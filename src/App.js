// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import WordCanvas from "./WordCanvas";

function App() {
  const [currentInput, setCurrentInput] = useState("");
  const [words, setWords] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        // Add current word and reset
        if (currentInput.trim()) {
          setWords((prev) => [...prev, currentInput.trim()]);
          setCurrentInput("");
        }
        e.preventDefault(); // prevent scroll on space
      } else if (e.key === "Backspace") {
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setCurrentInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentInput]);

  return (
    <div className="App">
      <h1>Word Alphabet</h1>
      <WordCanvas words={words} currentWord={currentInput} />
    </div>
  );
}

export default App;
