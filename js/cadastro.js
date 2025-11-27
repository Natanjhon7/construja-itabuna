function registerProfessional(formData) {
    const submitButton = document.querySelector('.professional-submit-btn');
    
    // Mostrar loading
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;
    
    try {
        // Processar uploads de arquivos
        const processedData = processFileUploads(formData);
        
        // Salvar profissional no sistema
        saveProfessionalToStorage(processedData);
        
        // Criar usuário para login
        createUserAccount(processedData);

         status: 'approved' // Mudar de 'pending' para 'approved'
        verificationStatus: 'approved'
        
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;

        
        
        showAlert('Cadastro profissional realizado com sucesso! Aguarde a aprovação.', 'success');
        
        // Redirecionar após sucesso
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        showAlert('Erro ao processar cadastro. Tente novamente.', 'error');
    }
}

function processFileUploads(formData) {
    const processedData = {
        ...formData,
        documents: {
            profilePhoto: null,
            portfolio: [],
            documents: []
        },
        registrationDate: new Date().toISOString(),
        status: 'pending', // pending, approved, rejected
        rating: 0,
        completedJobs: 0,
        reviews: []
    };
    
    // Processar foto de perfil
    const profilePhotoInput = document.getElementById('profilePhoto');
    if (profilePhotoInput.files[0]) {
        processedData.documents.profilePhoto = fileToBase64(profilePhotoInput.files[0]);
    }
    
    // Processar portfólio
    const portfolioInput = document.getElementById('portfolio');
    if (portfolioInput.files) {
        Array.from(portfolioInput.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                processedData.documents.portfolio.push(fileToBase64(file));
            }
        });
    }
    
    // Processar documentos
    const documentsInput = document.getElementById('documents');
    if (documentsInput.files) {
        Array.from(documentsInput.files).forEach(file => {
            processedData.documents.documents.push({
                name: file.name,
                type: file.type,
                data: fileToBase64(file)
            });
        });
    }
    
    return processedData;
}

function fileToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function saveProfessionalToStorage(professionalData) {
    // Recuperar profissionais existentes
    const professionals = JSON.parse(localStorage.getItem('construja_professionals') || '[]');
    
    // Verificar se CPF ou email já existem
    const exists = professionals.find(pro => 
        pro.cpf === professionalData.cpf || pro.email === professionalData.email
    );
    
    if (exists) {
        throw new Error('CPF ou E-mail já cadastrado no sistema');
    }
    
    // Adicionar ID único
    professionalData.id = generateProfessionalId();
    
    // Adicionar à lista
    professionals.push(professionalData);
    
    // Salvar no localStorage
    localStorage.setItem('construja_professionals', JSON.stringify(professionals));
    
    return professionalData.id;
}

function createUserAccount(professionalData) {
    const users = JSON.parse(localStorage.getItem('construja_users') || '[]');
    
    // Verificar se usuário já existe
    const userExists = users.find(user => user.email === professionalData.email);
    
    if (userExists) {
        throw new Error('Usuário já cadastrado');
    }
    
    // Criar conta de usuário
    const user = {
        id: professionalData.id,
        email: professionalData.email,
        password: professionalData.password, // Em produção, isso deve ser hasheado
        name: professionalData.name,
        type: 'professional',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    users.push(user);
    localStorage.setItem('construja_users', JSON.stringify(users));
}

function generateProfessionalId() {
    return 'pro_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}