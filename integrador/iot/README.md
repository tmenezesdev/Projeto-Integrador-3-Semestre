# SmartBench — IoT (Bancada Inteligente)

Controle automático de **retirada** e **devolução** de ferramentas do almoxarifado
usando ESP32 + leitor RFID RC522 + chaves push button.

## Como funciona

Cada ferramenta fica sobre uma **chave push button**. O peso da ferramenta mantém
o botão pressionado enquanto ela está na bancada.

1. O operador **movimenta** a ferramenta:
   - Ferramenta **sai** da bancada → o ESP32 prepara um evento de **RETIRADA**.
   - Ferramenta **volta** para a bancada → o ESP32 prepara um evento de **DEVOLUÇÃO**.
2. O operador **aproxima o crachá** no leitor RC522.
3. O ESP32 confirma o evento e envia uma linha estruturada pela USB:
   ```
   EVENTO {"tag":"RFID-FER-001","cracha":"AB-CD-12-34","tipo":"RETIRADA"}
   ```
4. A **ponte serial** (`backend/ponte-usb.js`) lê essa linha, encontra a ferramenta
   (por `tag_rfid`) e o funcionário (por `tag_cracha`), e grava a transação.
5. A trigger `trg_atualiza_status_ferramenta` do banco atualiza automaticamente o
   status da ferramenta para `EM_USO` (retirada) ou `DISPONIVEL` (devolução).
   O sistema passa a mostrar a ferramenta como **em uso por aquele operador**.

> Se o operador mover a ferramenta e não passar o crachá em até 30 s, o evento é
> cancelado (configurável em `TIMEOUT_CONFIRMACAO_MS` no firmware).

## Componentes

- ESP32
- Protoboard
- Leitor RFID RC522
- Chave Push Button 6 pinos 8,5 mm (1 por ferramenta)
- Jumpers

## Ligações (sugestão)

### RC522 → ESP32 (SPI2 / VSPI)

| RC522 | ESP32   |
|-------|---------|
| SDA   | GPIO 5  |
| SCK   | GPIO 18 |
| MOSI  | GPIO 23 |
| MISO  | GPIO 19 |
| RST   | GPIO 22 |
| 3.3V  | 3V3     |
| GND   | GND     |

> O RC522 trabalha em **3,3 V** — não ligue no 5 V.

### Botões → ESP32

Cada botão liga um pino de entrada ao **GND**. Os pinos usam `input_pullup`,
então a leitura é `HIGH` quando solto e `LOW` quando pressionado.

| Ferramenta                   | Pino |
|------------------------------|------|
| Torquímetro Digital 200Nm    | D13  |
| Chave de Impacto Pneumática  | D14  |

## Firmware (`firmware-esp32.js`)

Escrito em **Espruino** (JavaScript no microcontrolador).

1. Instale o [Espruino Web IDE](https://www.espruino.com/ide/) e o módulo `MFRC522`.
2. Abra `firmware-esp32.js`, ajuste o array `FERRAMENTAS` (pino + `tag` + nome).
3. Envie (upload) para o ESP32.

O campo `tag` de cada ferramenta **deve ser igual** ao `tag_rfid` cadastrado na
tabela `ferramentas` (ver `backend/migrations/SeedDB.sql`).

## Ponte serial (`backend/ponte-usb.js`)

É importada automaticamente pelo `app.js`, então **sobe junto com o backend**
(`npm start`). Configurações pelo `.env`:

```env
PORTA_SERIAL=COM3        # porta onde o ESP32 está (Windows: COMx, Linux: /dev/ttyUSB0)
BAUD_SERIAL=9600         # deve bater com o firmware
IOT_SERIAL_ENABLED=true  # use false em servidores/deploy sem o hardware
```

Se a porta não existir, o backend continua funcionando normalmente (só sem o IoT).

## Cadastrando os crachás (importante)

O RC522 lê o **UID físico** do cartão (ex.: `AB-CD-12-34`), que é diferente das
tags de exemplo do seed (`TAG-MEC-003`). Para vincular um crachá real a um
funcionário:

1. Aproxime o crachá com o backend rodando e veja no console:
   ```
   ❌ Crachá não cadastrado: "AB-CD-12-34".
   ```
2. Copie esse UID e grave na coluna `tag_cracha` do usuário desejado, por exemplo:
   ```sql
   UPDATE usuarios SET tag_cracha = 'AB-CD-12-34' WHERE email = 'carlos.silva@gm.com';
   ```

A partir daí, esse crachá passa a confirmar as movimentações daquele operador.
