import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { curriculoService, vagaService } from '../services/api';
import VagaCard from '../components/VagaCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
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

  const handleCandidatar = async (vagaId) => {
    try {
      await vagaService.candidatar(vagaId, id);
      alert('Candidatura realizada com sucesso!');
    } catch (err) {
      alert('Erro ao candidatar-se: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="vagas">
        <div className="container">
          <LoadingState message="Buscando vagas recomendadas..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vagas">
        <div className="container">
          <EmptyState
            message={error}
            submessage="Não foi possível carregar as vagas. Tente novamente mais tarde."
          />
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
          <EmptyState
            message="Nenhuma vaga encontrada no momento."
            submessage="Tente atualizar mais tarde ou ajuste as skills do seu currículo."
          />
        ) : (
          <>
            <div className="vagas-grid">
              {vagas.map((vaga, index) => (
                <VagaCard
                  key={vaga.id || index}
                  vaga={vaga}
                  curriculoId={id}
                  onCandidatar={handleCandidatar}
                />
              ))}
            </div>

            <div className="info-box">
              <h4>💡 Dica</h4>
              <p>
                As vagas são encontradas com base nas skills e localização do seu currículo.
                Para encontrar mais vagas, adicione mais skills relevantes ao seu perfil.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Vagas;
