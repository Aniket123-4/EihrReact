import React, { useState, useEffect } from 'react';
interface TypewriterProps {
  text: string;
  delay: number;
  infinite: boolean;
}
const Typewriter: React.FC<TypewriterProps> = ({ text, delay, infinite }) => {
  const [currentText, setCurrentText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (currentIndex <= text.length) {
      timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      setCurrentIndex(0);
      setCurrentText('');
    }
    return () => clearTimeout(timeout);
  }, [currentIndex, delay, infinite, text]);
  return <span>{currentText}</span>;
};
export default Typewriter;

// import { useState, useEffect } from 'react';
// const Typewriter = ({ text:any, delay:any, infinite:any }) => {
//   const [currentText, setCurrentText] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0)
//   useEffect(() => {
//     let timeout:any;
//     if (currentIndex <= text.length) {
//       timeout = setTimeout(() => {
//         setCurrentText(prevText => prevText + text[currentIndex]);
//         setCurrentIndex(prevIndex => prevIndex + 1);
//       }, delay);
//     } else if (infinite) {
//       setCurrentIndex(0);
//       setCurrentText('');
//     }
//     return () => clearTimeout(timeout);
//   }, [currentIndex, delay, infinite, text]);
//   return <span>{currentText}</span>;
// };
// export default Typewriter;