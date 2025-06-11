import { useEffect, useState } from 'react';

export default function UploadList({ subjectId }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null); // Still needed to hold the selected file temporarily

  const load = () => fetch(`http://localhost:4000/subjects/${subjectId}/uploads`)
    .then(r => r.json())
    .then(res => setItems(res.data));

  useEffect(load, [subjectId]);

  // Modified 'add' function: Now accepts the Cloudinary URL
  const add = async (uploadTitle, cloudinaryUrl) => {
    // We are no longer sending the file itself to the local backend.
    // Instead, we send the title and the Cloudinary URL.
    const payload = {
      title: uploadTitle,
      url: cloudinaryUrl // This will be the Cloudinary URL
    };

    await fetch(`http://localhost:4000/subjects/${subjectId}/uploads`, {
      method: 'POST',
      headers: { 
        'x-user-id': 1, 
        'x-user-role': 'USER',
        'Content-Type': 'application/json' // Set content type for JSON body
      },
      body: JSON.stringify(payload) // Send payload as JSON
    });
    setTitle(''); 
    setFile(null); // Clear the file selection
    load(); // Reload items after successful addition
  };

  const del = async id => {
    await fetch(`http://localhost:4000/uploads/${id}`, { method: 'DELETE' });
    load();
  };

  const handleUpload = async () => {
    if (!file || title.trim() === "") {
        alert("Please select a file and enter a title.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cloudsave");
    formData.append("public_id", title); // Optional: Use title as public_id

    try {
      // 1. Upload to Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/dliibgsez/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Cloudinary Upload Successful:", data);
      alert("Cloudinary Upload Complete!");

      const cloudinaryUrl = data.secure_url || data.url; // Get the URL from Cloudinary response

      // 2. Call the 'add' function with the title and Cloudinary URL
      await add(title, cloudinaryUrl);

    } catch (err) {
      console.error("Upload Failed:", err);
      alert("Upload Failed.");
    }
  };

  return (
    <div>
      <h2>Materials</h2>
      <form onSubmit={e => e.preventDefault()}> 
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <input type="file" onChange={e => setFile(e.target.files[0])} required />

        <button type="button" onClick={handleUpload} disabled={!file || title.trim() === ""}>
          Upload
        </button>
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