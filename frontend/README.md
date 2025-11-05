# 🧮 Teoria das Filas - Frontend

Interface web para cálculo de modelos de Teoria das Filas.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool rápida
- **TailwindCSS** - Estilização
- **React Router** - Navegação entre páginas
- **Axios** - Chamadas HTTP (preparado para Flask backend)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/           # Componentes reutilizáveis (Input, Button, etc)
│   │   └── Layout/           # Header, Sidebar, Layout
│   │
│   ├── pages/
│   │   ├── Home.tsx          # Página inicial com cards dos modelos
│   │   └── models/           # Páginas de cada modelo
│   │       ├── MM1.tsx       # ✅ Exemplo implementado
│   │       ├── MMs.tsx       # 🚧 Para implementar
│   │       ├── MM1K.tsx      # 🚧 Para implementar
│   │       ├── MMsK.tsx      # 🚧 Para implementar
│   │       ├── MM1N.tsx      # 🚧 Para implementar
│   │       ├── MMsN.tsx      # 🚧 Para implementar
│   │       ├── MG1.tsx       # 🚧 Para implementar
│   │       └── Priority/     # 🚧 4 modelos com prioridades
│   │
│   ├── services/
│   │   └── api.ts            # Serviço de API (pronto para Flask)
│   │
│   ├── types/
│   │   └── models.ts         # Tipos TypeScript de todos os modelos
│   │
│   └── App.tsx               # Configuração de rotas
│
├── docs/
│   └── COMO_IMPLEMENTAR_MODELO.md  # 📚 Guia para implementar modelos
│
└── README.md                 # Este arquivo
```

## 📊 Modelos Disponíveis

### ✅ Implementados
1. **M/M/1** - Modelo básico (use como referência!)

### 🚧 Para Implementar (Seus parceiros)
2. M/M/s>1
3. M/M/1/K
4. M/M/s>1/K
5. M/M/1/N
6. M/M/s>1/N
7. M/G/1
8. Prioridade - Modelo 1
9. Prioridade - Modelo 2
10. Prioridade - Modelo 3
11. Prioridade - Modelo 4

## 👨‍💻 Como Implementar um Modelo

Veja o guia completo em: **[docs/COMO_IMPLEMENTAR_MODELO.md](./docs/COMO_IMPLEMENTAR_MODELO.md)**

**Resumo rápido:**
1. Vá em `src/pages/models/SeuModelo.tsx`
2. Procure por "TODO" no código
3. Implemente as fórmulas na função `handleCalculate`
4. Configure os resultados em `resultItems`
5. Teste com valores de exemplo!

## 🔌 Integração com Backend Flask

O frontend já está preparado para conectar com o backend Flask:

1. Crie um arquivo `.env` baseado no `.env.example`:
```bash
VITE_API_URL=http://localhost:5000/api
```

2. As funções de API já estão em `src/services/api.ts`:
```typescript
import { calculateMM1 } from './services/api';

// Descomentar quando backend estiver pronto:
const result = await calculateMM1(inputs);
setResults(result);
```

## 🎨 Componentes Disponíveis

Componentes já criados para facilitar o desenvolvimento:

```tsx
import { Input, Button, Card, ResultDisplay } from './components/common';

// Input com label
<Input
  label="λ (Lambda)"
  value={lambda}
  onChange={handleChange}
  required
/>

// Botão estilizado
<Button type="submit" fullWidth>
  Calcular
</Button>

// Card de navegação
<Card
  title="M/M/1"
  description="Modelo básico"
  link="/mm1"
  icon="📊"
/>

// Exibir resultados
<ResultDisplay
  results={[
    { label: 'ρ', value: 0.75, description: 'Utilização' }
  ]}
/>
```

## 🐛 Troubleshooting

### Erro ao instalar dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de import
Verifique se todos os arquivos de index (`index.ts`) estão exportando corretamente.

### Tailwind não funciona
Certifique-se que `index.css` tem as diretivas:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento (porta 5173)
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Verifica erros de código

## 🤝 Divisão de Trabalho

**Você (estrutura base):**
- ✅ Setup do projeto
- ✅ Componentes comuns
- ✅ Layout e navegação
- ✅ Modelo M/M/1 como exemplo
- ✅ Documentação

**Parceiros (implementação):**
- 🚧 Cada um pega um modelo
- 🚧 Implementa fórmulas no arquivo do modelo
- 🚧 Testa com valores de exemplo
- 🚧 Depois integra com Flask backend

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)

---

**Dúvidas?** Veja o modelo M/M/1 implementado em `src/pages/models/MM1.tsx` como referência!
