"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Settings } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MarketSelector } from "@/components/market-selector"
import { DigitDistribution } from "@/components/digit-distribution"
import { SignalsTab } from "@/components/tabs/signals-tab"
import { ProSignalsTab } from "@/components/tabs/pro-signals-tab"
import { SuperSignalsTab } from "@/components/tabs/super-signals-tab"
import { EvenOddTab } from "@/components/tabs/even-odd-tab"
import { OverUnderTab } from "@/components/tabs/over-under-tab"
import { AdvancedOverUnderTab } from "@/components/tabs/advanced-over-under-tab"
import { MatchesTab } from "@/components/tabs/matches-tab"
import { DiffersTab } from "@/components/tabs/differs-tab"
import { RiseFallTab } from "@/components/tabs/rise-fall-tab"
import { AIAnalysisTab } from "@/components/tabs/ai-analysis-tab"
import { TradingViewTab } from "@/components/tabs/trading-view-tab"
import { StatisticalAnalysis } from "@/components/statistical-analysis"
import { LastDigitsChart } from "@/components/charts/last-digits-chart"
import { LastDigitsLineChart } from "@/components/charts/last-digits-line-chart"
import { ErrorBoundary } from "@/components/error-boundary"

export default function DerivAnalysisApp() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [symbol, setSymbol] = useState("R_50")
  const [maxTicks, setMaxTicks] = useState(100)

  // Mock data for the app
  const currentPrice = 1234.56
  const currentDigit = 4
  const tickCount = 150

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
    document.documentElement.classList.toggle("dark", theme === "light")
  }

  const recentDigits = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10))
  const recent40Digits = Array.from({ length: 40 }, () => Math.floor(Math.random() * 10))
  const recent50Digits = Array.from({ length: 50 }, () => Math.floor(Math.random() * 10))
  const recent100Digits = Array.from({ length: 100 }, () => Math.floor(Math.random() * 10))

  const signals = [
    { id: 1, status: "TRADE NOW" },
    { id: 2, status: "NEUTRAL" },
    { id: 3, status: "TRADE NOW" },
  ]

  const proSignals = [
    { id: 1, status: "TRADE NOW" },
    { id: 2, status: "NEUTRAL" },
    { id: 3, status: "TRADE NOW" },
  ]

  const activeSignals = (signals || []).filter((s) => s.status !== "NEUTRAL")
  const powerfulSignalsCount = activeSignals.filter((s) => s.status === "TRADE NOW").length

  return (
    <ErrorBoundary>
      <div
        className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#1a1f3a]" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}
      >
        <header className={`border-b border-blue-500/20 bg-[#0a0e27]/80 backdrop-blur-md sticky top-0 z-50 shadow-lg`}>
          <div className="w-full px-3 sm:px-4 md:px-6 py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left: Logo */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  )}
                </Button>
                <span className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                  Profit Hub
                </span>
              </div>

              {/* Center: Market Selector & Live Status */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center max-w-md">
                {/* Live streaming indicator */}
                <Badge
                  className={`text-xs px-2 py-1 ${
                    "connected"
                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse"
                  }`}
                >
                  <span className="h-3 w-3 mr-1 inline">⚡</span>
                  {"connected" ? "LIVE" : "Connecting..."}
                </Badge>
              </div>

              {/* Right: Theme, Settings */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Theme Toggle */}
                <Button variant="ghost" size="icon" onClick={handleThemeToggle} className="h-8 w-8 sm:h-9 sm:w-9">
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  )}
                </Button>

                {/* Settings Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className={`w-72 ${theme === "dark" ? "bg-[#0a0e27] border-blue-500/30" : "bg-white"}`}
                    align="end"
                  >
                    <div className="space-y-4">
                      <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Settings</h3>

                      {/* Mobile Market Selector */}
                      <div className="space-y-2 sm:hidden">
                        <label
                          className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Market
                        </label>
                        <MarketSelector
                          symbols={["R_50", "R_100", "R_250"]}
                          currentSymbol={symbol}
                          onSymbolChange={setSymbol}
                          theme={theme}
                        />
                      </div>

                      {/* Max Ticks Selector */}
                      <div className="space-y-2">
                        <label
                          className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Max Ticks History
                        </label>
                        <Select value={maxTicks.toString()} onValueChange={(value) => setMaxTicks(Number(value))}>
                          <SelectTrigger className={theme === "dark" ? "bg-slate-800 border-slate-600 text-white" : ""}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[50, 100, 200, 500, 1000].map((tick) => (
                              <SelectItem key={tick} value={tick.toString()}>
                                {tick} Ticks
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Current Symbol Info */}
                      <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-slate-800/50" : "bg-gray-100"}`}>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Current Market
                        </p>
                        <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{symbol}</p>
                        <p className={`text-sm ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`}>
                          {currentPrice?.toFixed(4) || "---"}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container-responsive py-4 sm:py-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div
              className={`p-3 sm:p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/20"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Current Price</div>
              <div className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`}>
                {currentPrice?.toFixed(4) || "---"}
              </div>
            </div>
            <div
              className={`p-3 sm:p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/20"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Last Digit</div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  currentDigit !== null
                    ? currentDigit % 2 === 0
                      ? "text-blue-400"
                      : "text-orange-400"
                    : theme === "dark"
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                {currentDigit !== null ? currentDigit : "-"}
              </div>
            </div>
            <div
              className={`p-3 sm:p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/20"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Ticks</div>
              <div
                className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-emerald-400" : "text-green-600"}`}
              >
                {tickCount}
              </div>
            </div>
            <div
              className={`p-3 sm:p-4 rounded-xl border ${
                theme === "dark"
                  ? "bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border-amber-500/20"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Active Signals</div>
              <div className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}>
                {powerfulSignalsCount}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="smart-analysis" className="space-y-4">
            <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
              <TabsList
                className={`inline-flex gap-1 sm:gap-2 p-1 rounded-xl w-max min-w-full sm:min-w-0 ${
                  theme === "dark" ? "bg-slate-800/50 backdrop-blur-sm" : "bg-gray-100"
                }`}
              >
                {[
                  "smart-analysis",
                  "signals",
                  "pro-signals",
                  "super-signals",
                  "even-odd",
                  "over-under",
                  "advanced-over-under",
                  "matches",
                  "differs",
                  "rise-fall",
                  "ai-analysis",
                  "trading-view",
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`flex-shrink-0 rounded-lg border border-transparent text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap transition-all capitalize font-medium data-[state=active]:border-emerald-400 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:shadow-[0_2px_10px_rgba(34,211,238,0.25)] data-[state=active]:bg-transparent ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-slate-800/50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"}`}
                  >
                    {tab.replace(/-/g, " ")}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="smart-analysis" className="mt-0">
              <div className="space-y-4 sm:space-y-6">
                {/* Digit Distribution */}
                <div
                  className={`p-3 sm:p-4 md:p-6 rounded-xl border ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/20"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <DigitDistribution recentDigits={recentDigits} theme={theme} />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Last Digits Chart */}
                  <div
                    className={`p-3 sm:p-4 md:p-6 rounded-xl border ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/20"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    <h3
                      className={`text-xs sm:text-sm font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Last Digits Distribution
                    </h3>
                    <LastDigitsChart digits={recentDigits} theme={theme} />
                  </div>

                  {/* Line Chart */}
                  <div
                    className={`p-3 sm:p-4 md:p-6 rounded-xl border ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/20"
                        : "bg-white border-gray-200 shadow-sm"
                    }`}
                  >
                    <h3
                      className={`text-xs sm:text-sm font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Digits Trend Line
                    </h3>
                    <LastDigitsLineChart digits={recent50Digits} />
                  </div>
                </div>

                {/* Statistical Analysis */}
                <div
                  className={`p-3 sm:p-4 md:p-6 rounded-xl border ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-500/20"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <StatisticalAnalysis analysis={{}} recentDigits={recent100Digits} theme={theme} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signals" className="mt-0">
              <SignalsTab signals={signals} theme={theme} />
            </TabsContent>

            <TabsContent value="pro-signals" className="mt-0">
              <ProSignalsTab signals={proSignals} theme={theme} />
            </TabsContent>

            <TabsContent value="super-signals" className="mt-0">
              <SuperSignalsTab />
            </TabsContent>

            <TabsContent value="even-odd" className="mt-0">
              <EvenOddTab analysis={{}} recentDigits={recent50Digits} theme={theme} />
            </TabsContent>

            <TabsContent value="over-under" className="mt-0">
              <OverUnderTab analysis={{}} recentDigits={recent50Digits} theme={theme} />
            </TabsContent>

            <TabsContent value="advanced-over-under" className="mt-0">
              <AdvancedOverUnderTab theme={theme} recentDigits={recent100Digits} />
            </TabsContent>

            <TabsContent value="matches" className="mt-0">
              <MatchesTab analysis={{}} recentDigits={recentDigits} theme={theme} />
            </TabsContent>

            <TabsContent value="differs" className="mt-0">
              <DiffersTab analysis={{}} recentDigits={recentDigits} theme={theme} />
            </TabsContent>

            <TabsContent value="rise-fall" className="mt-0">
              <RiseFallTab analysis={{}} theme={theme} />
            </TabsContent>

            <TabsContent value="ai-analysis" className="mt-0">
              <AIAnalysisTab recentDigits={recent100Digits} theme={theme} />
            </TabsContent>

            <TabsContent value="trading-view" className="mt-0">
              <TradingViewTab symbol={symbol} theme={theme} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ErrorBoundary>
  )
}
