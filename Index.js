const { WOLF, LoginType, OnlineState } = require('wolf.js');

// إنشاء نسخة من العميل
const client = new WOLF();

// بيانات تسجيل الدخول (يفضل وضعها في ملف .env)
const EMAIL = 'Ana.aya.ar@gmail.com'; 
const PASSWORD = 'As1412as';

async function startBot() {
    try {
        console.log('جاري محاولة تسجيل الدخول عبر سناب شات...');
        
        // استخدام الدالة التي وجدناها في ملف WOLF.js
        await client.login(
            EMAIL, 
            PASSWORD, 
            undefined, 
            OnlineState.ONLINE, 
            LoginType.SNAPCHAT
        );

    } catch (error) {
        console.error('حدث خطأ أثناء تسجيل الدخول:', error);
    }
}

// الأحداث (Events)
client.on('ready', () => {
    console.log(`تم تشغيل البوت بنجاح! متصل الآن باسم: ${client.currentSubscriber.nickname}`);
});

// التعامل مع الرسائل (مثال بسيط)
client.on('messagePrivate', async (message) => {
    if (message.content === '!ping') {
        await client.messaging().sendPrivateMessage(message.subscriberId, 'pong!');
    }
});

// بدء التشغيل
startBot();
