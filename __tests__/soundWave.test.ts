import {
  encodeWifiCredentialsToFrequencies,
  buildNetSdkGb28181Config,
  parseGb28181QrPayload,
} from '../src/features/pairing/SoundWaveGenerator';

describe('Acoustic SoundWave & GB28181 Pairing Engine', () => {
  it('correctly encodes Wi-Fi SSID and password to ultrasonic frequency tones', () => {
    const ssid = 'Test_WiFi_2.4G';
    const password = 'mypassword123';
    const packet = encodeWifiCredentialsToFrequencies(ssid, password);

    expect(packet.frequencies.length).toBeGreaterThan(10);
    // Verify synchronization preamble tones
    expect(packet.frequencies[0]).toBe(19000);
    expect(packet.frequencies[1]).toBe(19200);
    expect(packet.frequencies[2]).toBe(19400);

    // Verify all frequency values are within audible/near-ultrasonic microphone pick-up range (17kHz - 20kHz)
    packet.frequencies.forEach((freq) => {
      expect(freq).toBeGreaterThanOrEqual(17000);
      expect(freq).toBeLessThanOrEqual(20000);
    });

    // Verify duration calculation
    expect(packet.durationMs).toBe(packet.frequencies.length * 60);
  });

  it('builds standard Xiongmai NetSDK GB28181 configuration payload', () => {
    const gbConfig = {
      type: 'GB28181_CONFIG' as const,
      sipServer: 'api-cctv-backend.duckdns.org',
      sipPort: 5060,
      serverDomain: '3402000000',
      serverId: '34020000002000000001',
      deviceId: '34020000001320000042',
      password: 'cctv_secret_pass',
    };

    const netSdkPayload = buildNetSdkGb28181Config(gbConfig);

    expect(netSdkPayload.Name).toBe('NetWork.GB28181');
    expect(netSdkPayload['NetWork.GB28181'].Enable).toBe(true);
    expect(netSdkPayload['NetWork.GB28181'].ServerIP).toBe('api-cctv-backend.duckdns.org');
    expect(netSdkPayload['NetWork.GB28181'].ServerPort).toBe(5060);
    expect(netSdkPayload['NetWork.GB28181'].DeviceID).toBe('34020000001320000042');
    expect(netSdkPayload['NetWork.GB28181'].Password).toBe('cctv_secret_pass');
  });

  it('successfully parses Admin Panel QR code payload', () => {
    const rawQr = JSON.stringify({
      type: 'GB28181_CONFIG',
      sipServer: 'api-cctv-backend.duckdns.org',
      sipPort: 5060,
      serverDomain: '3402000000',
      serverId: '34020000002000000001',
      deviceId: '34020000001320000042',
      password: 'secret_token',
    });

    const parsed = parseGb28181QrPayload(rawQr);
    expect(parsed).not.toBeNull();
    expect(parsed?.deviceId).toBe('34020000001320000042');
    expect(parsed?.sipServer).toBe('api-cctv-backend.duckdns.org');

    // Invalid QR test
    expect(parseGb28181QrPayload('not-json')).toBeNull();
    expect(parseGb28181QrPayload('{"type":"OTHER"}')).toBeNull();
  });
});
