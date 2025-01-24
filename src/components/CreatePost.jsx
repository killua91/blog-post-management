import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to create a post');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to create a post');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/posts', { title, content }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setTitle('');
      setContent('');
      setError('');
      toast.success('Post created successfully!');
      navigate('/');
    } catch (err) {
      setError('Error creating post');
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea"
          ></textarea>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">
          Create Post
        </button>
        <button type="button" className="button cancel-button" onClick={() => navigate('/')}>
          Cancel
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreatePost;