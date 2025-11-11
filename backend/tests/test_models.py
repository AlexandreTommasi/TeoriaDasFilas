import unittest
import sys
import os

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

    def test_mms_stability(self):
        """Teste de validação: lambda >= s*mu deve dar erro"""
        with self.assertRaises(ValueError):
            calculate_mms(10, 5, 2)
        with self.assertRaises(ValueError):
            calculate_mms(11, 5, 2)

class TestMM1K(unittest.TestCase):
    """Testes para o modelo M/M/1/K"""

    def test_mm1k_basic(self):
        """Teste básico com valores conhecidos"""
        result = calculate_mm1k(3, 5, 4)
        self.assertAlmostEqual(result['rho'], 0.6, places=4)
        self.assertAlmostEqual(result['P0'], 0.4337, places=4)
        self.assertAlmostEqual(result['PK'], 0.0562, places=4)
        self.assertAlmostEqual(result['lambda_eff'], 2.8314, places=4)
        self.assertAlmostEqual(result['L'], 1.0784, places=4)
        self.assertAlmostEqual(result['W'], 0.3809, places=4)
        self.assertAlmostEqual(result['Lq'], 0.5121, places=4)
        self.assertAlmostEqual(result['Wq'], 0.1809, places=4)

    def test_mm1k_rho_equal_1(self):
        """Teste com rho = 1"""
        result = calculate_mm1k(5, 5, 4)
        self.assertAlmostEqual(result['L'], 2.0, places=4)
        self.assertAlmostEqual(result['P0'], 0.2, places=4)

if __name__ == '__main__':
    unittest.main()