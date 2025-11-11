import unittest
import sys
import os
import math

# Adicionar o diretório raiz do projeto ao sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models.mm1 import calculate_mm1
from app.models.mms import calculate_mms
from app.models.mm1k import calculate_mm1k

class TestMM1(unittest.TestCase):
    """Testes para o modelo M/M/1"""

    def test_mm1_basic(self):
        """Teste básico com valores conhecidos"""
        result = calculate_mm1(3, 5)
        self.assertAlmostEqual(result['rho'], 0.6, places=4)
        self.assertAlmostEqual(result['L'], 1.5, places=4)
        self.assertAlmostEqual(result['Lq'], 0.9, places=4)
        self.assertAlmostEqual(result['W'], 0.5, places=4)
        self.assertAlmostEqual(result['Wq'], 0.3, places=4)
        self.assertAlmostEqual(result['P0'], 0.4, places=4)

    def test_mm1_with_n(self):
        """Teste com parâmetro n - P(n)"""
        result = calculate_mm1(3, 5, n=2)
        self.assertIn('Pn', result)
        self.assertIn('n', result)
        self.assertEqual(result['n'], 2)
        # P(2) = P0 * rho^2 = 0.4 * 0.6^2 = 0.144
        self.assertAlmostEqual(result['Pn'], 0.144, places=4)

    def test_mm1_with_r(self):
        """Teste com parâmetro r - P(n>r)"""
        result = calculate_mm1(3, 5, r=3)
        self.assertIn('PnMaiorQueR', result)
        self.assertIn('r', result)
        self.assertEqual(result['r'], 3)
        # P(n>3) = rho^(r+1) = 0.6^4 = 0.1296
        self.assertAlmostEqual(result['PnMaiorQueR'], 0.1296, places=4)

    def test_mm1_with_t(self):
        """Teste com parâmetro t - P(W>t) e P(Wq>t)"""
        result = calculate_mm1(3, 5, t=1)
        self.assertIn('PWMaiorQueT', result)
        self.assertIn('PWqMaiorQueT', result)
        self.assertIn('t', result)
        self.assertEqual(result['t'], 1)
        # P(W>1) = e^(-(mu-lambda)*t) = e^(-2*1)
        self.assertAlmostEqual(result['PWMaiorQueT'], math.exp(-2), places=4)
        # P(Wq>1) = rho * e^(-(mu-lambda)*t) = 0.6 * e^(-2)
        self.assertAlmostEqual(result['PWqMaiorQueT'], 0.6 * math.exp(-2), places=4)

    def test_mm1_with_all_optional(self):
        """Teste com todos os parâmetros opcionais"""
        result = calculate_mm1(3, 5, n=2, r=3, t=1)
        self.assertIn('Pn', result)
        self.assertIn('PnMaiorQueR', result)
        self.assertIn('PWMaiorQueT', result)
        self.assertIn('PWqMaiorQueT', result)
        self.assertEqual(result['n'], 2)
        self.assertEqual(result['r'], 3)
        self.assertEqual(result['t'], 1)

    def test_mm1_stability(self):
        """Teste de validação: lambda >= mu deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mm1(5, 3)
        with self.assertRaises(ValueError):
            calculate_mm1(5, 5)

    def test_mm1_negative_values(self):
        """Teste de validação: valores negativos devem dar erro"""
        with self.assertRaises(ValueError):
            calculate_mm1(-1, 5)
        with self.assertRaises(ValueError):
            calculate_mm1(3, -5)

    def test_mm1_negative_n(self):
        """Teste de validação: n negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mm1(3, 5, n=-1)

    def test_mm1_negative_r(self):
        """Teste de validação: r negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mm1(3, 5, r=-1)

    def test_mm1_negative_t(self):
        """Teste de validação: t negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mm1(3, 5, t=-1)

