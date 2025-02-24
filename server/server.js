const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: 'password', // your MySQL password
    database: 'social_media_db'
});


// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// CREATE DATABASE AND TABLES
const initializeDatabase = async () => {
    try {
        // Create tables if they don't exist
        await db.promise().query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        likes INT DEFAULT 0,
        liked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await db.promise().query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);

        console.log('Database tables initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initializeDatabase();

// GET all posts with their comments
app.get('/api/posts', async (req, res) => {
    try {
        const [posts] = await db.promise().query('SELECT * FROM posts ORDER BY created_at DESC');
        const [comments] = await db.promise().query('SELECT * FROM comments');

        const postsWithComments = posts.map(post => ({
            ...post,
            comments: comments.filter(comment => comment.post_id === post.id)
        }));

        res.json(postsWithComments);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// CREATE a new post
app.post('/api/posts', async (req, res) => {
    const { user_id, content } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO posts (user_id, content, author_name, avatar_url) VALUES (?, ?, ?, ?)',
            [user_id, content, 'Test User', 'https://via.placeholder.com/50']
        );

        const [newPost] = await db.promise().query(
            'SELECT * FROM posts WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newPost[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error creating post' });
    }
});

// UPDATE a post
app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        await db.promise().query(
            'UPDATE posts SET content = ? WHERE id = ?',
            [content, id]
        );

        const [updatedPost] = await db.promise().query(
            'SELECT * FROM posts WHERE id = ?',
            [id]
        );

        if (updatedPost.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(updatedPost[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error updating post' });
    }
});

// DELETE a post
app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query('DELETE FROM posts WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Error deleting post' });
    }
});

// LIKE/UNLIKE a post
app.post('/api/posts/:id/like', async (req, res) => {
    const { id } = req.params;

    try {
        const [post] = await db.promise().query(
            'SELECT liked, likes FROM posts WHERE id = ?',
            [id]
        );

        if (post.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newLiked = !post[0].liked;
        const newLikes = newLiked ? post[0].likes + 1 : post[0].likes - 1;

        await db.promise().query(
            'UPDATE posts SET liked = ?, likes = ? WHERE id = ?',
            [newLiked, newLikes, id]
        );

        const [updatedPost] = await db.promise().query(
            'SELECT * FROM posts WHERE id = ?',
            [id]
        );

        res.json(updatedPost[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error updating like status' });
    }
});

// CREATE a comment
app.post('/api/posts/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { user_id, content, author_name, avatar_url } = req.body;

    try {
        const [result] = await db.promise().query(
            'INSERT INTO comments (post_id, user_id, content, author_name, avatar_url) VALUES (?, ?, ?, ?, ?)',
            [id, user_id, content, author_name, avatar_url]
        );

        const [newComment] = await db.promise().query(
            'SELECT * FROM comments WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newComment[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error creating comment' });
    }
});

// DELETE a comment
app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query('DELETE FROM comments WHERE id = ?', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Error deleting comment' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
