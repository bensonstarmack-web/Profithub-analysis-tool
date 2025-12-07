"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface LivePricePanelProps {
  currentPrice: number | null
  previousPrice: number | null
  currentDigit: number | null
  theme: "light" | "dark"
  symbol: string
}

export function LivePricePanel({ currentPrice, previousPrice, currentDigit, theme, symbol }: LivePricePanelProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 600)
    return () => clearTimeout(timer)
  }, [currentPrice])

  const priceChange = currentPrice && previousPrice ? currentPrice - previousPrice : 0
  const isPositive = priceChange >= 0

  const getDigitColor = (digit: number | null) => {
    if (digit === null) return "text-gray-400"
    if (digit > 5) return "text-green-400"
    if (digit === 5) return "text-yellow-400"
    return "text-red-400"
  }

  const getDigitBgColor = (digit: number | null) => {
    if (digit === null) return theme === "dark" ? "bg-slate-800" : "bg-gray-200"
    if (digit > 5) return "bg-gradient-to-br from-green-500 to-emerald-500"
    if (digit === 5) return "bg-gradient-to-br from-yellow-500 to-amber-500"
    return "bg-gradient-to-br from-red-500 to-pink-500"
  }

  return (
    <div
      className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
        isAnimating ? "scale-[1.02]" : "scale-100"
      } ${
        theme === "dark"
          ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/30 shadow-2xl shadow-blue-500/10"
          : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Current Market Price
        </p>
        <p className={`text-xs ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>{symbol}</p>
      </div>

      {/* Main Price Display */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`text-5xl font-black ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
              {currentPrice ? currentPrice.toFixed(4) : "---"}
            </div>
            <div className={`text-sm mt-2 flex items-center gap-2 ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(priceChange).toFixed(4)} ({isPositive ? "+" : ""}
              {((priceChange / (previousPrice || 1)) * 100).toFixed(2)}%)
            </div>
          </div>

          {/* Last Digit Bubble */}
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center font-black text-4xl ${getDigitBgColor(currentDigit)} shadow-2xl transition-all duration-300 ${
                isAnimating ? "animate-bounce" : ""
              } ${theme === "dark" ? "shadow-2xl shadow-cyan-500/30" : "shadow-2xl shadow-cyan-500/20"}`}
            >
              <span className="text-white">{currentDigit !== null ? currentDigit : "-"}</span>
            </div>
            <div
              className={`text-xs font-semibold text-center mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Last Digit
            </div>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-blue-500/20">
        <div className={`text-center py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          <p className="text-xs">Digit Type</p>
          <p className={`font-semibold text-sm ${getDigitColor(currentDigit)}`}>
            {currentDigit !== null ? (currentDigit % 2 === 0 ? "Even" : "Odd") : "-"}
          </p>
        </div>
        <div className={`text-center py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          <p className="text-xs">Range</p>
          <p className={`font-semibold text-sm ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
            {currentDigit !== null ? (currentDigit <= 4 ? "Low (0-4)" : "High (5-9)") : "-"}
          </p>
        </div>
      </div>
    </div>
  )
}
