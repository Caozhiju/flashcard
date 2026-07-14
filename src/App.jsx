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
    const unitOrder = { "一": 1, "二": 2, "三": 3, "四": 4 };
    return [...new Set(filtered.map((c) => c.chapter))].sort((a, b) => {
      const aUnit = a.match(/第([一二三四])单元/)?.[1];
      const bUnit = b.match(/第([一二三四])单元/)?.[1];
      const aNum = (aUnit ? unitOrder[aUnit] : 0) * 100;
      const bNum = (bUnit ? unitOrder[bUnit] : 0) * 100;
      const aLesson = parseInt(a.match(/第(\d+)课/)?.[1] || "0");
      const bLesson = parseInt(b.match(/第(\d+)课/)?.[1] || "0");
      return aNum + aLesson - (bNum + bLesson);
    });
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
    <div className="min-h-screen bg-[#fcfaf7] text-gray-800 flex flex-col items-center py-10 px-4 font-sans">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">初中知识闪卡</h1>
            <p className="text-base text-gray-500 mt-1.5">Anki 风格高效复习</p>
          </div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-gray-400 transition-all duration-200"
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

        {/* Action Buttons & Shortcuts Panel */}
        <ActionButtons
          isFlipped={isFlipped}
          onForget={handleForget}
          onRemember={handleRemember}
        />

        {/* Bottom Shortcut Panel */}
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4">
          <div className="flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-mono font-bold text-gray-700">Space</kbd>
              <span className="text-gray-600">翻牌</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-mono font-bold text-gray-700">←</kbd>
              <span className="text-gray-400">/</span>
              <kbd className="px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-mono font-bold text-gray-700">1</kbd>
              <span className="text-gray-600">忘记</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-mono font-bold text-gray-700">→</kbd>
              <span className="text-gray-400">/</span>
              <kbd className="px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-mono font-bold text-gray-700">2</kbd>
              <span className="text-gray-600">记住</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
