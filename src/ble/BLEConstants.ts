// BLE service and characteristic UUIDs — must match ESP32 firmware exactly.
// Nordic UART Service is used as the ECG service if custom UUIDs are not yet set.
// Replace with your actual firmware UUIDs before hardware integration.

export const BLE_DEVICE_NAME = 'Zayra-Axiom'

export const BLE_SERVICES = {
  ECG:    '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  VITALS: '0000180d-0000-1000-8000-00805f9b34fb',
} as const

export const BLE_CHARACTERISTICS = {
  ECG_STREAM:    '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
  VITALS_HR:     '00002a37-0000-1000-8000-00805f9b34fb',
  DEVICE_CONTROL:'6e400002-b5a3-f393-e0a9-e50e24dcca9e',
} as const

// Packet format constants
export const PACKET_HEADER_BYTE = 0xAA
export const PACKET_TYPE_ECG    = 0x01
export const PACKET_TYPE_VITALS = 0x02

// ADC to millivolt conversion — calibrate against your ESP32 ADC + gain circuit
export const ECG_ADC_TO_MV = 1 / 1000  // 1 raw unit = 1 µV → divide by 1000 for mV

// Ring buffer: hold last 3000 samples (3 seconds at 1000Hz)
export const ECG_RING_BUFFER_SIZE = 3000

// Reconnection strategy
export const BLE_RECONNECT_MAX_ATTEMPTS = 5
export const BLE_RECONNECT_BASE_DELAY_MS = 1000  // doubles each attempt