import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://bookstore-backend-hshq.onrender.com";

const ManageLetters = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/letters`);
      setLetters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load letters', err);
      alert('Failed to load letters');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) return alert('Title and file are required.');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('pdf', file);

    try {
      await axios.post(`${BACKEND_BASE_URL}/api/letters/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Letter uploaded successfully!');
      setTitle('');
      setFile(null);
      fetchLetters();
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this letter?')) return;
    try {
      await axios.delete(`${BACKEND_BASE_URL}/api/letters/${id}`);
      alert('Letter deleted.');
      fetchLetters();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete.');
    }
  };

  const handleRename = async (id) => {
    if (!newTitle.trim()) return alert('New title cannot be empty.');
    try {
      await axios.put(`${BACKEND_BASE_URL}/api/letters/${id}`, { title: newTitle.trim() });
      alert('Title updated.');
      setEditingTitleId(null);
      setNewTitle('');
      fetchLetters();
    } catch (err) {
      console.error('Rename failed', err);
      alert('Failed to rename.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Manage Letters</h2>

      <form onSubmit={handleUpload} style={{ marginBottom: '2rem' }}>
        <div>
          <label htmlFor="title-input">Title:</label>
          <input
            id="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
          />
        </div>
        <div>
          <label htmlFor="file-input">PDF File:</label>
          <input
            id="file-input"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={{ marginBottom: '1rem' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </form>

      <h3>Uploaded Letters</h3>

      {loading ? (
        <p>Loading...</p>
      ) : letters.length === 0 ? (
        <p>No letters found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {letters.map((letter) => (
            <li
              key={letter._id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
              }}
            >
              {editingTitleId === letter._id ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: '80%', padding: '0.4rem' }}
                    autoFocus
                  />
                  <button onClick={() => handleRename(letter._id)} style={{ marginLeft: '0.5rem' }}>
                    Save
                  </button>
                  <button onClick={() => setEditingTitleId(null)} style={{ marginLeft: '0.5rem' }}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <strong>{letter.title}</strong>{' '}
                  <small>— {new Date(letter.uploadedAt).toLocaleDateString()}</small>
                  <div style={{ marginTop: '0.5rem' }}>
                    <a
                      href={letter.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginRight: '1rem' }}
                    >
                      View
                    </a>
                    <a
                      href={letter.downloadUrl} 
                      rel="noopener noreferrer"
                      download={letter.fileName || 'letter.pdf'}
                      style={{ marginRight: '1rem' }}
                    >
                      Download
                    </a>

                    <button
                      onClick={() => {
                        setEditingTitleId(letter._id);
                        setNewTitle(letter.title);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(letter._id)}
                      style={{ color: 'red', marginLeft: '1rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageLetters;
