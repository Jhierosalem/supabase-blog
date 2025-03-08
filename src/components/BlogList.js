'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './BlogList.css'; // Import the CSS file

export default function BlogList({ onEditBlog }) {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .range((page - 1) * 10, page * 10 - 1);

      if (error) throw error;
      setBlogs(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a blog
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) throw error;
        alert('Blog deleted successfully!');
        fetchBlogs(); // Refresh the blog list after deletion
      } catch (error) {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return (
    <div className="blog-list">
      <h2>Blog List</h2>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <button onClick={() => onEditBlog(blog)}>Edit</button>
            <button onClick={() => handleDelete(blog.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}