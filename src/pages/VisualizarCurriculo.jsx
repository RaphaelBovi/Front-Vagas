import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { curriculoService } from '../services/api';
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
          <div className="loading">Carregando...</div>
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
            </div>
          </div>

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

