const login = require("@vangbanlanhat/fca-unofficial");
const fs = require("fs");
const path = require("path");

// ==========================================
// 1. LOAD CONFIGURATION
// ==========================================
const configPath = path.join(__dirname, "config.json");
if (!fs.existsSync(configPath)) {
    console.error("❌ THẤT BẠI: Thiếu file config.json!");
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const HOTLINE_ZALO = config.HOTLINE_ZALO;
const LINK_ZALO = config.LINK_ZALO;

// Parse reply template
const REPLY_TEMPLATE = config.REPLY_TEMPLATE
    .replace(/{LINK_ZALO}/g, LINK_ZALO)
    .replace(/{HOTLINE_ZALO}/g, HOTLINE_ZALO);

const CSV_FILE_PATH = path.join(__dirname, "chat_history.csv");
const JSON_FILE_PATH = path.join(__dirname, "chat_history.json");

// Initialize CSV header if it doesn't exist
if (!fs.existsSync(CSV_FILE_PATH)) {
    const header = "Timestamp,Sender ID,Full Name,Message Body,Zalo Redirected\n";
    fs.writeFileSync(CSV_FILE_PATH, header, "utf8");
}

// Initialize JSON database if it doesn't exist
if (!fs.existsSync(JSON_FILE_PATH)) {
    fs.writeFileSync(JSON_FILE_PATH, "[]", "utf8");
}

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
function getFormattedTime() {
    const now = new Date();
    return now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

function escapeCSV(text) {
    if (!text) return "";
    return `"${text.replace(/"/g, '""').replace(/\r?\n|\r/g, " ")}"`;
}

function saveToHistory(senderID, fullName, messageBody) {
    const timestamp = getFormattedTime();
    
    // 1. Append to CSV
    const csvRow = `${escapeCSV(timestamp)},${escapeCSV(senderID)},${escapeCSV(fullName)},${escapeCSV(messageBody)},Yes\n`;
    fs.appendFileSync(CSV_FILE_PATH, csvRow, "utf8");
    console.log(`[EXCEL] Successfully appended contact row to: ${CSV_FILE_PATH}`);

    // 2. Save to JSON
    try {
        const fileData = fs.readFileSync(JSON_FILE_PATH, "utf8");
        const jsonDb = JSON.parse(fileData);
        jsonDb.push({
            timestamp,
            senderID,
            fullName,
            messageBody,
            zaloRedirected: true
        });
        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(jsonDb, null, 2), "utf8");
    } catch (e) {
        console.error("[ERROR] Failed to save JSON log:", e);
    }
}

// ==========================================
// 3. BOT RUNTIME SETUP
// ==========================================
if (!fs.existsSync("./appstate.json")) {
    console.error("====================================================");
    console.error("❌ THẤT BẠI: Thiếu file appstate.json trong thư mục!");
    console.error("Hãy dán file appstate.json của ông vào đây hoặc chạy 'npm run extract' để tạo nhé.");
    console.error("====================================================");
    process.exit(1);
}

const credentials = { appState: JSON.parse(fs.readFileSync("./appstate.json", "utf8")) };

const botOptions = {
    listenEvents: true,
    selfListen: !config.IGNORE_SELF, 
    forceLogin: true,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

console.log("====================================================");
console.log("🌟 MẦM NON SAO SÁNG - KHỞI CHẠY HỆ THỐNG ĐIỀU HƯỚNG 🌟");
console.log("====================================================");
console.log("[SYSTEM] Đang đăng nhập Facebook bằng AppState...");

login(credentials, (err, api) => {
    if (err) {
        console.error("❌ ĐĂNG NHẬP THẤT BẠI: AppState có thể đã hết hạn. Vui lòng xuất lại file mới!", err);
        return;
    }

    api.setOptions(botOptions);
    console.log("====================================================");
    console.log("🚀 TRẠNG THÁI: Bot Mầm Non Sao Sáng đã sẵn sàng hoạt động!");
    console.log(`📡 Đang lắng nghe luồng tin nhắn và điều hướng sang Zalo: ${HOTLINE_ZALO}`);
    console.log("====================================================");

    // ==========================================
    // 4. LUỒNG XỬ LÝ TIN NHẮN (MESSAGE EVENT)
    // ==========================================
    api.listenMqtt((err, event) => {
        if (err) {
            console.error("⚠️ Lỗi hệ thống khi lắng nghe luồng MQTT:", err);
            return;
        }

        // Kiểm tra sự kiện tin nhắn mới từ người dùng khác
        if (event.type === "message" && event.senderID !== api.getCurrentUserID()) {
            const senderID = event.senderID;
            const messageBody = event.body || "[Hình ảnh/Sticker/File]";
            
            console.log(`\n📥 [NHẬN] Tin nhắn từ [ID: ${senderID}]: "${messageBody}"`);

            // 1. Fetch Tên đầy đủ của phụ huynh qua Graph API
            api.getUserInfo(senderID, (infoErr, ret) => {
                let fullName = "Phụ Huynh Mầm Non";
                if (!infoErr && ret && ret[senderID]) {
                    fullName = ret[senderID].name;
                }
                console.log(`👤 [KHÁCH HÀNG] Tên phụ huynh: ${fullName}`);

                // 2. Tạo độ trễ ngẫu nhiên từ config
                const minDelay = config.MIN_DELAY_MS || 2000;
                const maxDelay = config.MAX_DELAY_MS || 4000;
                const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                console.log(`⏳ [TRỄ] Đang chờ ${randomDelay}ms để mô phỏng người thật gõ phím...`);

                // 3. Hiển thị trạng thái đang soạn tin nhắn
                api.sendTypingIndicator(event.threadID, (typingErr) => {
                    if (typingErr) console.warn("[WARN] Không thể bật trạng thái gõ phím.");
                });

                // 4. Gửi tin nhắn điều hướng sau thời gian trễ
                setTimeout(() => {
                    api.sendMessage(REPLY_TEMPLATE, event.threadID, (sendErr) => {
                        if (sendErr) {
                            console.error(`❌ [THẤT BẠI] Không thể gửi phản hồi cho ${fullName}:`, sendErr);
                        } else {
                            console.log(`✅ [ĐIỀU HƯỚNG] Đã gửi kịch bản Zalo thành công đến ${fullName}.`);
                            
                            // 5. Lưu lịch sử khách hàng
                            saveToHistory(senderID, fullName, messageBody);
                        }
                    });
                }, randomDelay);
            });
        }
    });
});
