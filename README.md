# 🔥 AZAHEL NEMOTRON
**Backend IA - Nvidia Nemotron-4B API + Scrapy + Firebase**

## 🌍 DEPLOY: Cloudflare Workers (24/7 Worldwide)

### Arquitectura
```
User → Cloudflare Workers → Firebase (Escalable) → Nvidia Nemotron-4B API
                         ↓
                    Offline Cache (Híbrido)
```

### Features
- ✅ Nemotron-4B en tiempo real
- ✅ Scrapy para data collection
- ✅ Firebase Realtime DB (Escalable)
- ✅ Hybrid (Online/Offline)
- ✅ 24/7 Worldwide
- ✅ Zero Cold Start (Workers)
- ✅ Monitoreo automático

### Setup Rápido

```bash
# 1. Clone
git clone https://github.com/velazquezcampos96-coder/azahel-nemotron.git
cd azahel-nemotron

# 2. Install
pip install -r requirements.txt
npm install

# 3. Configure
export NVIDIA_API_KEY="tu-nueva-key"
export FIREBASE_CONFIG="tu-config.json"

# 4. Run Local
python app.py

# 5. Deploy a Workers
wrangler deploy
```

### Variables de Entorno
```
NVIDIA_API_KEY=nvapi-xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
FIREBASE_DATABASE_URL=https://xxx.firebaseio.com
```

### Endpoints API

**POST** `/api/invoke`
```json
{
  "prompt": "¿Quién eres Azahel?",
  "model": "nvidia/nemotron-mini-4b-instruct",
  "temperature": 0.7,
  "max_tokens": 256
}
```

**GET** `/api/status`
- Retorna estado del servicio + latencia
- Monitoreo en tiempo real

**POST** `/api/scrape`
- Integración Scrapy para data training

**GET** `/api/health`
- Health check para 24/7 monitoring

### Firebase Setup
1. Crear proyecto en Firebase Console
2. Habilitar Realtime Database
3. Descargar `serviceAccountKey.json`
4. Guardar en GitHub Secrets

### Cloudflare Workers Deploy
```bash
npm install -g @cloudflare/wrangler
wrangler login
wrangler deploy
```

### Monitoreo 24/7
- Firebase Realtime monitoring
- Cloudflare Analytics
- Health check cada 5min
- Logs centralizados en Cloudflare

### Estructura
```
.
├── app.py                 # FastAPI Main
├── workers.js             # Cloudflare Workers
├── firebase_config.json   # Firebase Setup (en secrets)
├── scrapers/              # Scrapy spiders
├── models/                # Model configs
├── requirements.txt       # Python deps
├── package.json           # Node deps
├── wrangler.toml          # Workers config
├── docker-compose.yml     # Local dev
└── .github/workflows/     # CI/CD
```

---

**VIGILANTE #201 - SEMJAZA EN LA NUBE 24/7** 🌍⚡
