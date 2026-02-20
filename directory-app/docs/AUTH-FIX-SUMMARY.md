# راهنمای رفع مشکلات لاگین و داشبورد

## 🔴 مشکلات شناسایی شده

### 1. **مشکل اصلی: Business به Owner لینک نمی‌شد** ❌
وقتی ادمین business رو approve می‌کرد، business ساخته می‌شد ولی به businessOwner لینک نمی‌شد!

**فایل:** `src/app/api/business/approve/[id]/route.ts`

**اصلاح انجام شده:**
```typescript
// بعد از ساخت business، owner رو update کردیم
const ownerEmail = formData.email?.toLowerCase()?.trim();
if (ownerEmail) {
    const owner = await db.businessOwner.findUnique({
        where: { email: ownerEmail }
    });
    
    if (owner && !owner.businessId) {
        await db.businessOwner.update({
            where: { id: owner.id },
            data: { businessId: business.id }
        });
    }
}
```

### 2. **مشکل Middleware** ❌
وقتی کاربر login داشت، باز هم می‌تونست بره `/bedrijf-aanmelden` در حالی که business داشت!

**فایل:** `src/middleware.ts`

**اصلاح انجام شده:**
- فقط وقتی `message=no-business` باشه اجازه دسترسی به `/bedrijf-aanmelden` داده می‌شه
- در غیر این صورت redirect به `/dashboard`

### 3. **مشکل LoginModal** ✅
قبلاً درست کار می‌کرد ولی با توجه به مشکل 1، کاربر نمی‌تونست وارد dashboard بشه

## ✅ فلوچارت درست کارکردن سیستم:

### حالت 1: کاربر جدید (بدون business)
```
1. کلیک روی "Inloggen"
2. وارد کردن email
3. چک می‌کنه → business نداره
4. نمایش popup: "Nog geen bedrijf geregistreerd"
5. کاربر روی "Verstuur verificatiecode" کلیک می‌کنه
6. OTP ارسال می‌شه
7. کاربر code رو وارد می‌کنه
8. verifyOtp اجرا می‌شه
9. Redirect به /bedrijf-aanmelden?email=...
10. فرم پر می‌شه و publish می‌شه
11. Admin approve می‌کنه
12. Business به owner لینک می‌شه (FIXED!)
13. کاربر می‌تونه وارد dashboard بشه
```

### حالت 2: کاربر موجود (با business)
```
1. کلیک روی "Inloggen"
2. وارد کردن email
3. چک می‌کنه → business داره
4. OTP ارسال می‌شه
5. کاربر code رو وارد می‌کنه
6. verifyOtp اجرا می‌شه
7. چک می‌کنه: publishStatus === 'PUBLISHED'
8. Redirect به /dashboard
```

### حالت 3: کاربر لاگین شده بدون business
```
1. کاربر لاگین هست
2. می‌خواد بره /dashboard
3. dashboard/page.tsx چک می‌کنه: !currentUser.businessId
4. Redirect به /bedrijf-aanmelden?message=no-business
5. Middleware اجازه می‌ده (چون message=no-business)
```

### حالت 4: کاربر لاگین شده با business
```
1. کاربر لاگین هست
2. می‌خواد بره /bedrijf-aanmelden
3. Middleware redirect می‌کنه به /dashboard
4. چون message=no-business نیست!
```

## 🔧 دستورات لازم برای اعمال تغییرات:

```bash
cd directory-app
rd /s /q .next
npm run dev
```

## 🧪 تست کردن:

### تست 1: کاربر جدید
1. یه email جدید وارد کن (مثلاً test123@gmail.com)
2. باید popup نمایش بده: "Nog geen bedrijf geregistreerd"
3. روی "Verstuur verificatiecode" کلیک کن
4. Code رو وارد کن
5. باید بره به فرم ثبت شرکت

### تست 2: کاربر موجود با business
1. email قبلی رو وارد کن
2. باید مستقیم OTP بفرسته (بدون popup)
3. Code رو وارد کن
4. باید بره به dashboard

### تست 3: Redirect بعد از login
1. با کاربری که business داره login کن
2. دستی برو به /bedrijf-aanmelden
3. باید redirect بشه به /dashboard

### تست 4: دسترسی به فرم بدون business
1. با کاربری که business نداره login کن
2. سعی کن بری /dashboard
3. باید redirect بشه به /bedrijf-aanmelden?message=no-business
4. و فرم رو ببینی

## ⚠️ نکات مهم:

1. **هر email فقط یک شرکت:** توی `requestOtp` چک می‌شه
2. **زمان session:** 3 ساعت (3 * 60 * 60 ثانیه)
3. **زمان OTP:** 10 دقیقه
4. **business باید PUBLISHED باشه:** تا کاربر بتونه وارد dashboard بشه

---

*آخرین بروزرسانی: 20 فوریه 2026*
