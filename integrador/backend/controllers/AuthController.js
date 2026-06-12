import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UsuarioModel from '../models/UsuarioModel.js';
import { JWT_CONFIG } from '../config/jwt.js';
import { getConnection, hashPassword } from '../config/database.js';
import { enviarEmailResetSenha } from '../services/emailService.js';

// Controller para operações de autenticação
class AuthController {

    // POST /auth/login - Fazer login
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Validações básicas
            if (!email || email.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email obrigatório',
                    mensagem: 'O email é obrigatório'
                });
            }

            if (!senha || senha.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha obrigatória',
                    mensagem: 'A senha é obrigatória'
                });
            }

            // Validação básica de formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }

            // Verificar credenciais
            const usuario = await UsuarioModel.verificarCredenciais(email.trim(), senha);

            if (!usuario) {
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Credenciais inválidas',
                    mensagem: 'Email ou senha incorretos'
                });
            }

            // Pegamos o tipo_perfil ou cargo, o que o seu banco retornar
            const perfil = usuario.tipo_perfil || usuario.tipo || usuario.cargo || 'MECANICO';

            // Gerar token JWT
            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    tipo_perfil: perfil
                },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );

            res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    token,
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        tipo_perfil: perfil
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível processar o login'
            });
        }
    }

    // GET /auth/perfil - Obter perfil do usuário logado
    static async obterPerfil(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: 'Usuário não foi encontrado'
                });
            }

            // Remover senha dos dados retornados
            const { senha, ...usuarioSemSenha } = usuario;

            res.status(200).json({
                sucesso: true,
                dados: usuarioSemSenha
            });
        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o perfil'
            });
        }
    }

    // POST /auth/esqueceu-senha - Solicitar redefinição de senha
    static async esqueceuSenha(req, res) {
        const { email } = req.body;
        if (!email?.trim()) {
            return res.status(400).json({ sucesso: false, mensagem: 'E-mail obrigatório.' });
        }

        let conn;
        try {
            conn = await getConnection();
            const [[usuario]] = await conn.execute(
                'SELECT id, nome, email FROM usuarios WHERE email = ?',
                [email.trim().toLowerCase()]
            );

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'E-mail não cadastrado no sistema. Entre em contato com o seu supervisor.',
                });
            }

            const token  = crypto.randomBytes(32).toString('hex');
            const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

            await conn.execute(
                'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
                [token, expiry, usuario.id]
            );

            try {
                await enviarEmailResetSenha(usuario.email, usuario.nome, token);
            } catch (emailError) {
                console.error('Falha ao enviar email de reset:', emailError.message);
                return res.status(500).json({
                    sucesso: false,
                    mensagem: `Erro ao enviar e-mail: ${emailError.message}`,
                });
            }

            res.json({ sucesso: true, mensagem: 'Instruções de redefinição enviadas para o seu e-mail.' });
        } catch (error) {
            console.error('Erro em esqueceuSenha:', error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar solicitação.' });
        } finally {
            if (conn) conn.release();
        }
    }

    // POST /auth/redefinir-senha - Redefinir senha com token
    static async redefinirSenha(req, res) {
        const { token, nova_senha } = req.body;
        if (!token || !nova_senha) {
            return res.status(400).json({ sucesso: false, mensagem: 'Token e nova senha são obrigatórios.' });
        }
        if (nova_senha.length < 6) {
            return res.status(400).json({ sucesso: false, mensagem: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        let conn;
        try {
            conn = await getConnection();
            const [[usuario]] = await conn.execute(
                'SELECT id FROM usuarios WHERE reset_token = ? AND reset_token_expiry > NOW()',
                [token]
            );

            if (!usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'Link inválido ou expirado. Solicite um novo.' });
            }

            const hash = await hashPassword(nova_senha);
            await conn.execute(
                'UPDATE usuarios SET senha = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
                [hash, usuario.id]
            );

            res.json({ sucesso: true, mensagem: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error('Erro em redefinirSenha:', error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao redefinir senha.' });
        } finally {
            if (conn) conn.release();
        }
    }
}

export default AuthController;
