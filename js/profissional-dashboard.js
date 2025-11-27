// profissional-dashboard.js
class ProfissionalDashboard {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('construja_current_user'));
        this.professionalData = null;
        this.init();
    }
    
    init() {
        this.loadProfessionalData();
        this.updateUI();
        this.loadRecentSolicitations();
    }
    
    loadProfessionalData() {
        const professionals = JSON.parse(localStorage.getItem('construja_professionals') || '[]');
        this.professionalData = professionals.find(pro => pro.id === this.currentUser.id);
        
        if (!this.professionalData) {
            this.professionalData = {
                ...this.currentUser,
                experience: 0,
                rating: 0,
                completedJobs: 0,
                revenue: 0
            };
        }
    }
    
    updateUI() {
        // Atualizar nome
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('welcomeName').textContent = this.currentUser.name.split(' ')[0];
        
        // Atualizar estatísticas
        const solicitacoesCount = chatSystem.getSolicitacoesPendentes().length;
        document.getElementById('solicitacoesCount').textContent = solicitacoesCount;
        document.getElementById('jobsCompleted').textContent = this.professionalData.completedJobs || 0;
        document.getElementById('averageRating').textContent = (this.professionalData.rating || 0).toFixed(1);
        document.getElementById('totalRevenue').textContent = `R$ ${(this.professionalData.revenue || 0).toLocaleString('pt-BR')}`;
    }
    
    loadRecentSolicitations() {
        const container = document.getElementById('recentSolicitations');
        const solicitacoes = chatSystem.getSolicitacoesPendentes().slice(0, 3); // Últimas 3
        
        if (solicitacoes.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-feather="inbox" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                    <p class="text-gray-500">Nenhuma solicitação recebida</p>
                    <p class="text-gray-400 text-sm mt-1">Seu perfil aparecerá para clientes buscando seu serviço</p>
                </div>
            `;
        } else {
            container.innerHTML = solicitacoes.map(chat => `
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-300">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-semibold text-gray-800">${chat.clientName}</h4>
                            <p class="text-sm text-gray-600">${chatSystem.getServiceDisplayName(chat.professionalService)}</p>
                        </div>
                        <span class="text-xs text-gray-500">${this.formatTimeAgo(chat.updatedAt)}</span>
                    </div>
                    
                    <p class="text-sm text-gray-700 mb-3 line-clamp-2">
                        "${chat.messages[0]?.content || 'Nova solicitação de serviço'}"
                    </p>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500">
                            ${chat.messages.length} mensagem${chat.messages.length !== 1 ? 'ens' : ''}
                        </span>
                        <button onclick="chatSystem.abrirChat('${chat.id}')" 
                                class="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition duration-300">
                            Responder
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        feather.replace();
    }
    
    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Agora mesmo';
        if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h atrás`;
        return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
    }
}

let profissionalDashboard;