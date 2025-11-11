"""
Script para iniciar o servidor Flask
Execute este arquivo a partir do diretório backend:
    python run.py
"""

from app.main import app

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Iniciando servidor Flask...")
    print("📍 API disponível em: http://localhost:5000/api")
    print("💚 Health check: http://localhost:5000/api/health")
    print("=" * 50)
    app.run(debug=True, port=5000)
