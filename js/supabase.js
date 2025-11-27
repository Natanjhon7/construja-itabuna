// auth/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// SUAS CREDENCIAIS DO SUPABASE - substitua pelas suas
const supabaseUrl = 'https://ocvkhwtbmpiltjbttsko.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdmtod3RibXBpbHRqYnR0c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzE5MzgsImV4cCI6MjA3OTg0NzkzOH0.Y6KFqQxs9l2fDziiURjtW3oZr6MWKZPNtyhT5-K7yGw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções auxiliares
export const AuthDB = {
    // Cadastrar usuário
    async cadastrarUsuario(usuarioData) {
        try {
            const { email, password, nome, telefone, tipo, service } = usuarioData
            
            // 1. Criar usuário no Auth do Supabase
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            })
            
            if (authError) throw authError

            // 2. Salvar dados no perfil
            const { data: profileData, error: profileError } = await supabase
                .from('usuarios')
                .insert([
                    {
                        id: authData.user.id,
                        email: email,
                        nome: nome,
                        telefone: telefone,
                        tipo: tipo,
                        status: tipo === 'professional' ? 'pending' : 'active'
                    }
                ])
                .select()
                .single()

            if (profileError) throw profileError

            // 3. Se for profissional, salvar dados específicos
            if (tipo === 'professional') {
                const { error: profError } = await supabase
                    .from('profissionais')
                    .insert([
                        {
                            id: authData.user.id,
                            especialidade: service,
                            disponivel: true
                        }
                    ])
                
                if (profError) throw profError
            }

            return { 
                success: true, 
                user: profileData,
                message: 'Cadastro realizado com sucesso!' 
            }
            
        } catch (error) {
            console.error('Erro no cadastro:', error)
            return { 
                success: false, 
                error: error.message 
            }
        }
    },

    // Login
    async loginUsuario(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            
            if (error) throw error

            // Buscar dados do perfil
            const { data: perfil } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', data.user.id)
                .single()

            return { 
                success: true, 
                user: perfil 
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.message 
            }
        }
    },

    // Logout
    async logout() {
        const { error } = await supabase.auth.signOut()
        return { success: !error, error }
    },

    // Buscar usuário atual
    async getUsuarioAtual() {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return null

        const { data: perfil } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', user.id)
            .single()

        return perfil
    },

    // Verificar se email existe
    async emailExiste(email) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('email')
            .eq('email', email)
            .single()

        return !!data
    }
}