# 🇹🇷 Türkiye Adresler Frontend

React tabanlı Türkiye adres arama uygulaması.

## 🚀 Netlify Deploy

### 1. GitHub'a Push
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/turkiye-adresler-frontend.git
git push -u origin main
```

### 2. Netlify'de Deploy
1. Netlify → "New site from Git"
2. GitHub repo seçin
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
4. Environment variables:
   - `REACT_APP_API_URL`: Backend API URL'i

### 3. Environment Variables
```
REACT_APP_API_URL=https://your-backend.up.railway.app
```

## 🛠️ Local Development

### 1. Install
```bash
npm install
```

### 2. Environment
```bash
cp env.example .env
# .env dosyasını düzenle
```

### 3. Start
```bash
npm start
```

## 📱 Özellikler

- ✅ Mobil uyumlu (responsive)
- ✅ Otomatik büyük harf (Cursorrools.md)
- ✅ Türkçe karakter normalizasyonu
- ✅ Google-style arama
- ✅ API fallback sistemi
- ✅ Real-time API status

## 🔧 Build & Deploy

```bash
# Build
npm run build

# Local test
npx serve -s build
```

## 🌐 URLs

- **Development**: http://localhost:3000
- **Production**: https://your-app.netlify.app 