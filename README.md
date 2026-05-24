# 🚀 Facebook Messenger Zalo Redirection Bot

[![Stealth Mode](https://img.shields.io/badge/Stealth-Camoufox-orange?style=for-the-badge)](https://camoufox.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://opensource.org/licenses/ISC)

A premium, secure Node.js Facebook Messenger profile bot that automatically intercepts incoming messages and auto-responds with a customized Zalo redirection link. Perfectly optimized for schools (like **Mầm Non Sao Sáng**), local clinics, and businesses trying to consolidate customer support into Zalo.

---

## ✨ High-Value Features

*   **🦊 Secure Cookie Extraction (Camoufox Integration):** Bypasses Google Chrome's App-Bound Encryption (`v20`) and DPAPI restrictions by spinning up an interactive Firefox stealth browser GUI window. Log in once, and the script handles the extraction, dot-prefixed formatting, and saving of your session keys into a valid `appstate.json`.
*   **⏳ Human typing simulation:** Triggers the native Facebook `typing...` state and applies a realistic random delay (2-4 seconds) before sending the reply script.
*   **📊 Local CRM database logs:** Automatically appends redirected conversations in real-time to Excel-compatible `chat_history.csv` and structured `chat_history.json` complete with customer full names resolved from the Graph API.
*   **🛠️ Reusable AI Agent Skill:** Includes a detailed [SKILL.md](file:///D:/code/sao-sang-bridge/SKILL.md) file so any AI agent can easily redeploy, customize, and configure this project for other schools or clients.

---

## 📦 Quick Start Guide

### 1. Installation

```bash
git clone https://github.com/hungpixi/fb-messenger-redirection-bot.git
cd fb-messenger-redirection-bot
npm install
```

### 2. Configuration

Set up your school/business redirection coordinates inside `config.json`:

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

### 3. Extract cookies securely (Interactive GUI)

```bash
npm run extract
```

1.  A Firefox Stealth browser window will pop up.
2.  Log in to your Facebook profile.
3.  Once on your Facebook homepage/newsfeed, return to your terminal and hit **`[ENTER]`**.
4.  Your session is saved cleanly to `appstate.json` (Note: `appstate.json` is automatically blocked by `.gitignore` to prevent credential leaks!).

### 4. Fire up the Bot

```bash
npm start
```

---

## 🛠️ Utility Scripts

*   **List recent chats and active Thread IDs:**
    ```bash
    npm run list-threads
    ```
*   **Send a quick test message:**
    ```bash
    npm run send-test
    ```

---

## 🤖 Reusable AI Agent Integration
This codebase is fully preconfigured for AI-driven maintenance. If you are pair-programming with an AI coding assistant (like Claude, Gemini, or ChatGPT), direct them to read the [SKILL.md](file:///D:/code/sao-sang-bridge/SKILL.md) file. They will automatically understand how to deploy and adapt this bot for your other accounts or schools in a single turn!

---

## 🔒 Security & Safe Operations
*   **Residential IP Only:** To avoid Meta account checkpoint blocks, always host this bot on a residential residential IP where you normally use your Facebook account.
*   **.gitignore Enforced:** Active logs (`chat_history.*`), temporary GUI files, and session state files (`appstate.json`) are strictly excluded from git tracking.

---

*Made with ❤️ for Mầm Non Sao Sáng & Hungpixi.*
