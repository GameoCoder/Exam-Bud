import { useEffect, useState } from 'react';
import UploadModal from './Upload.jsx'

export default function UploadList({ subjectId }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null); // Still needed to hold the selected file temporarily
  const [modalOpen, setmodalOpen] = useState(false);

  const load = () => fetch(`http://localhost:4000/subjects/${subjectId}/uploads`)
    .then(r => r.json())
    .then(res => setItems(res.data));

  useEffect(load, [subjectId]);

  const add = async (uploadTitle, cloudinaryUrl) => {
    const payload = {
      title: uploadTitle,
      url: cloudinaryUrl
    };

    await fetch(`http://localhost:4000/subjects/${subjectId}/uploads`, {
      method: 'POST',
      headers: { 
        'x-user-id': 1, 
        'x-user-role': 'USER',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    setTitle(''); 
    setFile(null);
    load();
  };

  const del = async id => {
    await fetch(`http://localhost:4000/uploads/${id}`, { method: 'DELETE' });
    load();
  };

  const handleUpload = async (fileToUpload,fileTitle) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("upload_preset", "cloudsave");
    formData.append("public_id", fileTitle); // Optional: Use title as public_id

    try {
      // 1. Upload to Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/dliibgsez/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Cloudinary Upload Successful:", data);
      alert("Cloudinary Upload Complete!");
      const cloudinaryUrl = data.secure_url || data.url;
      console.log(title);console.log(cloudinaryUrl)
      await add(title, cloudinaryUrl);
      setFile(null)
      setTitle("")

    } catch (err) {
      console.error("Upload Failed:", err);
      alert("Upload Failed.");
    }
  };

  const handleUploadComplete = async (selectedFile) => {
    setFile(selectedFile)
    setmodalOpen(false)
    await handleUpload(selectedFile, title.trim())
  }

  const handleButtonClick = () => {
    if (title.trim() === "") {
      alert("Please enter a title before uploading.")
      return
  }
  setmodalOpen(true) // triggers file selection
}

  return (
    <div>
      <h2>Materials</h2>
      <form onSubmit={e => e.preventDefault()}> 
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <button type="button" onClick={handleButtonClick} disabled={title.trim() === ""}>
          Upload
        </button>
        <UploadModal 
        open={modalOpen}
        onClose={() => setmodalOpen(false)}
        onComplete={handleUploadComplete}
        />
      </form>
      <ul>
        {items.map(u => (
          <li key={u.id}>
            {/* The URL from your database will now be the Cloudinary URL */}
            <a href={u.url} target="_blank" rel="noopener noreferrer">{u.title}</a>
            <span> by {u.user.name}</span>
            <button onClick={() => del(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}