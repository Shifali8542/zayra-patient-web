import React from 'react'
import { Bluetooth, BluetoothOff, Loader } from 'lucide-react'
import { useBLEContext } from '../../contexts/BLEContext'

export function BLEConnectionButton() {
    const { status, reconnectAttempt, connect, disconnect } = useBLEContext()

    const isConnected = status === 'streaming'
    const isTransitional = ['scanning', 'connecting', 'discovering', 'reconnecting'].includes(status)

    const label = {
        idle: 'Connect Axiom Device',
        scanning: 'Scanning…',
        connecting: 'Connecting…',
        discovering: 'Setting up…',
        streaming: 'Disconnect',
        reconnecting: `Reconnecting… (${reconnectAttempt}/5)`,
        disconnected: 'Reconnect Device',
        error: 'Retry Connection',
    }[status] ?? 'Connect Device'

    const handleClick = () => {
        if (isTransitional) return
        if (isConnected) disconnect()
        else connect()
    }
    return (
        <button
            onClick={handleClick}
            disabled={isTransitional}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isConnected
                ? 'bg-zayra-teal text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
        >
            {isTransitional
                ? <Loader size={12} className="animate-spin" />
                : isConnected
                    ? <Bluetooth size={12} />
                    : <BluetoothOff size={12} />
            }
            {label}
        </button>
    )
}