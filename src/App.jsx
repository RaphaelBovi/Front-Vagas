import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CriarCurriculo from './pages/CriarCurriculo';
import EditarCurriculo from './pages/EditarCurriculo';
import VisualizarCurriculo from './pages/VisualizarCurriculo';
import Vagas from './pages/Vagas';
import DetalhesVaga from './pages/DetalhesVaga';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/criar" element={<CriarCurriculo />} />
            <Route path="/curriculo/:id" element={<VisualizarCurriculo />} />
            <Route path="/curriculo/:id/editar" element={<EditarCurriculo />} />
            <Route path="/curriculo/:id/vagas" element={<Vagas />} />
            <Route path="/vaga/:id" element={<DetalhesVaga />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
