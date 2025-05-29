// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import WordCanvas from "./WordCanvas";
import html2canvas from "html2canvas";

function App() {
  const [currentInput, setCurrentInput] = useState("");
  const [words, setWords] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        if (currentInput.trim()) {
          setWords((prev) => [...prev, currentInput.trim()]);
          setCurrentInput("");
        }
        e.preventDefault();
      } else if (e.key === "Backspace") {
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setCurrentInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentInput]);

  const handleSave = async () => {
    const appDiv = document.querySelector(".App");
    if (!appDiv) return;
    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) saveBtn.style.visibility = "hidden";
    await new Promise((r) => setTimeout(r, 50));
    html2canvas(appDiv, { useCORS: true }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "alphabet-screenshot.png";
      link.href = canvas.toDataURL();
      link.click();
      if (saveBtn) saveBtn.style.visibility = "visible";
    });
  };

  return (
    <div
      className="App"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontSize: "1em",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <button
        id="save-btn"
        onClick={handleSave}
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          padding: "8px 16px",
          background: "#111",
          borderRadius: "999px",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          cursor: "pointer",
          width: "44px",
          height: "44px",
        }}
        aria-label="Save"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v12" />
          <path d="M6 13l6 6 6-6" />
          <rect x="4" y="19" width="16" height="2" rx="1" fill="white" stroke="none"/>
        </svg>
      </button>
      <div
        style={{
          textAlign: "left",
          marginLeft: 0,
          paddingTop: 0,
          position: "relative",
          zIndex: 2,
          paddingLeft: "1vw",
          paddingTop: "1vw",
          maxWidth: "60vw",
        }}
      >
        <h1
          style={{
            fontWeight: "bold",
            marginBottom: "0.2em",
            marginTop: 0,
            fontSize: "1.2em",
          }}
        >
          The Water Alphabet
        </h1>
        <div
          style={{
            fontWeight: "normal",
            fontSize: "1em",
            marginTop: 0,
          }}
        >
          From The Water To The Water
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: "1vw",
          right: "1vw",
          textAlign: "right",
          direction: "rtl",
          zIndex: 2,
          maxWidth: "60vw",
        }}
      >
        <h1
          style={{
            fontWeight: "bold",
            marginBottom: "0.2em",
            marginTop: 0,
            fontSize: "1.2em",
          }}
        >
          أبجدية الماء
        </h1>
        <div
          style={{
            fontWeight: "normal",
            fontSize: "1em",
            marginTop: 0,
          }}
        >
          من الميّة للميّة
        </div>
      </div>
      <WordCanvas words={words} currentWord={currentInput} />
      <div
        style={{
          position: "fixed",
          bottom: 18,
          left: 24,
          fontSize: "1em",
          fontStyle: "italic",
          color: "#444",
          background: "rgba(255,255,255,0.7)",
          padding: "4px 10px",
          borderRadius: "6px",
        }}
      >
        you write and only the water reads
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 18,
          right: 24,
          fontSize: "1em",
          fontStyle: "italic",
          color: "#444",
          background: "rgba(255,255,255,0.7)",
          padding: "4px 10px",
          borderRadius: "6px",
          direction: "rtl",
          textAlign: "right",
        }}
      >
        انت بتكتب وبس المي بتقرا.
      </div>
    </div>
  );
}

export default App;
