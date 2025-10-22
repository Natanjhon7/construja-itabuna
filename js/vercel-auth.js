// Sistema de Autenticação com Vercel
class VercelAuth {
    constructor() {
        this.storageKey = 'construja_users';
        this.currentUserKey = 'construja_current_user';
    }

    // Cadastro de usuário
    async registerUser(userData) {
        try {
            console.log('📝 Iniciando cadastro Vercel:', userData.email);

            // 1. Verificar se email já existe
            const existingUser = this.getUserByEmail(userData.email);
            if (existingUser) {
                throw new Error('Este e-mail já está cadastrado.');
            }

            // 2. Criar usuário
            const user = {
                id: this.generateId(),
                ...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // 3. Salvar localmente (para testes rápidos)
            this.saveUserLocal(user);

            // 4. Tentar salvar no Vercel (opcional)
            try {
                await this.saveUserToVercel(user);
            } catch (error) {
                console.log('⚠️ Vercel offline, usando localStorage');
            }

            console.log('✅ Usuário cadastrado:', user.id);
            return { success: true, user };

        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            return { success: false, error: error.message };
        }
    }

    // Cadastro de profissional
    async registerProfessional(userId, professionalData) {
        try {
            const professional = {
                id: this.generateId(),
                user_id: userId,
                servico: professionalData.service,
                experiencia: parseInt(professionalData.experience),
                descricao: professionalData.description,
                areas_atuacao: professionalData.workAreas || [],
                aprovado: false,
                avaliacao_media: 0,
                total_avaliacoes: 0,
                criado_em: new Date().toISOString()
            };

            // Salvar profissional
            const professionals = this.getProfessionalsLocal();
            professionals.push(professional);
            localStorage.setItem('construja_professionals', JSON.stringify(professionals));

            console.log('✅ Profissional cadastrado:', professional.id);
            return professional;

        } catch (error) {
            console.error('❌ Erro profissional:', error);
            throw error;
        }
    }

    // Login de usuário
    async loginUser(email, password) {
        try {
            console.log('🔐 Tentando login:', email);

            const user = this.getUserByEmail(email);
            
            if (!user) {
                throw new Error('Usuário não encontrado.');
            }

            if (user.password !== password) {
                throw new Error('Senha incorreta.');
            }

            // Salvar sessão
            this.setCurrentUser(user);

            console.log('✅ Login realizado:', user.id);
            return { success: true, user };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===== FUNÇÕES AUXILIARES =====

    // Gerar ID único
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Buscar usuário por email
    getUserByEmail(email) {
        const users = this.getUsersLocal();
        return users.find(user => user.email === email);
    }

    // Buscar usuário por ID
    getUserById(id) {
        const users = this.getUsersLocal();
        return users.find(user => user.id === id);
    }

    // Salvar usuário localmente
    saveUserLocal(user) {
        const users = this.getUsersLocal();
        users.push(user);
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    // Buscar usuários locais
    getUsersLocal() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Buscar profissionais locais
    getProfessionalsLocal() {
        return JSON.parse(localStorage.getItem('construja_professionals') || '[]');
    }

    // Definir usuário atual
    setCurrentUser(user) {
        // Remover senha por segurança
        const { password, ...userWithoutPassword } = user;
        sessionStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));
    }

    // Buscar usuário atual
    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem(this.currentUserKey) || 'null');
    }

    // Logout
    logout() {
        sessionStorage.removeItem(this.currentUserKey);
    }

    // Salvar no Vercel (opcional - para quando deployar)
    async saveUserToVercel(user) {
        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar no servidor');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Servidor offline - usando armazenamento local');
        }
    }

    // Verificar se está logado
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    
}

// Inicializar serviço
window.vercelAuth = new VercelAuth();
console.log('🔧 Vercel Auth carregado!');

