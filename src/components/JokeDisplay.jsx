// import { useState, useEffect } from "react";
// import truckerJokes from "../services/jokes";
// import { Typography, Box } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";

// const JokeDisplay = () => {
//   const [jokeIndex, setJokeIndex] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);

//   useEffect(() => {
//     const randomIndex = Math.floor(Math.random() * truckerJokes.length);
//     setJokeIndex(randomIndex);
//     setShowAnswer(false);

//     const revealTimeout = setTimeout(() => {
//       setShowAnswer(true);
//     }, 5000);

//     const jokeCycle = setInterval(() => {
//       const newIndex = Math.floor(Math.random() * truckerJokes.length);
//       setJokeIndex(newIndex);
//       setShowAnswer(false);
//       setTimeout(() => setShowAnswer(true), 5000);
//     }, 10000);

//     return () => {
//       clearTimeout(revealTimeout);
//       clearInterval(jokeCycle);
//     };
//   }, []);

//   const { question, answer } = truckerJokes[jokeIndex];

//   return (
//     <Box>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={showAnswer ? "answer" : "question"}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 10 }}
//           transition={{ duration: 0.6 }}
//         >
//           <Typography variant="body1" sx={{ fontSize: "1rem", fontWeight: 600 }}>
//             {showAnswer ? answer : question}
//           </Typography>

//           {showAnswer && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.7 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
//             >
//               <Typography fontSize="1.2rem" mt={1}>
//                 😂 🤣 😂
//               </Typography>
//             </motion.div>
//           )}
//         </motion.div>
//       </AnimatePresence>
//     </Box>
//   );
// };

// export default JokeDisplay;
