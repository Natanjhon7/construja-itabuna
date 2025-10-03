// Script específico para páginas de autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades baseadas na página atual
    initAuthPage();
});

// Inicializar funcionalidades da página de autenticação
function initAuthPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Funcionalidades comuns a todas as páginas de auth
    initMobileMenu();
    
    // Funcionalidades específicas por página
    if (currentPage === 'login.html' || currentPage === 'login') {
        initLoginPage();
    } else if (currentPage === 'cadastro.html' || currentPage === 'cadastro') {
        initRegistrationPage();
    } else if (currentPage === 'cadastro-profissional.html') {
        initProfessionalRegistrationPage();
    }
}

// Inicializar página de login
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Adicionar animação de entrada
    const loginCard = document.querySelector('.max-w-md');
    if (loginCard) {
        loginCard.classList.add('animate-slide-in-up');
    }
}

// Inicializar página de cadastro
function initRegistrationPage() {
    initTabSwitching();
    initFormValidation();
    initPhoneMasks();
    
    // Adicionar animação de entrada
    const registerCard = document.querySelector('.max-w-md');
    if (registerCard) {
        registerCard.classList.add('animate-slide-in-up');
    }
}

// Inicializar página de cadastro profissional
function initProfessionalRegistrationPage() {
    initFormValidation();
    initPhoneMasks();
    initCPFMask();
    
    // Adicionar animação de entrada
    const registerCard = document.querySelector('.max-w-3xl');
    if (registerCard) {
        registerCard.classList.add('animate-slide-in-up');
    }
}

// Funcionalidade de troca de abas (para cadastro)
function initTabSwitching() {
    const clientTab = document.getElementById('clientTab');
    const professionalTab = document.getElementById('professionalTab');
    const clientForm = document.getElementById('clientForm');
    const professionalForm = document.getElementById('professionalForm');
    
    if (clientTab && professionalTab) {
        clientTab.addEventListener('click', function() {
            switchToTab('client');
        });
        
        professionalTab.addEventListener('click', function() {
            switchToTab('professional');
        });
    }
}

function switchToTab(tabType) {
    const clientTab = document.getElementById('clientTab');
    const professionalTab = document.getElementById('professionalTab');
    const clientForm = document.getElementById('clientForm');
    const professionalForm = document.getElementById('professionalForm');
    
    if (tabType === 'client') {
        clientTab.classList.add('active', 'border-primary', 'text-primary');
        clientTab.classList.remove('border-transparent', 'text-gray-500');
        professionalTab.classList.add('border-transparent', 'text-gray-500');
        professionalTab.classList.remove('active', 'border-primary', 'text-primary');
        
        clientForm.classList.remove('hidden');
        clientForm.classList.add('active');
        professionalForm.classList.add('hidden');
        professionalForm.classList.remove('active');
    } else {
        professionalTab.classList.add('active', 'border-primary', 'text-primary');
        professionalTab.classList.remove('border-transparent', 'text-gray-500');
        clientTab.classList.add('border-transparent', 'text-gray-500');
        clientTab.classList.remove('active', 'border-primary', 'text-primary');
        
        professionalForm.classList.remove('hidden');
        professionalForm.classList.add('active');
        clientForm.classList.add('hidden');
        clientForm.classList.remove('active');
    }
}

// Validação de formulários (para cadastro)
function initFormValidation() {
    const clientForm = document.getElementById('clientRegistrationForm');
    const professionalForm = document.getElementById('professionalRegistrationForm');
    const professionalFullForm = document.getElementById('professionalRegistrationFullForm');
    
    if (clientForm) {
        clientForm.addEventListener('submit', handleClientRegistration);
    }
    
    if (professionalForm) {
        professionalForm.addEventListener('submit', handleProfessionalRegistration);
    }
    
    if (professionalFullForm) {
        professionalFullForm.addEventListener('submit', handleProfessionalFullRegistration);
    }
}

// Handler para login - AGORA COM VERCELL AUTH
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    const errors = validateLoginData(formData);
    
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'error');
        return;
    }
    
    // USAR VERCELL AUTH - CADASTRO REAL
    await loginUser(formData);
}

// Handler para cadastro de cliente - AGORA COM VERCELL AUTH
async function handleClientRegistration(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        type: 'client'
    };
    
    const errors = validateFormData(formData);
    
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'error');
        return;
    }
    
    // USAR VERCELL AUTH - CADASTRO REAL
    await registerUser(formData);
}

// Handler para cadastro de profissional (form simples) - AGORA COM VERCELL AUTH
async function handleProfessionalRegistration(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('proName').value,
        email: document.getElementById('proEmail').value,
        phone: document.getElementById('proPhone').value,
        service: document.getElementById('proService').value,
        password: document.getElementById('proPassword').value,
        type: 'professional'
    };
    
    const errors = validateFormData(formData);
    
    // Validação adicional para profissional
    if (!formData.service) {
        errors.push('Selecione o serviço oferecido');
    }
    
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'error');
        return;
    }
    
    // USAR VERCELL AUTH - CADASTRO REAL
    await registerUser(formData);
}

