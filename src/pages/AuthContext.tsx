// Forum.tsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/AuthContext';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { user } = useAuth(); // Get the logged-in user
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  // Fetch posts and comments
  const fetchPosts = async () => {
    const { data: postsData, error: postsError } = await supabase.from('forum_posts').select('*');
    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return;
    }
    setPosts(postsData);

    const commentsData = await fetchCommentsForPosts(postsData);
    setComments(commentsData);
  };

  // Fetch comments and replies for each post
  const fetchCommentsForPosts = async (posts) => {
    let commentsWithReplies = [];
    for (const post of posts) {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id);
      
      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }

      const repliesPromises = commentsData.map(async (comment) => {
        const { data: repliesData, error: repliesError } = await supabase
          .from('replies')
          .select('*')
          .eq('comment_id', comment.id);
        
        if (repliesError) {
          console.error('Error fetching replies:', repliesError);
        }

        return { comment, replies: repliesData };
      });
      
      const commentsWithRepliesData = await Promise.all(repliesPromises);
      commentsWithReplies.push({ post, comments: commentsWithRepliesData });
    }
    return commentsWithReplies;
  };

  // Handle adding a comment
  const handleAddComment = async (postId, content) => {
    if (!user) return;
    
    const { data, error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        user_id: user.id,
        content,
      },
    ]);
    
    if (error) {
      console.error('Error adding comment:', error);
      return;
    }

    setComments((prevComments) => [...prevComments, data[0]]);
  };

  // Handle adding a reply
  const handleAddReply = async (commentId, content) => {
    if (!user) return;

    const { data, error } = await supabase.from('replies').insert([
      {
        comment_id: commentId,
        user_id: user.id,
        content,
      },
    ]);
    
    if (error) {
      console.error('Error adding reply:', error);
      return;
    }

    setComments((prevComments) => {
      const updatedComments = prevComments.map((post) => {
        if (post.comments) {
          post.comments = post.comments.map((comment) => {
            if (comment.comment.id === commentId) {
              comment.replies.push(data[0]);
            }
            return comment;
          });
        }
        return post;
      });
      return updatedComments;
    });
  };

  return (
    <div>
      <h1>Forum Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => setShowCommentForm(!showCommentForm)}>Add Comment</button>
          
          {showCommentForm && (
            <form onSubmit={(e) => { e.preventDefault(); handleAddComment(post.id, e.target.content.value); }}>
              <textarea name="content" placeholder="Add a comment"></textarea>
              <button type="submit">Post Comment</button>
            </form>
          )}

          <div>
            {comments
              .filter((comment) => comment.post.id === post.id)
              .map(({ comment, replies }) => (
                <div key={comment.id}>
                  <p>{comment.content}</p>
                  <button onClick={() => handleAddReply(comment.id, "Reply content")}>Reply</button>
                  <div>
                    {replies.map((reply) => (
                      <p key={reply.id}>{reply.content}</p>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forum;
