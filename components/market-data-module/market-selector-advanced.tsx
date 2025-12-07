"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Zap } from "lucide-react"
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

  const groupedSymbols = useMemo(() => {
    const plainIndices: Record<string, MarketOption[]> = {}
    const oneSecIndices: Record<string, MarketOption[]> = {}
    const jumpIndices: Record<string, MarketOption[]> = {}
    const bullBear: Record<string, MarketOption[]> = {}
    const others: Record<string, MarketOption[]> = {}

    symbols.forEach((symbol) => {
      const displayName = symbol.display_name?.toLowerCase() || ""
      const symbolName = symbol.symbol?.toLowerCase() || ""

      // Categorize based on symbol/display name patterns
      if (displayName.includes("1s") || symbolName.includes("1s")) {
        if (!oneSecIndices[symbol.market]) oneSecIndices[symbol.market] = []
        oneSecIndices[symbol.market].push(symbol)
      } else if (displayName.includes("jump") || symbolName.includes("jump") || symbolName.match(/^j\d+$/i)) {
        if (!jumpIndices[symbol.market]) jumpIndices[symbol.market] = []
        jumpIndices[symbol.market].push(symbol)
      } else if (
        displayName.includes("bull") ||
        displayName.includes("bear") ||
        symbolName.includes("bull") ||
        symbolName.includes("bear")
      ) {
        if (!bullBear[symbol.market]) bullBear[symbol.market] = []
        bullBear[symbol.market].push(symbol)
      } else if (
        displayName.includes("volatility") ||
        displayName.includes("synthetic") ||
        symbolName.match(/^[rb]_\d+$/i)
      ) {
        if (!plainIndices[symbol.market]) plainIndices[symbol.market] = []
        plainIndices[symbol.market].push(symbol)
      } else {
        if (!others[symbol.market]) others[symbol.market] = []
        others[symbol.market].push(symbol)
      }
    })

    return {
      "Deriv Volatilities (Plain Indices)": plainIndices,
      "1s Markets": oneSecIndices,
      "Jump Indices": jumpIndices,
      "Bull & Bear": bullBear,
      "Other Markets": others,
    }
  }, [symbols])

  const getMarketIcon = (categoryName: string) => {
    return <Zap className="w-4 h-4 text-cyan-400" />
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
          {Object.entries(groupedSymbols).map(([categoryName, markets]) => {
            // Skip empty categories
            if (Object.keys(markets).length === 0) return null

            return (
              <div key={categoryName} className="border-b border-cyan-500/10 last:border-b-0">
                <div
                  className={`px-4 py-2 font-semibold text-xs flex items-center gap-2 ${
                    theme === "dark" ? "text-cyan-300 bg-cyan-900/20" : "text-cyan-700 bg-cyan-50"
                  }`}
                >
                  {getMarketIcon(categoryName)}
                  {categoryName}
                </div>

                {Object.entries(markets).map(([market, marketSymbols]) => (
                  <div key={market} className={theme === "dark" ? "bg-slate-800/50" : "bg-gray-50"}>
                    {marketSymbols.map((symbol) => (
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
            )
          })}
        </div>
      )}
    </div>
  )
}
