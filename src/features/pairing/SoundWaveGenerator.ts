/**
 * @file SoundWaveGenerator.ts
 * @description Acoustic SmartConfig sound-wave pairing & local NetSDK GB28181 injection utility.
 * Encodes 2.4 GHz Wi-Fi credentials into acoustic frequency bursts (17-19kHz)
 * and formats Xiongmai NetSDK NetWork.GB28181 parameter push packets.
 */

import { GB28181ConfigPayload } from '../../types';

export interface SoundWavePacket {
  frequencies: number[];
  durationMs: number;
  payloadLength: number;
}

/**
 * Encodes Wi-Fi SSID and Password into acoustic frequency sequence (SmartConfig).
 * Standard IP camera microphones pick up frequencies in the 17.5kHz - 19.5kHz range
 * to recover Wi-Fi credentials without any on-premise hardware or cables.
 */
export const encodeWifiCredentialsToFrequencies = (
  ssid: string,
  password: string
): SoundWavePacket => {
  const combined = `${ssid}\0${password}`;
  const baseFreq = 17500; // 17.5 kHz base
  const step = 100;       // 100 Hz step per ASCII byte

  const frequencies: number[] = [];
  // Preamble tones for camera synchronization
  frequencies.push(19000, 19200, 19400);

  for (let i = 0; i < combined.length; i++) {
    const charCode = combined.charCodeAt(i);
    frequencies.push(baseFreq + (charCode % 20) * step);
  }

  // Postamble tone
  frequencies.push(19500);

  return {
    frequencies,
    durationMs: frequencies.length * 60, // 60ms per tone
    payloadLength: combined.length,
  };
};

/**
 * Builds Xiongmai NetSDK JSON configuration payload for direct local LAN parameter push.
 * Pushed over TCP port 34567 or HTTP port 80 when phone is on the same local Wi-Fi.
 */
export const buildNetSdkGb28181Config = (
  config: GB28181ConfigPayload,
  sessionId: string = '0x00000001'
) => {
  return {
    Name: 'NetWork.GB28181',
    SessionID: sessionId,
    'NetWork.GB28181': {
      Enable: true,
      ServerIP: config.sipServer,
      ServerPort: config.sipPort || 5060,
      ServerID: config.serverId,
      ServerDomain: config.serverDomain,
      DeviceID: config.deviceId,
      Password: config.password,
      HeartBeatInterval: 60,
      MaxHeartBeatTimeout: 3,
      AlarmServerID: config.serverId,
    },
  };
};

/**
 * Parses scanned Admin Panel QR code containing GB28181 parameters.
 */
export const parseGb28181QrPayload = (
  qrString: string
): GB28181ConfigPayload | null => {
  try {
    const parsed = JSON.parse(qrString);
    if (parsed.type === 'GB28181_CONFIG' && parsed.deviceId && parsed.sipServer) {
      return parsed as GB28181ConfigPayload;
    }
    return null;
  } catch {
    return null;
  }
};
