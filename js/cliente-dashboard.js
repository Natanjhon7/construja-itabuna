// cliente-dashboard.js - Versão Corrigida
class ClientDashboard {
    constructor() {
        console.log('Iniciando ClientDashboard...');
        this.currentUser = getCurrentUser();
        this.clientData = null;
        
        if (!this.currentUser) {
            console.error('Usuário não encontrado!');
            this.redirectToLogin();
            return;
        }
        
        if (this.currentUser.type !== 'client') {
            console.error('Usuário não é cliente:', this.currentUser.type);
            this.redirectToLogin();
            return;
        }
        
        this.init();
    }
    
    init() {
        console.log('Inicializando dashboard para:', this.currentUser.name);
        this.loadClientData();
        this.updateUI();
        this.loadRecommendedProfessionals();
        this.setupEventListeners();
    }
    
    redirectToLogin() {
        // Usar setTimeout para evitar loops de redirecionamento
        setTimeout(() => {
            window.location.href = '../auth/login.html';
        }, 100);
    }
    
    loadClientData() {
        console.log('Carregando dados do cliente...');
        this.clientData = getClientData(this.currentUser.id);
        
        if (!this.clientData) {
            console.log('Criando novos dados para cliente...');
            this.clientData = {
                ...this.currentUser,
                jobsRequested: 0,
                jobsCompleted: 0,
                favoriteProfessionals: [],
                recentSearches: [],
                address: {
                    street: '',
                    neighborhood: '',
                    city: 'Itabuna',
                    state: 'BA'
                }
            };
            
            this.saveClientData();
        }
        
        console.log('Dados do cliente carregados:', this.clientData);
    }

    
    saveClientData() {
        const clients = JSON.parse(localStorage.getItem('construja_clients') || '[]');
        const existingIndex = clients.findIndex(client => client.id === this.clientData.id);
        
        if (existingIndex >= 0) {
            clients[existingIndex] = this.clientData;
        } else {
            clients.push(this.clientData);
        }
        
        localStorage.setItem('construja_clients', JSON.stringify(clients));
    }
    
    updateUI() {
        // Atualizar nome do usuário
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('welcomeName').textContent = this.currentUser.name.split(' ')[0]; // Primeiro nome
        
        // Atualizar estatísticas
        document.getElementById('jobsRequested').textContent = this.clientData.jobsRequested || 0;
        document.getElementById('jobsCompleted').textContent = this.clientData.jobsCompleted || 0;
        document.getElementById('favoriteCount').textContent = this.clientData.favoriteProfessionals?.length || 0;
        
        // Atualizar serviços recentes
        this.updateRecentServices();
        
    }

    // No método updateUI(), adicione:
updateRecentChats() {
    const userChats = chatSystem.chats.filter(chat => 
        chat.clientId === this.currentUser.id && chat.status === 'active'
    );
    
    const recentChatsContainer = document.getElementById('recentChats');
    if (!recentChatsContainer) return;
    
    if (userChats.length === 0) {
        recentChatsContainer.innerHTML = `
            <div class="text-center py-4">
                <i data-feather="message-circle" class="w-8 h-8 text-gray-300 mx-auto mb-2"></i>
                <p class="text-gray-500 text-sm">Nenhuma conversa ativa</p>
            </div>
        `;
    } else {
        const recentChats = userChats.slice(0, 3); // Últimos 3 chats
        recentChatsContainer.innerHTML = recentChats.map(chat => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const timeAgo = this.getTimeAgo(lastMessage.timestamp);
            
            return `
                <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300" 
                     onclick="chatSystem.abrirChat('${chat.id}')">
                    <div class="flex items-center justify-between mb-1">
                        <span class="font-medium text-gray-800">${chat.professionalName}</span>
                        <span class="text-xs text-gray-500">${timeAgo}</span>
                    </div>
                    <p class="text-sm text-gray-600 truncate">${lastMessage.content}</p>
                    <span class="inline-block mt-1 px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded">
                        ${chatSystem.getServiceDisplayName(chat.professionalService)}
                    </span>
                </div>
            `;
        }).join('');
    }
    
    feather.replace();
}

