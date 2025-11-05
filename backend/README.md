# 🐍 Backend Flask - Teoria das Filas

Backend em Python para cálculo de modelos de Teoria das Filas.

## 🚀 Instalação

```bash
# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

## ▶️ Rodar o Servidor

```bash
# Opção 1: Rodar diretamente
python app/main.py

# Opção 2: Usar flask run
set FLASK_APP=app.main
flask run

# O servidor estará rodando em: http://localhost:5000
```

## 🏗️ Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicação Flask principal
│   │
│   ├── models/              # 🎯 FÓRMULAS AQUI
│   │   ├── mm1.py          # M/M/1
│   │   ├── mms.py          # M/M/s
│   │   ├── mm1k.py         # M/M/1/K
│   │   ├── mmsk.py         # M/M/s/K
│   │   ├── mm1n.py         # M/M/1/N
│   │   ├── mmsn.py         # M/M/s/N
│   │   ├── mg1.py          # M/G/1
│   │   └── priority.py     # 4 modelos com prioridades
│   │
│   └── routes/
│       └── queue_routes.py  # Endpoints da API
│
├── tests/
│   └── test_models.py       # Testes unitários
│
├── requirements.txt
└── README.md
```

## 📊 Modelos a Implementar

Cada parceiro deve escolher um ou mais modelos para implementar:

### 🚧 Pendentes
- [ ] M/M/1 - Modelo básico
- [ ] M/M/s>1 - Múltiplos servidores
- [ ] M/M/1/K - Capacidade limitada
- [ ] M/M/s>1/K - Múltiplos servidores + capacidade limitada
- [ ] M/M/1/N - População finita
- [ ] M/M/s>1/N - Múltiplos servidores + população finita
- [ ] M/G/1 - Distribuição geral
- [ ] Priority 1, 2, 3, 4 - Modelos com prioridades

## 👨‍💻 Como Implementar um Modelo

### Passo 1: Implementar as Fórmulas

Vá no arquivo do seu modelo em `app/models/` e implemente as fórmulas:

**Exemplo: `app/models/mm1.py`**
```python
def calculate_mm1(lambda_: float, mu: float) -> dict:
    # Validações
    if lambda_ <= 0 or mu <= 0:
        raise ValueError("Lambda e Mu devem ser positivos")

    if lambda_ >= mu:
        raise ValueError("Sistema instável: lambda deve ser menor que mu")

    # Cálculos
    rho = lambda_ / mu
    L = rho / (1 - rho)
    Lq = (rho ** 2) / (1 - rho)
    W = 1 / (mu - lambda_)
    Wq = lambda_ / (mu * (mu - lambda_))
    P0 = 1 - rho

    return {
        'rho': rho,
        'L': L,
        'Lq': Lq,
        'W': W,
        'Wq': Wq,
        'P0': P0
    }
```

### Passo 2: Descomentar o Import nas Rotas

Em `app/routes/queue_routes.py`, descomente:
```python
from app.models.mm1 import calculate_mm1
```

### Passo 3: Descomentar o Endpoint

Em `app/routes/queue_routes.py`, descomente a chamada da função:
```python
@queue_bp.route('/calculate/mm1', methods=['POST'])
def api_calculate_mm1():
    # ... código ...
    result = calculate_mm1(lambda_, mu)
    return jsonify(result), 200
```

### Passo 4: Registrar o Blueprint

Em `app/main.py`, descomente:
```python
from app.routes.queue_routes import queue_bp
app.register_blueprint(queue_bp, url_prefix='/api')
```

### Passo 5: Testar

```bash
# Teste manual com curl
curl -X POST http://localhost:5000/api/calculate/mm1 \
  -H "Content-Type: application/json" \
  -d '{"lambda": 3, "mu": 5}'

# Ou com Postman/Insomnia
```

## 🧪 Testes

Crie testes unitários em `tests/test_models.py`:

```python
import unittest
from app.models.mm1 import calculate_mm1

class TestMM1(unittest.TestCase):
    def test_mm1_basic(self):
        result = calculate_mm1(3, 5)
        self.assertAlmostEqual(result['rho'], 0.6)
        self.assertAlmostEqual(result['L'], 1.5)

    def test_mm1_invalid(self):
        with self.assertRaises(ValueError):
            calculate_mm1(5, 3)  # lambda > mu

if __name__ == '__main__':
    unittest.main()
```

Rodar testes:
```bash
python -m pytest tests/
# ou
python -m unittest discover tests/
```

## 📡 Endpoints da API

Todos os endpoints seguem o padrão:

```
POST /api/calculate/{modelo}
Content-Type: application/json

Body: {
  "lambda": float,
  "mu": float,
  // ... outros parâmetros conforme o modelo
}

Response: {
  "rho": float,
  "L": float,
  "Lq": float,
  // ... outras métricas
}
```

### Lista de Endpoints

- `POST /api/calculate/mm1` - M/M/1
- `POST /api/calculate/mms` - M/M/s
- `POST /api/calculate/mm1k` - M/M/1/K
- `POST /api/calculate/mmsk` - M/M/s/K
- `POST /api/calculate/mm1n` - M/M/1/N
- `POST /api/calculate/mmsn` - M/M/s/N
- `POST /api/calculate/mg1` - M/G/1
- `POST /api/calculate/priority1` - Prioridade 1
- `POST /api/calculate/priority2` - Prioridade 2
- `POST /api/calculate/priority3` - Prioridade 3
- `POST /api/calculate/priority4` - Prioridade 4

## 🔧 Troubleshooting

### CORS Error
Se o frontend não conseguir conectar, verifique se o CORS está configurado em `app/main.py`:
```python
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})
```

### Import Error
Certifique-se de estar na pasta raiz do backend ao rodar:
```bash
# Correto:
cd backend
python app/main.py

# Errado:
cd backend/app
python main.py
```

### Módulo não encontrado
Instale as dependências:
```bash
pip install -r requirements.txt
```

## 📚 Bibliotecas Úteis

- **numpy**: Cálculos numéricos, arrays
- **scipy**: Funções matemáticas avançadas (fatorial, combinações)
- **math**: Funções matemáticas básicas (exp, log, etc)

Exemplo de uso:
```python
import numpy as np
from scipy.special import factorial
from math import exp

# Calcular P0 para M/M/s
def calculate_p0(lambda_, mu, s):
    rho = lambda_ / mu
    sum_term = sum((rho ** n) / factorial(n) for n in range(s))
    last_term = (rho ** s) / (factorial(s) * (1 - rho/s))
    p0 = 1 / (sum_term + last_term)
    return p0
```

## 🤝 Divisão de Trabalho

**Sugestão de divisão entre parceiros:**

- **Parceiro 1**: M/M/1, M/M/1/K
- **Parceiro 2**: M/M/s, M/M/s/K
- **Parceiro 3**: M/M/1/N, M/M/s/N
- **Parceiro 4**: M/G/1, Prioridades

Cada um implementa:
1. As fórmulas em `app/models/`
2. Descomenta o endpoint em `app/routes/`
3. Cria testes básicos
4. Testa com o frontend

---

**Dúvidas?** Veja os comentários TODO nos arquivos Python!
