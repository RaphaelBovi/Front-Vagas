import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { curriculoService } from '../services/api';
import './Home.css';

function Home() {
  const [curriculos, setCurriculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [curriculoEncontrado, setCurriculoEncontrado] = useState(null);

  const buscarCurriculo = async () => {
    if (!searchId.trim()) {
      setError('Por favor, informe um ID');
      return;
    }

    setLoading(true);
    setError(null);
    setCurriculoEncontrado(null);

    try {
      const data = await curriculoService.buscarPorId(searchId);
      setCurriculoEncontrado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este currículo?')) {
      return;
    }

    try {
      await curriculoService.deletar(id);
      if (curriculoEncontrado?.id === id) {
        setCurriculoEncontrado(null);
      }
      alert('Currículo deletado com sucesso!');
    } catch (err) {
      alert('Erro ao deletar: ' + err.message);
    }
  };

  return (
    <div className="home">
      <div className="container">
        <div className="home-header">
          <h2>Buscar Currículo</h2>
          <p>Digite o ID do currículo para visualizar</p>
        </div>

        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Digite o ID do currículo"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarCurriculo()}
            />
            <button onClick={buscarCurriculo} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {curriculoEncontrado && (
          <div className="curriculo-card">
            <div className="card-header">
              <h3>{curriculoEncontrado.nome}</h3>
              <div className="card-actions">
                <Link
                  to={`/curriculo/${curriculoEncontrado.id}`}
                  className="btn btn-primary"
                >
                  Ver Detalhes
                </Link>
                <Link
                  to={`/curriculo/${curriculoEncontrado.id}/editar`}
                  className="btn btn-secondary"
                >
                  Editar
                </Link>
                <Link
                  to={`/curriculo/${curriculoEncontrado.id}/vagas`}
                  className="btn btn-success"
                >
                  Ver Vagas
                </Link>
                <button
                  onClick={() => handleDelete(curriculoEncontrado.id)}
                  className="btn btn-danger"
                >
                  Deletar
                </button>
              </div>
            </div>
            <div className="card-body">
              <p><strong>Residência:</strong> {curriculoEncontrado.residencia}</p>
              <p><strong>Data de Nascimento:</strong> {new Date(curriculoEncontrado.dataNascimento).toLocaleDateString('pt-BR')}</p>
              <p><strong>Escolaridade:</strong> {curriculoEncontrado.nivelEscolaridade}</p>
              {curriculoEncontrado.skills && curriculoEncontrado.skills.length > 0 && (
                <div>
                  <strong>Skills:</strong>
                  <div className="tags">
                    {curriculoEncontrado.skills.map((skill, index) => (
                      <span key={index} className="tag">
                        {skill.nome} ({skill.nivel})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Como usar</h3>
          <ul>
            <li>Digite o ID de um currículo existente para visualizá-lo</li>
            <li>Crie um novo currículo clicando em "Novo Currículo" no menu</li>
            <li>Após criar, você receberá o ID do currículo para futuras buscas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;

