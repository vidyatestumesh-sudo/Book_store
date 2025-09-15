import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LetterFromLangshott = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get('/api/letters');
        // Ensure letters is always an array
        const lettersData = Array.isArray(response.data) ? response.data : [];
        setLetters(lettersData);
      } catch (error) {
        console.error('Failed to fetch letters:', error);
        setLetters([]); // fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Letters from Langshott</h2>
      {letters.length === 0 ? (
        <p>No letters uploaded yet.</p>
      ) : (
        <ul>
          {letters.map(letter => (
            <li key={letter._id}>
              <a href={letter.fileUrl} target="_blank" rel="noopener noreferrer">
                {letter.title}
              </a>{' '}
              — {new Date(letter.uploadedAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LetterFromLangshott;
