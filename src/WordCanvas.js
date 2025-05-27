// src/WordCanvas.js
import React, { useEffect, useRef } from "react";

const WordCanvas = ({ words, currentWord }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 60;
    const maxCircles = 4;
    const y = 120;
    const wordSpacing = 130;

    const allWords = [...words, currentWord].filter(Boolean);

    allWords.forEach((word, i) => {
      const x = padding + i * wordSpacing;
      const numCircles = Math.min(maxCircles, Math.ceil(word.length / 2));

      for (let j = 0; j < numCircles; j++) {
        const radius = 10 + j * 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `hsl(${(i * 60 + j * 30) % 360}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [words, currentWord]);

  return <canvas ref={canvasRef} width={900} height={250} />;
};

export default WordCanvas;
