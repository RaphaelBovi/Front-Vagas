import { useState } from 'react';
import './CurriculoForm.css';

function CurriculoForm({ curriculo = null, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    nome: curriculo?.nome || '',
    residencia: curriculo?.residencia || '',
    dataNascimento: curriculo?.dataNascimento || '',
    nivelEscolaridade: curriculo?.nivelEscolaridade || '',
    cursosComplementares: curriculo?.cursosComplementares || [],
    idiomas: curriculo?.idiomas || [],
    skills: curriculo?.skills || [{ nome: '', nivel: '' }],
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.residencia.trim()) {
      newErrors.residencia = 'Residência é obrigatória';
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
      // Limpar skills vazias
      const skillsLimpas = formData.skills.filter(s => s.nome.trim());
      onSubmit({
        ...formData,
        skills: skillsLimpas,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <form onSubmit={handleSubmit} className="curriculo-form">
      <div className="form-section">
        <h3>Dados Pessoais</h3>
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? 'error' : ''}
          />
          {errors.nome && <span className="error-message">{errors.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="residencia">Residência *</label>
          <input
            type="text"
            id="residencia"
            name="residencia"
            value={formData.residencia}
            onChange={handleChange}
            className={errors.residencia ? 'error' : ''}
          />
          {errors.residencia && <span className="error-message">{errors.residencia}</span>}
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
          />
          {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nivelEscolaridade">Nível de Escolaridade *</label>
          <input
            type="text"
            id="nivelEscolaridade"
            name="nivelEscolaridade"
            value={formData.nivelEscolaridade}
            onChange={handleChange}
            placeholder="Ex: Superior, Médio, Técnico..."
            className={errors.nivelEscolaridade ? 'error' : ''}
          />
          {errors.nivelEscolaridade && <span className="error-message">{errors.nivelEscolaridade}</span>}
        </div>
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

