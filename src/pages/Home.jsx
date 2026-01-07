import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vagaService, empresaService, curriculoService } from '../services/api';
import VagaCard from '../components/VagaCard';
import FiltrosVagas from '../components/FiltrosVagas';
import './Home.css';

function Home() {
  const [vagasDestaque, setVagasDestaque] = useState([]);
  const [vagasRecentes, setVagasRecentes] = useState([]);
  const [vagasFiltradas, setVagasFiltradas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [error, setError] = useState(null);
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const [palavraChave, setPalavraChave] = useState('');
  const [filtros, setFiltros] = useState({});

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    setLoading(true);
    setError(null);
    try {
      const [destaque, recentes, empresasData] = await Promise.all([
        vagaService.buscarDestaque().catch(() => []),
        vagaService.buscarRecentes(10).catch(() => []),
        empresaService.listar().catch(() => []),
      ]);
      setVagasDestaque(destaque);
      setVagasRecentes(recentes);
      setEmpresas(empresasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!palavraChave.trim()) return;

    setLoadingBusca(true);
    setError(null);
    setBuscaAtiva(true);

    try {
      const resultados = await vagaService.buscar(palavraChave);
      setVagasFiltradas(resultados);
    } catch (err) {
      setError(err.message);
      setVagasFiltradas([]);
    } finally {
      setLoadingBusca(false);
    }
  };

  const handleFiltrar = async (filtrosAplicados) => {
    setLoadingBusca(true);
    setError(null);
    setBuscaAtiva(true);
    setFiltros(filtrosAplicados);

    try {
      const resultados = await vagaService.listar(filtrosAplicados);
      setVagasFiltradas(resultados);
    } catch (err) {
      setError(err.message);
      setVagasFiltradas([]);
    } finally {
      setLoadingBusca(false);
    }
  };

  const handleLimparFiltros = () => {
    setFiltros({});
    setVagasFiltradas([]);
    setBuscaAtiva(false);
    setPalavraChave('');
  };

  const handleCandidatar = async (vagaId, curriculoId) => {
    if (!curriculoId) {
      alert('Você precisa ter um currículo cadastrado para se candidatar. Crie um currículo primeiro!');
      return;
    }
    try {
      await vagaService.candidatar(vagaId, curriculoId);
      alert('Candidatura realizada com sucesso!');
    } catch (err) {
      alert('Erro ao candidatar-se: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando vagas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        {/* Hero Section */}
        <div className="home-hero">
          <h1>Encontre a Vaga Ideal para Você</h1>
          <p>Milhares de oportunidades esperando por você</p>
        </div>

        {/* Busca Rápida */}
        <div className="busca-rapida">
          <form onSubmit={handleBuscar} className="search-box">
            <input
              type="text"
              placeholder="Buscar vagas por palavra-chave (ex: Desenvolvedor, Analista...)"
              value={palavraChave}
              onChange={(e) => setPalavraChave(e.target.value)}
            />
            <button type="submit" disabled={loadingBusca}>
              {loadingBusca ? 'Buscando...' : '🔍 Buscar'}
            </button>
          </form>
        </div>

        {/* Filtros */}
        <FiltrosVagas onFiltrar={handleFiltrar} onLimpar={handleLimparFiltros} />

        {/* Erro */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Resultados da Busca/Filtros */}
        {buscaAtiva && (
          <section className="section-vagas">
            <div className="section-header">
              <h2>Resultados da Busca</h2>
              <button onClick={handleLimparFiltros} className="btn btn-secondary">
                Limpar Busca
              </button>
            </div>
            {loadingBusca ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Buscando vagas...</p>
              </div>
            ) : vagasFiltradas.length === 0 ? (
              <div className="empty-state">
                <p>😔 Nenhuma vaga encontrada com os filtros selecionados.</p>
                <p>Tente ajustar os filtros ou buscar por outras palavras-chave.</p>
              </div>
            ) : (
              <div className="vagas-grid">
                {vagasFiltradas.map((vaga) => (
                  <VagaCard
                    key={vaga.id}
                    vaga={vaga}
                    onCandidatar={handleCandidatar}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Vagas em Destaque */}
        {!buscaAtiva && vagasDestaque.length > 0 && (
          <section className="section-vagas">
            <div className="section-header">
              <h2>⭐ Vagas em Destaque</h2>
              <Link to="/vagas/destaque" className="btn btn-secondary">
                Ver Todas
              </Link>
            </div>
            <div className="vagas-grid">
              {vagasDestaque.map((vaga) => (
                <VagaCard
                  key={vaga.id}
                  vaga={vaga}
                  onCandidatar={handleCandidatar}
                />
              ))}
            </div>
          </section>
        )}

        {/* Vagas Recentes */}
        {!buscaAtiva && vagasRecentes.length > 0 && (
          <section className="section-vagas">
            <div className="section-header">
              <h2>🆕 Vagas Recentes</h2>
              <Link to="/vagas/recentes" className="btn btn-secondary">
                Ver Todas
              </Link>
            </div>
            <div className="vagas-grid">
              {vagasRecentes.map((vaga) => (
                <VagaCard
                  key={vaga.id}
                  vaga={vaga}
                  onCandidatar={handleCandidatar}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empresas */}
        {!buscaAtiva && empresas.length > 0 && (
          <section className="section-empresas">
            <div className="section-header">
              <h2>🏢 Empresas Parceiras</h2>
            </div>
            <div className="empresas-grid">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="empresa-card">
                  <h3>{empresa.nome}</h3>
                  {empresa.descricao && <p>{empresa.descricao}</p>}
                  {empresa.site && (
                    <a href={empresa.site} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Visitar Site
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty States */}
        {!buscaAtiva && vagasDestaque.length === 0 && vagasRecentes.length === 0 && (
          <div className="empty-state">
            <p>📋 Nenhuma vaga disponível no momento.</p>
            <p>Volte mais tarde para ver novas oportunidades!</p>
          </div>
        )}

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Não encontrou o que procura?</h2>
          <p>Crie seu currículo e receba recomendações personalizadas de vagas</p>
          <Link to="/criar" className="btn btn-primary btn-large">
            Criar Meu Currículo
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Home;
