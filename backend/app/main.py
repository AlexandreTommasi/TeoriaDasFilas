"""
Aplicação Flask principal para cálculo de Teoria das Filas

Este é o ponto de entrada da aplicação.
Configure as rotas e o CORS aqui.
"""

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configurar CORS para permitir requisições do frontend React
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],  # Porta padrão do Vite
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# ==========================================
# Importar e registrar rotas
# ==========================================
from app.routes.queue_routes import queue_bp
app.register_blueprint(queue_bp, url_prefix='/api')


@app.route('/api/health')
def health():
    """Endpoint para verificar se o servidor está rodando"""
    return {"status": "ok", "message": "Backend Flask está rodando!"}, 200
