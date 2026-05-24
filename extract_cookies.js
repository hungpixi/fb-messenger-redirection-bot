const { Camoufox } = require('camoufox');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('====================================================');
    console.log('🦊 CAMOUFOX - TRÍCH XUẤT COOKIE MESSENGER BẢO MẬT 🦊');
    console.log('====================================================');
    console.log('[INFO] Đang khởi động trình duyệt Firefox Stealth...');
    
    // Launch interactive stealth Firefox browser
    const browser = await Camoufox({
        headless: false,
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('[INFO] Đang truy cập Facebook.com...');
    await page.goto('https://www.facebook.com');
    
    console.log('\n====================================================');
    console.log('👉 HƯỚNG DẪN:');
    console.log('1. Trên cửa sổ trình duyệt Firefox vừa xuất hiện, hãy đăng nhập tài khoản Facebook.');
    console.log('2. Sau khi đã đăng nhập thành công và thấy Bảng tin (Newfeed)...');
    console.log('3. HÃY QUAY LẠI Ô CHAT NÀY VÀ NHẤN PHÍM [ENTER] để bot tự động quét và lưu cookie!');
    console.log('====================================================\n');
    
    // Listen for terminal enter input
    process.stdin.resume();
    process.stdin.once('data', async () => {
        console.log('[INFO] Đang quét và mã hoá session cookie...');
        const cookies = await context.cookies();
        
        // Filter Facebook & Messenger cookies
        const fbDomains = ['facebook.com', 'messenger.com'];
        const fbCookies = cookies.filter(c => {
            return fbDomains.some(domain => c.domain.includes(domain));
        });
        
        // Convert to fca-unofficial format and ensure wildcards are correct
        const appState = fbCookies.map(c => {
            let domain = c.domain;
            if (!domain.startsWith('.')) {
                domain = '.' + domain;
            }
            return {
                key: c.name,
                value: c.value,
                domain: domain,
                path: c.path,
                hostOnly: false,
                creation: new Date().toISOString(),
                lastAccessed: new Date().toISOString()
            };
        });
        
        const c_user = appState.find(c => c.key === 'c_user');
        const xs = appState.find(c => c.key === 'xs');
        
        if (c_user && xs) {
            fs.writeFileSync('appstate.json', JSON.stringify(appState, null, 2), 'utf-8');
            console.log(`\n🎉 [THÀNH CÔNG] Đã tìm thấy phiên đăng nhập Facebook! (User ID: ${c_user.value})`);
            console.log('💾 File appstate.json đã được lưu thành công vào thư mục dự án!');
        } else {
            console.log('\n❌ [THẤT BẠI] Không tìm thấy session cookie (c_user/xs).');
        }
        
        await browser.close();
        process.exit();
    });
}

main().catch(err => {
    console.error('❌ Lỗi khởi động Camoufox:', err);
    process.exit(1);
});
