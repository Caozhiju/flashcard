export default function ActionButtons({ isFlipped, onForget, onRemember }) {
  if (!isFlipped) return null;

  return (
    <div className="w-full space-y-3 slide-up">
      <div className="flex gap-4">
        <button
          onClick={onForget}
          className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-orange-400 to-red-400 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          忘记 / 困难
        </button>
        <button
          onClick={onRemember}
          className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-green-400 to-green-500 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          记住 / 简单
        </button>
      </div>
    </div>
  );
}
