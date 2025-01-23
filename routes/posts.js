const express = require('express');
const Post = require('../models/Post');
const { authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a post (auth required)
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    console.log(req.user.id);
    const newPost = new Post({ title, content, author: req.user.id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Error creating post' });
  }
});

// Get all posts (admin only)
router.get('/',  async (req, res) => {
  const { query, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
  const sortOrder = order === 'asc' ? 1 : -1;
  let posts;

  try {
    if (query) {
      posts = await Post.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ]
      })
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    } else {
      posts = await Post.find()
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    if (posts.length === 0) {
      return res.status(404).json({ error: 'No posts found' });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching posts' });
  }
});

// Get single post by ID (auth required)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching post' });
  }
});

// Update a post (auth required, owner or admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: 'Error updating post' });
    }
});

// Delete a post (auth required, owner or admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting post' });
  }
});

module.exports = router;