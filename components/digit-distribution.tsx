"use client"

interface DigitDistributionProps {
  recentDigits: number[]
  theme?: "light" | "dark"
}

export function DigitDistribution({ recentDigits, theme = "dark" }: DigitDistributionProps) {
  // Count occurrences of each digit
  const digitCounts: { [key: number]: number } = {}
  recentDigits.forEach((digit) => {
    digitCounts[digit] = (digitCounts[digit] || 0) + 1
  })

  const digitRange1 = [0, 1, 2, 3, 4] // 0-4
  const digitRange2 = [5, 6, 7, 8, 9] // 5-9

  const sum1 = digitRange1.reduce((acc, d) => acc + (digitCounts[d] || 0), 0)
  const sum2 = digitRange2.reduce((acc, d) => acc + (digitCounts[d] || 0), 0)

  const total = recentDigits.length || 1

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Digits 0-4
          </span>
          <span className={`text-sm font-bold ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`}>
            {sum1} ({((sum1 / total) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}>
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            style={{ width: `${(sum1 / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Digits 5-9
          </span>
          <span className={`text-sm font-bold ${theme === "dark" ? "text-emerald-400" : "text-green-600"}`}>
            {sum2} ({((sum2 / total) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-700" : "bg-gray-200"}`}>
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
            style={{ width: `${(sum2 / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <div
            key={digit}
            className={`p-2 rounded-lg text-center ${
              theme === "dark" ? "bg-slate-800 border border-slate-600" : "bg-gray-100 border border-gray-300"
            }`}
          >
            <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{digit}</div>
            <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {digitCounts[digit] || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
