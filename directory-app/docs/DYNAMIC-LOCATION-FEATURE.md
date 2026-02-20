# سیستم ورود پویا مکان (Dynamic Location Input)

## 🎯 خلاصه
این سیستم به کاربران اجازه می‌دهد شهر و محله‌ای که در دیتابیس موجود نیست را خودشان وارد کنند.

---

## ✨ ویژگی‌ها

### 1. ورود پویا شهر (Dynamic City Input)
- اگر شهر مورد نظر در لیست نباشد، کاربر می‌تواند نام شهر را تایپ کند و دکمه "+ Toevoegen" را بزند
- شهر جدید به صورت خودکار در دیتابیس ثبت می‌شود
- وضعیت شهر جدید "pending" می‌شود تا بعداً توسط ادمین بررسی شود

### 2. ورود پویا محله (Dynamic Neighborhood Input)
- مشابه شهر، اگر محله در لیست نباشد، کاربر می‌تواند آن را وارد کند
- محله جدید به شهر مربوطه متصل می‌شود

### 3. نمایش وضعیت
- وقتی کاربر از حالت پویا استفاده می‌کند، یک باکس اطلاع‌رسانی آبی نمایش داده می‌شود
- کاربر می‌تواند به حالت لیست برگردد

---

## 🛠 فایل‌های تغییر یافته

### 1. `StepAddress.tsx`
**تغییرات اصلی:**
- اضافه شدن state های جدید:
  - `cityInputMode`: 'dropdown' | 'custom'
  - `neighborhoodInputMode`: 'dropdown' | 'custom'
  - `customCityName`: string
  - `customNeighborhoodName`: string

- اضافه شدن توابع جدید:
  - `handleCustomCitySubmit()`: ذخیره شهر سفارشی
  - `handleCustomNeighborhoodSubmit()`: ذخیره محله سفارشی
  - `switchToDropdownMode()`: بازگشت به حالت لیست

- UI جدید:
  - گزینه "+ Toevoegen" در پایین لیست شهرها
  - گزینه "+ Toevoegen" در پایین لیست محلات
  - باکس اطلاع‌رسانی برای حالت پویا
  - دکمه بازگشت به لیست

### 2. `POST /api/locations/custom`
**قابلیت‌ها:**
- ایجاد شهر جدید: `type: 'city'`
- ایجاد محله جدید: `type: 'neighborhood'`
- بررسی تکراری نبودن (case-insensitive)
- خودکار slug تولید می‌کند

**نمونه درخواست:**
```json
// ایجاد شهر
{
  "type": "city",
  "name": "Gorinchem",
  "province": "Zuid-Holland"
}

// ایجاد محله
{
  "type": "neighborhood",
  "name": "Centrum",
  "cityName": "Gorinchem",
  "province": "Zuid-Holland"
}
```

### 3. `POST /api/business/approve/[id]`
**تغییرات:**
- قبل از ثبت کسب‌وکار، بررسی می‌کند آیا شهر وجود دارد
- اگر شهر وجود ندارد، آن را می‌سازد (`ensureCityExists`)
- اگر محله وجود ندارد، آن را می‌سازد (`ensureNeighborhoodExists`)
- فیلد `provinceSlug` اضافه شد

---

## 🔄 فلوچارت کار

```
کاربر فرم را پر می‌کند
    ↓
شهر را جستجو می‌کند
    ↓
اگر پیدا شد → انتخاب می‌کند
    ↓
اگر پیدا نشد → "+ Toevoegen" را می‌زند
    ↓
نام شهر وارد شده در دیتابیس ذخیره می‌شود (status: pending)
    ↓
کاربر محله را جستجو می‌کند
    ↓
اگر پیدا نشد → محله هم به همین ترتیب اضافه می‌شود
    ↓
فرم ثبت می‌شود
    ↓
ادمین کسب‌وکار را تأیید می‌کند
    ↓
سیستم خودکار شهر و محله را در دیتابیس می‌سازد (در صورت نیاز)
```

