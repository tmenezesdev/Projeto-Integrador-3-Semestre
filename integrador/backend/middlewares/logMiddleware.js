import { create } from '../config/database.js';

// Middleware para registrar logs de acesso
export const logMiddleware = async (req, res, next) => {
    const startTime = Date.now();

    // Capturar dados da requisição
    const logData = {
        rota: req.originalUrl,
        metodo: req.method,
        ip_address: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
        user_agent: req.get('User-Agent'),
        dados_requisicao: {
            headers: {
                'content-type': req.get('Content-Type'),
                'authorization': req.get('Authorization') ? 'Bearer [REDACTED]' : null,
                'user-agent': req.get('User-Agent')
            },
            body: req.method !== 'GET' ? sanitizeRequestBody(req.body) : null,
            query: Object.keys(req.query).length > 0 ? req.query : null
        }
    };

    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function (data) {
        const finalLogData = {
            ...logData,
            status_code: res.statusCode,
            tempo_resposta_ms: Date.now() - startTime
        };

        if (req.usuario && req.usuario.id) {
            finalLogData.usuario_id = req.usuario.id;
        }

        if (res.statusCode >= 400) {
            finalLogData.dados_resposta = {
                error: true,
                status: res.statusCode,
                message: typeof data === 'string' ? data.substring(0, 500) : data
            };
        }

        // Chama a função global que agora trata os dados corretamente
        saveLog(finalLogData);
        return originalSend.call(this, data);
    };

    res.json = function (data) {
        const finalLogData = {
            ...logData,
            status_code: res.statusCode,
            tempo_resposta_ms: Date.now() - startTime
        };

        if (req.usuario && req.usuario.id) {
            finalLogData.usuario_id = req.usuario.id;
        }

        if (res.statusCode >= 400) {
            finalLogData.dados_resposta = {
                error: true,
                status: res.statusCode,
                message: typeof data === 'object' ? JSON.stringify(data).substring(0, 500) : data
            };
        }

        // Chama a mesma função global
        saveLog(finalLogData);
        return originalJson.call(this, data);
    };

    next();
};

// Função para sanitizar dados sensíveis do body
function sanitizeRequestBody(body) {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = ['senha', 'password', 'token', 'authorization'];
    
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });

    return sanitized;
}

// Função global e DEFINITIVA para salvar o log no banco de dados
async function saveLog(logData) {
    try {
        const dadosSeguros = {
            rota: logData.rota ?? null,
            metodo: logData.metodo ?? null,
            ip_address: logData.ip_address ?? null,
            user_agent: logData.user_agent ?? null,
            dados_requisicao: logData.dados_requisicao ? JSON.stringify(logData.dados_requisicao) : null,
            status_code: logData.status_code ?? null,
            tempo_resposta_ms: logData.tempo_resposta_ms ?? null,
            dados_resposta: logData.dados_resposta ? JSON.stringify(logData.dados_resposta) : null
        };

        Object.keys(dadosSeguros).forEach(key => {
            if (dadosSeguros[key] === undefined) {
                dadosSeguros[key] = null;
            }
        });

        await create('logs', dadosSeguros);
    } catch (error) {
        // Agora, se o log falhar, ele apenas avisa no console, mas não quebra a requisição do usuário
        console.error('Erro no background ao salvar o log:', error.message);
    }
}

// Middleware para logs simples (apenas console)
export const simpleLogMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const usuario = req.usuario ? `[${req.usuario.email}]` : '[Anônimo]';

    console.log(`${timestamp} - ${req.method} ${req.originalUrl} ${usuario} - IP: ${req.ip || 'N/A'}`);

    next();
};