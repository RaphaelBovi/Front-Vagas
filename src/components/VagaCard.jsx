import { Link } from 'react-router-dom';
import './VagaCard.css';

function VagaCard({ vaga, onCandidatar, curriculoId, showActions = true }) {
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

  const getModalidadeBadge = (modalidade) => {
    const badges = {
      'PRESENCIAL': { text: 'Presencial', class: 'badge-presencial' },
      'REMOTO': { text: 'Remoto', class: 'badge-remoto' },
      'HIBRIDO': { text: 'Híbrido', class: 'badge-hibrido' },
    };
    return badges[modalidade?.toUpperCase()] || { text: modalidade || 'Não informado', class: 'badge-default' };
  };

  const getTipoContratoBadge = (tipo) => {
    const badges = {
      'CLT': { text: 'CLT', class: 'badge-clt' },
      'PJ': { text: 'PJ', class: 'badge-pj' },
      'ESTAGIO': { text: 'Estágio', class: 'badge-estagio' },
      'TEMPORARIO': { text: 'Temporário', class: 'badge-temporario' },
    };
    return badges[tipo?.toUpperCase()] || { text: tipo || 'Não informado', class: 'badge-default' };
  };

  const modalidade = getModalidadeBadge(vaga.modalidade);
  const tipoContrato = getTipoContratoBadge(vaga.tipoContrato);

  return (
    <div className="vaga-card">
      <div className="vaga-card-header">
        <div className="vaga-title-section">
          <h3>
            <Link to={`/vaga/${vaga.id}`} className="vaga-title-link">
              {vaga.titulo || vaga.title || 'Título não disponível'}
            </Link>
          </h3>
          {vaga.empresa && (
            <span className="vaga-empresa">{vaga.empresa}</span>
          )}
        </div>
        {vaga.destaque && (
          <span className="vaga-destaque">⭐ Destaque</span>
        )}
      </div>

      <div className="vaga-card-body">
        <div className="vaga-info-row">
          {vaga.localizacao && (
            <div className="vaga-info-item">
              <span className="vaga-icon">📍</span>
              <span>{vaga.localizacao}</span>
            </div>
          )}
          {vaga.salario && (
            <div className="vaga-info-item">
              <span className="vaga-icon">💰</span>
              <span>{formatarSalario(vaga.salario)}</span>
            </div>
          )}
        </div>

        <div className="vaga-badges">
          <span className={`badge ${modalidade.class}`}>{modalidade.text}</span>
          <span className={`badge ${tipoContrato.class}`}>{tipoContrato.text}</span>
          {vaga.nivelExperiencia && (
            <span className="badge badge-experiencia">{vaga.nivelExperiencia}</span>
          )}
        </div>

        {vaga.descricao && (
          <div className="vaga-descricao">
            <p>
              {vaga.descricao.length > 150
                ? `${vaga.descricao.substring(0, 150)}...`
                : vaga.descricao}
            </p>
          </div>
        )}

        {vaga.dataPublicacao && (
          <div className="vaga-data">
            Publicada em {formatarData(vaga.dataPublicacao)}
          </div>
        )}
      </div>

      {showActions && (
        <div className="vaga-card-actions">
          <Link to={`/vaga/${vaga.id}`} className="btn btn-secondary">
            Ver Detalhes
          </Link>
          {curriculoId && onCandidatar && (
            <button
              onClick={() => onCandidatar(vaga.id, curriculoId)}
              className="btn btn-primary"
            >
              Candidatar-se
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default VagaCard;

