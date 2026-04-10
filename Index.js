const { WOLF, LoginType, OnlineState } = require('wolf.js');

const client = new WOLF();

const EMAIL = process.env.U_MAIL;
const PASSWORD = process.env.U_PASS;
const API_KEY = '864e707e-f05e-4445-97e1-931698203fd0';

// المعرف الهدف (العضوية المطلوبة)
const TARGET_ID = 51660277;

async function startBot() {
    try {
        console.log('--- جاري محاولة تسجيل الدخول ---');
        await client.login(
            EMAIL,
            PASSWORD,
            API_KEY,
            OnlineState.ONLINE,
            LoginType.SNAPCHAT
        );
    } catch (error) {
        console.error('❌ خطأ في الدخول:');
        console.error(error.message);
    }
}

// عند نجاح الاتصال
client.on('ready', async () => {
    console.log('✅ تم تسجيل الدخول بنجاح!');
    
    try {
        // إرسال رسالة تجريبية للعضوية المحددة فور التشغيل
        await client.messaging().sendPrivateMessage(TARGET_ID, 'مرحباً، تم تشغيل البوت بنجاح وهو الآن متصل!');
        console.log(`Successfully sent startup message to: ${TARGET_ID}`);
    } catch (sendError) {
        console.error('❌ فشل إرسال الرسالة للعضوية:');
        console.error(sendError.message);
    }
});

// استمرار الاستجابة للأوامر الأخرى
client.on('messagePrivate', async (message) => {
    if (message.content === '!test') {
        await client.messaging().sendPrivateMessage(message.subscriberId, 'البوت مستيقظ ويعمل!');
    }
});

startBot();
