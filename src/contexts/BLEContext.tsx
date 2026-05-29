import React, { createContext, useContext, type ReactNode } from 'react'
import { useBLEDevice, type BLEDeviceHookResult } from '../hooks/useBLEDevice'

const BLEContext = createContext<BLEDeviceHookResult | null>(null)

export function BLEProvider({ children }: { children: ReactNode }) {
  const ble = useBLEDevice()
  return <BLEContext.Provider value={ble}>{children}</BLEContext.Provider>
}

export function useBLEContext(): BLEDeviceHookResult {
  const ctx = useContext(BLEContext)
  if (!ctx) throw new Error('useBLEContext must be used within BLEProvider')
  return ctx
}