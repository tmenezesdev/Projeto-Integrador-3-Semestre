# SmartBench — Gestão Inteligente de Ferramentas

Projeto Integrador (3º Semestre). Sistema completo para controle de retirada e
devolução de ferramentas de uma bancada/almoxarifado, com identificação por
**RFID** e **crachá**, painel **web**, aplicativo **Android** e hardware **IoT (ESP32)**.

## Estrutura do repositório

```
integrador/
  backend/    API REST em Node.js + Express + MySQL (JWT, bcrypt, Cloudinary)
  frontend/   Painel web em Next.js (App Router) + Tailwind
  iot/        Firmware ESP32 (Espruino) + documentação do hardware
SmartBench-Android/   Aplicativo Android nativo (Java, MVVM, Retrofit)
```

## Perfis de acesso

- **ADMIN** — gestão de usuários, ferramentas, configurações e dashboards.
- **SUPERVISOR** — cadastro de funcionários, devolução manual, visão geral e atrasos.
- **MECANICO** — suas retiradas, histórico, alertas e ferramentas disponíveis.

## Como rodar

### 1. Banco de dados
Crie um MySQL e rode a migration (cria tabelas, trigger e dados de teste):
```bash
cd integrador/backend
cp env.example .env      # preencha as variáveis (banco, JWT, Cloudinary, Brevo)
npm install
node migrations/migrate.mjs
```

### 2. Backend (API)
```bash
cd integrador/backend
npm start                # ou: npm run dev  (com --watch)
# Sobe em http://localhost:3000
```

### 3. Frontend (web)
```bash
cd integrador/frontend
npm install
npm run dev              # http://localhost:3001
```
Em produção, defina `NEXT_PUBLIC_API_URL` com a URL pública da API.

### 4. Android
Abra `SmartBench-Android/` no Android Studio. A URL da API é definida em
`app/build.gradle` (`BASE_URL`). Rode em um emulador ou dispositivo.

### 5. IoT
Veja `integrador/iot/README.md` para montagem do hardware e upload do firmware.

## Segurança / variáveis de ambiente

- O arquivo `.env` **não** é versionado. Use `backend/env.example` como modelo.
- Nunca commite segredos reais (senha do banco, `JWT_SECRET`, chaves de API).
- Usuários só podem ser criados por ADMIN ou SUPERVISOR autenticados — não há
  cadastro público.

## Stack

- **Backend:** Node.js, Express, MySQL (mysql2), JWT, bcryptjs, Cloudinary, Brevo, SerialPort
- **Frontend:** Next.js 16, React 19, Tailwind CSS, Recharts, ExcelJS
- **Android:** Java 17, Retrofit/OkHttp, Glide, MPAndroidChart, ViewModel/LiveData
- **IoT:** ESP32 + RFID RC522 (firmware em Espruino)
