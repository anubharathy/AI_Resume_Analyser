import { useRef, useState } from "react";

// The empty state of the sheet: drag a PDF in, or click to browse.
export default function Dropzone({ onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div
      className={`dropzone${dragging ? " is-drag" : ""}`}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
    >
      <p className="dropzone-title">Drop your resume here</p>
      <p className="dropzone-hint">
        PDF up to 5 MB · or{" "}
        <button type="button" className="dropzone-browse" onClick={(e) => e.stopPropagation()}>
          browse files
        </button>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
