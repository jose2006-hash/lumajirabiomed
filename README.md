# BionicOS — Sistema de Control de Prótesis Biónica

Aplicación React.js para monitoreo y control en tiempo real de prótesis biónica con IA integrada.

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Tailwind CSS |
| Base de datos | Firebase Realtime Database |
| IA Chat | OpenAI GPT-4o mini |
| Gráficos | Recharts |
| Deploy | Vercel + PWA |

## ⚙️ Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env.local` y rellena con tus claves:
```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
# Firebase — Obtén estas desde Firebase Console → Project Settings → SDK
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc

# OpenAI — Obtén desde platform.openai.com/api-keys
REACT_APP_OPENAI_API_KEY=sk-...
```

> ⚡ **Sin configurar las variables**, la app corre en **Modo Demo** automáticamente con datos simulados.

### 3. Ejecutar en desarrollo
```bash
npm start
```

### 4. Build para producción
```bash
npm run build
```

## 🔥 Estructura Firebase Realtime Database

Tu ESP32/Arduino debe enviar datos a esta ruta:
```json
{
  "dispositivo": {
    "telemetria": {
      "emg": 127.5,
      "bioimpedancia": 523.0,
      "timestamp": 1700000000000
    },
    "control": {
      "emergency_stop": false
    },
    "calibracion": {
      "emg_max": 220.0
    },
    "historial": {
      "2025-01-15": {
        "sesion1": { "minutes": 45, "timestamp": 1700000000000 }
      }
    }
  }
}
```

### Reglas de seguridad Firebase (Realtime DB):
```json
{
  "rules": {
    "dispositivo": {
      ".read": true,
      ".write": true
    }
  }
}
```
> ⚠️ Para producción, implementar autenticación Firebase Auth.

## 📡 Código ESP32 (Arduino) — Ejemplo mínimo

```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>

#define FIREBASE_HOST "tu-proyecto-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "tu-database-secret"
#define WIFI_SSID "tu-wifi"
#define WIFI_PASSWORD "tu-contraseña"

FirebaseData fbdo;
FirebaseConfig config;
FirebaseAuth auth;

void setup() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
}

void loop() {
  // Leer sensor EMG (pin analógico)
  int emgRaw = analogRead(34);
  float emgMV = (emgRaw / 4095.0) * 3300.0; // mV

  // Leer bioimpedancia (depende de tu sensor)
  float bioimpedancia = 500.0; // reemplaza con tu lectura

  // Enviar a Firebase
  Firebase.setFloat(fbdo, "/dispositivo/telemetria/emg", emgMV);
  Firebase.setFloat(fbdo, "/dispositivo/telemetria/bioimpedancia", bioimpedancia);
  Firebase.setInt(fbdo, "/dispositivo/telemetria/timestamp", millis());

  // Verificar parada de emergencia
  Firebase.getBool(fbdo, "/dispositivo/control/emergency_stop");
  if (fbdo.boolData()) {
    // DETENER TODOS LOS MOTORES
    stopAllMotors();
  }

  delay(100); // 10 Hz de muestreo
}
```

## 🌐 Deploy en Vercel

1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com) → Import Project → tu repo
3. En **Environment Variables**, agrega las mismas variables de `.env.local`
4. Deploy automático ✅

### Variables en Vercel:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_DATABASE_URL`
- ... (todas las del .env)
- `REACT_APP_OPENAI_API_KEY`

## 📱 Instalar como PWA (sin Play Store)

1. Abre la app en Chrome móvil
2. Menú → "Añadir a pantalla de inicio"
3. La app funciona como app nativa offline

## 🧠 Funcionalidades IA

| Feature | Descripción |
|---------|-------------|
| Filtro Moving Average | Suaviza picos de ruido EMG (ventana 8 muestras) |
| Correlación Biométrica | Detecta fatiga y adapta umbrales automáticamente |
| Alertas Proactivas | Notifica si bioimpedancia indica mal posicionamiento del socket |
| Chat GPT-4o mini | Asistente médico con contexto de telemetría en tiempo real |
| Calibración Guiada | Wizard paso a paso para setear umbral EMG personal |
| Parada de Emergencia | Envío instantáneo a Firebase con hold de 1.2s para evitar accidentes |

## 📁 Estructura del Proyecto

```
src/
├── assets/
│   └── prosthesis.png          # Imagen de la prótesis (splash)
├── components/
│   ├── SplashScreen.jsx        # Pantalla de entrada con la imagen
│   ├── Dashboard.jsx           # Panel principal con tabs
│   ├── EMGChart.jsx            # Osciloscopio EMG en tiempo real
│   ├── BioimpedanceGauge.jsx   # Gauge circular de fatiga
│   ├── AIThresholds.jsx        # Sliders de umbrales adaptativos
│   ├── EmergencyStop.jsx       # Botón de parada de emergencia
│   ├── UsageHistory.jsx        # Historial de rehabilitación
│   ├── CalibrationWizard.jsx   # Asistente de calibración
│   └── AIChat.jsx              # Chat con OpenAI GPT-4o mini
├── hooks/
│   ├── useTelemetry.js         # Firebase + procesamiento de señal
│   └── useAIAssistant.js       # Integración OpenAI
└── lib/
    ├── firebase.js             # Configuración Firebase
    └── signalProcessing.js     # Filtros DSP y algoritmos IA
```

## 🏥 Desarrollado para MedTech — Lima, Perú 🇵🇪
