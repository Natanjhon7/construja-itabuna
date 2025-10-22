// professionals.js - Versão Corrigida
class ProfessionalsManager {
    constructor() {
        console.log('=== PROFESSIONALS MANAGER INICIADO ===');
        this.professionals = this.loadProfessionals();
        console.log('Profissionais carregados:', this.professionals.length);
    }
    
    loadProfessionals() {
        const professionals = JSON.parse(localStorage.getItem('construja_professionals') || '[]');
        console.log('📦 Professionals no localStorage:', professionals.length);
        professionals.forEach((pro, i) => {
            console.log(`${i + 1}. ${pro.name} - ${pro.service} - Status: ${pro.status}`);
        });
        return professionals;
    }
    
    getApprovedProfessionals() {
        const approved = this.professionals.filter(pro => {
            const isApproved = pro.status === 'approved' && 
                             (pro.verificationStatus === 'approved' || !pro.verificationStatus);
            console.log(`🔍 ${pro.name}: ${pro.status} - ${isApproved ? '✅ APROVADO' : '❌ PENDENTE'}`);
            return isApproved;
        });
        
        console.log(`📊 Profissionais aprovados: ${approved.length} de ${this.professionals.length}`);
        return approved;
    }
    
    getProfessionalsByService(service) {
        const approved = this.getApprovedProfessionals();
        const filtered = approved.filter(pro => 
            pro.service.toLowerCase().includes(service.toLowerCase())
        );
        console.log(`🔧 Filtro por serviço "${service}": ${filtered.length} encontrados`);
        return filtered;
    }
    
    getProfessionalsByArea(area) {
        const approved = this.getApprovedProfessionals();
        const filtered = approved.filter(pro => 
            pro.workAreas && pro.workAreas.some(workArea => 
                workArea.toLowerCase().includes(area.toLowerCase())
            )
        );
        console.log(`🗺️ Filtro por área "${area}": ${filtered.length} encontrados`);
        return filtered;
    }
    
    getProfessionalById(id) {
        return this.professionals.find(pro => pro.id === id);
    }
    
