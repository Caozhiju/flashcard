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
    <div className="w-full space-y-3">
      <div className="flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              subject === s
                ? "bg-gray-800 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800/20 cursor-pointer"
        >
          <option value="全部">全部年级</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800/20 cursor-pointer"
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
  );
}
