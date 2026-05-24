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
    
    // Target exact 1-1 private Thread ID of Nguyễn Thị Kiều Sang
    const targetThreadID = "100014640939543"; 
    
    console.log(`[SEND] Đang gửi tin nhắn "hi" đến KHUNG CHAT RIÊNG của Kiều Sang (ID: ${targetThreadID})...`);
    
    api.sendMessage("hi", targetThreadID, (sendErr) => {
        if (sendErr) {
            console.error("❌ Gửi tin nhắn thất bại:", sendErr);
        } else {
            console.log(`✅ [THÀNH CÔNG] Đã gửi tin nhắn "hi" thành công đến đúng KHUNG CHAT RIÊNG của Kiều Sang!`);
        }
        process.exit(0);
    });
});
