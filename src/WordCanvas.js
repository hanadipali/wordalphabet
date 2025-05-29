// src/WordCanvas.js
import { ReactComponent as AIcon } from '/Users/hanadikaleel/alphabet/src/ي.svg';
import { ReactComponent as BIcon } from '/Users/hanadikaleel/alphabet/src/ن.svg';
import { ReactComponent as CIcon } from '/Users/hanadikaleel/alphabet/src/و.svg';

import React, { useState, useEffect } from "react";

const svgMap = {
  a: AIcon,
  b: BIcon,
  c: CIcon
};

const fadeDuration = 6000; 

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

const WordCanvas = (props) => {
  const { width, height } = useWindowSize();

  const getRandomPosition = () => ({
    x: Math.random() * (width - 100), 
    y: Math.random() * (height - 100), 
  });

  function isOverlapping(pos1, pos2, size = 100, padding = 10) {
    return (
      Math.abs(pos1.x - pos2.x) < size + padding &&
      Math.abs(pos1.y - pos2.y) < size + padding
    );
  }

  function getNonOverlappingPosition(existingPositions, maxTries = 100) {
    let tries = 0;
    let pos;
    do {
      pos = getRandomPosition();
      tries++;
    } while (
      existingPositions.some((p) => isOverlapping(p, pos)) &&
      tries < maxTries
    );
    return pos;
  }

  const [currentLetters, setCurrentLetters] = useState([]);
  const [words, setWords] = useState([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        if (currentLetters.length > 0) {
          setWords((prev) => [
            ...prev,
            { letters: currentLetters, time: Date.now() },
          ]);
          setCurrentLetters([]);
        }
        e.preventDefault();
      } else if (e.key === "Backspace") {
        setCurrentLetters((prev) => prev.slice(0, -1));
      } else if (/^[a-cA-C]$/.test(e.key)) {
        const letter = e.key.toLowerCase();
        setCurrentLetters((prev) => {
          const existingPositions = prev.map((l) => l.pos);
          const pos = getNonOverlappingPosition(existingPositions);
          return [...prev, { letter, pos }];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLetters]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = Date.now();
    setWords((prev) => prev.filter((w) => now - w.time < fadeDuration));
  }, [tick]);

  const now = Date.now();

  return (
    <svg
      style={{
        backgroundColor: "white",
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {words.map(({ letters, time }, idx) => {
        const opacity = 1 - (now - time) / fadeDuration;
        return (
          <g key={idx} style={{ opacity }}>
            {letters.map(({ letter, pos }, i) => {
              const SVGComponent = svgMap[letter];
              return SVGComponent ? (
                <SVGComponent
                  key={i}
                  width={100}
                  height={100}
                  x={pos.x}
                  y={pos.y}
                />
              ) : null;
            })}
          </g>
        );
      })}

      {currentLetters.map(({ letter, pos }, i) => {
        const SVGComponent = svgMap[letter];
        return SVGComponent ? (
          <SVGComponent
            key={`current-${i}`}
            width={100}
            height={100}
            x={pos.x}
            y={pos.y}
          />
        ) : null;
      })}
    </svg>
  );
};

export default WordCanvas;