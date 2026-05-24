---
name: facebook-messenger-redirection-bot
description: >-
  Deploys, configures, and manages a Facebook Messenger personal profile bot
  that intercepts incoming messages and auto-responds with a customized Zalo
  contact/redirection link. Uses Camoufox stealth browser for secure DPAPI-free
  cookie extraction to bypass modern Facebook bot detection and Chrome App-Bound Encryption.
---

# Facebook Messenger Redirection Bot

## Overview
This skill allows an AI agent or a developer to deploy a secure Facebook Messenger profile bot that automatically intercepts incoming messages and redirects users/parents to a Zalo hotline. It is highly optimized for schools, local businesses, or clinics that want to consolidate their customer support onto Zalo.

### High-Value Features:
1. **Interactive Cookie Extraction (Camoufox):** Bypasses Google Chrome's App-Bound Encryption (v20) and DPAPI protection by spinning up a clean local Firefox stealth browser session where the user logs in once, then automatically parses and dumps dot-prefixed cookies into a valid `appstate.json`.
2. **Anti-Detection Measures:** Implements random realistic typing delays (2-4 seconds) and active typing indicators (`api.sendTypingIndicator`) to closely mimic human behavior and avoid Meta spam detection checkpoints.
3. **Local CRM Logging:** Logs all routed contacts in real-time to Excel-compatible `chat_history.csv` and structured `chat_history.json`.
4. **Fully Modular / School-Specific Customization:** Configured completely via `config.json` without editing the core bot code.

## Dependencies
- Node.js (v18 or higher)
- NPM (comes with Node.js)
- Pre-installed Chrome or Firefox (Camoufox will use its own stealth binaries)

## Quick Start

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/hungpixi/fb-messenger-redirection-bot.git
cd fb-messenger-redirection-bot
npm install
```

### 2. Configuration
Modify [config.json](file:///D:/code/sao-sang-bridge/config.json) to set your Zalo hotline, redirection link, and message template:
```json
{
  "HOTLINE_ZALO": "0834422439",
  "LINK_ZALO": "https://zalo.me/0834422439",
  "REPLY_TEMPLATE": "Dạ Mầm Non Sao Sáng xin chào Ba/Mẹ ạ! 🥰\n\nHiện tại Facebook cá nhân này không có người trực 24/7, sợ phản hồi cho Ba/Mẹ bị chậm trễ. Ba/Mẹ vui lòng bấm vào liên kết dưới đây để nhắn tin trực tiếp qua Zalo của các cô tư vấn nhé ạ:\n\n👉 LINK ZALO: {LINK_ZALO}\n(Hoặc kết bạn qua SĐT Zalo: {HOTLINE_ZALO})\n\nCác cô sẽ gửi bảng học phí chi tiết theo độ tuổi và hình ảnh 3 cơ sở vật chất qua Zalo cho Ba/Mẹ xem ngay ạ! ❤️",
  "IGNORE_SELF": true,
  "MIN_DELAY_MS": 2000,
  "MAX_DELAY_MS": 4000
}
```

### 3. Extracting Facebook Cookies (Interactive)
To log in securely and grab the required session cookies (`appstate.json`):
```bash
npm run extract
```
* **Step 1:** An interactive Firefox Stealth window will pop up.
* **Step 2:** Log in to your Facebook profile manually in the browser window.
* **Step 3:** Once logged in and viewing your News Feed, return to your terminal and press **`[ENTER]`**.
* **Step 4:** The script will automatically scrape the session cookies, enforce dot-prefixed wildcards (`.facebook.com` so they are routed correctly to Meta's MQTT subdomain), and save them safely to `appstate.json`.

### 4. Running the Bot
Start the bot runner to listen to real-time events:
```bash
npm start
```

---

## Utility Scripts

### List Active Threads
To view the recent threads and verify that the bot can see messages:
```bash
npm run list-threads
```

### Send a Test Message
To send a test message to a specific Thread ID (useful to check active session validity):
1. Edit the `targetThreadID` in `send_test.js`.
2. Run:
```bash
npm run send-test
```

---

## Common Mistakes

### 1. "Cannot get MQTT region & sequence ID" Error
* **Cause:** Facebook cookies were generated as "Host-Only" without leading dots. Meta's chat server runs on `edge-chat.facebook.com`, which requires wildcard cookies (`.facebook.com`).
* **Fix:** Use `npm run extract` which automatically prepends the required dot (`.`) prefix to all domains, or manually edit the domain of cookies in `appstate.json` to start with a dot.

### 2. Facebook Account Checkpoint (Spam Block)
* **Cause:** The bot replies too quickly or responds to too many messages within a short timeframe.
* **Fix:** Keep `MIN_DELAY_MS` at `2000` and `MAX_DELAY_MS` at `4000` or higher to simulate typing. Avoid running the bot on public datacenter/VPN IPs. Always run on local residential IPs where the Facebook account is normally used.

### 3. Missing `appstate.json` in Git
* **Cause:** `.gitignore` blocks `appstate.json` from being committed.
* **Explanation:** This is highly intentional! Committing `appstate.json` exposes your full Facebook session credentials, allowing anyone to hijack your account. Never force-add this file to Git.
