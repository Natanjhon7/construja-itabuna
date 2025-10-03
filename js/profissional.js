// Script específico para cadastro profissional
document.addEventListener('DOMContentLoaded', function() {
    initProfessionalRegistration();
});

function initProfessionalRegistration() {
    // Inicializar funcionalidades comuns
    initMobileMenu();
    initPhoneMasks();
    initCPFMask();
    
    // Inicializar funcionalidades específicas do profissional
    initFileUploads();
    initProfessionalFormValidation();
    initWorkAreasSelection();
    
    // Adicionar animação de entrada
    const registerCard = document.querySelector('.max-w-3xl');
    if (registerCard) {
        registerCard.classList.add('animate-slide-in-up');
    }
}

// Máscara de CPF
function initCPFMask() {
    const cpfInput = document.getElementById('proCpf');
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
            }
            
            e.target.value = value;
        });
    }
}

// Upload de arquivos
function initFileUploads() {
    initProfilePhotoUpload();
    initDocumentsUpload();
    initPortfolioUpload();
}

function initProfilePhotoUpload() {
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePhotoArea = document.getElementById('profilePhotoArea');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const previewImage = profilePhotoPreview.querySelector('img');
    
    if (profilePhotoInput) {
        // Drag and drop
        profilePhotoArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        profilePhotoArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        profilePhotoArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleProfilePhoto(files[0]);
            }
        });
        
        // Click to upload
        profilePhotoInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                handleProfilePhoto(this.files[0]);
            }
        });
    }
    
    function handleProfilePhoto(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                profilePhotoPreview.classList.remove('hidden');
                
                // Atualizar área de upload
                profilePhotoArea.innerHTML = `
                    <i data-feather="check" class="mx-auto text-green-500 mb-2"></i>
                    <p class="text-sm text-green-600">Foto selecionada</p>
                    <p class="text-xs text-green-500">Clique para alterar</p>
                `;
                feather.replace();
            };
            
            reader.readAsDataURL(file);
        } else {
            showAlert('Por favor, selecione uma imagem válida.', 'error');
        }
    }
}

function initDocumentsUpload() {
    const documentsInput = document.getElementById('documents');
    const documentsArea = document.getElementById('documentsArea');
    const documentsList = document.getElementById('documentsList');
    const documentsPreview = document.getElementById('documentsPreview');
    
    if (documentsInput) {
        documentsInput.addEventListener('change', function(e) {
            handleDocuments(this.files);
        });
        
        // Drag and drop
        documentsArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        documentsArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        documentsArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            handleDocuments(e.dataTransfer.files);
        });
    }
    
    function handleDocuments(files) {
        if (files.length > 0) {
            documentsPreview.innerHTML = '';
            
            Array.from(files).forEach((file, index) => {
                if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
                    const listItem = document.createElement('li');
                    listItem.className = 'document-item';
                    listItem.innerHTML = `
                        <span class="document-name">${file.name}</span>
                        <button type="button" class="document-remove" data-index="${index}">
                            <i data-feather="x" class="w-3 h-3"></i>
                        </button>
                    `;
                    documentsPreview.appendChild(listItem);
                }
            });
            
            if (documentsPreview.children.length > 0) {
                documentsList.classList.remove('hidden');
                
                // Atualizar área de upload
                documentsArea.innerHTML = `
                    <i data-feather="check" class="mx-auto text-green-500 mb-2"></i>
                    <p class="text-sm text-green-600">${documentsPreview.children.length} documento(s) selecionado(s)</p>
                    <p class="text-xs text-green-500">Clique para adicionar mais</p>
                `;
                feather.replace();
            }
            
            // Adicionar event listeners para remover documentos
            document.querySelectorAll('.document-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    this.closest('.document-item').remove();
                    
                    if (documentsPreview.children.length === 0) {
                        documentsList.classList.add('hidden');
                        resetDocumentsArea();
                    }
                });
            });
        }
    }
    
    function resetDocumentsArea() {
        documentsArea.innerHTML = `
            <i data-feather="file-text" class="mx-auto text-gray-400 mb-2"></i>
            <p class="text-sm text-gray-600">Envie seus documentos</p>
            <p class="text-xs text-gray-500">PDF, JPG ou PNG</p>
        `;
        feather.replace();
    }
}

