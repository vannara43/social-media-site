import { useState } from 'react';
import Header from './components/Header/Header.jsx';
import CreatePost from './components/CreatePost/CreatePost.jsx';
import Post from './components/Post/Post';
import './App.css';

function App() {
  const [user, setUser] = useState({
    name: 'John Doe',
    username: '@johndoe',
    avatar: 'https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png'
  });

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editingPost, setEditingPost] = useState(null); // Add this for editing
  const [comments, setComments] = useState({});  // Add this for storing comments
  const [newComment, setNewComment] = useState(''); // Add this for comment input
  const [commentingOn, setCommentingOn] = useState(null); // track which post is being commented on
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim() && !previewImage) return;

    if (editingPost) {
      setPosts(posts.map(post =>
        post.id === editingPost.id
          ? { ...post, content: newPost }
          : post
      ));
      setEditingPost(null);
    } else {
      const post = {
        id: Date.now(),
        content: newPost,
        author: user.name,
        avatar: user.avatar,
        timestamp: new Date().toISOString(),
        likes: 0,
        image: previewImage // Add the image to the post
      };
      setPosts([post, ...posts]);
    }
    setNewPost('');
    setPreviewImage(null); // Clear the preview image
    setSelectedFile(null); // Clear the selected file
  };

  // Add this new function to handle image uploads
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function to remove selected image
  const removeImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost(post.content);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setNewPost('');
  };

  const handleComment = (postId) => {
    setCommentingOn(postId);
  };

  const submitComment = (postId, e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      content: newComment,
      author: user.name,
      avatar: user.avatar,
      timestamp: new Date().toISOString()
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));

    setNewComment('');
    setCommentingOn(null);
  };

  return (
    <div className="App">
      <Header user={user} />
      <div className="dashboard-container">
        <CreatePost
          newPost={newPost}
          setNewPost={setNewPost}
          handleSubmit={handleSubmit}
          editingPost={editingPost}
          cancelEdit={cancelEdit}
          previewImage={previewImage}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
        />
        <div className="feed">
          {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              user={user}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleLike={handleLike}
              comments={comments}
              commentingOn={commentingOn}
              handleComment={handleComment}
              submitComment={submitComment}
              newComment={newComment}
              setNewComment={setNewComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
