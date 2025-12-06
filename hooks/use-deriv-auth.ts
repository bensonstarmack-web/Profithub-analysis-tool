"use client"

import { useEffect, useState } from "react"
import { DERIV_CONFIG } from "@/lib/deriv-config"

interface Balance {
  amount: number
  currency: string
}

interface Account {
  id: string
  type: "Demo" | "Real"
  currency: string
}

export function useDerivAuth() {
  const [token, setToken] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [balance, setBalance] = useState<Balance | null>(null)
  const [accountType, setAccountType] = useState<"Demo" | "Real" | null>(null)
  const [accountCode, setAccountCode] = useState<string>("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [activeLoginId, setActiveLoginId] = useState<string | null>(null)
  const [wsRef, setWsRef] = useState<WebSocket | null>(null)
  const [balanceSubscribed, setBalanceSubscribed] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")

  useEffect(() => {
    if (typeof window === "undefined") return

    setConnectionStatus("connecting")
    connectDirect()
  }, [])

  const connectDirect = () => {
    setConnectionStatus("connecting")
    console.log("[v0] 🔌 Connecting to Deriv WebSocket (direct mode, no auth required)...")
    const ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${DERIV_CONFIG.APP_ID}`)

    ws.onopen = () => {
      console.log("[v0] ✅ WebSocket connected (ready for market data)")
      setConnectionStatus("connected")
      setIsLoggedIn(true)
      // Subscribe to market data without authorization
      ws.send(JSON.stringify({ ping: 1 }))
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)

      if (data.error) {
        console.log("[v0] WebSocket message:", data)
        return
      }

      if (data.pong) {
        console.log("[v0] ✅ WebSocket heartbeat confirmed")
      }
    }

    ws.onclose = () => {
      console.log("[v0] 🔌 WebSocket disconnected")
      setConnectionStatus("disconnected")
    }

    ws.onerror = (error) => {
      console.error("[v0] ❌ WebSocket error:", error)
      setConnectionStatus("disconnected")
    }

    setWsRef(ws)
  }

  const logout = () => {
    if (typeof window === "undefined") return

    console.log("[v0] 👋 Disconnecting...")
    if (wsRef) {
      wsRef.close()
    }
    localStorage.clear()
    setToken("")
    setIsLoggedIn(false)
    setBalance(null)
    setAccountType(null)
    setAccountCode("")
    setAccounts([])
    setActiveLoginId(null)
    setBalanceSubscribed(false)
    setConnectionStatus("disconnected")
    console.log("[v0] ✅ Disconnected successfully")
  }

  const switchAccount = () => {
    console.log("[v0] Account switching not available in demo mode")
  }

  return {
    token,
    isLoggedIn,
    isAuthenticated: isLoggedIn,
    loginWithDeriv: () => {},
    logout,
    balance,
    accountType,
    accountCode,
    accounts,
    switchAccount,
    activeLoginId,
    connectionStatus,
  }
}
