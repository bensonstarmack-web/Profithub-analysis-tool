"use client"

import { useState, useMemo } from "react"
import { ChevronDown, TrendingUp, Zap, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MarketOption {
  symbol: string
  display_name: string
  market: string
  market_display_name: string
  submarket?: string
}

interface MarketSelectorAdvancedProps {
  symbols: MarketOption[]
  currentSymbol: string
  onSymbolChange: (symbol: string) => void
  theme: "light" | "dark"
}

export function MarketSelectorAdvanced({ symbols, currentSymbol, onSymbolChange, theme }: MarketSelectorAdvancedProps) {
  const [expanded, setExpanded] = useState(false)

  // Group symbols by market type
  const groupedSymbols = useMemo(() => {
    const groups: Record<string, Record<string, MarketOption[]>> = {}

    symbols.forEach((symbol) => {
      const market = symbol.market_display_name || symbol.market
      const submarket = symbol.submarket || symbol.market || "Other"

      if (!groups[market]) groups[market] = {}
      if (!groups[market][submarket]) groups[market][submarket] = []
      groups[market][submarket].push(symbol)
    })

    return groups
  }, [symbols])

  const getMarketIcon = (marketName: string) => {
    if (marketName.toLowerCase().includes("volatility") || marketName.toLowerCase().includes("synthetic"))
      return <Zap className="w-4 h-4 text-purple-400" />
    if (marketName.toLowerCase().includes("forex")) return <TrendingUp className="w-4 h-4 text-blue-400" />
    return <Gem className="w-4 h-4 text-cyan-400" />
  }

  const currentSymbolData = symbols.find((s) => s.symbol === currentSymbol)

  return (
    <div className="relative">
      <Button
        onClick={() => setExpanded(!expanded)}
        variant="outline"
        className={`w-full justify-between px-3 py-2 text-sm ${
          theme === "dark"
            ? "border-cyan-500/30 bg-cyan-900/20 hover:bg-cyan-900/30 text-cyan-400"
            : "border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-700"
        }`}
      >
        <span className="flex items-center gap-2">
          {getMarketIcon(currentSymbolData?.market_display_name || "")}
          <span className="truncate">{currentSymbolData?.display_name || "Select Market"}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </Button>

      {expanded && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-xl border z-50 shadow-xl ${
            theme === "dark"
              ? "border-cyan-500/30 bg-gradient-to-b from-slate-900 to-slate-800 backdrop-blur-xl"
              : "border-cyan-200 bg-white/95 backdrop-blur-sm"
          }`}
        >
          {Object.entries(groupedSymbols).map(([market, submarkets]) => (
            <div key={market} className="border-b border-cyan-500/10 last:border-b-0">
              <div
                className={`px-4 py-2 font-semibold text-xs flex items-center gap-2 ${
                  theme === "dark" ? "text-cyan-300 bg-cyan-900/20" : "text-cyan-700 bg-cyan-50"
                }`}
              >
                {getMarketIcon(market)}
                {market}
              </div>

              {Object.entries(submarkets).map(([submarket, submktSymbols]) => (
                <div key={submarket} className={theme === "dark" ? "bg-slate-800/50" : "bg-gray-50"}>
                  <div
                    className={`px-6 py-1.5 text-xs font-medium ${
                      theme === "dark" ? "text-cyan-200/60" : "text-cyan-600/60"
                    }`}
                  >
                    {submarket}
                  </div>

                  {submktSymbols.map((symbol) => (
                    <button
                      key={symbol.symbol}
                      onClick={() => {
                        onSymbolChange(symbol.symbol)
                        setExpanded(false)
                      }}
                      className={`w-full text-left px-8 py-2 text-sm transition-colors ${
                        currentSymbol === symbol.symbol
                          ? theme === "dark"
                            ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-300 border-l-2 border-cyan-500"
                            : "bg-cyan-100 text-cyan-700 border-l-2 border-cyan-500"
                          : theme === "dark"
                            ? "text-cyan-100 hover:bg-cyan-900/30"
                            : "text-cyan-900 hover:bg-cyan-50"
                      }`}
                    >
                      {symbol.display_name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
