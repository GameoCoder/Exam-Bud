import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDropzone } from "react-dropzone";
import "./uploadModal.css";

/**
 * Multi-stage "Upload Your File" modal.
 *
 * Props
 * -----
 * open        : boolean  – controls visibility
 * onClose     : function – called when modal should close
 * onComplete  : function – called after user presses "Next" on success stage
 */
export default function UploadModal({ open, onClose, onComplete }) {
  const [stage, setStage] = useState("initial"); // "initial" | "uploading" | "success"
  const [file, setFile] = useState(null);        // File object
  const [progress, setProgress] = useState(0);   // 0-100

  // ---- react-dropzone config -------------------------------------------------
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setFile(acceptedFiles[0]);
    setStage("uploading");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  // ---- upload simulation -----------------------------------------------------
  useEffect(() => {
    if (stage !== "uploading") return;

    // DEMO: fake an upload; replace with real API call
    let pct = 0;
    setProgress(0);
    const timer = setInterval(() => {
      pct += 5 + Math.random() * 10; // vary speed slightly
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

  // ---- helpers ---------------------------------------------------------------
  const handleSave = () => {
    // TODO: implement server-side save
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
    <div className="umodal-backdrop" role="dialog" aria-modal="true">
      <div className="umodal-card">
        {/* --- header ---------------------------------------------------------*/}
        <div className="umodal-header">
          <h2 className="umodal-title">Upload Your File</h2>
          <button
            className="umodal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* --- body -----------------------------------------------------------*/}
        <div className="umodal-body">
          {stage === "initial" && (
            <section
              className={`umodal-dropzone ${isDragActive ? "is-active" : ""}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <p className="umodal-dz-headline">📄 Drag & Drop your file here</p>
              <p className="umodal-dz-subtext">
                or <span className="umodal-browse">Browse</span>
              </p>
            </section>
          )}

          {stage === "uploading" && file && (
            <section className="umodal-uploading">
              <div className="umodal-file-meta">
                <p className="umodal-file-name">{file.name}</p>
                <p className="umodal-file-size">{humanSize(file.size)}</p>
              </div>

              <div className="umodal-progress-wrapper">
                <div
                  className="umodal-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <button
                className="umodal-primary"
                onClick={handleSave}
                disabled={progress < 100}
              >
                Save
              </button>
            </section>
          )}

          {stage === "success" && (
            <section className="umodal-success">
              <div className="umodal-check">✔</div>
              <h3 className="umodal-success-headline">Upload Successful!</h3>
              <p className="umodal-success-subtext">
                Your file has been uploaded.
              </p>
              <button className="umodal-primary" onClick={handleNext}>
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