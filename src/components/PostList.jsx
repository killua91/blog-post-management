import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostItem from './PostItem';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts', {
          params: { query, page },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, [query, page]);

  return (
    <div className="container">
      <div className="form-group">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />
        <Link to="/create" className="button">
          Create Post
        </Link>
      </div>
      <div>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="button"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;