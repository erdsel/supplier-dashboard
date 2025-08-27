# Deployment Kılavuzu

## Hızlı Deployment (Önerilen)

### Option 1: Vercel + MongoDB Atlas (15 dakika)

#### 1. MongoDB Atlas Setup
1. [MongoDB Atlas](https://www.mongodb.com/atlas) hesabı oluşturun
2. Ücretsiz M0 cluster oluşturun
3. Network Access'e 0.0.0.0/0 ekleyin (tüm IP'ler)
4. Connection string'i kopyalayın

#### 2. Backend Deployment (Vercel)
```bash
cd backend
npm i -g vercel
vercel

# Environment variables ekleyin:
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your-secret-key
# CORS_ORIGIN=https://your-frontend.vercel.app
```

#### 3. Frontend Deployment (Vercel)
```bash
cd frontend
vercel

# Environment variable ekleyin:
# REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### Option 2: Netlify + Render (Ücretsiz)

#### Frontend (Netlify)
1. GitHub'a push'ladıktan sonra [Netlify](https://netlify.com) girin
2. "Import from Git" seçin
3. Build command: `npm run build`
4. Publish directory: `build`
5. Environment variable ekleyin: `REACT_APP_API_URL`

#### Backend (Render)
1. [Render.com](https://render.com) hesabı oluşturun
2. New > Web Service
3. GitHub repo'yu bağlayın
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Environment variables ekleyin

### Option 3: Railway (Tek Platform - En Kolay)

```bash
# Railway CLI kurulum
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up

# MongoDB ve Redis otomatik provision edilir
```

## Demo Hesapları

Deploy ettikten sonra şu vendor isimleriyle giriş yapabilirsiniz:
- Robin
- Dilvin
- Mizalle
- Setre
- Xint

## Önemli Notlar

1. **CORS Ayarı**: Backend .env dosyasında `CORS_ORIGIN` değerini frontend URL'inize göre güncelleyin
2. **MongoDB**: Atlas kullanıyorsanız, IP whitelist'e deployment platform IP'lerini ekleyin
3. **Redis**: Production'da Upstash veya RedisLabs kullanabilirsiniz (opsiyonel)

## Test Etme

Deploy sonrası test için:
```bash
curl https://your-backend-url.vercel.app/healthz
curl https://your-backend-url.vercel.app/api-docs
```

## Teslim İçin Paylaşılacaklar

1. **Live Demo URL**: https://your-app.vercel.app
2. **API Docs**: https://your-backend.vercel.app/api-docs
3. **GitHub Repo**: https://github.com/erdsel/supplier-dashboard
4. **Demo Video**: (Opsiyonel) Loom ile 2 dakikalık demo

## Sorun Giderme

### CORS Hatası
Backend .env'de `CORS_ORIGIN` değerini kontrol edin

### MongoDB Bağlantı Hatası
- Atlas Network Access'i kontrol edin
- Connection string'deki kullanıcı adı/şifre doğru mu?

### Build Hatası
```bash
# Local'de test edin
cd frontend && npm run build
cd backend && npm run build
```