getTimeAgo(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
}
    
    updateRecentServices() {
        const recentServicesContainer = document.getElementById('recentServices');
        const contacts = JSON.parse(localStorage.getItem('construja_contacts') || '[]');
        const userContacts = contacts.filter(contact => contact.clientId === this.currentUser.id);
        
        if (userContacts.length === 0) {
            recentServicesContainer.innerHTML = `
                <div class="text-center py-8">
                    <i data-feather="briefcase" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                    <p class="text-gray-500">Nenhum serviço recente</p>
                    <a href="../profissionais.html" class="text-primary hover:underline mt-2 inline-block">Buscar profissionais</a>
                </div>
            `;
        } else {
            const recentContacts = userContacts.slice(0, 3); // Últimos 3 contatos
            recentServicesContainer.innerHTML = recentContacts.map(contact => {
                const professional = this.getProfessionalById(contact.professionalId);
                const statusBadge = this.getStatusBadge(contact.status);
                const date = new Date(contact.timestamp).toLocaleDateString('pt-BR');
                
                return `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                                <i data-feather="user" class="text-primary w-4 h-4"></i>
                            </div>
                            <div>
                                <p class="font-medium text-gray-800">${professional?.name || 'Profissional'}</p>
                                <p class="text-sm text-gray-500">${date}</p>
                            </div>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${statusBadge.class}">
                            ${statusBadge.text}
                        </span>
                    </div>
                `;
            }).join('');
        }
        
        feather.replace();
    }
    
    loadRecommendedProfessionals() {
        const container = document.getElementById('recommendedProfessionals');
        const professionalsManager = new ProfessionalsManager();
        const approvedProfessionals = professionalsManager.getApprovedProfessionals();
        
        // Pegar os 3 primeiros profissionais aprovados
        const recommended = approvedProfessionals.slice(0, 3);
        
        if (recommended.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 col-span-full">
                    <i data-feather="users" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                    <p class="text-gray-500">Nenhum profissional disponível no momento</p>
                </div>
            `;
        } else {
            container.innerHTML = recommended.map(professional => 
                this.getRecommendedProfessionalCard(professional)
            ).join('');
        }
        
        feather.replace();
    }
    
    getRecommendedProfessionalCard(professional) {
        const serviceName = this.getServiceDisplayName(professional.service);
        
        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                        <i data-feather="user" class="text-primary w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800">${professional.name}</h4>
                        <p class="text-sm text-gray-600">${serviceName}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>${professional.experience || 0} anos exp.</span>
                    <span class="flex items-center">
                        <i data-feather="star" class="w-3 h-3 text-yellow-500 mr-1"></i>
                        ${professional.rating?.toFixed(1) || '0.0'}
                    </span>
                </div>
                <button onclick="clientDashboard.contactProfessional('${professional.id}')" 
                        class="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 text-sm">
                    Contratar
                </button>
            </div>
        `;
    }
    
    contactProfessional(professionalId) {
        const professional = this.getProfessionalById(professionalId);
        
        if (professional) {
            // Salvar contato
            const contacts = JSON.parse(localStorage.getItem('construja_contacts') || '[]');
            const contactRequest = {
                id: 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                professionalId: professional.id,
                clientId: this.currentUser.id,
                clientName: this.currentUser.name,
                professionalName: professional.name,
                timestamp: new Date().toISOString(),
                status: 'pending',
                service: professional.service
            };
            
            contacts.push(contactRequest);
            localStorage.setItem('construja_contacts', JSON.stringify(contacts));
            
            // Atualizar contador de jobs solicitados
            this.clientData.jobsRequested = (this.clientData.jobsRequested || 0) + 1;
            this.saveClientData();
            this.updateUI();
            
            showAlert(`Solicitação enviada para ${professional.name}!`, 'success');
        }
    }
    
    getProfessionalById(professionalId) {
        const professionals = JSON.parse(localStorage.getItem('construja_professionals') || '[]');
        return professionals.find(pro => pro.id === professionalId);
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
    
    getStatusBadge(status) {
        const statusMap = {
            'pending': { class: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
            'accepted': { class: 'bg-blue-100 text-blue-800', text: 'Aceito' },
            'in_progress': { class: 'bg-purple-100 text-purple-800', text: 'Em Andamento' },
            'completed': { class: 'bg-green-100 text-green-800', text: 'Concluído' },
            'cancelled': { class: 'bg-red-100 text-red-800', text: 'Cancelado' }
        };
        
        return statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: 'Desconhecido' };
    }
    
    setupEventListeners() {
        // Event listeners adicionais podem ser adicionados aqui
    }
}

// Inicializar dashboard quando o DOM estiver carregado
let clientDashboard;
document.addEventListener('DOMContentLoaded', function() {
    clientDashboard = new ClientDashboard();
});