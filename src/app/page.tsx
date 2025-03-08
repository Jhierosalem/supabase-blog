'use client'; // Mark this file as a client component
import Auth from '@/components/Auth';
import BlogList from '@/components/BlogList';
import BlogForm from '@/components/BlogForm';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js'; // Directly import the User type

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // For editing a blog
  const [loading, setLoading] = useState(true); // Loading state for auth check
  const [error, setError] = useState(''); // Error state

  // Check if the user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error) {
        setError(error.message);
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
      const { error } = await supabase.from('blogs').select('*');
      if (error) throw error;
      // Update the blog list in the parent component (if needed)
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle creating or editing a blog
  const handleBlogAction = (blog = null) => {
    setSelectedBlog(blog); // Set the blog to edit (or null for creating a new blog)
    setShowBlogForm(true); // Show the BlogForm
  };

  // Handle updating the blog list after editing or creating a blog
  const handleUpdateBlogList = () => {
    setShowBlogForm(false); // Hide the BlogForm
    setSelectedBlog(null); // Reset the selected blog
    fetchBlogs(); // Refresh the blog list
  };

  if (loading) {
    return <p>Loading...</p>; // Show a loading spinner or message
  }

  return (
    <div>
      <h1>Welcome to My Blog</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display errors */}
      {!user ? (
        <Auth />
      ) : (
        <>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
          <button onClick={() => handleBlogAction()}>Create New Blog</button>
          {showBlogForm ? (
            <BlogForm blog={selectedBlog} onClose={handleUpdateBlogList} fetchBlogs={fetchBlogs} />
          ) : (
            <BlogList onEditBlog={handleBlogAction} fetchBlogs={undefined} />
          )}
        </>
      )}
    </div>
  );
}