import { Routes, Route, Link } from 'react-router-dom';
import Fornecedores from './pages/Fornecedores';
import Fornecedor from './pages/Fornecedor';
import Varejos from './pages/Varejos';
import NovoFornecedor from './pages/NovoFornecedor';
import NovoVarejo from './pages/NovoVarejo';
import Varejo from './pages/Varejo';
import { AppBar, Toolbar, Button } from '@mui/material';

export default function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/fornecedores">Fornecedores</Button>
          <Button color="inherit" component={Link} to="/varejos">Varejos</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/varejos" element={<Varejos />} />
        <Route path="/novo-fornecedor" element={<NovoFornecedor />} />
        <Route path="/novo-varejo" element={<NovoVarejo />} />
        <Route path="/fornecedor/:id" element={<Fornecedor />} />
        <Route path="/varejo/:id" element={<Varejo />} />
      </Routes>
    </div>
  );
}