import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vagaService, curriculoService } from '../services/api';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import './DetalhesVaga.css';

function DetalhesVaga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaga, setVaga] = useState(null);
  const [curriculos, setCurriculos] = useState([]);
  const [curriculoSelecionado, setCurriculoSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingCandidatura, setLoadingCandidatura] = useState(false);
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    carregarVaga();
    carregarCurriculos();
  }, [id]);

  const carregarVaga = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vagaService.buscarPorId(id);
      setVaga(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarCurriculos = async () => {
    try {
      // Buscar currículos do usuário (assumindo que há um endpoint para isso)
      // Por enquanto, vamos usar localStorage ou permitir inserir ID
      const curriculosSalvos = localStorage.getItem('curriculosIds');
      if (curriculosSalvos) {
        const ids = JSON.parse(curriculosSalvos);
        const promises = ids.map(id => 
          curriculoService.buscarPorId(id).catch(() => null)
        );
        const resultados = await Promise.all(promises);
        setCurriculos(resultados.filter(c => c !== null));
      }
    } catch (err) {
      console.error('Erro ao carregar currículos:', err);
    }
  };

  const handleCandidatar = async () => {
    if (!curriculoSelecionado) {
      alert('Por favor, selecione um currículo para candidatar-se');
      return;
    }

    setLoadingCandidatura(true);
    try {
      await vagaService.candidatar(id, curriculoSelecionado);
      setSucesso(true);
      setTimeout(() => {
        navigate(`/curriculo/${curriculoSelecionado}`);
      }, 2000);
    } catch (err) {
      alert('Erro ao candidatar-se: ' + err.message);
    } finally {
      setLoadingCandidatura(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const formatarSalario = (salario) => {
    if (!salario) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(salario);
  };

  if (loading) {
    return (
      <div className="detalhes-vaga">
        <div className="container">
          <LoadingState message="Carregando detalhes da vaga..." />
        </div>
      </div>
    );
  }

  if (error || !vaga) {
    return (
      <div className="detalhes-vaga">
        <div className="container">
          <EmptyState
            message={error || 'Vaga não encontrada'}
            submessage="A vaga que você está procurando não existe ou foi removida."
          />
          <div className="actions">
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detalhes-vaga">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Detalhes da Vaga</span>
        </div>

        <div className="vaga-detalhes">
          <div className="vaga-header-detalhes">
            <div>
              <h1>{vaga.titulo || vaga.title || 'Título não disponível'}</h1>
              {vaga.empresa && (
                <div className="vaga-empresa-detalhes">
                  <span className="empresa-nome">{vaga.empresa}</span>
                </div>
              )}
            </div>
            {vaga.destaque && (
              <span className="badge-destaque">⭐ Destaque</span>
            )}
          </div>

          <div className="vaga-info-detalhes">
            <div className="info-item">
              <span className="info-label">📍 Localização:</span>
              <span className="info-value">{vaga.localizacao || 'Não informado'}</span>
            </div>
            {vaga.salario && (
              <div className="info-item">
                <span className="info-label">💰 Salário:</span>
                <span className="info-value">{formatarSalario(vaga.salario)}</span>
              </div>
            )}
            {vaga.modalidade && (
              <div className="info-item">
                <span className="info-label">🏢 Modalidade:</span>
                <span className="info-value">{vaga.modalidade}</span>
              </div>
            )}
            {vaga.tipoContrato && (
              <div className="info-item">
                <span className="info-label">📄 Tipo de Contrato:</span>
                <span className="info-value">{vaga.tipoContrato}</span>
              </div>
            )}
            {vaga.nivelExperiencia && (
              <div className="info-item">
                <span className="info-label">⭐ Nível:</span>
                <span className="info-value">{vaga.nivelExperiencia}</span>
              </div>
            )}
            {vaga.dataPublicacao && (
              <div className="info-item">
                <span className="info-label">📅 Publicada em:</span>
                <span className="info-value">{formatarData(vaga.dataPublicacao)}</span>
              </div>
            )}
          </div>

          {vaga.descricao && (
            <div className="vaga-descricao-detalhes">
              <h2>Descrição da Vaga</h2>
              <div className="descricao-content">
                {vaga.descricao.split('\n').map((paragrafo, index) => (
                  <p key={index}>{paragrafo}</p>
                ))}
              </div>
            </div>
          )}

          {vaga.requisitos && vaga.requisitos.length > 0 && (
            <div className="vaga-requisitos">
              <h2>Requisitos</h2>
              <ul>
                {vaga.requisitos.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {vaga.beneficios && vaga.beneficios.length > 0 && (
            <div className="vaga-beneficios">
              <h2>Benefícios</h2>
              <ul>
                {vaga.beneficios.map((beneficio, index) => (
                  <li key={index}>{beneficio}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="vaga-candidatura">
            <h2>Candidatar-se a esta vaga</h2>
            {sucesso ? (
              <div className="sucesso-candidatura">
                <p>✅ Candidatura realizada com sucesso!</p>
                <p>Redirecionando para seu currículo...</p>
              </div>
            ) : (
              <>
                {curriculos.length > 0 ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="curriculo">Selecione seu currículo:</label>
                      <select
                        id="curriculo"
                        value={curriculoSelecionado}
                        onChange={(e) => setCurriculoSelecionado(e.target.value)}
                      >
                        <option value="">Selecione um currículo</option>
                        {curriculos.map(curriculo => (
                          <option key={curriculo.id} value={curriculo.id}>
                            {curriculo.nome} (ID: {curriculo.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleCandidatar}
                      disabled={loadingCandidatura || !curriculoSelecionado}
                      className="btn btn-primary btn-large"
                    >
                      {loadingCandidatura ? 'Candidatando...' : 'Candidatar-se'}
                    </button>
                  </>
                ) : (
                  <div className="sem-curriculo">
                    <p>Você precisa ter um currículo cadastrado para se candidatar.</p>
                    <Link to="/criar" className="btn btn-primary">
                      Criar Currículo
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="vaga-actions-footer">
          <Link to="/" className="btn btn-secondary">
            ← Voltar para Home
          </Link>
          {vaga.url && (
            <a
              href={vaga.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Ver no Site Original →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalhesVaga;

