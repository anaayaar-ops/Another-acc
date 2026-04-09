import 'dotenv/config';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

// إعدادات الاتصال والحساب
const settings = {
    identity: 'lvoot24682@gmail.com', 
    secret: 'epytapfalsfobkac', // رمز التطبيق المكون من 16 حرفاً
    loginType: 8,               // رقم 8 مخصص لتسجيل دخول جوجل
    targetGroupId: 74000, 
    minuteInterval: 62 * 1000,
    boxInterval: 1109 * 60 * 1000
};

const MY_INFO = {
    keyword: "فزآعنا",  
    ownerId: "2481425"  
};

// الخرائط اللازمة لتول (تحويل الأرقام والكلمات)
const numToWord = {'0':'صفر','1':'واحد','2':'اثنان','3':'ثلاثة','4':'أربعة','5':'خمسة','6':'ستة','7':'سبعة','8':'ثمانية','9':'تسعة','10':'عشرة'};
const wordToNum = {'صفر':'0','واحد':'1','اثنان':'2','ثلاثة':'3','أربعة':'4','خمسة':'5','ستة':'6','سبعة':'7','ثمانية':'8','تسعة':'9','عشرة':'10'};

const service = new WOLF();

const sendAutoCommands = async (cmd) => {
    try { await service.messaging.sendGroupMessage(settings.targetGroupId, cmd); } catch (e) {}
};

service.on('groupMessage', async (message) => {
    try {
        // التحقق من أن الرسالة في المجموعة المطلوبة وليست من البوت نفسه
        if (message.targetGroupId !== settings.targetGroupId || message.subscriberId === service.currentSubscriber.id) return;

        const content = message.body;
        
        // التحقق من أن الرسالة هي "فخ" موجه لك
        if (!content.includes("لأنك لاعب مجتهد جدًا اليوم")) return;
        if (!content.includes(MY_INFO.keyword)) {
            console.log("⏭️ تم تجاهل فخ للاعب آخر.");
            return;
        }

        console.log("🎯 فخ موجه لك، جاري استخراج الإجابة...");
        let answer = null;

        // 1. سؤال عضوية المالك
        if (content.includes('عضوية مالك البوت') || content.includes('عضوية صاحب البوت')) {
            answer = MY_INFO.ownerId;
        }
        
        // 2. تحويل الأرقام إلى كلمات
        else if (content.includes('بالكلمات') || content.includes('بالحروف')) {
            const match = content.match(/\d+/);
            if (match && numToWord[match[0]]) answer = numToWord[match[0]];
        }
        
        // 3. تحويل الكلمات إلى أرقام
        else if (content.includes('بالأرقام') || content.includes('بالارقام')) {
            for (let word in wordToNum) {
                if (content.includes(word)) { answer = wordToNum[word]; break; }
            }
        }

        // 4. اكتب الكلمة كما هي
        else if (content.includes('اكتب') && (content.includes('كلمة') || content.includes('كما هي'))) {
            const match = content.match(/:\s*(\S+)/) || content.match(/هي\s+(\S+)/);
            if (match) answer = match[1];
        }

        // 5. أسئلة صح أم خطأ
        else if (content.includes('صح أم خطأ') || content.includes('صح أو خطأ') || content.includes('التحالف') || content.includes('الصناديق')) {
            answer = "صح";
        }

        // 6. المقارنة (أكبر / أصغر)
        else if (content.includes('أيهما') || content.includes('ايهما')) {
            const nums = content.match(/\d+/g);
            if (nums && nums.length >= 2) {
                const n1 = parseInt(nums[0]), n2 = parseInt(nums[1]);
                answer = (content.includes('أكبر') || content.includes('اكبر')) ? Math.max(n1, n2) : Math.min(n1, n2);
            }
        }

        // 7. العمليات الحسابية (جمع وطرح)
        else if (content.includes('ناتج') || content.includes('+') || content.includes('-')) {
            const nums = content.match(/\d+/g);
            if (nums && nums.length >= 2) {
                const n1 = parseInt(nums[0]), n2 = parseInt(nums[1]);
                answer = (content.includes('-') || content.includes('طرح') || content.includes('ناقص')) ? n1 - n2 : n1 + n2;
            }
        }

        // إرسال الرد بعد انتظار 5 ثوانٍ
        if (answer !== null) {
            const finalResponse = `!${answer}`;
            setTimeout(async () => {
                await service.messaging.sendGroupMessage(settings.targetGroupId, finalResponse);
                console.log(`✅ تم الرد بـ: ${finalResponse}`);
            }, 5000); 
        } else {
            console.log("⚠️ لم يتم تحديد إجابة دقيقة للسؤال.");
        }
    } catch (err) {
        console.error("❌ خطأ في معالجة الرسالة:", err);
    }
});

service.on('ready', async () => {
    console.log(`✅ البوت متصل الآن عبر Google ومراقب لـ: ${MY_INFO.keyword}`);
    try {
        await service.group.joinById(settings.targetGroupId);
        
        // الأوامر التلقائية للمهام والتحالف
        setInterval(() => {
            sendAutoCommands("!مد مهام");
            setTimeout(() => sendAutoCommands("!مد تحالف ايداع كل"), 3000);
        }, settings.minuteInterval);
        
        // فتح الصناديق تلقائياً
        setInterval(() => sendAutoCommands("!مد صندوق فتح"), settings.boxInterval);
        
    } catch (e) {
        console.error("❌ خطأ أثناء الانضمام للمجموعة:", e);
    }
});

// تسجيل الدخول الرسمي
service.login(settings.identity, settings.secret, settings.loginType);
