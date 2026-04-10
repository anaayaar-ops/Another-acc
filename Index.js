const { WOLF, LoginType, OnlineState } = require('wolf.js');

// إنشاء نسخة العميل
const client = new WOLF();

// البيانات من GitHub Secrets
const EMAIL = process.env.U_MAIL;
const PASSWORD = process.env.U_PASS;
// الـ API Key الضروري لتجاوز تنبيه النظام
const API_KEY = '864e707e-f05e-4445-97e1-931698203fd0'; 

async function startBot() {
    try {
        console.log('--- بدأت عملية التشغيل الفعلي ---');
        console.log(`المستهدف: تسجيل دخول سناب شات للحساب: ${EMAIL}`);

        // محاولة تسجيل الدخول مع معالجة الاستجابة
        const loginResponse = await client.login(
            EMAIL,
            PASSWORD,
            API_KEY,
            OnlineState.ONLINE,
            LoginType.SNAPCHAT
        );

        console.log('استجابة السيرفر المستلمة...');

    } catch (error) {
        console.error('❌ فشل تسجيل الدخول!');
        // طباعة تفاصيل الخطأ بدقة لمعرفة السبب (كلمة مرور، OTP، أو حظر)
        if (error.body) {
            console.error('تفاصيل الخطأ من السيرفر:', JSON.stringify(error.body, null, 2));
        } else {
            console.error('رسالة الخطأ:', error.message);
        }
    }
}

// أحداث البوت
client.on('ready', () => {
    console.log('✅ تم تسجيل الدخول بنجاح!');
    console.log(`البوت الآن متصل باسم: ${client.currentSubscriber.nickname}`);
});

// لمنع الأكشن من الإغلاق فوراً (إبقاء البوت حياً)
client.on('messagePrivate', async (message) => {
    if (message.content === '!test') {
        await client.messaging().sendPrivateMessage(message.subscriberId, 'البوت مستيقظ ويعمل!');
    }
});

// بدء التشغيل
startBot();
