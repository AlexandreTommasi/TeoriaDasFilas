# 📚 Como Implementar um Modelo de Fila

Este guia mostra como você (parceiro) deve implementar as fórmulas do seu modelo de fila.

## 🎯 Arquivos que Você Vai Modificar

Para cada modelo, você precisará trabalhar em **2-3 arquivos**:

### 1. Tipos TypeScript (`src/types/models.ts`)
Define os inputs e outputs do seu modelo

### 2. Página do Modelo (`src/pages/models/SeuModelo.tsx`)
Implementa as fórmulas e validações

### 3. (Futuro) Serviço de API (`src/services/api.ts`)
Já está preparado para conectar com o Flask backend

---

## 📝 Passo a Passo - Exemplo Completo

Vamos usar o modelo **M/M/1** como exemplo (já implementado). Use ele como referência!

### Passo 1: Defina os Tipos (se necessário)

Vá em `src/types/models.ts` e encontre a interface do seu modelo.

**Exemplo para M/M/s:**
```typescript
export interface MMsInput {
  lambda: number; // Taxa de chegada
  mu: number;     // Taxa de atendimento
  s: number;      // Número de servidores
}

export interface MMsResult extends BaseQueueResult {
  rho: number;    // Utilização
  L: number;      // Clientes no sistema
  Lq: number;     // Clientes na fila
  W: number;      // Tempo no sistema
  Wq: number;     // Tempo na fila
  P0: number;     // Prob de sistema vazio
  // Adicione outros campos específicos do seu modelo
}
```

### Passo 2: Implemente as Fórmulas

Vá na página do seu modelo em `src/pages/models/`.

**Localize esta seção no código:**
```tsx
const handleCalculate = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setResults(null);

  // ⚠️ AQUI É ONDE VOCÊ VAI TRABALHAR! ⚠️

  // TODO: IMPLEMENTAR VALIDAÇÕES ESPECÍFICAS DO MODELO
  // Exemplo:
  if (inputs.lambda <= 0 || inputs.mu <= 0) {
    setError('Lambda e Mu devem ser maiores que zero');
    return;
  }

  // TODO: IMPLEMENTAR CÁLCULOS DO MODELO
  try {
    // Suas fórmulas aqui
    const rho = inputs.lambda / (inputs.s * inputs.mu);
    const L = // ... sua fórmula
    const Lq = // ... sua fórmula
    // ... etc

    setResults({
      rho,
      L,
      Lq,
      // ... outros resultados
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao calcular');
  }
};
```

### Passo 3: Configure a Exibição dos Resultados

Logo abaixo, configure quais resultados serão exibidos:

```tsx
const resultItems = results
  ? [
      {
        label: 'ρ (Utilização)',
        value: results.rho,
        description: 'Taxa de utilização do servidor',
      },
      {
        label: 'L (Clientes no Sistema)',
        value: results.L,
        description: 'Número médio de clientes no sistema',
      },
      // Adicione mais resultados conforme necessário
    ]
  : [];
```

### Passo 4: Adicione Inputs (se necessário)

Se o seu modelo precisa de inputs adicionais, adicione na seção do formulário:

```tsx
<Input
  label="s - Número de Servidores"
  value={inputs.s}
  onChange={handleInputChange('s')}
  placeholder="Ex: 3"
  required
  min={1}
  step={1}
/>
```

---

## 🧮 Fórmulas Comuns de Teoria das Filas

### M/M/1
```
ρ = λ/μ
L = ρ/(1-ρ)
Lq = ρ²/(1-ρ)
W = 1/(μ-λ)
Wq = λ/(μ(μ-λ))
P0 = 1-ρ
```

### M/M/s (você precisa implementar)
```
ρ = λ/(s*μ)
P0 = [Σ(n=0 até s-1) (λ/μ)^n/n! + (λ/μ)^s/(s!(1-ρ))]^-1
Lq = P0 * (λ/μ)^s * ρ / (s! * (1-ρ)²)
L = Lq + λ/μ
Wq = Lq/λ
W = Wq + 1/μ
```

---

## ✅ Checklist de Implementação

Use este checklist ao implementar seu modelo:

- [ ] Defini os tipos de Input e Result em `types/models.ts`
- [ ] Implementei as validações dos inputs (valores positivos, condições de estabilidade, etc)
- [ ] Implementei todas as fórmulas do modelo
- [ ] Configurei quais resultados serão exibidos
- [ ] Testei com valores de exemplo
- [ ] Verifiquei se os resultados fazem sentido matematicamente
- [ ] Removi a mensagem de "Aguardando Implementação"

---

## 🎨 Personalizações Opcionais

### Adicionar Gráfico
Se quiser adicionar visualizações, você pode instalar uma biblioteca:
```bash
npm install recharts
```

### Adicionar Mais Inputs
Basta adicionar mais componentes `<Input>` no formulário.

### Validações Customizadas
Adicione suas validações específicas antes de calcular:
```tsx
if (inputs.s < inputs.K) {
  setError('Número de servidores deve ser menor que capacidade');
  return;
}
```

---

## 🚀 Quando o Backend Estiver Pronto

Quando o Flask backend estiver implementado:

1. Crie um arquivo `.env` baseado no `.env.example`
2. Descomente a linha da chamada de API:
```tsx
// Trocar de:
const rho = inputs.lambda / inputs.mu;
// ... cálculos locais

// Para:
const result = await calculateMM1(inputs); // ou calculateMMs, etc
setResults(result);
```

3. O serviço de API já está pronto em `src/services/api.ts`!

---

## 📞 Dúvidas?

- Veja o modelo **M/M/1** completo em `src/pages/models/MM1.tsx`
- Consulte os tipos em `src/types/models.ts`
- Procure por "TODO" no seu arquivo para ver onde trabalhar

## 🎯 Estrutura de Pastas Resumida

```
frontend/
├── src/
│   ├── pages/models/
│   │   ├── MM1.tsx         ← Exemplo completo (use como referência!)
│   │   ├── MMs.tsx         ← Seu modelo aqui
│   │   ├── MM1K.tsx
│   │   └── ...
│   │
│   ├── types/
│   │   └── models.ts       ← Defina tipos aqui
│   │
│   └── services/
│       └── api.ts          ← Já preparado para Flask
```

---

Boa implementação! 🚀