    renderProfessionalsGrid(containerId, filter = {}) {
        console.log(`🎨 Renderizando grid em: ${containerId}`, filter);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container não encontrado: ${containerId}`);
            return;
        }
        
        let professionals = this.getApprovedProfessionals();
        console.log(`👥 Profissionais aprovados para render: ${professionals.length}`);
        
        // Aplicar filtros
        if (filter.service) {
            professionals = professionals.filter(pro => 
                pro.service === filter.service
            );
            console.log(`🔧 Após filtro de serviço "${filter.service}": ${professionals.length}`);
        }
        
        if (filter.area) {
            professionals = professionals.filter(pro =>
                pro.workAreas && pro.workAreas.includes(filter.area)
            );
            console.log(`🗺️ Após filtro de área "${filter.area}": ${professionals.length}`);
        }
        
        if (professionals.length === 0) {
            container.innerHTML = this.getEmptyStateHTML(filter);
            console.log('📭 Grid vazio - mostrando estado vazio');
        } else {
            container.innerHTML = professionals.map(professional => 
                this.getProfessionalCardHTML(professional)
            ).join('');
            console.log(`✅ Grid renderizado com ${professionals.length} profissionais`);
        }
        
        // Inicializar feather icons nos cards
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    getProfessionalCardHTML(professional) {
        const profilePhoto = professional.documents?.profilePhoto || '../static/default-avatar.png';
        const serviceName = this.getServiceDisplayName(professional.service);
        
        console.log(`🖼️ Gerando card para: ${professional.name}`);
        
        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden professional-card hover:shadow-lg transition-shadow duration-300">
                <div class="relative">
                    <img src="${profilePhoto}" 
                         alt="${professional.name}" 
                         class="w-full h-48 object-cover bg-gray-200">
                    <div class="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${serviceName}
                    </div>
                    ${professional.rating ? `
                        <div class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm flex items-center">
                            <i data-feather="star" class="w-3 h-3 mr-1"></i>
                            ${professional.rating.toFixed(1)}
                        </div>
                    ` : ''}
                </div>
                
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2 text-gray-800">${professional.name}</h3>
                    
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                        ${professional.description || 'Profissional qualificado e experiente.'}
                    </p>
                    
                    <div class="flex items-center justify-between text-sm mb-3">
                        <span class="flex items-center text-gray-500">
                            <i data-feather="briefcase" class="w-4 h-4 mr-1"></i>
                            ${professional.experience || 0} ano${(professional.experience || 0) !== 1 ? 's' : ''}
                        </span>
                        <span class="flex items-center text-gray-500">
                            <i data-feather="check-circle" class="w-4 h-4 mr-1 text-green-500"></i>
                            ${professional.completedJobs || 0} jobs
                        </span>
                    </div>
                    
                    <div class="mb-3">
                        <p class="text-xs text-gray-500 mb-1">Atende em:</p>
                        <div class="flex flex-wrap gap-1">
                            ${(professional.workAreas || ['centro']).slice(0, 2).map(area => `
                                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${this.getAreaDisplayName(area)}</span>
                            `).join('')}
                            ${(professional.workAreas || []).length > 2 ? `
                                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">+${(professional.workAreas || []).length - 2}</span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <button class="mt-2 w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 font-medium flex items-center justify-center solicitar-servico-btn" 
                            data-professional-id="${professional.id}">
                        <i data-feather="message-circle" class="w-4 h-4 mr-2"></i>
                        Solicitar Serviço
                    </button>
                </div>
            </div>
        `;
    }
    
    getEmptyStateHTML(filter = {}) {
        let message = 'Nenhum profissional encontrado';
        let description = 'Não há profissionais disponíveis no momento.';
        
        if (filter.service) {
            message = `Nenhum ${this.getServiceDisplayName(filter.service)} encontrado`;
            description = `Não há profissionais de ${this.getServiceDisplayName(filter.service)} disponíveis no momento.`;
        }
        
        if (filter.area) {
            message = `Nenhum profissional na área ${this.getAreaDisplayName(filter.area)}`;
            description = `Não há profissionais disponíveis na área ${this.getAreaDisplayName(filter.area)} no momento.`;
        }
        
        return `
            <div class="col-span-full text-center py-12">
                <i data-feather="users" class="w-16 h-16 text-gray-300 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-500 mb-2">${message}</h3>
                <p class="text-gray-400 mb-4">${description}</p>
                <button onclick="window.location.href='../index.html'" class="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                    Voltar para serviços
                </button>
            </div>
        `;
    }
    
    getServiceDisplayName(service) {
        const services = {
            'pedreiro': 'Pedreiro',
            'pintor': 'Pintor',
            'eletricista': 'Eletricista',
            'encanador': 'Encanador',
            'outro': 'Outro Serviço'
        };
        return services[service] || service;
    }
    
    getAreaDisplayName(area) {
        const areas = {
            'centro': 'Centro',
            'jardim_primavera': 'Jardim Primavera',
            'sao_caetano': 'São Caetano',
            'fatima': 'Fátima',
            'jardim_vitoria': 'Jardim Vitória',
            'sao_pedro': 'São Pedro',
            'outros': 'Outras Áreas'
        };
        return areas[area] || area;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO PROFESSIONALS MANAGER ===');
    const professionalsManager = new ProfessionalsManager();
    window.professionalsManager = professionalsManager; // Tornar global para debug
    
    // Renderizar profissionais na página principal
    if (document.getElementById('professionalsGrid')) {
        console.log('🎯 Renderizando professionalsGrid');
        professionalsManager.renderProfessionalsGrid('professionalsGrid');
    }
    
    // Renderizar na página de todos os profissionais
    if (document.getElementById('allProfessionalsGrid')) {
        console.log('🎯 Renderizando allProfessionalsGrid');
        professionalsManager.renderProfessionalsGrid('allProfessionalsGrid');
    }
    
    // Adicionar event listeners para botões de contato
    document.addEventListener('click', function(e) {
        if (e.target.closest('.solicitar-servico-btn')) {
            const professionalId = e.target.closest('.solicitar-servico-btn').getAttribute('data-professional-id');
            console.log('🔔 Botão clicado - Professional ID:', professionalId);
            
            if (window.chatSystem) {
                window.chatSystem.iniciarContato(professionalId);
            } else {
                console.error('❌ ChatSystem não disponível');
                alert('Sistema de chat não carregado. Recarregue a página.');
            }
        }
    });
    
    console.log('✅ Professionals Manager inicializado com sucesso!');
});