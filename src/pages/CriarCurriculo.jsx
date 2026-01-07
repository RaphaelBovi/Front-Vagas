import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { curriculoService } from '../services/api';
import CurriculoForm from '../components/CurriculoForm';
import './CriarCurriculo.css';

function CriarCurriculo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const curriculo = await curriculoService.criar(formData);
      alert(`Currículo criado com sucesso! ID: ${curriculo.id}`);
      navigate(`/curriculo/${curriculo.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-curriculo">
      <div className="container">
        <div className="page-header">
          <h2>Criar Novo Currículo</h2>
          <p>Preencha os dados abaixo para criar seu currículo</p>
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

