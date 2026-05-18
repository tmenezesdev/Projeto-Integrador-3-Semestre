export async function enviarEmailResetSenha(email, nome, token) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const link = `${frontendUrl}/reset-senha?token=${token}`;

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            sender: { name: 'SmartBench System', email: 'smartbench.sistema@gmail.com' },
            to: [{ email, name: nome }],
            subject: 'Redefinição de Senha — SmartBench',
            htmlContent: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#04030d;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:rgba(10,8,22,0.98);border:1px solid rgba(112,51,255,0.3);border-radius:16px;overflow:hidden;">
    <div style="padding:32px;text-align:center;background:linear-gradient(135deg,rgba(112,51,255,0.8),rgba(45,212,191,0.4));">
      <h1 style="margin:0;font-size:30px;font-weight:900;color:#fff;letter-spacing:-1px;">Smart<span style="color:#f59e0b;">Bench</span></h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Sistema de Gestão de Ferramentas</p>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#fff;margin:0 0 6px;font-size:20px;">Olá, ${nome}!</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 12px;">Recebemos uma solicitação para redefinir a senha da sua conta no <strong style="color:#a87fff;">SmartBench</strong>.</p>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 28px;">Clique no botão abaixo para criar uma nova senha. Este link expira em <strong style="color:#f59e0b;">1 hora</strong>.</p>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${link}" style="display:inline-block;background:#7033ff;color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:700;font-size:15px;box-shadow:0 0 24px rgba(112,51,255,0.45);">Redefinir Senha</a>
      </div>
      <p style="color:#475569;font-size:13px;line-height:1.6;margin:0 0 24px;">Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
      <hr style="border:none;border-top:1px solid rgba(112,51,255,0.15);margin:0 0 20px;">
      <p style="color:#334155;font-size:12px;text-align:center;margin:0;">© 2026 SmartBench System · Acesso monitorado</p>
    </div>
  </div>
</body>
</html>`,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Brevo HTTP ${res.status}`);
    }
}
