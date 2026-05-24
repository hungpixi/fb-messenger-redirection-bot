const login = require("@vangbanlanhat/fca-unofficial");
const fs = require("fs");

if (!fs.existsSync("./appstate.json")) {
    console.error("❌ appstate.json not found!");
    process.exit(1);
}

const credentials = { appState: JSON.parse(fs.readFileSync("./appstate.json", "utf8")) };

const botOptions = {
    selfListen: true, 
    forceLogin: true,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

login(credentials, (err, api) => {
    if (err) {
        console.error("❌ Đăng nhập thất bại:", err);
        return;
    }
    
    api.setOptions(botOptions);
    console.log("[INFO] Đang tải danh sách 20 cuộc hội thoại gần nhất...");

    api.getThreadList(3, null, ["INBOX"], (threadErr, list) => {
        if (threadErr) {
            console.error("❌ Không thể lấy danh sách hộp thư:", threadErr);
            process.exit(1);
        }

        console.log("\n====================================================");
        console.log("📋 DANH SÁCH CUỘC HỘI THOẠI GẦN ĐÂY CỦA ÔNG HƯNG:");
        console.log("====================================================");
        
        list.forEach((t, i) => {
            const pNames = t.participants ? t.participants.map(p => `${p.name} (ID: ${p.userID})`).join(", ") : "Không rõ";
            console.log(`${i+1}. Thread ID: ${t.threadID}`);
            console.log(`   - Tên Thread: "${t.name || "Chat riêng 1-1"}"`);
            console.log(`   - Người tham gia: [${pNames}]`);
            console.log(`   - Tin nhắn cuối: "${t.snippet || "[Hình ảnh/Sticker]"}"`);
            console.log("----------------------------------------------------");
        });
        
        process.exit(0);
    });
});
