const express = require('express');
const router = express.Router();
const db = require('../db/config');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const [posts] = await db.query(`
      SELECT 
        p.*,
        u.name as author_name,
        u.avatar_url,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create post
router.post('/', async (req, res) => {
    const { user_id, content, image_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
            [user_id, content, image_url]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update post
router.put('/:id', async (req, res) => {
    const { content } = req.body;
    try {
        await db.query(
            'UPDATE posts SET content = ? WHERE id = ?',
            [content, req.params.id]
        );
        res.json({ id: req.params.id, content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
