const { WOLF, LoginType, OnlineState } = require('wolf.js');

// إنشاء نسخة العميل
const client = new WOLF();

// جلب البيانات من متغيرات البيئة (GitHub Secrets)
const EMAIL = process.env.U_MAIL;
const PASSWORD = process.env.U_PASS;
// الـ API Key الافتراضي للمكتبة لضمان استقرار الدخول
const API_KEY = '864e707e-f05e-4445-97e1-931698203fd0'; 

async function startBot() {
    try {
        console.log('--- بدأت عملية التحميل ---');
        console.log(`محاولة تسجيل الدخول للحساب: ${EMAIL}`);
        console.log('نوع الدخول المستهدف: SNAPCHAT');

        // تنفيذ عملية تسجيل الدخول
        await client.login(
            EMAIL,
            PASSWORD,
            API_KEY,
            OnlineState.ONLINE,
            LoginType.SNAPCHAT // القيمة البرمجية لـ 'snapchat'
        );

    } catch (error) {
        console.error('حدث خطأ أثناء محاولة تسجيل الدخول:');
        console.error(error);
        
        // التحقق من الأخطاء المتعلقة بـ OTP
        if (error.message && error.message.includes('security')) {
            console.log('تنبيه: الحساب يتطلب رمز تحقق (OTP) من البريد الإلكتروني.');
        }
    }
}

// الأحداث (Events)
client.on('ready', () => {
    console.log('====================================');
    console.log(`تم تسجيل الدخول بنجاح!`);
    console.log(`متصل الآن باسم: ${client.currentSubscriber.nickname}`);
    console.log(`ID الحساب: ${client.currentSubscriber.id}`);
    console.log('====================================');
});

// مثال لأمر بسيط للتأكد من استجابة البوت
client.on('messagePrivate', async (message) => {
    if (message.content === '!ping') {
        await client.messaging().sendPrivateMessage(message.subscriberId, 'PONG! البوت يعمل بنجاح عبر GitHub Actions.');
    }
});

// التعامل مع الفصل التلقائي لضمان بقاء البوت حياً
client.on('reconnecting', () => console.log('جاري إعادة الاتصال...'));
client.on('error', (err) => console.error('خطأ في الاتصال:', err));

// بدء التشغيل
startBot();
