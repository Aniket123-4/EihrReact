import React, { useState, useEffect } from "react";

interface TypewriterProps {
  textArray: string[];
  delay: number;
  infinite: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({ textArray, delay, infinite }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const handleTyping = () => {
      const index = currentIndex % textArray.length;
      const fullText = textArray[index];

      setCurrentText(
        isDeleting
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1)
      );

      const typingSpeed = isDeleting ? delay / 2 : delay;

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => {
          if (!infinite && currentIndex === textArray.length - 1) return;
          setCurrentIndex((prevIndex) => (prevIndex + 1) % textArray.length);
          setIsDeleting(true);
        }, typingSpeed);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
      }

      setTimeout(handleTyping, typingSpeed);
    };

    const timeout = setTimeout(handleTyping, delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, currentText, isDeleting, delay, textArray, infinite]);

  return <span>{currentText}</span>;
};

export default Typewriter;