// Handler para cadastro profissional COMPLETO - AGORA COM VERCELL AUTH
async function handleProfessionalFullRegistration(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('proName').value,
        cpf: document.getElementById('proCpf').value,
        email: document.getElementById('proEmail').value,
        phone: document.getElementById('proPhone').value,
        birthDate: document.getElementById('proBirth').value,
        password: document.getElementById('proPassword').value,
        service: document.getElementById('proService').value,
        experience: document.getElementById('proExperience').value,
        description: document.getElementById('proDescription').value,
        workAreas: Array.from(document.querySelectorAll('input[name="workAreas"]:checked')).map(cb => cb.value),
        terms: document.getElementById('terms').checked,
        type: 'professional'
    };
    
    const errors = validateProfessionalFormData(formData);
    
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'error');
        return;
    }
    
    // USAR VERCELL AUTH - CADASTRO REAL
    await registerUser(formData);
}

// Validação de dados de login
function validateLoginData(data) {
    const errors = [];
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('E-mail inválido');
    }
    
    if (!data.password) {
        errors.push('Senha é obrigatória');
    }
    
    return errors;
}

// Validação de dados de cadastro básico
function validateFormData(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('E-mail inválido');
    }
    
    if (!data.phone || data.phone.length < 10) {
        errors.push('Telefone inválido');
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    return errors;
}

// Validação de dados de cadastro profissional COMPLETO
function validateProfessionalFormData(data) {
    const errors = validateFormData(data);
    
    // Validações específicas do profissional
    if (!data.cpf || !isValidCPF(data.cpf)) {
        errors.push('CPF inválido');
    }
    
    if (!data.birthDate || !isValidBirthDate(data.birthDate)) {
        errors.push('Data de nascimento inválida (deve ser maior de 18 anos)');
    }
    
    if (!data.service) {
        errors.push('Selecione o serviço principal');
    }
    
    if (!data.experience || data.experience < 0) {
        errors.push('Anos de experiência inválidos');
    }
    
    if (!data.description || data.description.length < 10) {
        errors.push('Descrição deve ter pelo menos 10 caracteres');
    }
    
    if (!data.workAreas || data.workAreas.length === 0) {
        errors.push('Selecione pelo menos uma área de atuação');
    }
    
    if (!data.terms) {
        errors.push('Você deve aceitar os termos e condições');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
}

function isValidBirthDate(date) {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    return age >= 18 && age <= 100;
}

// Máscara de telefone
function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
            
            e.target.value = value;
        });
    });
}

// Máscara de CPF
function initCPFMask() {
    const cpfInput = document.getElementById('proCpf');
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
            }
            
            e.target.value = value;
        });
    }
}

// Menu mobile
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Atualizar ícone
            const menuIcon = menuButton.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.setAttribute('data-feather', 'menu');
            } else {
                menuIcon.setAttribute('data-feather', 'x');
            }
            feather.replace();
        });
    }
}

// ========== FUNÇÕES PRINCIPAIS ATUALIZADAS ==========

// Função de login - AGORA COM VERCELL AUTH REAL
async function loginUser(userData) {
    const submitButton = document.querySelector('.login-submit-btn');
    
    // Mostrar loading
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;

    try {
        // USAR O VERCELL AUTH - LOGIN REAL
        const result = await window.vercelAuth.loginUser(userData.email, userData.password);
        
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;

        if (result.success) {
            showAlert('Login realizado com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        showAlert('Erro inesperado. Tente novamente.', 'error');
    }
}

// Função de cadastro - AGORA COM VERCELL AUTH REAL
async function registerUser(userData) {
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Mostrar loading
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;

    try {
        // USAR O VERCELL AUTH - CADASTRO REAL
        const result = await window.vercelAuth.registerUser(userData);
        
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;

        if (result.success) {
            // Se for profissional completo, cadastrar dados específicos
            if (userData.type === 'professional' && userData.experience !== undefined) {
                await window.vercelAuth.registerProfessional(result.user.id, userData);
            }

            showAlert('Cadastro realizado com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            showAlert(result.error, 'error');
        }
    } catch (error) {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        showAlert('Erro inesperado. Tente novamente.', 'error');
    }
}

// Sistema de alertas
function showAlert(message, type) {
    // Remover alertas existentes
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Criar novo alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-message alert-${type}`;
    alertDiv.innerHTML = message;
    
    // Inserir antes do formulário
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(alertDiv, form);
    }
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Verificar se usuário está logado
function checkAuthStatus() {
    const currentUser = window.vercelAuth ? window.vercelAuth.getCurrentUser() : null;
    if (currentUser) {
        console.log('👤 Usuário logado:', currentUser.email);
        return currentUser;
    }
    return null;
}

// Logout
function logoutUser() {
    if (window.vercelAuth) {
        window.vercelAuth.logout();
    }
    window.location.href = 'auth/login.html';
}

// Utilidades para outras páginas
window.AuthUtils = {
    validateEmail: isValidEmail,
    showAlert: showAlert,
    formatPhone: function(phone) {
        let value = phone.replace(/\D/g, '');
        if (value.length <= 10) {
            return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            return value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    },
    checkAuthStatus: checkAuthStatus,
    logoutUser: logoutUser
};

// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuthStatus();
    if (user) {
        console.log('✅ Usuário autenticado:', user.name);
        // Aqui você pode atualizar a UI para mostrar que está logado
        // Ex: mostrar nome do usuário, botão de logout, etc.
    }
});