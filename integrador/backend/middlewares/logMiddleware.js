export const logMiddleware = (req, res, next) => {
    next();
};

export const simpleLogMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const usuario = req.usuario ? `[${req.usuario.email}]` : '[Anônimo]';

    console.log(`${timestamp} - ${req.method} ${req.originalUrl} ${usuario} - IP: ${req.ip || 'N/A'}`);

    next();
};