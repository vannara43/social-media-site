import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import CreatePost from './components/CreatePost/CreatePost';
import Post from './components/Post/Post';
import Comments from './components/Comments/Comments';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Temporary user (replace with actual auth later)
  const user = {
    id: 1,
    name: 'Vannara Thong',
    avatar: 'https://images.vexels.com/media/users/3/147101/isolated/preview/b4a49d4b864c74bb73de63f080ad7930-instagram-profile-button.png'
  };

  const handleSuccess = (message) => {
    setToast({ type: 'success', message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleError = (message) => {
    setToast({ type: 'error', message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      handleError('Failed to fetch posts');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      if (editingPost) {
        // Update existing post
        const response = await fetch(`http://localhost:5000/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newPost
          }),
        });
        const updatedPost = await response.json();
        setPosts(posts.map(post =>
          post.id === editingPost.id ? updatedPost : post
        ));
        setEditingPost(null);
        handleSuccess('Post updated successfully!');
      } else {
        // Create new post
        const response = await fetch('http://localhost:5000/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            content: newPost
          }),
        });
        const data = await response.json();
        setPosts([data, ...posts]);
        handleSuccess('Post created successfully!');
      }
      setNewPost('');
    } catch (err) {
      handleError('Failed to save post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost(post.content);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`http://localhost:5000/api/posts/${postId}`, {
          method: 'DELETE'
        });
        setPosts(posts.filter(post => post.id !== postId));
        handleSuccess('Post deleted successfully!');
      } catch (err) {
        handleError('Failed to delete post');
      }
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const updatedPost = await response.json();
      setPosts(posts.map(post =>
        post.id === postId ? updatedPost : post
      ));
    } catch (err) {
      handleError('Failed to update like');
    }
  };

  const handleComment = async (postId, commentData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          content: commentData.content,
          author_name: user.name,
          avatar_url: user.avatar
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      }));
      handleSuccess('Comment added successfully!');
    } catch (err) {
      handleError('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <Header user={user} />

      <div className="dashboard-container">
        <CreatePost
          newPost={newPost}
          setNewPost={setNewPost}
          handleSubmit={handleSubmit}
          editingPost={editingPost}
          cancelEdit={() => {
            setEditingPost(null);
            setNewPost('');
          }}
        />

        <div className="feed">
          {posts.map(post => (
            <div key={post.id} className="post-container">
              <Post
                post={post}
                user={user}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleLike={handleLike}
              />
              <Comments
                comments={post.comments || []}
                postId={post.id}
                user={user}
                onAddComment={handleComment}
              />
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
