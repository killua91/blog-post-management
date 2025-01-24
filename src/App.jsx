
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePostPage from './pages/CreatePostPage';
import PostListPage from './pages/PostListPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/" element={<PostListPage />} />
      </Routes>
    </Router>
  );
};

export default App;