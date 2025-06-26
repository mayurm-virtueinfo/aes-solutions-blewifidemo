# AER/Semaphore Mobile App Development Kickoff Meeting

## Meeting Purpose
Kickoff meeting for AER/Semaphore mobile app development project, focusing on device connectivity and project timeline.

---

## Key Takeaways
- Devices use **Bluetooth** for initial pairing, then **Wi-Fi** for data transmission to the cloud.
- **Primary device** (always powered):
  - Samples every **2 minutes**
  - Sends data every **10 minutes**
- **Remote device** (battery-powered, 2-year lithium life):
  - Samples every **10 minutes** (6 quick samples)
  - Sends data every **hour**
- **Target date for first build**: **July 11th**, with expectation of at least 3 iterations.
- **Weekly updates** planned, with **daily communication** via Slack channel.

---

## Topics

### Device Connectivity and Data Flow
- **Primary device**:
  - Always powered and connected to Wi-Fi
- **Remote device**:
  - Battery-powered with 2-year battery life
- **Communication**:
  - Both devices send data to the cloud
  - Cloud can send data back to devices
- **Sampling Rates**:
  - Primary: Every 2 mins
  - Remote: Every 10 mins (6 quick samples)
- **Data Transmission Rates**:
  - Primary: Every 10 mins
  - Remote: Every hour
- **Initial Pairing**: Bluetooth
- **Ongoing Communication**: Wi-Fi
- Remote device provides **time sync backup** for the primary device if power is lost

### App Development Focus
- Initial goals:
  - New user onboarding
  - Device pairing
  - Cloud data reporting
- Single platform support for **Android and iOS**
- Emphasis on **robust, stable, and repeatable functionality**
- Future phase: Secondary app for service groups with **location-based sharing**

### Project Timeline and Testing
- Devices arriving **Wednesday**, development begins **Thursday/Friday**
- **First build target**: July 11th (±2 days)
- At least **3 build iterations** expected
- **Distribution**:
  - iOS via **TestFlight**
  - Android via **APK links** in Slack
- Weekly updates on **Fridays**
- Immediate Slack notification of significant breakthroughs

### Account Setup and Communication
- Apple developer account setup challenges noted
- **Slack** for daily communication
- **Email** for weekly summaries
- Team is available and accommodating of **time zone differences**

---

## Next Steps
- **Eric** to:
  - Discuss schedule with lead developer
  - Provide detailed timeline
  - Notify **Chris** and **James** when devices reach dev team in India
- Team to begin development **upon device arrival**
- **Jonah** to ensure **James** and **Chris** have access to TestFlight and APKs
- First weekly update to be provided on the **following Friday**
- All parties to **monitor Slack** channel for ongoing communication
