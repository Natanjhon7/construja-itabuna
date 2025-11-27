// js/carregar-profissionais.js
async function carregarProfissionais() {
    try {
        const supabaseUrl = 'https://ocvkhwtbmpiltjbttsko.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdmtod3RibXBpbHRqYnR0c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzE5MzgsImV4cCI6MjA3OTg0NzkzOH0.Y6KFqQxs9l2fDziiURjtW3oZr6MWKZPNtyhT5-K7yGw';
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        // Buscar profissionais no banco
        const { data: profissionais, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('tipo', 'profissional');

        if (error) {
            console.error('Erro ao carregar profissionais:', error);
            return [];
        }

        console.log('Profissionais encontrados:', profissionais);
        return profissionais || [];

    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

// Função para exibir profissionais na página
function exibirProfissionais(profissionais) {
    const container = document.getElementById('professionals-grid');
    
    if (!container) {
        console.error('Container professionals-grid não encontrado');
        return;
    }

    container.innerHTML = '';

    if (profissionais.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>Nenhum profissional encontrado</p>
            </div>
        `;
        return;
    }

    profissionais.forEach(profissional => {
        const card = `
            <div class="professional-card">
                <div class="card-header">
                    <div class="avatar">
                        ${profissional.nome ? profissional.nome.split(' ').map(n => n[0]).join('').toUpperCase() : 'PR'}
                    </div>
                    <div class="professional-info">
                        <h3>${profissional.nome || 'Profissional'}</h3>
                        <p>${profissional.servico_principal || 'Serviços Gerais'}</p>
                        <div class="rating">
                            <span class="rating-value">4.5</span>
                            <div class="rating-stars">
                                ★★★★☆
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="specialties">
                        <span class="specialty">${profissional.experiencia || '0'} anos exp.</span>
                    </div>
                    <p class="description">${profissional.descricao || 'Profissional qualificado'}</p>
                </div>
                <div class="card-footer">
                    <span class="price">A combinar</span>
                    <button class="btn-contact" onclick="contatarProfissional('${profissional.nome}', '${profissional.telefone}')">
                        Contatar
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Função para contatar
function contatarProfissional(nome, telefone) {
    alert(`Contatar ${nome}\nTelefone: ${telefone}`);
}