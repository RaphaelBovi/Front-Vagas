import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { curriculoService } from '../services/api';
import LoadingState from '../components/LoadingState';
import './VisualizarCurriculo.css';

function VisualizarCurriculo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculo, setCurriculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarCurriculo = async () => {
      try {
        const data = await curriculoService.buscarPorId(id);
        setCurriculo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarCurriculo();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este currículo?')) {
      return;
    }

    try {
      await curriculoService.deletar(id);
      alert('Currículo deletado com sucesso!');
      navigate('/');
    } catch (err) {
      alert('Erro ao deletar: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="visualizar-curriculo">
        <div className="container">
          <LoadingState message="Carregando currículo..." />
        </div>
      </div>
    );
  }

  if (error || !curriculo) {
    return (
      <div className="visualizar-curriculo">
        <div className="container">
          <div className="alert alert-error">
            {error || 'Currículo não encontrado'}
          </div>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="visualizar-curriculo">
      <div className="container">
        <div className="curriculo-header">
          <div>
            <h2>{curriculo.nome}</h2>
            <p className="curriculo-id">ID: {curriculo.id}</p>
          </div>
          <div className="header-actions">
            <Link to={`/curriculo/${id}/editar`} className="btn btn-secondary">
              Editar
            </Link>
            <Link to={`/curriculo/${id}/vagas`} className="btn btn-success">
              Ver Vagas
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Deletar
            </button>
          </div>
        </div>

        <div className="curriculo-content">
          <div className="info-section">
            <h3>Dados Pessoais</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Residência:</strong>
                <span>{curriculo.residencia}</span>
              </div>
              <div className="info-item">
                <strong>Data de Nascimento:</strong>
                <span>{new Date(curriculo.dataNascimento).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="info-item">
                <strong>Nível de Escolaridade:</strong>
                <span>{curriculo.nivelEscolaridade}</span>
              </div>
              {curriculo.nomeUniversidade && (
                <div className="info-item">
                  <strong>Universidade:</strong>
                  <span>{curriculo.nomeUniversidade}</span>
                </div>
              )}
            </div>
          </div>

          {(curriculo.cargoDesejado || curriculo.pretensaoSalarial) && (
            <div className="info-section">
              <h3>Objetivos Profissionais</h3>
              <div className="info-grid">
                {curriculo.cargoDesejado && (
                  <div className="info-item">
                    <strong>Cargo Desejado:</strong>
                    <span>{curriculo.cargoDesejado}</span>
                  </div>
                )}
                {curriculo.pretensaoSalarial && (
                  <div className="info-item">
                    <strong>Pretensão Salarial:</strong>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(curriculo.pretensaoSalarial)}
                    </span>
                  </div>
                )}
                <div className="info-item">
                  <strong>Disponibilidade:</strong>
                  <span>
                    {curriculo.disponibilidadeMudanca && 'Mudança '}
                    {curriculo.disponibilidadeViagem && 'Viagens'}
                    {!curriculo.disponibilidadeMudanca && !curriculo.disponibilidadeViagem && 'Não informado'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {curriculo.experiencias && curriculo.experiencias.length > 0 && (
            <div className="info-section">
              <h3>Experiências Profissionais</h3>
              <div className="list">
                {curriculo.experiencias.map((exp, index) => (
                  <div key={index} className="list-item experiencia-item">
                    <div className="list-item-header">
                      <div>
                        <strong>{exp.cargo}</strong>
                        {exp.empresa && <span className="empresa-nome"> - {exp.empresa}</span>}
                      </div>
                      <div className="experiencia-periodo">
                        {exp.dataInicio && (
                          <span>
                            {new Date(exp.dataInicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {exp.dataInicio && (exp.dataFim || exp.atualmente) && ' - '}
                        {exp.atualmente ? (
                          <span className="badge badge-atual">Atual</span>
                        ) : exp.dataFim ? (
                          <span>
                            {new Date(exp.dataFim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {exp.descricao && (
                      <p className="list-item-subtitle">{exp.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {curriculo.skills && curriculo.skills.length > 0 && (
            <div className="info-section">
              <h3>Skills</h3>
              <div className="tags">
                {curriculo.skills.map((skill, index) => (
                  <span key={index} className="tag tag-skill">
                    {skill.nome} <span className="tag-level">({skill.nivel})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {curriculo.cursosComplementares && curriculo.cursosComplementares.length > 0 && (
            <div className="info-section">
              <h3>Cursos Complementares</h3>
              <div className="list">
                {curriculo.cursosComplementares.map((curso, index) => (
                  <div key={index} className="list-item">
                    <div className="list-item-header">
                      <strong>{curso.nome}</strong>
                      {curso.cargaHoraria && (
                        <span className="badge">{curso.cargaHoraria}h</span>
                      )}
                    </div>
                    {curso.instituicao && (
                      <p className="list-item-subtitle">{curso.instituicao}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {curriculo.idiomas && curriculo.idiomas.length > 0 && (
            <div className="info-section">
              <h3>Idiomas</h3>
              <div className="list">
                {curriculo.idiomas.map((idioma, index) => (
                  <div key={index} className="list-item">
                    <strong>{idioma.nome}</strong>
                    <span className="badge">{idioma.nivel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizarCurriculo;

