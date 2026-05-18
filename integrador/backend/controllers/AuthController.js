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
            const perfil = usuario.tipo_perfil || usuario.tipo || usuario.cargo || 'COMUM';

            // Gerar token JWT
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    email: usuario.email,
                    tipo_perfil: perfil // <-- CORRIGIDO AQUI
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
                        tipo_perfil: perfil // <-- CORRIGIDO AQUI TAMBÉM! Agora vai pro frontend
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

    // POST /auth/registrar - Registrar novo usuário
    static async registrar(req, res) {
        try {
            const { nome, email, senha, tipo_perfil, tipo } = req.body;
            
            // Validações básicas
            if (!nome || nome.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome obrigatório',
                    mensagem: 'O nome é obrigatório'
                });
            }

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

            // Validações de formato
            if (nome.length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito curto',
                    mensagem: 'O nome deve ter pelo menos 2 caracteres'
                });
            }

            if (nome.length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito longo',
                    mensagem: 'O nome deve ter no máximo 255 caracteres'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }

            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha muito curta',
                    mensagem: 'A senha deve ter pelo menos 6 caracteres'
                });
            }

            // Verificar se o email já existe
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Email já cadastrado',
                    mensagem: 'Este email já está sendo usado por outro usuário'
                });
            }

            // Preparar dados do usuário (aceita tanto tipo_perfil quanto tipo)
            const dadosUsuario = {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha: senha,
                tipo_perfil: tipo_perfil || tipo || 'COMUM'
            };

            // Criar usuário
            const usuarioId = await UsuarioModel.criar(dadosUsuario);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário registrado com sucesso',
                dados: {
                    id: usuarioId,
                    nome: dadosUsuario.nome,
                    email: dadosUsuario.email,
                    tipo_perfil: dadosUsuario.tipo_perfil
                }
            });
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar o usuário'
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

    // GET /usuarios - Listar todos os usuários (apenas admin, com paginação)
    static async listarUsuarios(req, res) {
        try {
            // Obter parâmetros de paginação da query string
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            
            // Validações
            if (pagina < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                });
            }
            
            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite < 1 || limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }
            
            const resultado = await UsuarioModel.listarTodos(pagina, limite);
            
            // Remover senha de todos os usuários
            const usuariosSemSenha = resultado.usuarios.map(({ senha, ...usuario }) => usuario);

            res.status(200).json({
                sucesso: true,
                dados: usuariosSemSenha,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuários'
            });
        }
    }

    // POST /usuarios - Criar novo usuário (apenas admin)
    static async criarUsuario(req, res) {
        try {
            const { nome, email, senha, tipo_perfil, tipo } = req.body;
            
            // Validações básicas
            if (!nome || nome.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome obrigatório',
                    mensagem: 'O nome é obrigatório'
                });
            }

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

            // Validações de formato
            if (nome.length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito curto',
                    mensagem: 'O nome deve ter pelo menos 2 caracteres'
                });
            }

            if (nome.length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito longo',
                    mensagem: 'O nome deve ter no máximo 255 caracteres'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }

            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha muito curta',
                    mensagem: 'A senha deve ter pelo menos 6 caracteres'
                });
            }

            // Verificar se o email já existe
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Email já cadastrado',
                    mensagem: 'Este email já está sendo usado por outro usuário'
                });
            }

            // Preparar dados do usuário
            const dadosUsuario = {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha: senha,
                tipo_perfil: tipo_perfil || tipo || 'COMUM'
            };

            // Criar usuário
            const usuarioId = await UsuarioModel.criar(dadosUsuario);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário criado com sucesso',
                dados: {
                    id: usuarioId,
                    nome: dadosUsuario.nome,
                    email: dadosUsuario.email,
                    tipo_perfil: dadosUsuario.tipo_perfil
                }
            });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o usuário'
            });
        }
    }

    // PUT /usuarios/:id - Atualizar usuário (apenas admin)
    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, tipo_perfil, tipo } = req.body;
            
            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Preparar dados para atualização
            const dadosAtualizacao = {};
            
            if (nome !== undefined) {
                if (nome.trim() === '') {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome inválido',
                        mensagem: 'O nome não pode estar vazio'
                    });
                }
                if (nome.length < 2) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome muito curto',
                        mensagem: 'O nome deve ter pelo menos 2 caracteres'
                    });
                }
                dadosAtualizacao.nome = nome.trim();
            }

            if (email !== undefined) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Email inválido',
                        mensagem: 'Formato de email inválido'
                    });
                }
                
                // Verificar se o email já está em uso por outro usuário
                const usuarioComEmail = await UsuarioModel.buscarPorEmail(email);
                if (usuarioComEmail && usuarioComEmail.id !== parseInt(id)) {
                    return res.status(409).json({
                        sucesso: false,
                        erro: 'Email já cadastrado',
                        mensagem: 'Este email já está sendo usado por outro usuário'
                    });
                }
                
                dadosAtualizacao.email = email.trim().toLowerCase();
            }

            if (senha !== undefined) {
                if (senha.length < 6) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Senha muito curta',
                        mensagem: 'A senha deve ter pelo menos 6 caracteres'
                    });
                }
                dadosAtualizacao.senha = senha;
            }

            const perfil = tipo_perfil || tipo;
            if (perfil !== undefined) {
                dadosAtualizacao.tipo_perfil = perfil;
            }

            // Verificar se há dados para atualizar
            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneça pelo menos um campo para atualizar'
                });
            }

            // Atualizar usuário
            const resultado = await UsuarioModel.atualizar(id, dadosAtualizacao);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o usuário'
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

    // DELETE /usuarios/:id - Excluir usuário (apenas admin)
    static async excluirUsuario(req, res) {
        try {
            const { id } = req.params;
            
            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Excluir usuário
            const resultado = await UsuarioModel.excluir(id);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o usuário'
            });
        }
    }
}

export default AuthController;