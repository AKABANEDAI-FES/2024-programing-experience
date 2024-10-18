// import { useCallback, useEffect, useState } from 'react';

// // 仮のMarkDown会話データ
// const conversationData = [
//   '# こんにちは！',
//   '## プログラミングを始めましょう',
//   '1. まず、**ブロック**を選びます',
//   '2. 次に、それを**組み合わせて**いきます',
//   '3. 最後に、**実行**してみましょう！',
//   '### 準備はいいですか？',
//   'さあ、始めましょう！',
// ];

// export function useConversation() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoMode, setIsAutoMode] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [showAll, setShowAll] = useState(false);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isAutoMode && !isPaused && currentIndex < conversationData.length - 1) {
//       timer = setInterval(() => {
//         setCurrentIndex((prevIndex) => prevIndex + 1);
//       }, 3000);
//     }
//     return () => clearInterval(timer);
//   }, [isAutoMode, isPaused, currentIndex]);

//   const handleNext = useCallback(() => {
//     if (currentIndex < conversationData.length - 1) {
//       setCurrentIndex((prevIndex) => prevIndex + 1);
//     }
//   }, [currentIndex]);

//   const handlePrev = useCallback(() => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prevIndex) => prevIndex - 1);
//     }
//   }, [currentIndex]);

//   const toggleAutoMode = useCallback(() => {
//     setIsAutoMode(!isAutoMode);
//     setIsPaused(false);
//   }, [isAutoMode]);

//   const togglePause = useCallback(() => {
//     setIsPaused(!isPaused);
//   }, [isPaused]);

//   const toggleShowAll = useCallback(() => {
//     setShowAll(!showAll);
//   }, [showAll]);

//   return {
//     currentIndex,
//     isAutoMode,
//     isPaused,
//     showAll,
//     conversationData,
//     handleNext,
//     handlePrev,
//     toggleAutoMode,
//     togglePause,
//     toggleShowAll,
//   };
// }
