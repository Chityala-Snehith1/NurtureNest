import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  created_at: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <span className="text-sm font-medium text-blue-600">{article.category}</span>
              <h2 className="text-xl font-semibold text-gray-900 mt-2 mb-4">{article.title}</h2>
              <p className="text-gray-600 line-clamp-3">{article.content}</p>
              <div className="mt-4">
                <span className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No articles available at the moment.</p>
        </div>
      )}
    </div>
  );
}