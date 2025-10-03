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
    
    if (clientForm) {
        clientForm.addEventListener('submit', handleClientRegistration);
    }
    
    if (professionalForm) {
        professionalForm.addEventListener('submit', handleProfessionalRegistration);
    }
}

// Handler para login
function handleLogin(e) {
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
    
    // Simular login
    loginUser(formData);
}

// Handler para cadastro de cliente
function handleClientRegistration(e) {
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
    
    // Simular cadastro
    registerUser(formData);
}

// Handler para cadastro de profissional
function handleProfessionalRegistration(e) {
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
    
    // Simular cadastro
    registerUser(formData);
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

// Validação de dados de cadastro
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

// Função de login (simulada)
function loginUser(userData) {
    const submitButton = document.querySelector('.login-submit-btn');
    
    // Mostrar loading
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;
    
    // Simular requisição API
    setTimeout(() => {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        
        // Simular resposta da API
        const success = Math.random() > 0.2; // 80% de chance de sucesso
        
        if (success) {
            showAlert('Login realizado com sucesso! Redirecionando...', 'success');
            
            // Redirecionar após sucesso
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            showAlert('E-mail ou senha incorretos. Tente novamente.', 'error');
        }
    }, 1500);
}

// Função de cadastro (simulada)
function registerUser(userData) {
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Mostrar loading
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;
    
    // Simular requisição API
    setTimeout(() => {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        
        showAlert('Cadastro realizado com sucesso! Redirecionando...', 'success');
        
        // Redirecionar após sucesso
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }, 1500);
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
    }
};