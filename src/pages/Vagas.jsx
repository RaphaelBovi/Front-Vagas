import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { curriculoService } from '../services/api';
import './Vagas.css';

function Vagas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vagas, setVagas] = useState([]);
  const [curriculo, setCurriculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar currículo e vagas em paralelo
        const [curriculoData, vagasData] = await Promise.all([
          curriculoService.buscarPorId(id),
          curriculoService.buscarVagas(id),
        ]);
        setCurriculo(curriculoData);
        setVagas(vagasData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  if (loading) {
    return (
      <div className="vagas">
        <div className="container">
          <div className="loading">Buscando vagas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vagas">
        <div className="container">
          <div className="alert alert-error">
            {error}
          </div>
          <div className="actions">
            <button onClick={() => navigate(`/curriculo/${id}`)} className="btn btn-primary">
              Voltar para Currículo
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vagas">
      <div className="container">
        <div className="page-header">
          <div>
            <h2>Vagas Recomendadas</h2>
            {curriculo && (
              <p>Vagas encontradas para: <strong>{curriculo.nome}</strong></p>
            )}
          </div>
          <Link to={`/curriculo/${id}`} className="btn btn-secondary">
            Voltar para Currículo
          </Link>
        </div>

        {vagas.length === 0 ? (
          <div className="no-vagas">
            <p>Nenhuma vaga encontrada no momento.</p>
            <p>Tente atualizar mais tarde ou ajuste as skills do seu currículo.</p>
          </div>
        ) : (
          <div className="vagas-grid">
            {vagas.map((vaga, index) => (
              <div key={index} className="vaga-card">
                <div className="vaga-header">
                  <h3>{vaga.title || 'Título não disponível'}</h3>
                  {vaga.company && (
                    <span className="vaga-company">{vaga.company}</span>
                  )}
                </div>
                {vaga.location && (
                  <div className="vaga-location">
                    📍 {vaga.location}
                  </div>
                )}
                {vaga.description && (
                  <div className="vaga-description">
                    <p>{vaga.description.length > 200 
                      ? `${vaga.description.substring(0, 200)}...` 
                      : vaga.description}</p>
                  </div>
                )}
                {vaga.url && (
                  <div className="vaga-actions">
                    <a
                      href={vaga.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Ver Vaga Completa
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="info-box">
          <h4>💡 Dica</h4>
          <p>
            As vagas são encontradas com base nas skills e localização do seu currículo.
            Para encontrar mais vagas, adicione mais skills relevantes ao seu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Vagas;

