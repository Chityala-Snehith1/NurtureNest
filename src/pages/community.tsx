import React, { useEffect, useState } from 'react';
import { ThumbsUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  subtopic: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  parent_id: string | null;
  profiles: {
    full_name: string | null;
  } | null;
  replies?: Comment[];
}

const subtopics = ['Pregnancy', 'Postpartum', 'Nutrition', 'Mental Health'];

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState('All');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [activePostCommentBox, setActivePostCommentBox] = useState<string | null>(null);
  const [activeCommentReplyBox, setActiveCommentReplyBox] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, selectedSubtopic, sort]);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setUserId(data.user.id);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community') // Changed from 'forum_posts' to 'community'
      .select(
        `
        *,
        profiles:user_id (
          full_name
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setPosts(data);
      data.forEach((post: CommunityPost) => fetchComments(post.id));
    }

    setLoading(false);
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        profiles:user_id (
          full_name
        )
      `
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Comment fetch error:', error.message);
      return;
    }

    const nestComments = (comments: Comment[], parentId: string | null = null): Comment[] =>
      comments
        .filter((c) => c.parent_id === parentId)
        .map((c) => ({ ...c, replies: nestComments(comments, c.id) }));

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: nestComments(data),
    }));
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];
    if (selectedSubtopic !== 'All') {
      filtered = filtered.filter((post) => post.subtopic === selectedSubtopic);
    }
    filtered.sort((a, b) => {
      if (sort === 'liked') {
        return (b.likes ?? 0) - (a.likes ?? 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setFilteredPosts(filtered);
  };

  const handleLike = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const updatedLikes = (post.likes || 0) + 1;

    const { error } = await supabase
      .from('community') // Changed from 'forum_posts' to 'community'
      .update({ likes: updatedLikes })
      .eq('id', postId);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: updatedLikes } : p))
      );
    }
  };

  const CommentForm = ({
    postId,
    parentId = null,
  }: {
    postId: string;
    parentId?: string | null;
  }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
      if (!userId) {
        alert('Please log in to comment.');
        return;
      }

      if (!content.trim()) return;

      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        parent_id: parentId,
        content,
        user_id: userId,
      });

      if (!error) {
        await fetchComments(postId);
        setContent('');
        setActiveCommentReplyBox(null); // Close reply form
        setActivePostCommentBox(null);  // Close main comment form if applicable
      }
    };

    return (
      <div className="mt-2">
        <textarea
          className="w-full border rounded p-2 text-sm"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="mt-1 text-xs text-purple-600 hover:underline"
        >
          Submit
        </button>
      </div>
    );
  };

  const CommentList = ({ postId, comments }: { postId: string; comments: Comment[] }) => {
    return (
      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="ml-4 border-l-2 pl-4">
            <p className="text-sm text-gray-700">
              <strong>{comment.profiles?.full_name || 'Anonymous'}:</strong> {comment.content}
            </p>
            <button
              onClick={() =>
                setActiveCommentReplyBox((prev) => (prev === comment.id ? null : comment.id))
              }
              className="text-xs text-purple-500 hover:underline"
            >
              Reply
            </button>
            {activeCommentReplyBox === comment.id && (
              <CommentForm postId={postId} parentId={comment.id} />
            )}
            {comment.replies && comment.replies.length > 0 && (
              <CommentList postId={postId} comments={comment.replies} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mothers' Community Forum</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={selectedSubtopic}
          onChange={(e) => setSelectedSubtopic(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Topics</option>
          {subtopics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="recent">Sort by: Recent</option>
          <option value="liked">Sort by: Most Liked</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No posts found.</p>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm p-6 transition hover:shadow-md
