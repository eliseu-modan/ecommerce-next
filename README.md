# Ecommerce Frontend

![Next.js](https://img.shields.io/badge/nextjs-frontend-black)
![React](https://img.shields.io/badge/react-19-blue)
![Tailwind](https://img.shields.io/badge/tailwind-css-blue)

Frontend de e-commerce desenvolvido com Next.js, React e Tailwind CSS, consumindo uma API REST construída com NestJS.

A aplicação implementa uma experiência completa de loja virtual, incluindo autenticação, catálogo de produtos, carrinho e integração com backend.

---

## 🚀 Visão geral

Este projeto representa a camada de apresentação de um sistema completo de e-commerce, sendo responsável por:

- Interface moderna e responsiva
- Consumo de API para produtos e autenticação
- Gerenciamento de sessão do usuário
- Navegação protegida
- Experiência de compra simulada

---

## 🔗 Integração com Backend

Este frontend consome a API disponível em:

👉 https://github.com/eliseu-modan/ecommerce

A comunicação é feita via Axios, utilizando uma instância centralizada com interceptors para autenticação.

---

## 🎯 Funcionalidades

- Listagem dinâmica de produtos via API  
- Visualização detalhada de produtos  
- Login e cadastro de usuários  
- Login social com Google OAuth  
- Persistência de sessão  
- Rotas protegidas  
- Header responsivo com navegação e carrinho  
- Estrutura de checkout (carrinho)  

---

## 🛠️ Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Axios
- Headless UI
- Heroicons
- React Icons

---

## 🧱 Arquitetura

O projeto segue boas práticas de organização frontend:

- **App Router (Next.js)** → estrutura de rotas moderna  
- **Componentização** → UI reutilizável e desacoplada  
- **Context API** → gerenciamento global de autenticação  
- **Camada de API centralizada** → Axios com interceptors  
- **Proteção de rotas** → controle de acesso baseado em autenticação  

---

## 📁 Estrutura do projeto

```text
app/
├── auth/googleAuth/
├── dashboard/
├── layout.tsx
├── page.tsx

components/
├── Auth/
├── Cart/
├── Layout/
├── Products/
├── routes/

contexts/
├── AuthProvider.tsx

lib/
├── api.ts

⚙️ Requisitos
Node.js 20+
npm
Backend rodando (API NestJS)
npm install


🔑 Variáveis de ambiente

Crie um arquivo .env:

NEXT_PUBLIC_API_URL=http://localhost:3000
▶️ Executando o projeto
npm run dev

Aplicação disponível em:

http://localhost:9000

🔐 Autenticação

A aplicação possui um sistema completo de autenticação:

Login com e-mail e senha
Cadastro de usuários
Login social com Google
Persistência de sessão no cliente
Proteção de rotas privadas

📡 Consumo da API
A comunicação com o backend é feita através de uma instância Axios centralizada:

Base URL configurada via .env
Interceptors para envio automático de token
Tratamento de erros global


🚧 Melhorias futuras
Implementar testes (Jest/React Testing Library)
Melhorar UX do fluxo de checkout
Adicionar loading states e feedback visual
Deploy em ambiente cloud (Vercel)


👨‍💻 Autor

Eliseu Modanesi