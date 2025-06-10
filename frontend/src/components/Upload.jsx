import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDropzone } from "react-dropzone";
import "./uploadModal.css";

export default function UploadModal({ open, onClose, onComplete }) {
  const [stage, setStage] = useState("initial");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setFile(acceptedFiles[0]);
    setStage("uploading");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  useEffect(() => {
    if (stage !== "uploading") return;

    let pct = 0;
    setProgress(0);
    const timer = setInterval(() => {
      pct += 5 + Math.random() * 10;
      if (pct >= 100) {
        clearInterval(timer);
        setProgress(100);
        setStage("success");
      } else {
        setProgress(Math.round(pct));
      }
    }, 250);

    return () => clearInterval(timer);
  }, [stage]);

  const handleSave = () => {
    onClose?.();
  };

  const handleNext = () => {
    onComplete?.(file);
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
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Upload Your File</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {stage === "initial" && (
            <section
              className={`dropzone ${isDragActive ? "active" : ""}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <p className="dropzone-headline">📄 Drag & Drop your file here</p>
              <p className="dropzone-subtext">
                or <span className="dropzone-browse">Browse</span>
              </p>
            </section>
          )}

          {stage === "uploading" && file && (
            <section className="uploading">
              <div className="file-meta">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{humanSize(file.size)}</p>
              </div>

              <div className="progress-wrapper">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <button
                className="button-primary"
                onClick={handleSave}
                disabled={progress < 100}
              >
                Save
              </button>
            </section>
          )}

          {stage === "success" && (
            <section className="success">
              <div className="success-check">✔</div>
              <h3 className="success-headline">Upload Successful!</h3>
              <p className="success-subtext">Your file has been uploaded.</p>
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