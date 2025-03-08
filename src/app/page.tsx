'use client';
import Auth from '@/components/Auth';
import BlogList from '@/components/BlogList';
import BlogForm from '@/components/BlogForm';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if the user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase.from('blogs').select('*');
      if (error) throw error;
      return data; // Return the fetched blogs
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    }
  };

  // Handle deleting a blog
  const handleDeleteBlog = async (blogId: string) => {
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', blogId);
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // Handle creating or editing a blog
  const handleBlogAction = (blog = null) => {
    setSelectedBlog(blog);
    setShowBlogForm(true);
  };

  // Handle updating the blog list after editing or creating a blog
  const handleUpdateBlogList = () => {
    setShowBlogForm(false);
    setSelectedBlog(null);
    fetchBlogs(); // Refresh the blog list
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome to My Blog</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!user ? (
        <Auth />
      ) : (
        <>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
          <button onClick={() => handleBlogAction()}>Create New Blog</button>
          {showBlogForm ? (
            <BlogForm blog={selectedBlog} onClose={handleUpdateBlogList} fetchBlogs={fetchBlogs} />
          ) : (
            <BlogList onEditBlog={handleBlogAction} fetchBlogs={fetchBlogs} onDeleteBlog={handleDeleteBlog} />
          )}
        </>
      )}
    </div>
  );
}