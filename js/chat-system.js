// chat-system.js - Sistema completo para clientes e profissionais
class ChatSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('construja_current_user'));
        this.chats = JSON.parse(localStorage.getItem('construja_chats') || '[]');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateChatUI();
    }
    
    setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Event listener para clientes solicitarem serviço
    document.addEventListener('click', (e) => {
        console.log('Clique detectado:', e.target);
        
        const contactBtn = e.target.closest('.contact-btn') || 
                          e.target.closest('.solicitar-servico-btn') ||
                          e.target.closest('.contratar-btn');
        
        if (contactBtn) {
            console.log('Botão de contato clicado!');
            const professionalId = contactBtn.getAttribute('data-professional-id');
            console.log('Professional ID:', professionalId);
            this.iniciarContato(professionalId);
        }
        });
    }
    
    updateChatUI() {
        // Adicionar botão de solicitações para profissionais
        if (this.currentUser && this.currentUser.type === 'professional') {
            this.adicionarBotaoSolicitacoes();
        }
    }
    
    adicionarBotaoSolicitacoes() {
        // Verificar se já existe o botão
        if (document.getElementById('solicitacoesBtn')) return;
        
        const nav = document.querySelector('nav .hidden.md\\:flex, nav .flex.justify-between');
        if (!nav) return;
        
        const solicitacoesCount = this.getSolicitacoesPendentes().length;
        
        const solicitacoesBtn = document.createElement('button');
        solicitacoesBtn.id = 'solicitacoesBtn';
        solicitacoesBtn.className = 'flex items-center space-x-1 text-gray-800 hover:text-primary font-medium relative';
        solicitacoesBtn.innerHTML = `
            <i data-feather="message-circle"></i>
            <span>Solicitações</span>
            ${solicitacoesCount > 0 ? `
                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ${solicitacoesCount}
                </span>
            ` : ''}
        `;
        solicitacoesBtn.onclick = () => this.mostrarSolicitacoes();
        
        // Inserir antes do menu do usuário
        const userMenu = document.getElementById('userMenu');
        if (userMenu && userMenu.parentNode) {
            userMenu.parentNode.insertBefore(solicitacoesBtn, userMenu);
        } else {
            nav.appendChild(solicitacoesBtn);
        }
        
        feather.replace();
    }
    
    iniciarContato(professionalId) {
    console.log('=== INICIAR CONTATO ===');
    console.log('Professional ID recebido:', professionalId);
    
    // Verificação simplificada
    if (!this.currentUser) {
        console.log('Usuário não logado - redirecionando...');
        showAlert('Para solicitar um serviço, faça login primeiro.', 'info');
        setTimeout(() => {
            window.location.href = 'auth/login.html';
        }, 2000);
        return;
    }
    
    console.log('Usuário logado:', this.currentUser.name, 'Tipo:', this.currentUser.type);
    
    // Verificar se é cliente
    if (this.currentUser.type !== 'client') {
        console.log('Usuário não é cliente:', this.currentUser.type);
        showAlert('Apenas clientes podem solicitar serviços. Faça login como cliente para contratar.', 'warning');
        return;
    }
    
    const professional = this.getProfessionalById(professionalId);
    console.log('Profissional encontrado:', professional);
    
    if (!professional) {
        console.log('Profissional não encontrado com ID:', professionalId);
        showAlert('Profissional não encontrado.', 'error');
        return;
    }
    
    // Verificar se já existe um chat
    const existingChat = this.getChat(this.currentUser.id, professionalId);
    console.log('Chat existente:', existingChat);
    
    if (existingChat) {
        console.log('Abrindo chat existente:', existingChat.id);
        this.abrirChat(existingChat.id);
    } else {
        console.log('Criando novo chat com:', professional.name);
        this.criarNovoChat(professional);
    }
}
    
    criarNovoChat(professional) {
        const chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const novoChat = {
            id: chatId,
            clientId: this.currentUser.id,
            clientName: this.currentUser.name,
            professionalId: professional.id,
            professionalName: professional.name,
            professionalService: professional.service,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
                {
                    id: 'msg_' + Date.now(),
                    senderId: this.currentUser.id,
                    senderName: this.currentUser.name,
                    content: `Olá! Gostaria de solicitar um serviço de ${this.getServiceDisplayName(professional.service)}. Podemos conversar?`,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                }
            ],
            serviceDetails: {
                type: professional.service,
                description: '',
                budget: null,
                deadline: null,
                status: 'requested'
            }
        };
        
        this.chats.push(novoChat);
        this.saveChats();
        
        showAlert(`Solicitação enviada para ${professional.name}!`, 'success');
        
        // Abrir o chat automaticamente
        this.abrirChat(chatId);
        
        // Atualizar contador de jobs do cliente
        this.atualizarContadorCliente();
    }
    
    abrirChat(chatId) {
        // Aqui você pode implementar a abertura do modal de chat
        this.mostrarModalChat(chatId);
    }
    
    mostrarModalChat(chatId) {
        const chat = this.getChatById(chatId);
        if (!chat) return;
        
        // Criar modal de chat
        this.criarModalChat(chat);
    }
    
    criarModalChat(chat) {
        // Remover modal existente
        const existingModal = document.getElementById('chatModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modalHTML = `
            <div id="chatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg w-full max-w-2xl h-96 flex flex-col">
                    <!-- Cabeçalho do Chat -->
                    <div class="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div class="flex items-center">
                            <i data-feather="message-circle" class="mr-2"></i>
                            <h3 class="font-semibold">Conversa com ${chat.professionalName}</h3>
                            <span class="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                                ${this.getServiceDisplayName(chat.professionalService)}
                            </span>
                        </div>
                        <button onclick="chatSystem.fecharChat()" class="text-white hover:text-gray-200">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    
                    <!-- Área de Mensagens -->
                    <div class="flex-1 p-4 overflow-y-auto bg-gray-50" id="chatMessages">
                        ${this.renderMessages(chat.messages)}
                    </div>
                    
                    <!-- Input de Mensagem -->
                    <div class="border-t p-4">
                        <div class="flex space-x-2">
                            <input type="text" 
                                   id="messageInput" 
                                   placeholder="Digite sua mensagem..." 
                                   class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                            <button onclick="chatSystem.enviarMensagem('${chat.id}')" 
                                    class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                                <i data-feather="send" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        feather.replace();
        
        // Focar no input
        document.getElementById('messageInput').focus();
        
        // Rolagem automática para a última mensagem
        this.scrollToBottom();
    }
    
    renderMessages(messages) {
        return messages.map(msg => `
            <div class="mb-4 ${msg.senderId === this.currentUser.id ? 'text-right' : 'text-left'}">
                <div class="inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === this.currentUser.id ? 'bg-primary text-white' : 'bg-white border border-gray-200'}">
                    <p class="text-sm">${msg.content}</p>
                    <p class="text-xs opacity-70 mt-1">${this.formatTime(msg.timestamp)}</p>
                </div>
            </div>
        `).join('');
    }
    
    // NOVAS FUNÇÕES PARA PROFISSIONAIS
    mostrarSolicitacoes() {
        const solicitacoes = this.getSolicitacoesPendentes();
        
        const modalHTML = `
            <div id="solicitacoesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg w-full max-w-2xl max-h-96 overflow-hidden flex flex-col">
                    <div class="bg-primary text-white p-4 flex justify-between items-center">
                        <h3 class="font-semibold flex items-center">
                            <i data-feather="message-circle" class="mr-2"></i>
                            Minhas Solicitações (${solicitacoes.length})
                        </h3>
                        <button onclick="this.closest('#solicitacoesModal').remove()" class="text-white hover:text-gray-200">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-4">
                        ${solicitacoes.length === 0 ? `
                            <div class="text-center py-8">
                                <i data-feather="inbox" class="w-12 h-12 text-gray-300 mx-auto mb-3"></i>
                                <p class="text-gray-500">Nenhuma solicitação pendente</p>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${solicitacoes.map(chat => `
                                    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition duration-300"
                                         onclick="chatSystem.abrirChat('${chat.id}')">
                                        <div class="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 class="font-semibold text-gray-800">${chat.clientName}</h4>
                                                <p class="text-sm text-gray-600">${this.getServiceDisplayName(chat.professionalService)}</p>
                                            </div>
                                            <span class="text-xs text-gray-500">${this.formatDate(chat.createdAt)}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <p class="text-sm text-gray-700 truncate flex-1 mr-2">
                                                ${chat.messages[0]?.content || 'Nova solicitação'}
                                            </p>
                                            <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                ${chat.messages.length} msg
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        feather.replace();
    }

    
    
    getSolicitacoesPendentes() {
        if (!this.currentUser || this.currentUser.type !== 'professional') {
            return [];
        }
        
        return this.chats.filter(chat => 
            chat.professionalId === this.currentUser.id && 
            chat.status === 'active'
        );
    }
    
    // Atualizar a função enviarMensagem para profissionais
    enviarMensagem(chatId) {
        const input = document.getElementById('messageInput');
        const content = input.value.trim();
        
        if (!content) return;
        
        const chat = this.getChatById(chatId);
        if (!chat) return;
        
        // Verificar se o usuário tem permissão para enviar mensagem neste chat
        if (!this.usuarioPodeEnviarMensagem(chat)) {
            showAlert('Você não tem permissão para enviar mensagens neste chat.', 'error');
            return;
        }
        
        const novaMensagem = {
            id: 'msg_' + Date.now(),
            senderId: this.currentUser.id,
            senderName: this.currentUser.name,
            content: content,
            timestamp: new Date().toISOString(),
            type: 'text',
            read: false
        };
        
        chat.messages.push(novaMensagem);
        chat.updatedAt = new Date().toISOString();
        
        this.saveChats();
        
        // Atualizar a exibição das mensagens
        document.getElementById('chatMessages').innerHTML = this.renderMessages(chat.messages);
        
        // Limpar input e rolar para baixo
        input.value = '';
        this.scrollToBottom();
        
        // Não simular resposta automática se for o profissional respondendo
        if (this.currentUser.type === 'professional') {
            // Marcar mensagens do cliente como lidas
            this.marcarMensagensComoLidas(chat);
        } else {
            // Cliente enviando - simular resposta do profissional
            this.simularRespostaProfissional(chat);
        }
    }
    
    usuarioPodeEnviarMensagem(chat) {
        return chat.clientId === this.currentUser.id || 
               chat.professionalId === this.currentUser.id;
    }
    
    marcarMensagensComoLidas(chat) {
        chat.messages.forEach(msg => {
            if (msg.senderId !== this.currentUser.id) {
                msg.read = true;
            }
        });
        this.saveChats();
    }
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    simularRespostaProfissional(chat) {
        setTimeout(() => {
            const respostas = [
                "Olá! Obrigado pelo seu interesse. Poderia me dar mais detalhes sobre o serviço?",
                "Claro! Em que posso ajudá-lo?",
                "Perfeito! Quando gostaria que o serviço fosse realizado?",
                "Entendi. Posso fazer uma visita técnica para orçamento?",
                "Ótimo! Trabalho nessa área há anos. Podemos combinar os detalhes?"
            ];
            
            const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
            
            const resposta = {
                id: 'msg_' + Date.now(),
                senderId: chat.professionalId,
                senderName: chat.professionalName,
                content: respostaAleatoria,
                timestamp: new Date().toISOString(),
                type: 'text'
            };
            
            chat.messages.push(resposta);
            chat.updatedAt = new Date().toISOString();
            
            this.saveChats();
            
            // Atualizar a exibição se o chat ainda estiver aberto
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = this.renderMessages(chat.messages);
                this.scrollToBottom();
            }
            
        }, 2000); // Resposta após 2 segundos
    }
    
    fecharChat() {
        const modal = document.getElementById('chatModal');
        if (modal) {
            modal.remove();
        }
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    getChat(clientId, professionalId) {
        return this.chats.find(chat => 
            chat.clientId === clientId && 
            chat.professionalId === professionalId && 
            chat.status === 'active'
        );
    }
    
    getChatById(chatId) {
        return this.chats.find(chat => chat.id === chatId);
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
    
    atualizarContadorCliente() {
        const clients = JSON.parse(localStorage.getItem('construja_clients') || '[]');
        const client = clients.find(cli => cli.id === this.currentUser.id);
        
        if (client) {
            client.jobsRequested = (client.jobsRequested || 0) + 1;
            localStorage.setItem('construja_clients', JSON.stringify(clients));
        }
    }
    
    saveChats() {
        localStorage.setItem('construja_chats', JSON.stringify(this.chats));
    }
    
    // Estatísticas para dashboard
    getChatStats(userId, userType) {
        const userChats = this.chats.filter(chat => {
            if (userType === 'client') {
                return chat.clientId === userId;
            } else {
                return chat.professionalId === userId;
            }
        });
        
        return {
            total: userChats.length,
            active: userChats.filter(chat => chat.status === 'active').length,
            unread: userChats.filter(chat => {
                const lastMessage = chat.messages[chat.messages.length - 1];
                return lastMessage && lastMessage.senderId !== userId && !lastMessage.read;
            }).length
        };
    }
}

// Inicializar sistema de chat
let chatSystem;

document.addEventListener('DOMContentLoaded', function() {
    chatSystem = new ChatSystem();
});

// No final do chat-system.js, adicione:
console.log('ChatSystem carregado!');
console.log('Usuário atual:', chatSystem?.currentUser);
console.log('Chats existentes:', chatSystem?.chats?.length);

// No final do chat-system.js, adicione:
function debugChatSystem() {
    console.log('=== DEBUG CHAT SYSTEM ===');
    console.log('Current User:', chatSystem.currentUser);
    console.log('Chats:', chatSystem.chats);
    console.log('Professionals no localStorage:', JSON.parse(localStorage.getItem('construja_professionals') || '[]'));
    console.log('Users no localStorage:', JSON.parse(localStorage.getItem('construja_users') || '[]'));
    console.log('========================');
}

// Execute debugChatSystem() no console para ver o estado