import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { initialCards } from "./data/cardsData";
import FilterBar from "./components/FilterBar";
import ProgressBar from "./components/ProgressBar";
import FlashCard from "./components/FlashCard";
import ActionButtons from "./components/ActionButtons";

const STORAGE_KEY = "flashcard_progress_v1";

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load progress:", e);
  }
  return { mastered: [], forgotten: [], lastReset: new Date().toDateString() };
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [subject, setSubject] = useState("全部");
  const [grade, setGrade] = useState("全部");
  const [chapter, setChapter] = useState("全部");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const isFlippedRef = useRef(isFlipped);
  const currentCardRef = useRef(null);

  useEffect(() => {
    isFlippedRef.current = isFlipped;
  }, [isFlipped]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastReset !== today) {
      const newProgress = { mastered: [], forgotten: [], lastReset: today };
      setProgress(newProgress);
      saveProgress(newProgress);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const filteredCards = useMemo(() => {
    return initialCards.filter((card) => {
      if (subject !== "全部" && card.subject !== subject) return false;
      if (grade !== "全部" && card.grade !== grade) return false;
      if (chapter !== "全部" && card.chapter !== chapter) return false;
      return true;
    });
  }, [subject, grade, chapter]);

  const remainingCards = useMemo(() => {
    return filteredCards.filter((card) => !progress.mastered.includes(card.id));
  }, [filteredCards, progress.mastered]);

  const grades = useMemo(() => {
    const filtered =
      subject === "全部"
        ? initialCards
        : initialCards.filter((c) => c.subject === subject);
    return [...new Set(filtered.map((c) => c.grade))].sort();
  }, [subject]);

  const chapters = useMemo(() => {
    let filtered = initialCards;
    if (subject !== "全部") filtered = filtered.filter((c) => c.subject === subject);
    if (grade !== "全部") filtered = filtered.filter((c) => c.grade === grade);
    return [...new Set(filtered.map((c) => c.chapter))].sort();
  }, [subject, grade]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [subject, grade, chapter]);

  const currentCard = remainingCards[currentIndex] || null;

  useEffect(() => {
    currentCardRef.current = currentCard;
  }, [currentCard]);

  const handleFlip = useCallback(() => {
    if (currentCardRef.current) setIsFlipped((prev) => !prev);
  }, []);

  const handleForget = useCallback(() => {
    if (!currentCardRef.current) return;
    setProgress((prev) => ({
      ...prev,
      forgotten: [...prev.forgotten, currentCardRef.current.id]
    }));
    setIsFlipped(false);
  }, []);

  const handleRemember = useCallback(() => {
    if (!currentCardRef.current) return;
    setProgress((prev) => ({
      ...prev,
      mastered: [...prev.mastered, currentCardRef.current.id]
    }));
    setIsFlipped(false);
  }, []);

  const handleReset = useCallback(() => {
    const newProgress = {
      mastered: [],
      forgotten: [],
      lastReset: new Date().toDateString()
    };
    setProgress(newProgress);
    saveProgress(newProgress);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleFlip();
      } else if ((e.code === "ArrowLeft" || e.key === "1") && isFlippedRef.current) {
        e.preventDefault();
        handleForget();
      } else if ((e.code === "ArrowRight" || e.key === "2") && isFlippedRef.current) {
        e.preventDefault();
        handleRemember();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip, handleForget, handleRemember]);

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-gray-800 flex flex-col items-center py-8 px-4 font-sans">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#2d2d2d]">初中知识闪卡</h1>
            <p className="text-sm text-gray-500 mt-1">Anki 风格高效复习</p>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-[#2d2d2d] bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
          >
            重新开始今日复习
          </button>
        </header>

        {/* Filter Bar */}
        <FilterBar
          subject={subject}
          setSubject={setSubject}
          grade={grade}
          setGrade={setGrade}
          chapter={chapter}
          setChapter={setChapter}
          grades={grades}
          chapters={chapters}
        />

        {/* Progress Bar */}
        <ProgressBar
          remaining={remainingCards.length}
          total={filteredCards.length}
          mastered={progress.mastered.length}
        />

        {/* Card Arena */}
        <FlashCard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

        {/* Action Buttons */}
        <ActionButtons
          isFlipped={isFlipped}
          onForget={handleForget}
          onRemember={handleRemember}
        />

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 pt-2">
          快捷键：Space 翻牌 · ←/1 忘记 · →/2 记住
        </footer>
      </div>
    </div>
  );
}
