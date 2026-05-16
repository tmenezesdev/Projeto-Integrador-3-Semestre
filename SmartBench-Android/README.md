# SmartBench Android

App mobile nativo em Java para o sistema SmartBench de gestão de ferramentas RFID.

## Infraestrutura

| Componente | Onde roda |
|-----------|-----------|
| Banco de dados | Railway (nuvem) — `trolley.proxy.rlwy.net:31089` |
| Backend Node.js | Railway (nuvem) — `projeto-integrador-3-semestre-production-197e.up.railway.app` |
| Imagens / uploads | Cloudinary (nuvem) |
| App Android | Qualquer rede — sem necessidade de Wi-Fi específico |

> Tudo na nuvem. Não precisa de PC ligado nem de IP local.

---

## Configuração

### 1. Abrir no Android Studio

1. `File → Open` → selecionar a pasta `SmartBench-Android`
2. Aguardar o sync do Gradle
3. Conectar o dispositivo físico (USB ou Wi-Fi Debug)
4. Clicar em **Run**

---

## Estrutura do projeto

```
app/src/main/java/com/smartbench/app/
├── data/api/          # Retrofit + OkHttp + Interceptors
├── data/local/        # SessionManager (JWT em SharedPreferences)
├── data/model/        # Entities, Requests, Responses
├── data/repository/   # AuthRepository, AdminRepository, SupervisorRepository, MecanicoRepository
├── ui/auth/           # LoginActivity, RedefinirSenhaActivity
├── ui/admin/          # 7 Fragments + ViewModels + BottomSheets
├── ui/supervisor/     # 5 Fragments + ViewModels
├── ui/mecanico/       # 6 Fragments + ViewModels
├── ui/common/         # Adapters reutilizáveis
└── utils/             # ColorUtils, DateUtils, ValidationUtils, ExcelExporter
```

---

## Tecnologias

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Java | 17 | Linguagem |
| Material Design 3 | 1.12.0 | UI |
| Navigation Component | 2.8.9 | Navegação |
| Retrofit2 | 2.11.0 | HTTP |
| OkHttp3 | 4.12.0 | HTTP client |
| Gson | 2.11.0 | JSON |
| Glide | 4.16.0 | Imagens |
| MPAndroidChart | 3.1.0 | Gráficos |
| OpenCSV | 5.9 | Exportação CSV |

---

## Perfis e Temas

| Perfil | Cor | Theme Android |
|--------|-----|---------------|
| ADMIN | `#7033FF` Roxo | `Theme.SmartBench.Admin` |
| SUPERVISOR | `#2DD4BF` Teal | `Theme.SmartBench.Supervisor` |
| MECANICO | `#F59E0B` Âmbar | `Theme.SmartBench.Mecanico` |
