# 🧮 Teoria das Filas - Calculadora Web

Sistema completo para cálculo de modelos de Teoria das Filas com interface web moderna.

## 🎯 Sobre o Projeto

Este projeto acadêmico implementa 11 modelos de Teoria das Filas:

1. **M/M/1** - Modelo básico com 1 servidor
2. **M/M/s>1** - Múltiplos servidores
3. **M/M/1/K** - Capacidade limitada
4. **M/M/s>1/K** - Múltiplos servidores + capacidade limitada
5. **M/M/1/N** - População finita
6. **M/M/s>1/N** - Múltiplos servidores + população finita
7. **M/G/1** - Distribuição geral de atendimento
8-11. **4 Modelos com Prioridades**

## 🏗️ Arquitetura

```
TeoriaDasFilas/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Componentes UI
│   │   ├── pages/         # Páginas dos modelos
│   │   ├── services/      # Chamadas API
│   │   └── types/         # Tipos TypeScript
│   └── docs/              # Documentação frontend
│
├── backend/           # Python + Flask
│   ├── app/
│   │   ├── models/        # 🎯 Fórmulas dos modelos
│   │   └── routes/        # Endpoints da API
│   └── tests/             # Testes unitários
│
└── README.md          # Este arquivo
```

## 🚀 Início Rápido

### 1. Frontend (Interface Web)

```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

### 2. Backend (Servidor Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# ou: source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python app/main.py
```

API rodando em: http://localhost:5000

## 👥 Divisão de Trabalho

### ✅ Estrutura Base (Concluída)
- [x] Frontend React completo com 11 páginas
- [x] Componentes reutilizáveis (Input, Button, Card, ResultDisplay)
- [x] Layout com Header e Sidebar
- [x] Serviço de API preparado
- [x] Estrutura backend Flask
- [x] Arquivos de modelos com templates
- [x] Sistema de rotas da API
- [x] Documentação completa

### 🚧 Para Implementar (Parceiros)

Cada parceiro deve:

**Backend:**
1. Escolher 1-2 modelos
2. Implementar fórmulas em `backend/app/models/`
3. Descomentar imports e endpoints em `backend/app/routes/`
4. Testar endpoint com curl/Postman

**Frontend:**
1. Descomentar chamada de API no arquivo do modelo
2. Testar integração

## 📝 Sugestão de Divisão

### Parceiro 1
- **Backend**: M/M/1 + M/M/1/K
- **Frontend**: Descomentar APIs desses modelos

### Parceiro 2
- **Backend**: M/M/s + M/M/s/K
- **Frontend**: Descomentar APIs desses modelos

### Parceiro 3
- **Backend**: M/M/1/N + M/M/s/N
- **Frontend**: Descomentar APIs desses modelos

### Parceiro 4
- **Backend**: M/G/1 + 4 modelos de Prioridade
- **Frontend**: Descomentar APIs desses modelos

## 📚 Documentação Detalhada

### Frontend
- [README do Frontend](./frontend/README.md)
- [Como Implementar um Modelo](./frontend/docs/COMO_IMPLEMENTAR_MODELO.md)

### Backend
- [README do Backend](./backend/README.md)
- Cada arquivo em `backend/app/models/` tem comentários TODO explicando o que fazer

## 🧪 Como Testar a Integração

### 1. Testar Backend Isoladamente

```bash
# Com curl
curl -X POST http://localhost:5000/api/calculate/mm1 \
  -H "Content-Type: application/json" \
  -d '{"lambda": 3, "mu": 5}'

# Resposta esperada:
# {"rho": 0.6, "L": 1.5, "Lq": 0.9, "W": 0.5, "Wq": 0.3, "P0": 0.4}
```

### 2. Testar Frontend com Backend

1. Backend rodando: http://localhost:5000
2. Frontend rodando: http://localhost:5173
3. Acessar a página do modelo
4. Preencher os inputs
5. Clicar em "Calcular"
6. Ver os resultados

## 🔧 Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

### Backend
- Python 3.10+
- Flask
- Flask-CORS
- NumPy
- SciPy

## 📖 Recursos de Estudo

### Teoria das Filas
- Hillier & Lieberman - "Introduction to Operations Research"
- Taha - "Operations Research: An Introduction"

### Fórmulas Online
- [Queue Theory Calculator](https://www.supositorio.com/rcalc/rcalclite.htm)
- Wikipedia - Queueing Theory

## ⚠️ Estado Atual do Projeto

### ✅ Pronto para Desenvolvimento
- Toda estrutura frontend e backend está criada
- Todos os arquivos têm comentários TODO explicando o que fazer
- Documentação completa disponível
- Componentes UI funcionais
- Sistema de rotas configurado

### 🚧 Aguardando Implementação
- Fórmulas matemáticas dos 11 modelos
- Testes unitários
- Validações específicas de cada modelo

## 🤝 Como Contribuir

1. Clone o repositório
2. Escolha um modelo para implementar
3. Veja a documentação específica:
   - Backend: `backend/README.md`
   - Frontend: `frontend/docs/COMO_IMPLEMENTAR_MODELO.md`
4. Implemente as fórmulas
5. Teste localmente
6. Faça commit das suas mudanças

## 📞 Contato e Suporte

- Procure por "TODO" nos arquivos para ver o que precisa ser implementado
- README de cada pasta tem instruções detalhadas
- Cada arquivo Python tem docstrings explicando o que fazer

---

## 🎯 Checklist Geral do Projeto

### Frontend
- [x] Estrutura base React + Vite
- [x] Componentes comuns (Input, Button, etc)
- [x] Layout (Header, Sidebar)
- [x] 11 páginas dos modelos
- [x] Serviço de API
- [x] Tipos TypeScript
- [ ] Integração com backend (descomentar quando pronto)

### Backend
- [x] Estrutura Flask base
- [x] Templates dos 11 modelos
- [x] Sistema de rotas
- [x] CORS configurado
- [ ] Implementar fórmulas M/M/1
- [ ] Implementar fórmulas M/M/s
- [ ] Implementar fórmulas M/M/1/K
- [ ] Implementar fórmulas M/M/s/K
- [ ] Implementar fórmulas M/M/1/N
- [ ] Implementar fórmulas M/M/s/N
- [ ] Implementar fórmulas M/G/1
- [ ] Implementar modelos de Prioridade (4)
- [ ] Testes unitários

### Integração
- [ ] Testar cada modelo end-to-end
- [ ] Validar resultados matemáticos
- [ ] Documentar casos de uso

---

Bom trabalho! 🚀
