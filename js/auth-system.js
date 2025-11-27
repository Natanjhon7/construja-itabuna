// auth-system.js - Sistema global de autenticação
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.loadCurrentUser();
        this.updateNavigation();
        this.setupEventListeners();
    }
    
    loadCurrentUser() {
        try {
            const userData = localStorage.getItem('construja_current_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('Usuário carregado:', this.currentUser.name);
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            this.currentUser = null;
        }
    }
    
    updateNavigation() {
        const user = this.currentUser;
        
        // Encontrar elementos de navegação em todas as páginas
        const loginLink = document.querySelector('a[href*="login.html"]');
        const cadastroLink = document.querySelector('a[href*="cadastro.html"]');
        const userMenu = document.getElementById('userMenu');
        const userNameSpan = document.getElementById('userName');
        
        if (user) {
            // Usuário está logado - mostrar menu do usuário
            if (loginLink) loginLink.style.display = 'none';
            if (cadastroLink) cadastroLink.style.display = 'none';
            
            if (userNameSpan) {
                userNameSpan.textContent = user.name.split(' ')[0]; // Primeiro nome
            }
            
            if (userMenu) {
                userMenu.style.display = 'block';
            }
            
            // Adicionar link para dashboard baseado no tipo de usuário
            this.addDashboardLink();
            
        } else {
            // Usuário não está logado - mostrar links de login/cadastro
            if (loginLink) loginLink.style.display = 'block';
            if (cadastroLink) cadastroLink.style.display = 'block';
            
            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }
    }

    updateMobileNavigation() {
    const user = this.currentUser;
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileGuestMenu = document.getElementById('mobileGuestMenu');
    const mobileDashboardLink = document.getElementById('mobileDashboardLink');
    
    if (user) {
        // Usuário logado - mostrar menu mobile do usuário
        if (mobileUserMenu) mobileUserMenu.style.display = 'block';
        if (mobileGuestMenu) mobileGuestMenu.style.display = 'none';
        
        if (mobileDashboardLink) {
            const dashboardUrl = user.type === 'professional' ? 'profissional/dashboard.html' : 'cliente/dashboard.html';
            mobileDashboardLink.href = dashboardUrl;
        }
    } else {
        // Usuário não logado - mostrar menu mobile de convidado
        if (mobileUserMenu) mobileUserMenu.style.display = 'none';
        if (mobileGuestMenu) mobileGuestMenu.style.display = 'block';
    }

    this.updateMobileNavigation();
    }
    
    addDashboardLink() {
        // Verificar se já existe um link de dashboard
        if (document.querySelector('a[href*="dashboard"]')) return;
        
        const nav = document.querySelector('nav .hidden.md\\:flex, nav .flex.justify-between');
        if (!nav) return;
        
        const user = this.currentUser;
        const dashboardText = user.type === 'professional' ? 'Painel Profissional' : 'Meu Painel';
        const dashboardUrl = user.type === 'professional' ? 'profissional/dashboard.html' : 'cliente/dashboard.html';
        
        // Criar link do dashboard
        const dashboardLink = document.createElement('a');
        dashboardLink.href = dashboardUrl;
        dashboardLink.className = 'text-gray-800 hover:text-primary font-medium';
        dashboardLink.textContent = dashboardText;
        
        // Inserir antes do link de login
        const loginLink = nav.querySelector('a[href*="login.html"]');
        if (loginLink && loginLink.parentNode) {
            loginLink.parentNode.insertBefore(dashboardLink, loginLink);
        } else {
            nav.appendChild(dashboardLink);
        }
    }
    
    setupEventListeners() {
        // Logout global
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="logout"]') || e.target.closest('#logoutBtn')) {
                e.preventDefault();
                this.logout();
            }
        });
    }
    
    logout() {
        localStorage.removeItem('construja_current_user');
        this.currentUser = null;
        
        showAlert('Logout realizado com sucesso!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    
    isLoggedIn() {
        return this.currentUser !== null && this.currentUser.status === 'active';
    }
    
    getUserType() {
        return this.currentUser ? this.currentUser.type : null;
    }

    
}

// Inicializar sistema de auth globalmente
let authSystem;

// Função global de logout para ser usada em onclick
function logout() {
    if (authSystem) {
        authSystem.logout();
    } else {
        localStorage.removeItem('construja_current_user');
        window.location.href = 'index.html';
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthSystem();
});

// Adicione no auth-system.js
class MultiUserSystem {
    constructor() {
        this.currentProfile = null;
        this.availableProfiles = [];
        this.init();
    }
    
    init() {
        this.loadProfiles();
        this.showProfileSwitcher();
    }
    
    loadProfiles() {
        // Carregar todos os usuários do localStorage
        const users = JSON.parse(localStorage.getItem('construja_users') || '[]');
        this.availableProfiles = users;
        
        // Definir perfil atual
        const currentUser = JSON.parse(localStorage.getItem('construja_current_user'));
        this.currentProfile = currentUser;
    }
    
    showProfileSwitcher() {
        // Adicionar seletor de perfil na navegação
        if (this.availableProfiles.length > 1) {
            this.addProfileSelector();
        }
    }
    
    switchProfile(userId) {
        const newProfile = this.availableProfiles.find(user => user.id === userId);
        if (newProfile) {
            localStorage.setItem('construja_current_user', JSON.stringify(newProfile));
            this.currentProfile = newProfile;
            window.location.reload();
        }
    }
}

