import { useState } from 'react';
import { ESTADOS_BRASIL, TIPO_CONTRATO, MODALIDADE, NIVEL_EXPERIENCIA } from '../utils/estadosBrasil';
import './FiltrosVagas.css';

function FiltrosVagas({ onFiltrar, onLimpar }) {
  const [filtros, setFiltros] = useState({
    palavraChave: '',
    cidade: '',
    estado: '',
    tipoContrato: '',
    modalidade: '',
    nivelExperiencia: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFiltrar(filtros);
  };

  const handleLimpar = () => {
    const filtrosLimpos = {
      palavraChave: '',
      cidade: '',
      estado: '',
      tipoContrato: '',
      modalidade: '',
      nivelExperiencia: '',
    };
    setFiltros(filtrosLimpos);
    onLimpar();
  };

  const temFiltros = Object.values(filtros).some(val => val !== '');

  return (
    <form onSubmit={handleSubmit} className="filtros-vagas">
      <div className="filtros-header">
        <h3>🔍 Filtros de Busca</h3>
        {temFiltros && (
          <button type="button" onClick={handleLimpar} className="btn-limpar">
            Limpar Filtros
          </button>
        )}
      </div>

      <div className="filtros-grid">
        <div className="filtro-group">
          <label htmlFor="palavraChave">Palavra-chave</label>
          <input
            type="text"
            id="palavraChave"
            name="palavraChave"
            value={filtros.palavraChave}
            onChange={handleChange}
            placeholder="Ex: Desenvolvedor, Analista..."
          />
        </div>

        <div className="filtro-group">
          <label htmlFor="cidade">Cidade</label>
          <input
            type="text"
            id="cidade"
            name="cidade"
            value={filtros.cidade}
            onChange={handleChange}
            placeholder="Ex: São Paulo"
          />
        </div>

        <div className="filtro-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={filtros.estado}
            onChange={handleChange}
          >
            <option value="">Todos os estados</option>
            {ESTADOS_BRASIL.map(estado => (
              <option key={estado.sigla} value={estado.sigla}>
                {estado.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="tipoContrato">Tipo de Contrato</label>
          <select
            id="tipoContrato"
            name="tipoContrato"
            value={filtros.tipoContrato}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {TIPO_CONTRATO.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="modalidade">Modalidade</label>
          <select
            id="modalidade"
            name="modalidade"
            value={filtros.modalidade}
            onChange={handleChange}
          >
            <option value="">Todas</option>
            {MODALIDADE.map(modalidade => (
              <option key={modalidade} value={modalidade}>
                {modalidade}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="nivelExperiencia">Nível de Experiência</label>
          <select
            id="nivelExperiencia"
            name="nivelExperiencia"
            value={filtros.nivelExperiencia}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {NIVEL_EXPERIENCIA.map(nivel => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filtros-actions">
        <button type="submit" className="btn btn-primary">
          Aplicar Filtros
        </button>
      </div>
    </form>
  );
}

export default FiltrosVagas;

