import { useEffect, useState } from 'react';
import UploadModal from './Upload.jsx'

export default function UploadList({ subjectId }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [modalOpen, setmodalOpen] = useState(false);
  // const [stage, setStage] = useState("select")

  const load = ()=>fetch(`http://localhost:4000/subjects/${subjectId}/uploads`)
    .then(r=>r.json())
    .then(res => setItems(res.data));

  useEffect(load, [subjectId]);

  const add = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('file', file);
    await fetch(`http://localhost:4000/subjects/${subjectId}/uploads`, {
      method:'POST',
      headers: { 'x-user-id': 1, 'x-user-role': 'USER' },
      body: fd
    });
    setTitle(''); setFile(null);
    load();
  };

  const del = async id => {
    await fetch(`http://localhost:4000/uploads/${id}`, { method:'DELETE' });
    load();
  };

   const handleUploadComplete = async (selectedFile) => {
    setFile(selectedFile)
    setmodalOpen(false)
    await handleUpload(selectedFile, title.trim())
  };

  const handleUpload = async (fileToUpload, fileTitle) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "cloudsave")
    formData.append("public_id", title)

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dliibgsez/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      console.log("Upload Successful:", data)
      alert("Upload Complete!")
      setFile(null)
      setTitle("")
      // Remove comments after backend is good to go
      // load()
    } catch(err) {
      console.error("Upload Failed:", err)
      alert("Upload Failed.")
    }
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
      <form onSubmit={add}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required/>
        {/* <input type="file" onChange={e=>setFile(e.target.files[0])} required/> */}
        {/* This is the button for Uploading */}
        {/* <UploadWidget /> */}
        <button type="button" onClick={handleButtonClick}>
          Upload
        </button>

        <UploadModal
        open={modalOpen}
        onClose={() => setmodalOpen(false)}
        onComplete={handleUploadComplete}
      />
      </form>
      <ul>
        {items.map(u=>(
          <li key={u.id}>
            <a href={`http://localhost:4000${u.url}`} target="_blank">{u.title}</a>
            <span> by {u.user.name}</span>
            <button onClick={()=>del(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
