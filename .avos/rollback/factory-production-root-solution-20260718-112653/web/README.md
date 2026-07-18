# AVOS Web Platform

واجهة AVOS الأمامية مبنية باستخدام Next.js وتعمل على المنفذ `3001`.

## التشغيل

```powershell
cd C:\Users\User\Desktop\AVOS
pnpm install

cd .\apps\web
Copy-Item .env.example .env.local -Force
pnpm dev
```

ثم افتح:

```text
http://localhost:3001
```

يجب أن يعمل API على:

```text
http://localhost:3000
```
