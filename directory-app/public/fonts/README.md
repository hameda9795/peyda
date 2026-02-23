# فونت‌های پروژه Peyda

## فونت Ransom (برای لوگو)

برای نمایش درست لوگوی "peyda.nl"، فایل‌های فونت Ransom را در این پوشه قرار دهید:

### فایل‌های مورد نیاز:
- `Ransom.woff2` - فرمت اصلی (modern browsers)
- `Ransom.woff` - فرمت پشتیبان
- `Ransom.ttf` - فرمت TrueType
- `Ransom.otf` - فرمت OpenType

### نکات مهم:
1. حداقل فایل `Ransom.woff2` باید وجود داشته باشد
2. اگر فونت Ransom را ندارید، می‌توانید از یکی از این جایگزین‌ها استفاده کنید:
   - [Rubik Glitch](https://fonts.google.com/specimen/Rubik+Glitch) - Google Fonts
   - [Creepster](https://fonts.google.com/specimen/Creepster) - Google Fonts
   - [Nosifer](https://fonts.google.com/specimen/Nosifer) - Google Fonts

### تغییر نام فونت:
اگر فونت شما نام متفاوتی دارد، یکی از این کارها را انجام دهید:

**گزینه ۱:** فایل را Rename کنید به `Ransom.woff2` (یا فرمت مورد نظر)

**گزینه ۲:** در فایل `src/app/globals.css` مسیر فونت را تغییر دهید:
```css
@font-face {
  font-family: 'Ransom';
  src: url('/fonts/YourFontName.woff2') format('woff2'),
       ...
}
```

### نحوه تست:
بعد از قرار دادن فایل‌ها، سایت را ری‌استارت کنید و لوگو باید با فونت Ransom نمایش داده شود.
