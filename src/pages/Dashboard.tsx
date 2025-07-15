import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, MessageSquare, LineChart, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

interface DashboardStats {
  totalPosts: number;
  totalConsultations: number;
  lastLogin: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalConsultations: 0,
    lastLogin: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  async function fetchStats() {
    try {
      const { data: posts, error: postsError } = await supabase
        .from('forum_posts')
        .select('id')
        .eq('user_id', user?.id);

      if (postsError) throw postsError;

      setStats({
        totalPosts: posts?.length || 0,
        totalConsultations: 0, // To be implemented with consultations table
        lastLogin: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.full_name || 'User'}!</h1>
          <p className="text-gray-600 mt-2">Manage your pregnancy and postpartum journey</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <h3 className="ml-2 text-lg font-semibold">Forum Posts</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalPosts}</p>
          <p className="text-gray-600">Total posts</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h3 className="ml-2 text-lg font-semibold">Consultations</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalConsultations}</p>
          <p className="text-gray-600">Scheduled sessions</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 text-green-600" />
            <h3 className="ml-2 text-lg font-semibold">Resources</h3>
          </div>
          <button
            onClick={() => navigate('/articles')}
            className="text-green-600 hover:text-green-700"
          >
            View Articles →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <LineChart className="h-6 w-6 text-orange-600" />
            <h3 className="ml-2 text-lg font-semibold">Progress</h3>
          </div>
          <p className="text-gray-600">Track your journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/consultations')}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <Calendar className="h-5 w-5 text-purple-600 mr-3" />
              Book a Consultation
            </button>
            <button
              onClick={() => navigate('/forum')}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <MessageSquare className="h-5 w-5 text-purple-600 mr-3" />
              Start a Discussion
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-gray-600">
            <p>Last login: {new Date(stats.lastLogin).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}