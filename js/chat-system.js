// js/chat-system.js
class ChatSystem {
    constructor() {
        this.supabaseUrl = 'https://ocvkhwtbmpiltjbttsko.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdmtod3RibXBpbHRqYnR0c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzE5MzgsImV4cCI6MjA3OTg0NzkzOH0.Y6KFqQxs9l2fDziiURjtW3oZr6MWKZPNtyhT5-K7yGw';
        this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        
        this.currentUser = null;
        this.currentConversation = null;
        this.conversations = [];
        this.channel = null;
        
        this.initialize();
    }

    async initialize() {
        await this.checkAuth();
        if (this.currentUser) {
            await this.loadConversations();
            this.setupRealtimeSubscription();
        }
    }

    async checkAuth() {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (user) {
            const { data: usuario } = await this.supabase
                .from('usuarios')
                .select('*')
                .eq('id', user.id)
                .single();
            this.currentUser = usuario;
        }
    }

    // Configurar subscription em tempo real
    setupRealtimeSubscription() {
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
        }

        this.channel = this.supabase
            .channel('chat-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'mensagens',
                    filter: `conversa_id=in.(${this.conversations.map(c => c.id).join(',')})`
                },
                (payload) => {
                    this.handleNewMessage(payload.new);
                }
            )
            .subscribe();
    }

    // Carregar conversas do usuário
    async loadConversations() {
        if (!this.currentUser) return;

        const { data: conversations, error } = await this.supabase
            .from('conversas')
            .select(`
                *,
                cliente:usuarios!conversas_cliente_id_fkey(id, nome, tipo),
                profissional:usuarios!conversas_profissional_id_fkey(id, nome, tipo),
                mensagens:mensagens(*)
            `)
            .or(`cliente_id.eq.${this.currentUser.id},profissional_id.eq.${this.currentUser.id}`)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Erro ao carregar conversas:', error);
            return;
        }

        this.conversations = conversations || [];
        this.renderConversationsList();
    }

    // Iniciar ou buscar conversa
    async startConversation(otherUserId, otherUserName) {
        if (!this.currentUser) {
            alert('Por favor, faça login para iniciar uma conversa.');
            return;
        }

        // Verificar se já existe conversa
        const existingConversation = this.conversations.find(conv => 
            (conv.cliente_id === this.currentUser.id && conv.profissional_id === otherUserId) ||
            (conv.profissional_id === this.currentUser.id && conv.cliente_id === otherUserId)
        );

        if (existingConversation) {
            this.openChat(existingConversation.id, otherUserName);
            return;
        }

        // Criar nova conversa
        const { data: newConversation, error } = await this.supabase
            .from('conversas')
            .insert([
                {
                    cliente_id: this.currentUser.tipo === 'cliente' ? this.currentUser.id : otherUserId,
                    profissional_id: this.currentUser.tipo === 'profissional' ? this.currentUser.id : otherUserId
                }
            ])
            .select(`
                *,
                cliente:usuarios!conversas_cliente_id_fkey(id, nome, tipo),
                profissional:usuarios!conversas_profissional_id_fkey(id, nome, tipo)
            `)
            .single();

        if (error) {
            console.error('Erro ao criar conversa:', error);
            alert('Erro ao iniciar conversa. Tente novamente.');
            return;
        }

        this.conversations.unshift(newConversation);
        this.openChat(newConversation.id, otherUserName);
        this.setupRealtimeSubscription();
    }

    // Abrir chat
    async openChat(conversationId, otherUserName) {
        this.currentConversation = this.conversations.find(c => c.id === conversationId);
        
        if (!this.currentConversation) return;

        // Criar ou mostrar modal do chat
        this.createChatModal(otherUserName);
        await this.loadMessages(conversationId);
    }

    // Criar modal do chat
    createChatModal(otherUserName) {
        // Remover modal existente
        const existingModal = document.getElementById('chatModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="chatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
                    <!-- Header -->
                    <div class="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div>
                            <h3 class="font-semibold">Conversa com ${otherUserName}</h3>
                            <p class="text-blue-100 text-sm">Online</p>
                        </div>
                        <button onclick="chatSystem.closeChat()" class="text-white hover:text-blue-200">
                            <i data-feather="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Messages Container -->
                    <div id="chatMessages" class="flex-1 p-4 overflow-y-auto bg-gray-50 max-h-96">
                        <div class="text-center text-gray-500">
                            <i data-feather="message-circle" class="w-8 h-8 mx-auto mb-2"></i>
                            <p>Inicie a conversa</p>
                        </div>
                    </div>

                    <!-- Message Input -->
                    <div class="p-4 border-t border-gray-200">
                        <div class="flex space-x-2">
                            <input type="text" id="messageInput" 
                                   placeholder="Digite sua mensagem..." 
                                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                            <button onclick="chatSystem.sendMessage()" 
                                    class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                                <i data-feather="send" class="w-4 h-4"></i>
                            </button>
                        </div>
                        
                        <!-- Solicitação de Serviço -->
                        <div class="mt-3 pt-3 border-t border-gray-200">
                            <button onclick="chatSystem.showServiceRequestForm()" 
                                    class="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-green-500 transition duration-300 text-sm">
                                <i data-feather="briefcase" class="w-4 h-4 inline mr-2"></i>
                                Solicitar Serviço
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        feather.replace();

        // Enter para enviar mensagem
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // Fechar chat
    closeChat() {
        const modal = document.getElementById('chatModal');
        if (modal) {
            modal.remove();
        }
        this.currentConversation = null;
    }

    // Carregar mensagens
    async loadMessages(conversationId) {
        const { data: messages, error } = await this.supabase
            .from('mensagens')
            .select('*')
            .eq('conversa_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Erro ao carregar mensagens:', error);
            return;
        }

        this.renderMessages(messages || []);
    }

    // Renderizar mensagens
    renderMessages(messages) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        container.innerHTML = messages.map(message => `
            <div class="mb-4 ${message.remetente_id === this.currentUser.id ? 'text-right' : 'text-left'}">
                <div class="inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.remetente_id === this.currentUser.id 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-800 border border-gray-200'
                }">
                    <p class="text-sm">${message.texto}</p>
                    <p class="text-xs opacity-70 mt-1">
                        ${new Date(message.created_at).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </p>
                </div>
            </div>
        `).join('');

        // Scroll para baixo
        container.scrollTop = container.scrollHeight;
    }

    // Enviar mensagem
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const messageText = input.value.trim();

        if (!messageText || !this.currentConversation) return;

        const { error } = await this.supabase
            .from('mensagens')
            .insert([
                {
                    conversa_id: this.currentConversation.id,
                    remetente_id: this.currentUser.id,
                    texto: messageText
                }
            ]);

        if (error) {
            console.error('Erro ao enviar mensagem:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
            return;
        }

        // Atualizar updated_at da conversa
        await this.supabase
            .from('conversas')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', this.currentConversation.id);

        input.value = '';
        
        // Recarregar mensagens para mostrar a nova
        await this.loadMessages(this.currentConversation.id);
    }

    // Nova mensagem em tempo real
    handleNewMessage(message) {
        if (this.currentConversation && message.conversa_id === this.currentConversation.id) {
            this.loadMessages(this.currentConversation.id);
        }
        this.loadConversations(); // Atualizar lista de conversas
    }

    // Mostrar formulário de solicitação de serviço
    showServiceRequestForm() {
        const modal = document.getElementById('chatModal');
        if (!modal) return;

        const serviceFormHTML = `
            <div id="serviceRequestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Solicitar Serviço</h3>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                class="text-gray-500 hover:text-gray-700">
                            <i data-feather="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <form id="serviceRequestForm" onsubmit="chatSystem.submitServiceRequest(event)">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                                <select name="tipo_servico" required 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Selecione...</option>
                                    <option value="pedreiro">Pedreiro</option>
                                    <option value="pintor">Pintor</option>
                                    <option value="eletricista">Eletricista</option>
                                    <option value="encanador">Encanador</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Descrição do Serviço</label>
                                <textarea name="descricao" required rows="4"
                                          placeholder="Descreva detalhadamente o serviço que precisa..."
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Orçamento Previsto (opcional)</label>
                                <input type="number" name="orcamento" step="0.01" min="0"
                                       placeholder="R$ 0,00"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                            </div>
                        </div>

                        <div class="flex space-x-3 mt-6">
                            <button type="button" 
                                    onclick="document.getElementById('serviceRequestModal').remove()"
                                    class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300">
                                Cancelar
                            </button>
                            <button type="submit" 
                                    class="flex-1 bg-secondary text-white py-2 px-4 rounded-md hover:bg-green-500 transition duration-300">
                                Enviar Solicitação
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', serviceFormHTML);
        feather.replace();
    }

    // Enviar solicitação de serviço
    async submitServiceRequest(event) {
        event.preventDefault();
        
        if (!this.currentUser || this.currentUser.tipo !== 'cliente') {
            alert('Apenas clientes podem solicitar serviços.');
            return;
        }

        const formData = new FormData(event.target);
        const serviceData = {
            conversa_id: this.currentConversation.id,
            cliente_id: this.currentUser.id,
            profissional_id: this.currentConversation.cliente_id === this.currentUser.id 
                ? this.currentConversation.profissional_id 
                : this.currentConversation.cliente_id,
            descricao: formData.get('descricao'),
            tipo_servico: formData.get('tipo_servico'),
            orcamento: formData.get('orcamento') || null
        };

        const { error } = await this.supabase
            .from('solicitacoes_servico')
            .insert([serviceData]);

        if (error) {
            console.error('Erro ao enviar solicitação:', error);
            alert('Erro ao enviar solicitação. Tente novamente.');
            return;
        }

        // Enviar mensagem automática
        await this.supabase
            .from('mensagens')
            .insert([
                {
                    conversa_id: this.currentConversation.id,
                    remetente_id: this.currentUser.id,
                    texto: `📋 Solicitação de serviço enviada: ${serviceData.descricao.substring(0, 50)}...`
                }
            ]);

        alert('Solicitação enviada com sucesso!');
        document.getElementById('serviceRequestModal').remove();
        
        // Recarregar mensagens
        await this.loadMessages(this.currentConversation.id);
    }

    // Renderizar lista de conversas (para sidebar)
    renderConversationsList() {
        const container = document.getElementById('conversationsList');
        if (!container) return;

        container.innerHTML = this.conversations.map(conv => {
            const otherUser = this.currentUser.tipo === 'cliente' ? conv.profissional : conv.cliente;
            const lastMessage = conv.mensagens && conv.mensagens.length > 0 
                ? conv.mensagens[conv.mensagens.length - 1] 
                : null;

            return `
                <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100" 
                     onclick="chatSystem.openChat('${conv.id}', '${otherUser.nome}')">
                    <div class="flex items-center space-x-3">
                        <div class="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                            <i data-feather="user" class="text-gray-500 w-4 h-4"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-gray-900 truncate">${otherUser.nome}</p>
                            <p class="text-sm text-gray-500 truncate">
                                ${lastMessage ? lastMessage.texto : 'Nenhuma mensagem'}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400">
                                ${lastMessage ? new Date(lastMessage.created_at).toLocaleDateString('pt-BR') : ''}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        feather.replace();
    }
}

// Inicializar sistema de chat
let chatSystem = new ChatSystem();