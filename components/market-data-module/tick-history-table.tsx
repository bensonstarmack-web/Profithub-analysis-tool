"use client"

import { useEffect, useRef } from "react"

interface Tick {
  time: string
  price: number
  digit: number
  change: number
  direction: "up" | "down"
}

interface TickHistoryTableProps {
  ticks: Tick[]
  theme: "light" | "dark"
  maxRows?: number
}

export function TickHistoryTable({ ticks, theme, maxRows = 10 }: TickHistoryTableProps) {
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight
    }
  }, [ticks])

  const displayTicks = ticks.slice(-maxRows).reverse()

  const getDigitColor = (digit: number) => {
    if (digit > 5) return "text-green-400 bg-green-500/10"
    if (digit === 5) return "text-yellow-400 bg-yellow-500/10"
    return "text-red-400 bg-red-500/10"
  }

  return (
    <div
      className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/30"
          : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
      }`}
    >
      <div className="p-4 border-b border-emerald-500/20">
        <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Live Tick History</h3>
      </div>

      <div ref={tableRef} className="overflow-y-auto max-h-64">
        <table className="w-full text-sm">
          <thead
            className={`sticky top-0 ${
              theme === "dark"
                ? "bg-emerald-900/30 border-b border-emerald-500/20"
                : "bg-emerald-100 border-b border-emerald-200"
            }`}
          >
            <tr>
              <th className={`px-4 py-2 text-left ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Time</th>
              <th className={`px-4 py-2 text-left ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Price</th>
              <th className={`px-4 py-2 text-left ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Digit</th>
              <th className={`px-4 py-2 text-left ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Change</th>
            </tr>
          </thead>
          <tbody>
            {displayTicks.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className={`px-4 py-6 text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                >
                  Waiting for ticks...
                </td>
              </tr>
            ) : (
              displayTicks.map((tick, idx) => (
                <tr
                  key={idx}
                  className={`border-t border-emerald-500/10 transition-colors animate-in fade-in ${
                    theme === "dark" ? "hover:bg-emerald-900/20" : "hover:bg-emerald-100/50"
                  }`}
                >
                  <td className={`px-4 py-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{tick.time}</td>
                  <td className={`px-4 py-3 font-semibold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
                    {tick.price.toFixed(4)}
                  </td>
                  <td className={`px-4 py-3`}>
                    <span className={`px-2 py-1 rounded-lg font-semibold ${getDigitColor(tick.digit)}`}>
                      {tick.digit}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${tick.direction === "up" ? "text-green-400" : "text-red-400"}`}
                  >
                    {tick.direction === "up" ? "↑" : "↓"} {Math.abs(tick.change).toFixed(4)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
