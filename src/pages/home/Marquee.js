// import React from "react";
// import news from "../../assets/images/news.png";

// export const Marquee = ({ title, text }) => {
//   const { useState, useEffect } = React;
//   const width = window.innerHeight;
//   console.log(width);

//   const [pos, setPos] = useState(0);
//   const [run, setRun] = useState(true);
//   const scrollEff = () => {
//     if (run) setPos((p) => (p < width ? p + 1 : -width));
//   };

//   useEffect(() => {
//     const tm = setTimeout(scrollEff, 10);
//     return () => clearTimeout(tm);
//   }, [pos]);

//   const onMouseEnter = (e) => {
//     // console.log("mouse enter");
//     setRun(false);
//   };

//   const onMouseLeave = (e) => {
//     // console.log("mouse leave");
//     setRun(true);
//     setPos(pos + 1); // to trigger useEffect
//   };

//   const styles = {
//     position: "relative",
//     fontSize: "1em",
//     bottom: pos + "px",
//   };

//   return (
//     <div>
//       <h1
//         style={styles}
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//       >
//         <mark>{title}</mark> {text}
//       </h1>
//     </div>
//   );
// };

// const MarqueeApp = () => {
//   const marqueeData = [
//     {
//       id: 1,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 2,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 3,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 4,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 5,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 6,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 7,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 8,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 9,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 10,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 11,
//       tags: "This type of advertising businesses",
//       link: "https://www.google.com/",
//     },
//     {
//       id: 12,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 13,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 14,
//       tags: "This type of advertising businesses",
//       link: "https://www.google.com/",
//     },
//     {
//       id: 15,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//     {
//       id: 16,
//       tags: "This type of advertising businesses",
//       img: news,
//       link: "https://www.google.com/",
//     },
//   ];
//   return (
//     <div>
//       <Marquee
//         text={marqueeData.map((item) => {
//           return (
//             <div style={{marginBottom:"10px"}}>
//               <a href={item.link}>
//                 {item.tags}
//                 <img src={item.img} style={{ width: "35px" }} />
//               </a>
//             </div>
//           );
//         })}
//       />
//     </div>
//   );
// };

// export default MarqueeApp;
