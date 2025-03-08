'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './BlogForm.css'; // Import the CSS file

export default function BlogForm({ blog = null, onClose, fetchBlogs }) {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null); // Reset error state

    try {
      if (blog) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update({ title, content })
          .eq('id', blog.id);

        if (error) throw error;
        alert('Blog updated successfully!');
      } else {
        // Create new blog
        const { error } = await supabase.from('blogs').insert([{ title, content }]);

        if (error) throw error;
        alert('Blog created successfully!');
      }

      onClose(); // Close the form and trigger a refresh in the parent component
      if (fetchBlogs) fetchBlogs(); // Refresh the blog list
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <h2>{blog ? 'Edit Blog' : 'Create Blog'}</h2>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : blog ? 'Update' : 'Create'}
      </button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}