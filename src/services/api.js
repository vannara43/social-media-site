const API_URL = 'http://localhost:5000/api';

export const api = {
    // Posts
    getPosts: async () => {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    createPost: async (postData) => {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error('Failed to create post');
        return response.json();
    },

    updatePost: async (postId, postData) => {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error('Failed to update post');
        return response.json();
    },

    deletePost: async (postId) => {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete post');
        return response.json();
    },

    // Comments
    getComments: async (postId) => {
        const response = await fetch(`${API_URL}/comments/post/${postId}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    createComment: async (commentData) => {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        });
        if (!response.ok) throw new Error('Failed to create comment');
        return response.json();
    },

    // Likes
    toggleLike: async (postId, userId) => {
        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error('Failed to toggle like');
        return response.json();
    }
};
