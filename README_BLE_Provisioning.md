
# 📡 React Native + BLE Wi-Fi Provisioning (ESP32-style Simulation)

This guide walks you through how to **simulate an ESP32 BLE server** using your iPhone (via LightBlue app) and send **Wi-Fi credentials** using a React Native app with `react-native-ble-plx`.

---

## ✅ Components

### 📱 React Native BLE App
- Scans for BLE devices
- Connects to your BLE peripheral
- Discovers service and characteristics
- Sends `SSID` and `Password` over BLE

### 📲 LightBlue iOS App
- Simulates the ESP32 BLE server
- Defines custom service + characteristics
- Accepts Wi-Fi credentials via BLE write

---

## 🧱 BLE Structure

| Element         | UUID                                      | Type       | Note                            |
|----------------|-------------------------------------------|------------|---------------------------------|
| Service         | `12345678-1234-1234-1234-1234567890AB`    | Primary    | Custom Wi-Fi provisioning svc   |
| SSID Character. | `12345678-1234-1234-1234-1234567890AC`    | Writeable  | Receives SSID as UTF-8 string   |
| Password Char.  | `12345678-1234-1234-1234-1234567890AD`    | Writeable  | Receives password as UTF-8      |

---

## 🧪 LightBlue Setup (Peripheral on iPhone)

1. **Open Peripheral tab → Add Server**
2. Add Service: `12345678-1234-1234-1234-1234567890AB`
3. Add Characteristics:
   - SSID:
     - UUID: `...90AC`
     - Properties: `Write`
     - Permissions: `Writeable`
     - Format: `UTF-8`
   - Password:
     - UUID: `...90AD`
     - Same settings as SSID
4. Add Advertiser:
   - Add advertiser and attach the same service UUID
   - Toggle ON to **Start Advertising**
5. Rename Peripheral (optional): e.g., `ESP32-Wifi-Setup`

---

## 📱 React Native Code Highlights

### 1. Scan for BLE Devices
```ts
manager.startDeviceScan(null, null, (error, device) => {
  if (device?.name?.includes("ESP32") || device?.id === knownId) {
    manager.stopDeviceScan();
    setDeviceId(device.id); // <-- used in sendCredentials
  }
});
```

### 2. Send Credentials Function
```ts
await device.writeCharacteristicWithoutResponseForService(
  service.uuid,
  ssidChar.uuid,
  base64.encode(ssid)
);
await device.writeCharacteristicWithoutResponseForService(
  service.uuid,
  passChar.uuid,
  base64.encode(password)
);
```

---

## ✅ What You Can Do Next

| Task | Description |
|------|-------------|
| 🧠 Use Real ESP32 | Flash code to ESP32 with BLE server + Wi-Fi logic |
| 📥 Read Response | Add BLE characteristic for ESP32 to return `connected/success` |
| 🔒 Secure Comm | Encrypt payload using a shared key |

---

## 🗃 Example Repo/Structure

```
/BleProvisionApp/
├── App.tsx
├── BLEScanner.tsx
├── bleManager.ts
├── utils/
│   └── permissions.ts
└── README.md   <-- This guide
```

---

## 💬 Need ESP32 BLE Code?

Let me know — I’ll send the exact Arduino or ESP-IDF sketch to make the ESP32 match this setup.
