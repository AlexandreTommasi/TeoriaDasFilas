import unittest
import sys
import os
import math

# Adicionar o diretório raiz do projeto ao sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models.mm1 import calculate_mm1
from app.models.mms import calculate_mms
from app.models.mm1k import calculate_mm1k
from app.models.mmsk import calculate_mmsk
from app.models.mmsn import calculate_mmsn

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

class TestMMsK(unittest.TestCase):
    """Testes para o modelo M/M/s/K"""

    def test_mmsk_basic(self):
        """Teste básico com valores conhecidos"""
        result = calculate_mmsk(3, 2, 2, 5)
        # Verificações básicas
        self.assertGreater(result['P0'], 0)
        self.assertLess(result['P0'], 1)
        self.assertGreater(result['PK'], 0)
        self.assertLess(result['PK'], 1)
        self.assertGreaterEqual(result['L'], 0)
        self.assertGreaterEqual(result['Lq'], 0)
        self.assertGreaterEqual(result['W'], 0)
        self.assertGreaterEqual(result['Wq'], 0)
        # rho = lambda/(s*mu) = 3/(2*2) = 0.75
        self.assertAlmostEqual(result['rho'], 0.75, places=4)

    def test_mmsk_with_n(self):
        """Teste com parâmetro n - P(n)"""
        result = calculate_mmsk(3, 2, 2, 5, n=3)
        self.assertIn('Pn', result)
        self.assertIn('n', result)
        self.assertEqual(result['n'], 3)
        self.assertGreater(result['Pn'], 0)
        self.assertLess(result['Pn'], 1)

    def test_mmsk_with_n_equal_K(self):
        """Teste com n = K"""
        result = calculate_mmsk(3, 2, 2, 5, n=5)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 5)
        # P(K) deve ser igual a PK
        self.assertAlmostEqual(result['Pn'], result['PK'], places=6)

    def test_mmsk_with_n_equal_0(self):
        """Teste com n = 0"""
        result = calculate_mmsk(3, 2, 2, 5, n=0)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 0)
        # P(0) deve ser igual a P0
        self.assertAlmostEqual(result['Pn'], result['P0'], places=6)

    def test_mmsk_n_less_than_s(self):
        """Teste com n < s (todos os servidores não estão ocupados)"""
        result = calculate_mmsk(3, 2, 3, 6, n=1)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 1)
        self.assertGreater(result['Pn'], 0)

    def test_mmsk_n_greater_than_s(self):
        """Teste com n > s (fila formada)"""
        result = calculate_mmsk(3, 2, 2, 5, n=4)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 4)
        self.assertGreater(result['Pn'], 0)

    def test_mmsk_n_greater_than_K(self):
        """Teste de validação: n > K deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mmsk(3, 2, 2, 5, n=6)

    def test_mmsk_negative_n(self):
        """Teste de validação: n negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mmsk(3, 2, 2, 5, n=-1)

    def test_mmsk_K_less_than_s(self):
        """Teste de validação: K < s deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mmsk(3, 2, 3, 2)

    def test_mmsk_lambda_eff_less_than_lambda(self):
        """Lambda efetivo deve ser menor ou igual a lambda"""
        result = calculate_mmsk(5, 2, 2, 4)
        self.assertLessEqual(result['lambdaEfetivo'], 5)
        # lambda_eff = lambda * (1 - PK)
        expected_lambda_eff = 5 * (1 - result['PK'])
        self.assertAlmostEqual(result['lambdaEfetivo'], expected_lambda_eff, places=6)

    def test_mmsk_rho_equal_1(self):
        """Teste com rho = 1"""
        # lambda/(s*mu) = 1 => lambda = s*mu
        result = calculate_mmsk(4, 2, 2, 5)
        self.assertAlmostEqual(result['rho'], 1.0, places=4)
        self.assertGreater(result['P0'], 0)
        self.assertGreater(result['PK'], 0)

    def test_mmsk_consistency_L_Lq(self):
        """L deve ser maior ou igual a Lq"""
        result = calculate_mmsk(3, 2, 2, 5)
        self.assertGreaterEqual(result['L'], result['Lq'])

    def test_mmsk_little_law(self):
        """Verificar Lei de Little: L = lambda_eff * W e Lq = lambda_eff * Wq"""
        result = calculate_mmsk(3, 2, 2, 5)
        # L = lambda_eff * W
        expected_L = result['lambdaEfetivo'] * result['W']
        self.assertAlmostEqual(result['L'], expected_L, places=4)
        # Lq = lambda_eff * Wq
        expected_Lq = result['lambdaEfetivo'] * result['Wq']
        self.assertAlmostEqual(result['Lq'], expected_Lq, places=4)

class TestMMsN(unittest.TestCase):
    """Testes para o modelo M/M/s/N"""

    def test_mmsn_basic(self):
        """Teste básico com valores conhecidos"""
        result = calculate_mmsn(0.5, 1, 2, 10)
        # Verificações básicas
        self.assertGreater(result['P0'], 0)
        self.assertLess(result['P0'], 1)
        self.assertGreaterEqual(result['L'], 0)
        self.assertLessEqual(result['L'], 10)  # L não pode ser maior que N
        self.assertGreaterEqual(result['Lq'], 0)
        self.assertGreaterEqual(result['W'], 0)
        self.assertGreaterEqual(result['Wq'], 0)
        # rho = N*lambda/(s*mu) = 10*0.5/(2*1) = 2.5
        self.assertAlmostEqual(result['rho'], 2.5, places=4)

    def test_mmsn_with_n(self):
        """Teste com parâmetro n - P(n)"""
        result = calculate_mmsn(0.5, 1, 2, 10, n=5)
        self.assertIn('Pn', result)
        self.assertIn('n', result)
        self.assertEqual(result['n'], 5)
        self.assertGreater(result['Pn'], 0)
        self.assertLess(result['Pn'], 1)

    def test_mmsn_with_n_equal_N(self):
        """Teste com n = N (toda população no sistema)"""
        result = calculate_mmsn(0.5, 1, 2, 10, n=10)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 10)
        self.assertGreater(result['Pn'], 0)
        self.assertLess(result['Pn'], 1)

    def test_mmsn_with_n_equal_0(self):
        """Teste com n = 0"""
        result = calculate_mmsn(0.5, 1, 2, 10, n=0)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 0)
        # P(0) deve ser igual a P0
        self.assertAlmostEqual(result['Pn'], result['P0'], places=6)

    def test_mmsn_n_less_than_s(self):
        """Teste com n < s (todos os servidores não estão ocupados)"""
        result = calculate_mmsn(0.5, 1, 3, 10, n=2)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 2)
        self.assertGreater(result['Pn'], 0)

    def test_mmsn_n_greater_than_s(self):
        """Teste com n > s (fila formada)"""
        result = calculate_mmsn(0.5, 1, 2, 10, n=5)
        self.assertIn('Pn', result)
        self.assertEqual(result['n'], 5)
        self.assertGreater(result['Pn'], 0)

    def test_mmsn_n_greater_than_N(self):
        """Teste de validação: n > N deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mmsn(0.5, 1, 2, 10, n=11)

    def test_mmsn_negative_n(self):
        """Teste de validação: n negativo deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mmsn(0.5, 1, 2, 10, n=-1)

    def test_mmsn_N_less_than_s(self):
        """Teste de validação: N <= s deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mmsn(0.5, 1, 3, 2)

    def test_mmsn_N_equal_s(self):
        """Teste de validação: N = s deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mmsn(0.5, 1, 3, 3)

    def test_mmsn_L_less_than_N(self):
        """L deve ser menor ou igual a N"""
        result = calculate_mmsn(0.5, 1, 2, 10)
        self.assertLessEqual(result['L'], 10)

    def test_mmsn_consistency_L_Lq(self):
        """L deve ser maior ou igual a Lq"""
        result = calculate_mmsn(0.5, 1, 2, 10)
        self.assertGreaterEqual(result['L'], result['Lq'])

    def test_mmsn_num_operacionais(self):
        """Número operacionais deve ser N - L"""
        result = calculate_mmsn(0.5, 1, 2, 10)
        expected_num_op = 10 - result['L']
        self.assertAlmostEqual(result['numOperacionais'], expected_num_op, places=6)

    def test_mmsn_lambda_efetivo(self):
        """Lambda efetivo deve ser lambda * (N - L)"""
        result = calculate_mmsn(0.5, 1, 2, 10)
        expected_lambda_eff = 0.5 * (10 - result['L'])
        self.assertAlmostEqual(result['lambdaEfetivo'], expected_lambda_eff, places=6)

    def test_mmsn_little_law(self):
        """Verificar Lei de Little: L = lambda_eff * W e Lq = lambda_eff * Wq"""
        result = calculate_mmsn(0.5, 1, 2, 10)
        # L = lambda_eff * W
        expected_L = result['lambdaEfetivo'] * result['W']
        self.assertAlmostEqual(result['L'], expected_L, places=4)
        # Lq = lambda_eff * Wq
        expected_Lq = result['lambdaEfetivo'] * result['Wq']
        self.assertAlmostEqual(result['Lq'], expected_Lq, places=4)

    def test_mmsn_PWqIgualZero(self):
        """P(Wq=0) deve estar entre 0 e 1"""
        result = calculate_mmsn(0.5, 1, 2, 10)
        self.assertGreaterEqual(result['PWqIgualZero'], 0)
        self.assertLessEqual(result['PWqIgualZero'], 1)

    def test_mmsn_sum_probabilities(self):
        """Soma de todas as probabilidades P(n) deve ser aproximadamente 1"""
        result_base = calculate_mmsn(0.5, 1, 2, 10)
        total_prob = 0
        for i in range(11):  # 0 até N=10
            result = calculate_mmsn(0.5, 1, 2, 10, n=i)
            total_prob += result['Pn']
        self.assertAlmostEqual(total_prob, 1.0, places=6)

if __name__ == '__main__':
    unittest.main()