import { ECG_ADC_TO_MV, PACKET_HEADER_BYTE, PACKET_TYPE_ECG } from './BLEConstants'
import type { ECGSample, ParsedECGPacket } from './types'

// Pure function — no BLE, no React. Fully testable in isolation.
export function parseECGPacket(buffer: DataView): ParsedECGPacket {
  const invalid: ParsedECGPacket = { samples: [], sequenceNumber: 0, valid: false }

  if (buffer.byteLength < 6) return invalid
  if (buffer.getUint8(0) !== PACKET_HEADER_BYTE) return invalid
  if (buffer.getUint8(1) !== PACKET_TYPE_ECG) return invalid

  const sequenceNumber = buffer.getUint16(2, true)  // little-endian
  const sampleCount    = buffer.getUint16(4, true)

  // Validate buffer length: header(6) + samples(sampleCount * 2) + checksum(2)
  const expectedLength = 6 + sampleCount * 2 + 2
  if (buffer.byteLength < expectedLength) return invalid

  // Validate XOR checksum over all bytes except the last 2
  let checksum = 0
  for (let i = 0; i < expectedLength - 2; i++) {
    checksum ^= buffer.getUint8(i)
  }
  const receivedChecksum = buffer.getUint16(expectedLength - 2, true)
  if (checksum !== receivedChecksum) return invalid

  // Parse samples: int16 raw ADC → millivolts
  const now = Date.now()
  const samples: ECGSample[] = []
  for (let i = 0; i < sampleCount; i++) {
    const rawAdc = buffer.getInt16(6 + i * 2, true)
    samples.push({ channelMv: rawAdc * ECG_ADC_TO_MV, timestamp: now })
  }

  return { samples, sequenceNumber, valid: true }
}

// Parse standard Bluetooth Heart Rate Measurement characteristic (0x2A37)
export function parseHeartRateMeasurement(buffer: DataView): number | null {
  if (buffer.byteLength < 2) return null
  const flags = buffer.getUint8(0)
  // Bit 0: 0 = HR is uint8, 1 = HR is uint16
  const isUint16 = (flags & 0x01) !== 0
  return isUint16 ? buffer.getUint16(1, true) : buffer.getUint8(1)
}