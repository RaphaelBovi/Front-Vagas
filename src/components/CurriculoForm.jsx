import { useState, useEffect } from 'react';
import { ESTADOS_BRASIL, NIVEL_ESCOLARIDADE } from '../utils/estadosBrasil';
import './CurriculoForm.css';

function CurriculoForm({ curriculo = null, onSubmit, loading = false }) {
  // Separar nome completo em nome e sobrenome se existir
  const nomeCompleto = curriculo?.nome || '';
  const partesNome = nomeCompleto.split(' ');
  const nomeInicial = partesNome[0] || '';
  const sobrenomeInicial = partesNome.slice(1).join(' ') || '';

  // Separar residência em cidade e estado se existir
  const residenciaCompleta = curriculo?.residencia || '';
  const partesResidencia = residenciaCompleta.split(', ');
  const cidadeInicial = partesResidencia[0] || '';
  const estadoInicial = partesResidencia[1] || '';

  const [formData, setFormData] = useState({
    nome: nomeInicial,
    sobrenome: sobrenomeInicial,
    cidade: cidadeInicial,
    estado: estadoInicial,
    dataNascimento: curriculo?.dataNascimento || '',
    nivelEscolaridade: curriculo?.nivelEscolaridade || '',
    nomeUniversidade: curriculo?.nomeUniversidade || '',
    cargoDesejado: curriculo?.cargoDesejado || '',
    pretensaoSalarial: curriculo?.pretensaoSalarial || '',
    disponibilidadeMudanca: curriculo?.disponibilidadeMudanca || false,
    disponibilidadeViagem: curriculo?.disponibilidadeViagem || false,
    experiencias: curriculo?.experiencias || [],
    cursosComplementares: curriculo?.cursosComplementares || [],
    idiomas: curriculo?.idiomas || [],
    skills: curriculo?.skills || [{ nome: '', nivel: '' }],
  });

  const [errors, setErrors] = useState({});

  // Verificar se precisa mostrar campo de universidade
  const mostrarUniversidade = formData.nivelEscolaridade === 'Superior Incompleto' || 
                              formData.nivelEscolaridade === 'Superior Completo';

  const validate = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.sobrenome.trim()) {
      newErrors.sobrenome = 'Sobrenome é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const data = new Date(formData.dataNascimento);
      const hoje = new Date();
      if (data >= hoje) {
        newErrors.dataNascimento = 'Data de nascimento deve ser no passado';
      }
    }

    if (!formData.nivelEscolaridade.trim()) {
      newErrors.nivelEscolaridade = 'Nível de escolaridade é obrigatório';
    }

    if (mostrarUniversidade && !formData.nomeUniversidade.trim()) {
      newErrors.nomeUniversidade = 'Nome da universidade é obrigatório para nível superior';
    }

    if (formData.skills.length === 0 || formData.skills.some(s => !s.nome.trim())) {
      newErrors.skills = 'Pelo menos uma skill é obrigatória';
    }

    if (formData.cursosComplementares.length > 15) {
      newErrors.cursosComplementares = 'Máximo de 15 cursos permitidos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Combinar nome e sobrenome
      const nomeCompleto = `${formData.nome.trim()} ${formData.sobrenome.trim()}`;
      
      // Combinar cidade e estado
      const residencia = `${formData.cidade.trim()}, ${formData.estado}`;

      // Limpar skills vazias
      const skillsLimpas = formData.skills.filter(s => s.nome.trim());

      onSubmit({
        ...formData,
        nome: nomeCompleto,
        residencia: residencia,
        skills: skillsLimpas,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { nome: '', nivel: '' }],
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const updateSkill = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const addCurso = () => {
    setFormData(prev => ({
      ...prev,
      cursosComplementares: [...prev.cursosComplementares, { nome: '', instituicao: '', cargaHoraria: '' }],
    }));
  };

  const removeCurso = (index) => {
    setFormData(prev => ({
      ...prev,
      cursosComplementares: prev.cursosComplementares.filter((_, i) => i !== index),
    }));
  };

  const updateCurso = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      cursosComplementares: prev.cursosComplementares.map((curso, i) =>
        i === index ? { ...curso, [field]: value } : curso
      ),
    }));
  };

  const addIdioma = () => {
    setFormData(prev => ({
      ...prev,
      idiomas: [...prev.idiomas, { nome: '', nivel: '' }],
    }));
  };

  const removeIdioma = (index) => {
    setFormData(prev => ({
      ...prev,
      idiomas: prev.idiomas.filter((_, i) => i !== index),
    }));
  };

  const updateIdioma = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      idiomas: prev.idiomas.map((idioma, i) =>
        i === index ? { ...idioma, [field]: value } : idioma
      ),
    }));
  };

  const addExperiencia = () => {
    setFormData(prev => ({
      ...prev,
      experiencias: [...prev.experiencias, {
        cargo: '',
        empresa: '',
        dataInicio: '',
        dataFim: '',
        descricao: '',
        atualmente: false,
      }],
    }));
  };

  const removeExperiencia = (index) => {
    setFormData(prev => ({
      ...prev,
      experiencias: prev.experiencias.filter((_, i) => i !== index),
    }));
  };

  const updateExperiencia = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experiencias: prev.experiencias.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="curriculo-form">
      <div className="form-section">
        <h3>Dados Pessoais</h3>
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={errors.nome ? 'error' : ''}
              placeholder="Seu primeiro nome"
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sobrenome">Sobrenome *</label>
            <input
              type="text"
              id="sobrenome"
              name="sobrenome"
              value={formData.sobrenome}
              onChange={handleChange}
              className={errors.sobrenome ? 'error' : ''}
              placeholder="Seu sobrenome"
            />
            {errors.sobrenome && <span className="error-message">{errors.sobrenome}</span>}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="cidade">Cidade *</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className={errors.cidade ? 'error' : ''}
              placeholder="Ex: São Paulo"
            />
            {errors.cidade && <span className="error-message">{errors.cidade}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado *</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={errors.estado ? 'error' : ''}
            >
              <option value="">Selecione o estado</option>
              {ESTADOS_BRASIL.map(estado => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.nome}
                </option>
              ))}
            </select>
            {errors.estado && <span className="error-message">{errors.estado}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dataNascimento">Data de Nascimento *</label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            className={errors.dataNascimento ? 'error' : ''}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nivelEscolaridade">Nível de Escolaridade *</label>
          <select
            id="nivelEscolaridade"
            name="nivelEscolaridade"
            value={formData.nivelEscolaridade}
            onChange={handleChange}
            className={errors.nivelEscolaridade ? 'error' : ''}
          >
            <option value="">Selecione o nível</option>
            {NIVEL_ESCOLARIDADE.map(nivel => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {errors.nivelEscolaridade && <span className="error-message">{errors.nivelEscolaridade}</span>}
        </div>

        {mostrarUniversidade && (
          <div className="form-group">
            <label htmlFor="nomeUniversidade">Nome da Universidade *</label>
            <input
              type="text"
              id="nomeUniversidade"
              name="nomeUniversidade"
              value={formData.nomeUniversidade}
              onChange={handleChange}
              className={errors.nomeUniversidade ? 'error' : ''}
              placeholder="Ex: Universidade de São Paulo"
            />
            {errors.nomeUniversidade && <span className="error-message">{errors.nomeUniversidade}</span>}
          </div>
        )}
      </div>

      <div className="form-section">
        <h3>Objetivos Profissionais</h3>
        <div className="form-group">
          <label htmlFor="cargoDesejado">Cargo Desejado</label>
          <input
            type="text"
            id="cargoDesejado"
            name="cargoDesejado"
            value={formData.cargoDesejado}
            onChange={handleChange}
            placeholder="Ex: Desenvolvedor Full Stack"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pretensaoSalarial">Pretensão Salarial (R$)</label>
          <input
            type="number"
            id="pretensaoSalarial"
            name="pretensaoSalarial"
            value={formData.pretensaoSalarial}
            onChange={handleChange}
            placeholder="Ex: 5000"
            min="0"
            step="100"
          />
        </div>

        <div className="form-row-2">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="disponibilidadeMudanca"
                checked={formData.disponibilidadeMudanca}
                onChange={handleChange}
              />
              <span>Disponível para mudança de cidade</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="disponibilidadeViagem"
                checked={formData.disponibilidadeViagem}
                onChange={handleChange}
              />
              <span>Disponível para viagens</span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>Experiências Profissionais</h3>
          <button type="button" onClick={addExperiencia} className="btn-add">
            + Adicionar Experiência
          </button>
        </div>
        {formData.experiencias.map((exp, index) => (
          <div key={index} className="experiencia-item">
            <div className="form-row-2">
              <div className="form-group">
                <label>Cargo</label>
                <input
                  type="text"
                  placeholder="Ex: Desenvolvedor"
                  value={exp.cargo}
                  onChange={(e) => updateExperiencia(index, 'cargo', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input
                  type="text"
                  placeholder="Nome da empresa"
                  value={exp.empresa}
                  onChange={(e) => updateExperiencia(index, 'empresa', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Data Início</label>
                <input
                  type="date"
                  value={exp.dataInicio}
                  onChange={(e) => updateExperiencia(index, 'dataInicio', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Data Fim</label>
                <input
                  type="date"
                  value={exp.dataFim}
                  onChange={(e) => updateExperiencia(index, 'dataFim', e.target.value)}
                  disabled={exp.atualmente}
                />
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={exp.atualmente}
                  onChange={(e) => updateExperiencia(index, 'atualmente', e.target.checked)}
                />
                <span>Trabalho atualmente aqui</span>
              </label>
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                placeholder="Descreva suas responsabilidades e conquistas"
                value={exp.descricao}
                onChange={(e) => updateExperiencia(index, 'descricao', e.target.value)}
                rows="3"
              />
            </div>
            <button
              type="button"
              onClick={() => removeExperiencia(index)}
              className="btn-remove"
            >
              Remover Experiência
            </button>
          </div>
        ))}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>Skills *</h3>
          <button type="button" onClick={addSkill} className="btn-add">
            + Adicionar Skill
          </button>
        </div>
        {errors.skills && <span className="error-message">{errors.skills}</span>}
        {formData.skills.map((skill, index) => (
          <div key={index} className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome da skill"
                value={skill.nome}
                onChange={(e) => updateSkill(index, 'nome', e.target.value)}
              />
            </div>
            <div className="form-group">
              <select
                value={skill.nivel}
                onChange={(e) => updateSkill(index, 'nivel', e.target.value)}
              >
                <option value="">Selecione o nível</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Especialista">Especialista</option>
              </select>
            </div>
            {formData.skills.length > 1 && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="btn-remove"
              >
                Remover
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>Cursos Complementares (máx. 15)</h3>
          <button type="button" onClick={addCurso} className="btn-add" disabled={formData.cursosComplementares.length >= 15}>
            + Adicionar Curso
          </button>
        </div>
        {formData.cursosComplementares.length >= 15 && (
          <span className="warning-message">Limite de 15 cursos atingido</span>
        )}
        {formData.cursosComplementares.map((curso, index) => (
          <div key={index} className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome do curso"
                value={curso.nome}
                onChange={(e) => updateCurso(index, 'nome', e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Instituição"
                value={curso.instituicao}
                onChange={(e) => updateCurso(index, 'instituicao', e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Carga horária"
                value={curso.cargaHoraria}
                onChange={(e) => updateCurso(index, 'cargaHoraria', e.target.value)}
                min="0"
              />
            </div>
            <button
              type="button"
              onClick={() => removeCurso(index)}
              className="btn-remove"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>Idiomas</h3>
          <button type="button" onClick={addIdioma} className="btn-add">
            + Adicionar Idioma
          </button>
        </div>
        {formData.idiomas.map((idioma, index) => (
          <div key={index} className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome do idioma"
                value={idioma.nome}
                onChange={(e) => updateIdioma(index, 'nome', e.target.value)}
              />
            </div>
            <div className="form-group">
              <select
                value={idioma.nivel}
                onChange={(e) => updateIdioma(index, 'nivel', e.target.value)}
              >
                <option value="">Selecione o nível</option>
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Fluente">Fluente</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeIdioma(index)}
              className="btn-remove"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Salvando...' : curriculo ? 'Atualizar' : 'Criar Currículo'}
        </button>
      </div>
    </form>
  );
}

export default CurriculoForm;