function initPortfolioUpload() {
    const portfolioInput = document.getElementById('portfolio');
    const portfolioArea = document.getElementById('portfolioArea');
    const portfolioPreview = document.getElementById('portfolioPreview');
    
    if (portfolioInput) {
        portfolioInput.addEventListener('change', function(e) {
            handlePortfolio(this.files);
        });
        
        // Drag and drop
        portfolioArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        portfolioArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        portfolioArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            handlePortfolio(e.dataTransfer.files);
        });
    }
    
    function handlePortfolio(files) {
        if (files.length > 0) {
            const currentImages = portfolioPreview.children.length;
            const remainingSlots = 10 - currentImages;
            
            if (files.length > remainingSlots) {
                showAlert(`Você pode adicionar no máximo ${remainingSlots} imagens adicionais.`, 'error');
                return;
            }
            
            Array.from(files).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const previewDiv = document.createElement('div');
                        previewDiv.className = 'upload-preview';
                        previewDiv.innerHTML = `
                            <img src="${e.target.result}" alt="Portfolio image">
                            <button type="button" class="remove-image">
                                <i data-feather="x" class="w-3 h-3"></i>
                            </button>
                        `;
                        portfolioPreview.appendChild(previewDiv);
                        portfolioPreview.classList.remove('hidden');
                        
                        // Atualizar área de upload
                        portfolioArea.innerHTML = `
                            <i data-feather="check" class="mx-auto text-green-500 mb-2"></i>
                            <p class="text-sm text-green-600">${portfolioPreview.children.length} foto(s) no portfólio</p>
                            <p class="text-xs text-green-500">Clique para adicionar mais (máx. 10)</p>
                        `;
                        feather.replace();
                        
                        // Adicionar event listener para remover imagem
                        previewDiv.querySelector('.remove-image').addEventListener('click', function() {
                            previewDiv.remove();
                            
                            if (portfolioPreview.children.length === 0) {
                                portfolioPreview.classList.add('hidden');
                                resetPortfolioArea();
                            } else {
                                portfolioArea.innerHTML = `
                                    <i data-feather="check" class="mx-auto text-green-500 mb-2"></i>
                                    <p class="text-sm text-green-600">${portfolioPreview.children.length} foto(s) no portfólio</p>
                                    <p class="text-xs text-green-500">Clique para adicionar mais (máx. 10)</p>
                                `;
                                feather.replace();
                            }
                        });
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    function resetPortfolioArea() {
        portfolioArea.innerHTML = `
            <i data-feather="image" class="mx-auto text-gray-400 mb-2"></i>
            <p class="text-sm text-gray-600">Adicione fotos do seu trabalho</p>
            <p class="text-xs text-gray-500">Até 10 imagens</p>
        `;
        feather.replace();
    }
}

// Seleção de áreas de trabalho
function initWorkAreasSelection() {
    const workAreaCheckboxes = document.querySelectorAll('input[name="workAreas"]');
    
    workAreaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('label');
            
            if (this.checked) {
                label.classList.add('checked');
            } else {
                label.classList.remove('checked');
            }
        });
    });
}

// Validação do formulário profissional
function initProfessionalFormValidation() {
    const professionalForm = document.getElementById('professionalRegistrationForm');
    
    if (professionalForm) {
        professionalForm.addEventListener('submit', handleProfessionalRegistration);
    }
}

function handleProfessionalRegistration(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('proName').value,
        cpf: document.getElementById('proCpf').value,
        email: document.getElementById('proEmail').value,
        phone: document.getElementById('proPhone').value,
        birthDate: document.getElementById('proBirth').value,
        password: document.getElementById('proPassword').value,
        service: document.getElementById('proService').value,
        experience: document.getElementById('proExperience').value,
        description: document.getElementById('proDescription').value,
        workAreas: Array.from(document.querySelectorAll('input[name="workAreas"]:checked')).map(cb => cb.value),
        terms: document.getElementById('terms').checked,
        type: 'professional'
    };
    
    const errors = validateProfessionalFormData(formData);
    
    if (errors.length > 0) {
        showAlert(errors.join('<br>'), 'error');
        return;
    }
    
    // Simular cadastro
    registerProfessional(formData);
}

function validateProfessionalFormData(data) {
    const errors = [];
    
    // Validações básicas
    if (!data.name || data.name.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!data.cpf || !isValidCPF(data.cpf)) {
        errors.push('CPF inválido');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('E-mail inválido');
    }
    
    if (!data.phone || data.phone.length < 10) {
        errors.push('Telefone inválido');
    }
    
    if (!data.birthDate || !isValidBirthDate(data.birthDate)) {
        errors.push('Data de nascimento inválida');
    }
    
    if (!data.password || data.password.length < 6) {
        errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (!data.service) {
        errors.push('Selecione o serviço principal');
    }
    
    if (!data.experience || data.experience < 0) {
        errors.push('Anos de experiência inválidos');
    }
    
    if (!data.description || data.description.length < 10) {
        errors.push('Descrição deve ter pelo menos 10 caracteres');
    }
    
    if (!data.workAreas || data.workAreas.length === 0) {
        errors.push('Selecione pelo menos uma área de atuação');
    }
    
    if (!data.terms) {
        errors.push('Você deve aceitar os termos e condições');
    }
    
    // Validação de foto de perfil
    const profilePhoto = document.getElementById('profilePhoto');
    if (!profilePhoto.files || profilePhoto.files.length === 0) {
        errors.push('Foto de perfil é obrigatória');
    }
    
    return errors;
}

function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.length === 11;
}

function isValidBirthDate(date) {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    return age >= 18 && age <= 100;
}

function registerProfessional(formData) {
    const submitButton = document.querySelector('.professional-submit-btn');
    
    // Mostrar loading
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;
    
    // Simular requisição API
    setTimeout(() => {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        
        showAlert('Cadastro profissional realizado com sucesso! Redirecionando...', 'success');
        
        // Redirecionar após sucesso
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }, 2000);
}

// Utilizar a função showAlert do auth.js
function showAlert(message, type) {
    if (window.AuthUtils && window.AuthUtils.showAlert) {
        window.AuthUtils.showAlert(message, type);
    } else {
        // Fallback básico
        alert(message);
    }
}