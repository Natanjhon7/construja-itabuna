// professionals-page.js
class ProfessionalsPage {
    constructor() {
        this.professionalsManager = new ProfessionalsManager();
        this.currentPage = 1;
        this.professionalsPerPage = 8;
        this.filters = {};
        this.init();
    }
    
    init() {
        this.renderProfessionals();
        this.setupEventListeners();
        this.updateResultsCount();
    }
    
    setupEventListeners() {
        // Filtros
        document.getElementById('serviceFilter').addEventListener('change', (e) => {
            this.filters.service = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('areaFilter').addEventListener('change', (e) => {
            this.filters.area = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('experienceFilter').addEventListener('change', (e) => {
            this.filters.minExperience = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('sortFilter').addEventListener('change', (e) => {
            this.filters.sortBy = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });
    }
    
    applyFilters() {
        this.currentPage = 1;
        this.renderProfessionals();
        this.updateResultsCount();
    }
    
    clearFilters() {
        this.filters = {};
        document.getElementById('serviceFilter').value = '';
        document.getElementById('areaFilter').value = '';
        document.getElementById('experienceFilter').value = '';
        document.getElementById('sortFilter').value = 'rating';
        this.applyFilters();
    }
    
    renderProfessionals() {
        let professionals = this.professionalsManager.getApprovedProfessionals();
        
        // Aplicar filtros
        professionals = this.filterProfessionals(professionals);
        
        // Ordenar
        professionals = this.sortProfessionals(professionals);
        
        // Paginação
        const startIndex = (this.currentPage - 1) * this.professionalsPerPage;
        const endIndex = startIndex + this.professionalsPerPage;
        const paginatedProfessionals = professionals.slice(startIndex, endIndex);
        
        const container = document.getElementById('allProfessionalsGrid');
        
        if (paginatedProfessionals.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
        } else {
            container.innerHTML = paginatedProfessionals.map(pro => 
                this.professionalsManager.getProfessionalCardHTML(pro)
            ).join('');
        }
        
        this.renderPagination(professionals.length);
        feather.replace();
        
        // Adicionar event listeners para os botões de contato
        this.addContactEventListeners();
    }
    
    filterProfessionals(professionals) {
        return professionals.filter(pro => {
            if (this.filters.service && pro.service !== this.filters.service) return false;
            if (this.filters.area && !pro.workAreas.includes(this.filters.area)) return false;
            if (this.filters.minExperience && pro.experience < parseInt(this.filters.minExperience)) return false;
            return true;
        });
    }
    
    sortProfessionals(professionals) {
        const sortBy = this.filters.sortBy || 'rating';
        
        return professionals.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'experience':
                    return (b.experience || 0) - (a.experience || 0);
                case 'jobs':
                    return (b.completedJobs || 0) - (a.completedJobs || 0);
                default:
                    return 0;
            }
        });
    }
    
    renderPagination(totalProfessionals) {
        const totalPages = Math.ceil(totalProfessionals / this.professionalsPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = `
            <div class="flex space-x-2">
                <button class="px-3 py-2 border rounded-md ${this.currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}" 
                        ${this.currentPage === 1 ? 'disabled' : ''} 
                        onclick="professionalsPage.previousPage()">
                    Anterior
                </button>
        `;
        
        // Mostrar até 5 páginas
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="px-3 py-2 border rounded-md ${this.currentPage === i ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}" 
                        onclick="professionalsPage.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        paginationHTML += `
                <button class="px-3 py-2 border rounded-md ${this.currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}" 
                        ${this.currentPage === totalPages ? 'disabled' : ''} 
                        onclick="professionalsPage.nextPage()">
                    Próxima
                </button>
            </div>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderProfessionals();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.getFilteredProfessionals().length / this.professionalsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderProfessionals();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderProfessionals();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    updateResultsCount() {
        const count = this.getFilteredProfessionals().length;
        const resultsElement = document.getElementById('resultsCount');
        resultsElement.textContent = `${count} profissional${count !== 1 ? 'es' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
    
    getFilteredProfessionals() {
        let professionals = this.professionalsManager.getApprovedProfessionals();
        professionals = this.filterProfessionals(professionals);
        return this.sortProfessionals(professionals);
    }
    
    getEmptyStateHTML() {
        return `
            <div class="col-span-full text-center py-12">
                <i data-feather="search" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-500 mb-2">Nenhum profissional encontrado</h3>
                <p class="text-gray-400 mb-4">Tente ajustar os filtros para ver mais resultados.</p>
                <button onclick="professionalsPage.clearFilters()" class="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                    Limpar filtros
                </button>
            </div>
        `;
    }
    
    addContactEventListeners() {
        // Adicionar event listeners para os botões de contato
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const professionalId = e.target.closest('.contact-btn').getAttribute('data-professional-id');
                this.handleContactProfessional(professionalId);
            });
        });
    }
    
    handleContactProfessional(professionalId) {
        const professional = this.professionalsManager.getProfessionalById(professionalId);
        
        if (professional) {
            // Verificar se usuário está logado
            const currentUser = JSON.parse(localStorage.getItem('construja_current_user'));
            
            if (!currentUser) {
                this.showAlert('Para contratar um profissional, faça login primeiro.', 'info');
                setTimeout(() => {
                    window.location.href = 'auth/login.html';
                }, 2000);
                return;
            }
            
            this.showAlert(`Contato iniciado com ${professional.name}! Em breve ele responderá.`, 'success');
            
            // Salvar solicitação de contato
            this.saveContactRequest({
                professionalId: professional.id,
                clientId: currentUser.id,
                clientName: currentUser.name,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
        }
    }
    
    saveContactRequest(contactRequest) {
        const contacts = JSON.parse(localStorage.getItem('construja_contacts') || '[]');
        contacts.push({
            ...contactRequest,
            id: 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        });
        localStorage.setItem('construja_contacts', JSON.stringify(contacts));
    }
    
    showAlert(message, type = 'info') {
        // Remove alertas anteriores
        const existingAlerts = document.querySelectorAll('.custom-alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert fixed top-4 right-4 p-4 rounded-md text-white z-50 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        }`;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Inicializar quando o DOM estiver carregado
let professionalsPage;
document.addEventListener('DOMContentLoaded', function() {
    professionalsPage = new ProfessionalsPage();
});