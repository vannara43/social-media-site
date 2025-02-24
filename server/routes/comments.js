const express = require('express');
const router = express.Router();
const db = require('../db/config');

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const [comments] = await db.query(`
      SELECT 
        c.*,
        u.name as author_name,
        u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [req.params.postId]);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add comment
router.post('/', async (req, res) => {
    const { post_id, user_id, content } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [post_id, user_id, content]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
