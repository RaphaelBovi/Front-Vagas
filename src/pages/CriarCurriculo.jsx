import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { curriculoService, vagaService } from '../services/api';
import CurriculoForm from '../components/CurriculoForm';
import VagaCard from '../components/VagaCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import './CriarCurriculo.css';

function CriarCurriculo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [curriculoCriado, setCurriculoCriado] = useState(null);
  const [vagasRecomendadas, setVagasRecomendadas] = useState([]);
  const [loadingVagas, setLoadingVagas] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const curriculo = await curriculoService.criar(formData);
      setCurriculoCriado(curriculo);
      
      // Buscar vagas recomendadas imediatamente após criar o currículo
      setLoadingVagas(true);
      try {
        const vagas = await curriculoService.buscarVagas(curriculo.id);
        setVagasRecomendadas(vagas);
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
        // Não mostrar erro, apenas não exibir vagas
      } finally {
        setLoadingVagas(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidatar = async (vagaId) => {
    if (!curriculoCriado?.id) return;
    
    try {
      await vagaService.candidatar(vagaId, curriculoCriado.id);
      alert('Candidatura realizada com sucesso!');
    } catch (err) {
      alert('Erro ao candidatar-se: ' + err.message);
    }
  };

  const handleVerDetalhes = () => {
    if (curriculoCriado?.id) {
      navigate(`/curriculo/${curriculoCriado.id}`);
    }
  };

  // Se o currículo foi criado, mostrar vagas recomendadas
  if (curriculoCriado) {
    return (
      <div className="criar-curriculo">
        <div className="container">
          <div className="success-message">
            <h2>✅ Currículo Criado com Sucesso!</h2>
            <p>Seu currículo foi criado com o ID: <strong>{curriculoCriado.id}</strong></p>
            <div className="success-actions">
              <button onClick={handleVerDetalhes} className="btn btn-primary">
                Ver Meu Currículo
              </button>
              <button onClick={() => navigate('/')} className="btn btn-secondary">
                Voltar para Home
              </button>
            </div>
          </div>

          <section className="vagas-recomendadas-section">
            <div className="section-header">
              <h2>🎯 Vagas Recomendadas para Você</h2>
              <p>Com base no seu perfil, encontramos estas oportunidades:</p>
            </div>

            {loadingVagas ? (
              <LoadingState message="Buscando vagas compatíveis..." />
            ) : vagasRecomendadas.length === 0 ? (
              <EmptyState
                message="Nenhuma vaga encontrada no momento."
                submessage="Tente atualizar mais tarde ou ajuste as skills do seu currículo."
              />
            ) : (
              <>
                <div className="vagas-grid">
                  {vagasRecomendadas.map((vaga, index) => (
                    <VagaCard
                      key={vaga.id || index}
                      vaga={vaga}
                      curriculoId={curriculoCriado.id}
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
          </section>
        </div>
      </div>
    );
  }

  // Formulário de criação
  return (
    <div className="criar-curriculo">
      <div className="container">
        <div className="page-header">
          <h2>Criar Novo Currículo</h2>
          <p>Preencha os dados abaixo para criar seu currículo e receber recomendações de vagas</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <CurriculoForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}

export default CriarCurriculo;
