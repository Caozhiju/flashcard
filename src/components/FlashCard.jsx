import { subjectColors } from "../data/cardsData";

export default function FlashCard({ card, isFlipped, onFlip }) {
  if (!card) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center space-y-4 min-h-[350px] flex flex-col items-center justify-center">
          <div className="text-6xl">🎉</div>
          <h3 className="text-xl font-semibold text-gray-700">今日任务已完成！</h3>
          <p className="text-gray-500">所有卡片都已复习完毕，点击右上角重新开始可重新复习。</p>
        </div>
      </div>
    );
  }

  const color = subjectColors[card.subject] || "#6b6560";

  return (
    <div className="w-full">
      <div
        className="w-full min-h-[350px] cursor-pointer select-none relative"
        style={{ perspective: "1000px" }}
        onClick={onFlip}
      >
        <div
          className="w-full h-full relative transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "350px"
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg border border-amber-100/50 flex flex-col"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-center gap-2 pt-5">
              <span
                className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {card.subject}
              </span>
              <span className="text-sm font-bold text-gray-800">
                {card.grade} · {card.chapter}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center px-8">
              <p className="text-2xl font-bold text-gray-900 leading-relaxed whitespace-pre-wrap text-center">
                {card.front}
              </p>
            </div>

            <div className="pb-5 text-center">
              <span className="text-sm font-medium text-gray-500">点击卡片 / 按空格键 查看答案</span>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg border border-emerald-100/50 flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="flex items-center justify-center gap-2 pt-5">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">
                答案与解析
              </span>
              <span className="text-sm font-bold text-gray-800">
                {card.subject} · {card.chapter}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-8 overflow-y-auto">
              <p className="text-2xl font-bold text-gray-900 my-3 text-center whitespace-pre-wrap">
                {card.back}
              </p>

              {card.note && (
                <div className="mt-4 p-4 bg-[#f9f8f3] rounded-xl text-base text-gray-600 max-w-md text-center border border-gray-100 whitespace-pre-wrap">
                  <span className="font-semibold text-orange-500">💡 解析：</span>
                  {card.note}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
