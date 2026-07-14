export default function FilterBar({
  subject,
  setSubject,
  grade,
  setGrade,
  chapter,
  setChapter,
  grades,
  chapters
}) {
  const subjects = ["全部", "语文", "历史", "地理", "道德与法治"];

  return (
    <div className="w-full bg-[#f5f5f5] rounded-xl shadow-sm border border-gray-200 px-6 py-5 space-y-4">
      {/* Subject Row */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">科目：</span>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                subject === s
                  ? "bg-gray-800 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grade & Chapter Row */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">年级：</span>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800/20 cursor-pointer"
          >
            <option value="全部">全部年级</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">章节：</span>
          <select
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800/20 cursor-pointer"
          >
            <option value="全部">全部章节</option>
            {chapters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
