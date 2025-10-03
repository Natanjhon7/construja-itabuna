// Script principal para o projeto Construjá

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ícones Feather
    feather.replace();
    
    // Configurar menu mobile
    setupMobileMenu();
    
    // Configurar animações de scroll
    setupScrollAnimations();
    
    // Configurar funcionalidades interativas
    setupInteractiveFeatures();
});

// Configuração do menu mobile
function setupMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            
            // Atualizar ícone do menu
            const menuIcon = menuButton.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                menuIcon.setAttribute('data-feather', 'x');
            } else {
                menuIcon.setAttribute('data-feather', 'menu');
            }
            feather.replace();
        });
    }
}

// Configuração de animações de scroll
function setupScrollAnimations() {
    // Observador de elementos para animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const elementsToAnimate = document.querySelectorAll('.service-card, .testimonial-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Configuração de funcionalidades interativas
function setupInteractiveFeatures() {
    // Adicionar classe de loading para botões de ação
    const actionButtons = document.querySelectorAll('a[href*="cadastro"]');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Adicionar feedback visual
            this.classList.add('loading');
            
            // Em um caso real, aqui seria feita a navegação ou requisição
            // Por enquanto, apenas removeremos a classe após um tempo
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });
    
    // Adicionar efeito de hover para cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Função utilitária para formatação de telefone
function formatPhoneNumber(phone) {
    // Implementação de formatação de telefone
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Função para validação de formulários (para futura implementação)
function validateForm(formData) {
    // Implementação de validação de formulário
    const errors = [];
    
    // Exemplo de validação
    if (!formData.name || formData.name.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    return errors;
}

// Exportar funções para uso global (se necessário)
window.Construja = {
    formatPhoneNumber,
    validateForm
};