const { WOLF, LoginType, OnlineState } = require('wolf.js');

// إنشاء نسخة العميل
const client = new WOLF();

// استخدام البيانات من متغيرات البيئة (GitHub Secrets)
const EMAIL = process.env.U_MAIL;
const PASSWORD = process.env.U_PASS;
const API_KEY = '864e707e-f05e-4445-97e1-931698203fd0'; // مفتاح عام مستقر

async function startBot() {
    try {
        console.log('--- بدأت عملية التشغيل ---');
        console.log(`محاولة تسجيل الدخول للحساب: ${EMAIL}`);
        console.log('نوع الدخول المستهدف: SNAPCHAT');

        // تنفيذ عملية تسجيل الدخول
        await client.login(
            EMAIL,
            PASSWORD,
            API_KEY,
            OnlineState.ONLINE,
            LoginType.SNAPCHAT // القيمة التي وجدناها في ملف LoginType.js
        );

    } catch (error) {
        console.error('حدث خطأ أثناء محاولة تسجيل الدخول:');
        console.error(error);
        
        // إذا كان الخطأ متعلقاً بـ OTP أو رمز تحقق، سيظهر هنا في السجلات
        if (error.message && error.message.includes('security')) {
            console.log('تنبيه: الحساب يتطلب رمز تحقق (OTP) من الإيميل.');
        }
    }
}

// حدث عند نجاح الاتصال وجاهزية البوت
client.on('ready', () => {
    console.log('====================================');
    console.log(`تم تسجيل الدخول بنجاح!`);
    console.log(`اسم الحساب: ${client.currentSubscriber.nickname}`);
    console.log(`ID الحساب: ${client.currentSubscriber.id}`);
    console.log('====================================');
});

// حدث عند استقبال رسالة خاصة (للتجربة)
client.on('messagePrivate', async (message) => {
    if (message.content === '!ping') {
        await client.messaging().sendPrivateMessage(message.subscriberId, 'PONG! البوت يعمل بنجاح عبر سناب شات.');
    }
});

// معالجة أخطاء الفصل التلقائي
client.on('reconnecting', () => console.log('جاري إعادة الاتصال...'));
client.on('error', (err) => console.error('خطأ في الاتصال:', err));

// بدء التشغيل
startBot();
