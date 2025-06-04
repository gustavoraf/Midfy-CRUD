# Midfy CRUD App

Aplicação Full Stack desenvolvida como parte de um processo seletivo para a startup Midfy. Gestão de **fornecedores** e **varejos**, incluindo funcionalidades de associação, upload de logos, e operações de CRUD completas.

Tive que desenvolver em apenas 2 dias por conta de correria pré-viagem que terei que fazer, então acabou sendo um ótimo exercício de manter uma certa estética, mas focando em praticidade e funcionalidade, além de clareza.

OBS: Optei por conectar o front-end diretamente ao Supabase, que já fornece uma API performática para esse tipo de aplicação. 
Em um projeto real e com maior escala, faria sentido considerar uma camada intermediária para encapsular a lógica de negócio e não expor as queries pro frontend.
Além disso, apesar de eu ter estudado as RLS Policies, por conta do projeto ser simples e de um desafio, optei por usar a chave que dá acesso a todos os processos do banco. Mas isso obviamente em ambiente de trabalho não é uma boa prática.

## ✨ Tecnologias utilizadas

- **Frontend:** React + TypeScript
- **UI:** Material UI
- **Formulários:** Formik + Yup
- **Backend-as-a-Service:** Supabase
- **Armazenamento de arquivos:** Supabase Storage
- **Validações:** Yup
- **Roteamento:** React Router

## 📁 Estrutura de pastas

```bash
src/
├── pages/            # Páginas principais (rotas)
├── services/         # Configuração do Supabase
├── App.tsx           # Definição das rotas
└── index.tsx         # Entrada da aplicação