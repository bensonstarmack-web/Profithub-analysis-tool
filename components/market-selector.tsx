"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { DerivSymbol } from "@/lib/deriv-websocket"

interface MarketSelectorProps {
  symbols: DerivSymbol[]
  currentSymbol: string
  onSymbolChange: (symbol: string) => void
  theme?: "light" | "dark"
}

export function MarketSelector({ symbols, currentSymbol, onSymbolChange, theme = "dark" }: MarketSelectorProps) {
  const [open, setOpen] = useState(false)

  const groupedSymbols = useMemo(() => {
    const validSymbols = (symbols || []).filter((s) => s && s.symbol)

    // Categorize symbols
    const derivVolatilities1s: DerivSymbol[] = []
    const derivVolatilitiesIndices: DerivSymbol[] = []
    const forex: DerivSymbol[] = []
    const commodities: DerivSymbol[] = []
    const stocks: DerivSymbol[] = []
    const cryptocurrencies: DerivSymbol[] = []
    const otherSymbols: DerivSymbol[] = []

    validSymbols.forEach((symbol) => {
      const market = symbol?.market || ""
      const displayName = symbol?.display_name || symbol?.symbol || ""

      // Categorize by market type
      if (market === "synthetic_index" || symbol?.symbol?.includes?.("R_")) {
        // Check if it's 1s volatility
        if (symbol?.symbol?.includes?.("1s")) {
          derivVolatilities1s.push(symbol)
        } else {
          // All other indices go into "Deriv Volatilities"
          derivVolatilitiesIndices.push(symbol)
        }
      } else if (market === "forex") {
        forex.push(symbol)
      } else if (market === "commodities") {
        commodities.push(symbol)
      } else if (market === "stock" || market === "stocks") {
        stocks.push(symbol)
      } else if (market === "crypto" || market === "cryptocurrency" || market === "cryptocurrencies") {
        cryptocurrencies.push(symbol)
      } else {
        otherSymbols.push(symbol)
      }
    })

    // Sort each category
    const sortByDisplayName = (a: DerivSymbol, b: DerivSymbol) => {
      const aName = a?.display_name || ""
      const bName = b?.display_name || ""
      return aName.localeCompare(bName)
    }

    derivVolatilities1s.sort(sortByDisplayName)
    derivVolatilitiesIndices.sort(sortByDisplayName)
    forex.sort(sortByDisplayName)
    commodities.sort(sortByDisplayName)
    stocks.sort(sortByDisplayName)
    cryptocurrencies.sort(sortByDisplayName)
    otherSymbols.sort(sortByDisplayName)

    // Combine all volatilities under one category
    const allVolatilities = [...derivVolatilitiesIndices, ...derivVolatilities1s]

    const groups: Record<string, DerivSymbol[]> = {}

    if (allVolatilities.length > 0) {
      groups["Deriv Volatilities"] = allVolatilities
    }
    if (forex.length > 0) {
      groups["Forex"] = forex
    }
    if (commodities.length > 0) {
      groups["Commodities"] = commodities
    }
    if (stocks.length > 0) {
      groups["Stocks"] = stocks
    }
    if (cryptocurrencies.length > 0) {
      groups["Cryptocurrencies"] = cryptocurrencies
    }
    if (otherSymbols.length > 0) {
      groups["Other"] = otherSymbols
    }

    return groups
  }, [symbols])

  const currentSymbolData = (symbols || []).find((s) => s?.symbol === currentSymbol)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[220px] justify-between ${
            theme === "dark"
              ? "bg-[#0f1629]/50 border-blue-500/30 text-white hover:bg-[#1a2235] hover:text-white"
              : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
          }`}
        >
          {currentSymbolData?.display_name || currentSymbol || "Select market..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-[320px] p-0 max-h-[450px] overflow-y-auto ${
          theme === "dark" ? "bg-[#0a0e27] border-blue-500/30" : "bg-white border-gray-300"
        }`}
      >
        <Command className={theme === "dark" ? "bg-[#0a0e27]" : "bg-white"}>
          <CommandInput placeholder="Search markets..." className={theme === "dark" ? "text-white" : "text-gray-900"} />
          <CommandList>
            <CommandEmpty className={`py-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              No market found.
            </CommandEmpty>
            {Object.entries(groupedSymbols).map(([market, marketSymbols]) => (
              <CommandGroup
                key={market}
                heading={market}
                className={theme === "dark" ? "text-blue-400 font-semibold" : "text-blue-600 font-semibold"}
              >
                {(marketSymbols || []).map((symbol) => (
                  <CommandItem
                    key={symbol?.symbol}
                    value={symbol?.symbol}
                    onSelect={() => {
                      if (symbol?.symbol) {
                        onSymbolChange(symbol.symbol)
                        setOpen(false)
                      }
                    }}
                    className={
                      theme === "dark"
                        ? "text-white hover:bg-blue-500/20 cursor-pointer"
                        : "text-gray-900 hover:bg-blue-50 cursor-pointer"
                    }
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        currentSymbol === symbol?.symbol ? "opacity-100 text-green-400" : "opacity-0"
                      }`}
                    />
                    {symbol?.display_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
