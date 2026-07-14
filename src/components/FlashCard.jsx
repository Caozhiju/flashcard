import { subjectColors } from "../data/cardsData";

export default function FlashCard({ card, isFlipped, onFlip }) {
  if (!card) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center space-y-4 min-h-[380px] flex flex-col items-center justify-center">
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
      {/* 最外层容器：perspective + 点击交互 */}
      <div
        className="w-full min-h-[380px] cursor-pointer select-none relative"
        style={{ perspective: "1000px" }}
        onClick={onFlip}
      >
        {/* 3D 旋转包裹层 */}
        <div
          className="w-full h-full relative transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "380px"
          }}
        >
          {/* 卡片正面 */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg border border-amber-100/50 p-8 flex flex-col justify-center items-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {card.subject}
              </span>
              <span className="text-xs text-gray-400">
                {card.grade} · {card.chapter}
              </span>
            </div>

            <p className="text-2xl font-bold text-gray-800 leading-relaxed whitespace-pre-wrap text-center px-4">
              {card.front}
            </p>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-sm text-gray-400">点击卡片 / 按空格键 查看答案</span>
            </div>
          </div>

          {/* 卡片背面（答案页） */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg border border-emerald-100/50 p-8 flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            {/* 顶部标签 */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                答案与解析
              </span>
              <span className="text-xs text-gray-400">
                {card.subject} · {card.chapter}
              </span>
            </div>

            {/* 核心答案 */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <p className="text-2xl font-bold text-gray-800 my-4 text-center whitespace-pre-wrap px-4">
                {card.back}
              </p>

              {/* 补充解析 */}
              {card.note && (
                <div className="mt-6 p-4 bg-[#f9f8f3] rounded-xl text-base text-gray-600 max-w-md text-center border border-gray-100 whitespace-pre-wrap">
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