class TestMMs(unittest.TestCase):
    """Testes para o modelo M/M/s"""

    def test_mms_basic(self):
        """Teste básico com valores conhecidos"""
        result = calculate_mms(8, 5, 2)
        self.assertAlmostEqual(result['rho'], 0.8, places=4)
        self.assertAlmostEqual(result['P0'], 0.1111, places=4)
        self.assertAlmostEqual(result['Lq'], 2.8444, places=4)
        self.assertAlmostEqual(result['L'], 4.4444, places=4)
        self.assertAlmostEqual(result['Wq'], 0.3556, places=4)
        self.assertAlmostEqual(result['W'], 0.5556, places=4)
        # Deve sempre retornar PWqIgualZero
        self.assertIn('PWqIgualZero', result)

    def test_mms_with_n_less_than_s(self):
        """Teste com parâmetro n < s - P(n)"""
        result = calculate_mms(8, 5, 2, n=1)
        self.assertIn('Pn', result)
        self.assertIn('n', result)
        self.assertEqual(result['n'], 1)
        # P(1) = P0 * (lambda/mu)^n / n! para n < s
        # P(1) = 0.1111 * (8/5)^1 / 1! = 0.1111 * 1.6 = 0.1778
        self.assertAlmostEqual(result['Pn'], 0.1778, places=4)

    def test_mms_with_n_greater_than_s(self):
        """Teste com parâmetro n >= s - P(n)"""
        result = calculate_mms(8, 5, 2, n=3)
        self.assertIn('Pn', result)
        self.assertIn('n', result)
        self.assertEqual(result['n'], 3)
        # P(3) = P0 * (lambda/mu)^n / (s! * s^(n-s)) para n >= s
        # Verificamos apenas se o cálculo não dá erro
        self.assertGreater(result['Pn'], 0)

    def test_mms_with_r(self):
        """Teste com parâmetro r - P(n>r)"""
        result = calculate_mms(8, 5, 2, r=5)
        self.assertIn('PnMaiorQueR', result)
        self.assertIn('r', result)
        self.assertEqual(result['r'], 5)
        # Verificamos que está entre 0 e 1
        self.assertGreaterEqual(result['PnMaiorQueR'], 0)
        self.assertLessEqual(result['PnMaiorQueR'], 1)

    def test_mms_with_t(self):
        """Teste com parâmetro t - P(W>t) e P(Wq>t)"""
        result = calculate_mms(8, 5, 2, t=0.5)
        self.assertIn('PWMaiorQueT', result)
        self.assertIn('PWqMaiorQueT', result)
        self.assertIn('t', result)
        self.assertEqual(result['t'], 0.5)
        # Verificamos que estão entre 0 e 1
        self.assertGreaterEqual(result['PWMaiorQueT'], 0)
        self.assertLessEqual(result['PWMaiorQueT'], 1)
        self.assertGreaterEqual(result['PWqMaiorQueT'], 0)
        self.assertLessEqual(result['PWqMaiorQueT'], 1)

    def test_mms_with_all_optional(self):
        """Teste com todos os parâmetros opcionais"""
        result = calculate_mms(8, 5, 2, n=3, r=5, t=0.5)
        self.assertIn('Pn', result)
        self.assertIn('PnMaiorQueR', result)
        self.assertIn('PWMaiorQueT', result)
        self.assertIn('PWqMaiorQueT', result)
        self.assertIn('PWqIgualZero', result)

    def test_mms_stability(self):
        """Teste de validação: lambda >= s*mu deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mms(10, 5, 2)
        with self.assertRaises(ValueError):
            calculate_mms(11, 5, 2)

    def test_mms_negative_n(self):
        """Teste de validação: n negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mms(8, 5, 2, n=-1)

    def test_mms_negative_r(self):
        """Teste de validação: r negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mms(8, 5, 2, r=-1)

    def test_mms_negative_t(self):
        """Teste de validação: t negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mms(8, 5, 2, t=-1)

class TestMM1K(unittest.TestCase):
    """Testes para o modelo M/M/1/K"""

    def test_mm1k_basic(self):
        """Teste básico com valores conhecidos"""
        result = calculate_mm1k(3, 5, 4)
        self.assertAlmostEqual(result['rho'], 0.6, places=4)
        self.assertAlmostEqual(result['P0'], 0.4337, places=4)
        self.assertAlmostEqual(result['PK'], 0.0562, places=4)
        # Corrigido: campo agora é lambdaEfetivo (não lambda_eff)
        self.assertAlmostEqual(result['lambdaEfetivo'], 2.8314, places=4)
        self.assertAlmostEqual(result['L'], 1.0784, places=4)
        self.assertAlmostEqual(result['W'], 0.3809, places=4)
        self.assertAlmostEqual(result['Lq'], 0.5121, places=4)
        self.assertAlmostEqual(result['Wq'], 0.1809, places=4)
        self.assertEqual(result['K'], 4)

    def test_mm1k_rho_equal_1(self):
        """Teste com rho = 1"""
        result = calculate_mm1k(5, 5, 4)
        self.assertAlmostEqual(result['L'], 2.0, places=4)
        self.assertAlmostEqual(result['P0'], 0.2, places=4)
        self.assertEqual(result['K'], 4)

    def test_mm1k_with_n(self):
        """Teste com parâmetro n - P(n)"""
        result = calculate_mm1k(3, 5, 4, n=2)
        self.assertIn('Pn', result)
        self.assertIn('n', result)
        self.assertEqual(result['n'], 2)
        # P(2) = P0 * rho^2
        # P0 = 0.4337, rho = 0.6, então P(2) = 0.4337 * 0.36 = 0.1561
        self.assertAlmostEqual(result['Pn'], 0.1561, places=4)

    def test_mm1k_with_n_equal_K(self):
        """Teste com n = K"""
        result = calculate_mm1k(3, 5, 4, n=4)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 4)
        # P(4) deve ser igual a PK
        self.assertAlmostEqual(result['Pn'], result['PK'], places=4)

    def test_mm1k_with_n_equal_0(self):
        """Teste com n = 0"""
        result = calculate_mm1k(3, 5, 4, n=0)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 0)
        # P(0) deve ser igual a P0
        self.assertAlmostEqual(result['Pn'], result['P0'], places=4)

    def test_mm1k_n_greater_than_K(self):
        """Teste de validação: n > K deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mm1k(3, 5, 4, n=5)

    def test_mm1k_negative_n(self):
        """Teste de validação: n negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mm1k(3, 5, 4, n=-1)

    def test_mm1k_rho_greater_than_1(self):
        """Teste com rho > 1 (permitido em M/M/1/K)"""
        result = calculate_mm1k(7, 5, 4)
        self.assertGreater(result['rho'], 1)
        # Sistema deve continuar estável devido ao limite K
        self.assertGreater(result['P0'], 0)
        self.assertLess(result['P0'], 1)

if __name__ == '__main__':
    unittest.main()