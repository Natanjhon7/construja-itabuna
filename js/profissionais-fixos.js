// js/profissionais-fixos.js
const PROFISSIONAIS_FIXOS = [
    {
        id: 'pro_fixo_1',
        personal: { 
            name: 'Marcelo Coelho Damasceno', 
            email: 'marcelodam@construja.com', 
            phone: '(73) 98814-5196' 
        },
        professional: { 
            service: 'Manutenção e instalação elétrica', 
            experience: '20', 
            description: 'Especialista em Manutenção e instalação elétrica.',
            workAreas: ['centro', 'sao_pedro', 'jardim_primavera', 'outros'] 
        },
        documents: { 
            profilePhoto: '',
            portfolio: []
        },
        rating: 4.8, 
        completedJobs: 25, 
        status: 'approved',
        isFixed: true
    },
    {
        id: 'pro_fixo_2', 
        personal: { 
            name: 'André Batista Viana', 
            email: 'andreviana82745@construja.com', 
            phone: '(73) 98889-7624' 
        },
        professional: { 
            service: 'Ajudante Prático, Auxiliar de Escritório, Ferramenteiro', 
            experience: '15', 
            description: 'Atua em diversas áreas no setor da construção por ser ajudante prático, além de possuir experiência na parte de logística, sendo auxiliar de escritório e ferramenteiro.',
            workAreas: ['jardim_primavera', 'fatima', 'outros'] 
        },
        documents: { 
            profilePhoto: '',
            portfolio: []
        },
        rating: 4.7, 
        completedJobs: 18, 
        status: 'approved',
        isFixed: true
    },
    {
                id: 'pro_fixo_3',
                personal: { 
                    name: 'Antonio Caetano Dos Santos Filho', 
                    email: 'Antoniofilho21@construja.com', 
                    phone: '(73) 9156-6007' 
                },
                professional: { 
                    service: 'Bitoneiro', 
                    experience: '10', 
                    description: 'Profissional qualificado e experiente para o serviço.',
                    workAreas: ['centro', 'jardim_vitoria'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.6, 
                completedJobs: 15, 
                status: 'approved',
                isFixed: true
            },
            {
                id: 'pro_fixo_4',
                personal: { 
                    name: 'Luciano Santos Ferreira', 
                    email: 'donosdabolalu@gmail.com', 
                    phone: '(73) 99851-0877' 
                },
                professional: { 
                    service: 'Pedreiro', 
                    experience: '15', 
                    description: 'Contribuir com bons resultados, por meio das mihas experiencias adquiridas ao longo dos anos atuando como pedreiro.',
                    workAreas: ['centro', 'sao_caetano', 'fatima', 'outros'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.9, 
                completedJobs: 32, 
                status: 'approved',
                isFixed: true
            },
            {
                id: 'pro_fixo_5',
                personal: { 
                    name: 'Gustavo Conceição Santos', 
                    email: 'gustavoconc@construja.com', 
                    phone: '(73) 98810-1754' 
                },
                professional: { 
                    service: 'Auxiliar de carga', 
                    experience: '0.8', 
                    description: 'Otimo profissional, preparado para contribuir e promover o melhor.',
                    workAreas: ['centro', 'sao_caetano', 'fatima', 'outros'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.9, 
                completedJobs: 32, 
                status: 'approved',
                isFixed: true
            },
            {
                id: 'pro_fixo_6',
                personal: { 
                    name: 'Adailton Ferreira De Araujo', 
                    email: 'ferreiraaraujo@construja.com', 
                    phone: '(71) 99113-2474' 
                },
                professional: { 
                    service: 'Encarregado', 
                    experience: '25', 
                    description: 'Profissional dedicado e empenhado com vasta experiência.',
                    workAreas: ['centro', 'sao_caetano', 'fatima', 'outros'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.9, 
                completedJobs: 32, 
                status: 'approved',
                isFixed: true
            },
            {
                id: 'pro_fixo_7',
                personal: { 
                    name: 'Jaime Bernardo Góes De Jesus', 
                    email: 'jesusjaimee02@gamil.com', 
                    phone: '(71) 99719-9029' 
                },
                professional: { 
                    service: 'Encarregado', 
                    experience: '19', 
                    description: '19 anos de profissão executando a função de encarregado de obra.',
                    workAreas: ['centro', 'sao_caetano', 'fatima', 'outros'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.9, 
                    completedJobs: 32, 
                status: 'approved',
                isFixed: true
            },
            {
                id: 'pro_fixo_8',
                personal: { 
                    name: 'Daniel Alves Oliveira', 
                    email: 'daniel10alves@construja.com', 
                    phone: '(73) 99830-8371' 
                },
                professional: { 
                    service: 'Ajudante de predeiro Pratico', 
                    experience: '6', 
                    description: 'Serviços gerais, servente pratico, ajudante de pedreiro pratico, empacotador e estoquista.',
                    workAreas: ['centro', 'sao_caetano', 'fatima', 'outros'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.9, 
                completedJobs: 32, 
                status: 'approved',
                isFixed: true
            },
            {
                id: 'pro_fixo_9',
                personal: { 
                    name: 'Alan Santana Dos Santos', 
                    email: 'dossantos321@construja.com', 
                    phone: '(73) 99131-0043' 
                },
                professional: { 
                    service: 'Servente', 
                    experience: '8', 
                    description: 'Otimo profissional com experiência nas areas de servente comum, servente de pedreiro e auxiliar de produção.',
                    workAreas: ['centro', 'sao_caetano', 'fatima', 'outros'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.9, 
                completedJobs: 32, 
                status: 'approved',
                isFixed: true
            },
            {
                id: 'pro_fixo_10',
                personal: { 
                    name: 'Emerson Alves Leandro', 
                    email: 'emersonkaka_@hotmail.com', 
                    phone: '(73) 98802-3336' 
                },
                professional: { 
                    service: 'Ajudante de predeiro', 
                    experience: '15', 
                    description: 'Experiente, proativo, dedicado com experiências em ajudante de pedreiro, servente de pedreiro, auxiliar de almoxerifado, auxiliar de produção.',
                    workAreas: ['centro', 'sao_caetano', 'fatima', 'outros'] 
                },
                documents: { 
                    profilePhoto: '',
                    portfolio: []
                },
                rating: 4.9, 
                completedJobs: 32, 
                status: 'approved',
                isFixed: true
            }
];