---

## 🎨 رابط کاربری

### حالت عادی (Dropdown)
```
┌─────────────────────────────┐
│ Plaats *                    │
│ ┌─────────────────────────┐ │
│ │ Selecteer uw stad    ▼  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### حالت پویا (Custom)
```
┌─────────────────────────────┐
│ Plaats *                    │
│ ┌─────────────────────────┐ │
│ │ 🏢 Aangepaste stad:     │ │
│ │    Gorinchem            │ │
│ └─────────────────────────┘ │
│ [Toch uit lijst selecteren] │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ℹ️ Nieuwe locatie gedetecteerd    │
│ De door u ingevoerde stad...      │
└─────────────────────────────┘
```

### گزینه اضافه کردن در Dropdown
```
┌─────────────────────────────┐
│ Zoek stad...          [   ] │
│ ─────────────────────────── │
│ Amsterdam          15 wijken│
│ Amersfoort          8 wijken│
│ ...                         │
│ ─────────────────────────── │
│ Stad niet gevonden?         │
│ [Gorinchem    ] [+ Toevoegen]│
└─────────────────────────────┘
```

---

## 🗄 ساختار دیتابیس

### جدول City
```prisma
model City {
  id            String         @id @default(cuid())
  name          String         @unique
  slug          String         @unique
  province      String?        // ← اضافه شد
  contentStatus String?        @default("pending") // pending, completed
  neighborhoods Neighborhood[]
  createdAt     DateTime       @default(now())
}
```

### جدول Neighborhood
```prisma
model Neighborhood {
  id        String   @id @default(cuid())
  name      String
  slug      String
  cityId    String
  city      City     @relation(fields: [cityId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@unique([cityId, slug])
}
```

---

## ✅ مزایا

1. **انعطاف‌پذیری**: کاربر هر شهری می‌تواند ثبت کند
2. **SEO**: شهرهای جدید به صورت خودکار در سایت ایندکس می‌شوند
3. **Crowd-sourced**: شهرهای محبوب توسط کاربران اضافه می‌شوند
4. **هوشمند**: بررسی تکراری، تولید خودکار slug
5. **امنیت**: همه موارد نیاز به تأیید ادمین دارند

---

## 🔧 نکات فنی

### Slug Generation
از تابع `slugify()` استفاده می‌شود:
```typescript
"Gorinchem" → "gorinchem"
"Den Haag" → "den-haag"
"'s-Hertogenbosch" → "s-hertogenbosch"
```

### Duplicate Detection
بررسی تکراری با حروف بزرگ/کوچک حساس نیست:
```typescript
{ name: { equals: "Gorinchem", mode: 'insensitive' } }
```

---

## 🚀 گام‌های بعدی (اختیاری)

### 1. پنل ادمین برای مدیریت شهرها
```
/admin/locations/pending
```
نمایش شهرهای pending برای تأیید/رد

### 2. محدودیت تعداد
فقط کاربران تأیید شده بتوانند شهر اضافه کنند

### 3. گزارش تکراری
اگر چند نفر همان شهر را درخواست دادند، اولویت بالاتر

### 4. Merge شهرها
اگر ادمین بخواهد دو شهر را با هم ادغام کند

---

## 📱 تست

### سناریو 1: شهر جدید
1. به `/bedrijf-aanmelden` بروید
2. استان: Zuid-Holland
3. شهر: "Gorinchem" (تایپ کنید)
4. روی "+ Toevoegen" کلیک کنید
5. محله: "Centrum"
6. فرم را ثبت کنید

### سناریو 2: محله جدید در شهر موجود
1. شهر: Amsterdam
2. محله: "Nieuwe Wijk" (تایپ کنید)
3. روی "+ Toevoegen" کلیک کنید

---

*آخرین بروزرسانی: 20 فوریه 2026*
