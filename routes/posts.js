const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Create a post
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: 'Error creating post' });
  }
});

// Get all posts or search posts by title or content with pagination
router.get('/', async (req, res) => {
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

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching post' });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Error updating post' });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting post' });
  }
});

module.exports = router;
