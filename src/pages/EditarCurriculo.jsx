import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { curriculoService } from '../services/api';
import CurriculoForm from '../components/CurriculoForm';
import './EditarCurriculo.css';

function EditarCurriculo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculo, setCurriculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);

    try {
      await curriculoService.atualizar(id, formData);
      alert('Currículo atualizado com sucesso!');
      navigate(`/curriculo/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editar-curriculo">
        <div className="container">
          <div className="loading">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error && !curriculo) {
    return (
      <div className="editar-curriculo">
        <div className="container">
          <div className="alert alert-error">
            {error}
          </div>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-curriculo">
      <div className="container">
        <div className="page-header">
          <h2>Editar Currículo</h2>
          <p>Atualize os dados do currículo</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {curriculo && (
          <CurriculoForm
            curriculo={curriculo}
            onSubmit={handleSubmit}
            loading={saving}
          />
        )}
      </div>
    </div>
  );
}

export default EditarCurriculo;

