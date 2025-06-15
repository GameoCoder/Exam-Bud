import React, { useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useDropzone } from "react-dropzone";
import "./uploadModal.css";

export default function UploadModal({ open, onClose, onComplete, title }) {
  const [stage, setStage] = useState("initial");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [cloudinaryResponse, setCloudinaryResponse] = useState(null);


  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setFile(acceptedFiles[0]);
    setProgress(0);
    setCloudinaryResponse(null);
    setStage("selected");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
  });

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const startFileUpload = useCallback(() => {
    if (!file) {
      console.error("No file selected for upload.");
      return;
    }

    setStage("uploading");

    const formData = new FormData();
    const CLOUDINARY_UPLOAD_PRESET=import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const CLOUDINARY_PUBLIC_ID=import.meta.env.VITE_CLOUDINARY_PUBLIC_ID
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("public_id", title);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_PUBLIC_ID}/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded * 100) / event.total);
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.response);
        console.log("Upload success:", responseData);
        setProgress(100);
        setCloudinaryResponse(responseData);
        setStage("success");
      } else {
        console.error("Upload failed:", xhr.responseText);
        alert("File upload failed. Please try again.");
        setStage("selected");
        setProgress(0);
      }
    };

    xhr.onerror = () => {
      console.error("Upload error (network issue)");
      alert("File upload failed due to a network error. Please check your connection and try again.");
      setStage("selected");
      setProgress(0);
    };

    xhr.send(formData);
  }, [file]);

  const handleSave = () => {
    startFileUpload();
  };

  const handleNext = () => {
    onComplete?.(cloudinaryResponse);
    onClose?.();
  };

  const humanSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Upload Your File</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="modal-body">
          {stage === "initial" && (
            <section
              className={`dropzone ${isDragActive ? "active" : ""}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} ref={fileInputRef} style={{ display: 'none' }} />

              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#BFD5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>

              <p className="dropzone-combined-text">
                Drag file or <span className="dropzone-browse" onClick={handleBrowseClick}>Browse</span>
              </p>
            </section>
          )}

          {(stage === "selected" || stage === "uploading") && file && (
            <section className="uploading">
              <div className="file-meta">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{humanSize(file.size)}</p>
              </div>

              <div className="progress-wrapper">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>

              <button
                className="button-primary"
                onClick={handleSave}
                disabled={stage === "uploading"}
              >
                {stage === "uploading" ? `Uploading ${progress}%` : "Save"}
              </button>

            </section>
          )}

          {stage === "success" && (
            <section className="success">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="success-headline">Upload Successful!</h3>
              <button className="button-primary" onClick={handleNext}>
                Next
              </button>
            </section>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
