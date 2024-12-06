import { useState } from 'react';
import { toast } from 'react-toastify';

const VITE_API_URI = 'http://localhost:9000/api/v1'; // Replace with your API URL

const Write = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cont, setCont] = useState('');

  const handlePublish = () => {
    if (!title || !desc || !cont) {
      toast.error('Please fill all the fields');
    } else {
      fetch(`${VITE_API_URI}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, desc, cont }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Short Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div data-testid="mdx-editor">
        <textarea 
          data-testid="mdx-editor-textarea"
          value={cont}
          onChange={(e) => setCont(e.target.value)}
        />
      </div>
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
};

export default Write;