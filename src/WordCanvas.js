// src/WordCanvas.js
import { ReactComponent as AlefIcon } from '/Users/hanadikaleel/alphabet/src/alef.svg';
import { ReactComponent as BehIcon } from '/Users/hanadikaleel/alphabet/src/ب.svg';
import { ReactComponent as TehIcon } from '/Users/hanadikaleel/alphabet/src/ت.svg';
import { ReactComponent as ThehIcon } from '/Users/hanadikaleel/alphabet/src/ث.svg';
import { ReactComponent as JeemIcon } from '/Users/hanadikaleel/alphabet/src/ج.svg';
import { ReactComponent as HahIcon } from '/Users/hanadikaleel/alphabet/src/ح.svg';
import { ReactComponent as KhahIcon } from '/Users/hanadikaleel/alphabet/src/خ.svg';
import { ReactComponent as DalIcon } from '/Users/hanadikaleel/alphabet/src/د.svg';
import { ReactComponent as ThalIcon } from '/Users/hanadikaleel/alphabet/src/ذ.svg';
import { ReactComponent as RehIcon } from '/Users/hanadikaleel/alphabet/src/ر.svg';
import { ReactComponent as ZainIcon } from '/Users/hanadikaleel/alphabet/src/ز.svg';
import { ReactComponent as SeenIcon } from '/Users/hanadikaleel/alphabet/src/س.svg';
import { ReactComponent as SheenIcon } from '/Users/hanadikaleel/alphabet/src/ش.svg';
import { ReactComponent as SadIcon } from '/Users/hanadikaleel/alphabet/src/ص.svg';
import { ReactComponent as DadIcon } from '/Users/hanadikaleel/alphabet/src/ض.svg';
import { ReactComponent as TahIcon } from '/Users/hanadikaleel/alphabet/src/ط.svg';
import { ReactComponent as ZahIcon } from '/Users/hanadikaleel/alphabet/src/ظ.svg';
import { ReactComponent as AinIcon } from '/Users/hanadikaleel/alphabet/src/ع.svg';
import { ReactComponent as GhainIcon } from '/Users/hanadikaleel/alphabet/src/غ.svg';
import { ReactComponent as FehIcon } from '/Users/hanadikaleel/alphabet/src/ف.svg';
import { ReactComponent as QafIcon } from '/Users/hanadikaleel/alphabet/src/ق.svg';
import { ReactComponent as KafIcon } from '/Users/hanadikaleel/alphabet/src/ك.svg';
import { ReactComponent as LamIcon } from '/Users/hanadikaleel/alphabet/src/ل.svg';
import { ReactComponent as MeemIcon } from '/Users/hanadikaleel/alphabet/src/م.svg';
import { ReactComponent as NoonIcon } from '/Users/hanadikaleel/alphabet/src/ن.svg';
import { ReactComponent as HehIcon } from '/Users/hanadikaleel/alphabet/src/ه.svg';
import { ReactComponent as WawIcon } from '/Users/hanadikaleel/alphabet/src/و.svg';
import { ReactComponent as YehIcon } from '/Users/hanadikaleel/alphabet/src/ي.svg';

import React, { useState, useEffect } from "react";

const svgMap = {
  "ا": AlefIcon,
  "ب": BehIcon,
  "ت": TehIcon,
  "ث": ThehIcon,
  "ج": JeemIcon,
  "ح": HahIcon,
  "خ": KhahIcon,
  "د": DalIcon,
  "ذ": ThalIcon,
  "ر": RehIcon,
  "ز": ZainIcon,
  "س": SeenIcon,
  "ش": SheenIcon,
  "ص": SadIcon,
  "ض": DadIcon,
  "ط": TahIcon,
  "ظ": ZahIcon,
  "ع": AinIcon,
  "غ": GhainIcon,
  "ف": FehIcon,
  "ق": QafIcon,
  "ك": KafIcon,
  "ل": LamIcon,
  "م": MeemIcon,
  "ن": NoonIcon,
  "ه": HehIcon,
  "و": WawIcon,
  "ي": YehIcon
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

  // Temporary edit state for the chip
  const [pendingSize, setPendingSize] = useState(160);
  const [pendingColor, setPendingColor] = useState("#111");
  // Active state for new letters
  const [letterSize, setLetterSize] = useState(160);
  const [letterColor, setLetterColor] = useState("#111");

  const getRandomPosition = () => ({
    x: Math.random() * (width - letterSize), 
    y: Math.random() * (height - letterSize), 
  });

  function isOverlapping(pos1, pos2, size = letterSize, padding = 10) {
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
            // Save the current letters as a word, with their own size/color
            { letters: currentLetters, time: Date.now() }
          ]);
          setCurrentLetters([]);
        }
        e.preventDefault();
      } else if (e.key === "Backspace") {
        setCurrentLetters((prev) => prev.slice(0, -1));
      } else if (svgMap[e.key]) {
        const letter = e.key;
        setCurrentLetters((prev) => {
          const existingPositions = prev.map((l) => l.pos);
          const pos = getNonOverlappingPosition(existingPositions);
          return [
            ...prev,
            { letter, pos, size: letterSize, color: letterColor }
          ];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLetters, letterSize, letterColor]);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = Date.now();
    setWords((prev) => prev.filter((w) => now - w.time < fadeDuration));
  }, [tick]);

  const now = Date.now();

  // Update pending values when active values change (for initial sync)
  useEffect(() => {
    setPendingSize(letterSize);
    setPendingColor(letterColor);
  }, []); // Only on mount

  return (
    <>
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
              {letters.map(({ letter, pos, size, color }, i) => {
                const SVGComponent = svgMap[letter];
                return SVGComponent ? (
                  <SVGComponent
                    key={i}
                    width={size}
                    height={size}
                    x={pos.x}
                    y={pos.y}
                    style={{ color }}
                    fill={color}
                  />
                ) : null;
              })}
            </g>
          );
        })}

        {currentLetters.map(({ letter, pos, size, color }, i) => {
          const SVGComponent = svgMap[letter];
          return SVGComponent ? (
            <SVGComponent
              key={`current-${i}`}
              width={size}
              height={size}
              x={pos.x}
              y={pos.y}
              style={{ color }}
              fill={color}
            />
          ) : null;
        })}
      </svg>
    </>
  );
};

export default WordCanvas;