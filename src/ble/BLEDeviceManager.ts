import {
  BLE_DEVICE_NAME,
  BLE_SERVICES,
  BLE_CHARACTERISTICS,
  BLE_RECONNECT_MAX_ATTEMPTS,
  BLE_RECONNECT_BASE_DELAY_MS,
} from './BLEConstants'
import { parseECGPacket, parseHeartRateMeasurement } from './ECGPacketParser'
import type { BLEStatus, BLEVitals, ECGSample } from './types'

type StatusListener = (status: BLEStatus, attempt?: number) => void
type VitalsListener = (vitals: BLEVitals) => void
type ECGListener = (samples: ECGSample[]) => void
type ErrorListener = (message: string) => void

// Singleton class
export class BLEDeviceManager {
  private device: BluetoothDevice | null = null
  private server: BluetoothRemoteGATTServer | null = null
  private reconnectAttempts = 0
  private _isReconnecting = false
  private _connected = false

  private statusListeners: Set<StatusListener> = new Set()
  private vitalsListeners: Set<VitalsListener> = new Set()
  private ecgListeners: Set<ECGListener> = new Set()
  private errorListeners: Set<ErrorListener> = new Set()

  // ─── Public API

  onStatus(fn: StatusListener) { this.statusListeners.add(fn); return () => this.statusListeners.delete(fn) }
  onVitals(fn: VitalsListener) { this.vitalsListeners.add(fn); return () => this.vitalsListeners.delete(fn) }
  onECG(fn: ECGListener) { this.ecgListeners.add(fn); return () => this.ecgListeners.delete(fn) }
  onError(fn: ErrorListener) { this.errorListeners.add(fn); return () => this.errorListeners.delete(fn) }

  async connect(): Promise<void> {
    if (!navigator.bluetooth) {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      if (!isChrome) {
        this.emitError('Please use Google Chrome to connect the Axiom device.')
      } else {
        this.emitError('Bluetooth not available. Make sure this page is opened on https://')
      }
      this.emitStatus('error')
      return
    }

    // Forget previously paired device so Chrome always shows fresh scan list
    // This is the industry fix for Chrome BLE caching problem
    if (this.device) {
      try {
        // Disconnect cleanly if still connected
        if (this.device.gatt?.connected) {
          this.device.gatt.disconnect()
        }
        // Forget the device — removes Chrome's internal cache for this device
        if (typeof (this.device as any).forget === 'function') {
          await (this.device as any).forget()
        }
      } catch { /* ignore forget errors */ }
    }

    this.device = null
    this.server = null
    this.reconnectAttempts = 0
    this._isReconnecting = false

    try {
      this.emitStatus('scanning')
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ name: BLE_DEVICE_NAME }],
        optionalServices: [
          BLE_SERVICES.ECG,
          BLE_SERVICES.VITALS,
        ],
      })
      this.device.addEventListener('gattserverdisconnected', this.handleDisconnect)
      await this.connectGATT()
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'NotFoundError') {
        this.emitStatus('idle')
        return
      }
      this.emitError(`Connection failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
      this.emitStatus('error')
    }
  }

  async disconnect(): Promise<void> {
    this._isReconnecting = false
    this._connected = false
    this.reconnectAttempts = 0

    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect()
    }

    // Forget device on manual disconnect
    if (this.device && typeof (this.device as any).forget === 'function') {
      try { await (this.device as any).forget() } catch { /* ignore */ }
    }

    this.device = null
    this.server = null
    this.emitStatus('idle')
  }

  get isConnected(): boolean {
    return this._connected
  }

  // Private internals
  private async connectGATT(): Promise<void> {
    if (!this.device) return
    try {
      this.emitStatus('connecting')
      this.server = await this.device.gatt!.connect()
      this.emitStatus('discovering')
      await this.subscribeToECG()
      await this.subscribeToVitals()
      this.reconnectAttempts = 0
      this._isReconnecting = false
      this._connected = true
      this.emitStatus('streaming')
    } catch (e: unknown) {
      this._connected = false
      this.emitError(`Could not connect: ${e instanceof Error ? e.message : String(e)}`)
      this.emitStatus('error')
    }
  }
  private handleDisconnect = async (): Promise<void> => {
    if (this._isReconnecting) return
    this._isReconnecting = true
    this.attemptReconnect()
  }

  private async attemptReconnect(): Promise<void> {
    while (this._isReconnecting && this.reconnectAttempts < BLE_RECONNECT_MAX_ATTEMPTS) {
      this.reconnectAttempts++
      this.emitStatus('reconnecting', this.reconnectAttempts)
      const delay = BLE_RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1)
      await sleep(delay)
      if (!this._isReconnecting) return
      try {
        await this.connectGATT()
        return  // reconnected successfully
      } catch { /* try again */ }
    }
    this._isReconnecting = false
    this.emitStatus('disconnected')
    this.emitError('Device disconnected. Please reconnect manually.')
  }

  private async subscribeToECG(): Promise<void> {
    if (!this.server) return
    try {
      const service = await this.server.getPrimaryService(BLE_SERVICES.ECG)
      const characteristic = await service.getCharacteristic(BLE_CHARACTERISTICS.ECG_STREAM)
      characteristic.addEventListener('characteristicvaluechanged', (e: Event) => {
        const target = e.target as BluetoothRemoteGATTCharacteristic
        if (!target.value) return
        const parsed = parseECGPacket(target.value)
        if (parsed.valid) this.ecgListeners.forEach(fn => fn(parsed.samples))
      })
      await characteristic.startNotifications()
    } catch {
    }
  }

  private async subscribeToVitals(): Promise<void> {
    if (!this.server) return
    try {
      const service = await this.server.getPrimaryService(BLE_SERVICES.VITALS)
      const hrChar = await service.getCharacteristic(BLE_CHARACTERISTICS.VITALS_HR)
      hrChar.addEventListener('characteristicvaluechanged', (e: Event) => {
        const target = e.target as BluetoothRemoteGATTCharacteristic
        if (!target.value) return
        const hr = parseHeartRateMeasurement(target.value)
        if (hr !== null) {
          this.vitalsListeners.forEach(fn => fn({ heartRate: hr, spO2: null, timestamp: Date.now() }))
        }
      })
      await hrChar.startNotifications()
    } catch {
      // Vitals service optional — device may not expose it
    }
  }

  private emitStatus(status: BLEStatus, attempt?: number) {
    this.statusListeners.forEach(fn => fn(status, attempt))
  }
  private emitVitals(vitals: BLEVitals) {
    this.vitalsListeners.forEach(fn => fn(vitals))
  }
  private emitError(message: string) {
    this.errorListeners.forEach(fn => fn(message))
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Export a singleton — one BLE manager for the entire app
export const bleDeviceManager = new BLEDeviceManager()