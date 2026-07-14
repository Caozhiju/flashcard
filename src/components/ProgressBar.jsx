export default function ProgressBar({ remaining, total, mastered }) {
  const percentage = total > 0 ? ((total - remaining) / total) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 font-medium">
          今日待刷：{remaining} / {total} 张
        </span>
        <span className="text-gray-400 text-xs">
          已掌握：{mastered} 张
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
