
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePostPage from './pages/CreatePostPage';
import PostListPage from './pages/PostListPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/" element={<PostListPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;