// admin.js - Painel simples para aprovar profissionais
function loadPendingProfessionals() {
    const professionals = JSON.parse(localStorage.getItem('construja_professionals') || '[]');
    const pendingPros = professionals.filter(pro => pro.status === 'pending');
    
    const container = document.getElementById('pendingProfessionals');
    if (!container) return;
    
    container.innerHTML = pendingPros.map(pro => `
        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <div class="flex items-start justify-between">
                <div class="flex items-center space-x-4">
                    <img src="${pro.documents?.profilePhoto || '../static/default-avatar.png'}" 
                         alt="${pro.name}" 
                         class="w-16 h-16 object-cover rounded-full">
                    <div>
                        <h3 class="font-semibold text-lg">${pro.name}</h3>
                        <p class="text-gray-600">${pro.service} • ${pro.experience} anos de experiência</p>
                        <p class="text-sm text-gray-500">${pro.email} • ${pro.phone}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="approveProfessional('${pro.id}')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Aprovar
                    </button>
                    <button onclick="rejectProfessional('${pro.id}')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Rejeitar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function approveProfessional(id) {
    const professionals = JSON.parse(localStorage.getItem('construja_professionals') || '[]');
    const professional = professionals.find(pro => pro.id === id);
    
    if (professional) {
        professional.status = 'approved';
        localStorage.setItem('construja_professionals', JSON.stringify(professionals));
        loadPendingProfessionals();
        alert('Profissional aprovado com sucesso!');
    }
}