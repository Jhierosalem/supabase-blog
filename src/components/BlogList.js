'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // eslint-disable-line @typescript-eslint/no-unused-vars
import PropTypes from 'prop-types'; // Import PropTypes
import './BlogList.css'; // Import the CSS file

export default function BlogList({ onEditBlog, fetchBlogs, onDeleteBlog }) {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch blogs for pagination
  const fetchBlogsInternal = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogs(); // Use the fetchBlogs function passed from the parent
      setBlogs(data || []); // Ensure data is not undefined
    } catch (error) {
      // Handle the error as an unknown type
      if (error instanceof Error) {
        setError(error.message); // Safely access error.message
      } else {
        setError('An unknown error occurred'); // Fallback for non-Error types
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete a blog
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await onDeleteBlog(id); // Use the onDeleteBlog prop to delete the blog
        await fetchBlogsInternal(); // Refresh the blog list after deletion
      } catch (error) {
        // Handle the error as an unknown type
        if (error instanceof Error) {
          setError(error.message); // Safely access error.message
        } else {
          setError('An unknown error occurred'); // Fallback for non-Error types
        }
      }
    }
  };

  // Refresh the blog list
  const handleRefresh = async () => {
    await fetchBlogsInternal(); // Call the internal fetch function to refresh the data
  };

  // Fetch blogs when the component mounts or the page changes
  useEffect(() => {
    fetchBlogsInternal(); // Use the internal fetch function for pagination
  }, [page]);

  return (
    <div className="blog-list">
      <h2>Blog List</h2>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleRefresh} className="refresh-button">
        Refresh
      </button>
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

// Define prop types using PropTypes
BlogList.propTypes = {
  onEditBlog: PropTypes.func.isRequired,
  fetchBlogs: PropTypes.func.isRequired, // Add fetchBlogs to prop types
  onDeleteBlog: PropTypes.func.isRequired,
};