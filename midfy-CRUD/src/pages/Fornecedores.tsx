import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Box,
  Button,
} from '@mui/material';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);

  useEffect(() => {
    const fetchFornecedores = async () => {
      const { data, error } = await supabase.from('fornecedores').select('*');
      if (!error && data) {
        setFornecedores(data);
      }
    };
    fetchFornecedores();
  }, []);

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deletarSelecionados = async () => {
    await supabase.from('fornecedores').delete().in('id', selecionados);
    await supabase.from('cnpj_fornecedores').delete().in('id', selecionados);
    setFornecedores((prev) => prev.filter((f) => !selecionados.includes(f.id)));
    setSelecionados([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Fornecedores</Typography>
      <List>
        {fornecedores.map((f) => (
          <ListItem key={f.id}>
            <Checkbox
              edge="start"
              checked={selecionados.includes(f.id)}
              onChange={() => toggleSelecionado(f.id)}
            />
            <ListItemAvatar>
              <Avatar src={f.logo || ''} alt={f.name} variant="square" />
            </ListItemAvatar>
            <ListItemText
              primary={<Link to={`/fornecedor/${f.id}`} style={{ color: '#1976d2', textDecoration: 'underline' }}>{f.name}</Link>}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" component={Link} to="/novo-fornecedor">
            Novo Fornecedor
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={selecionados.length === 0}
          onClick={deletarSelecionados}
        >
          Deletar
        </Button>
      </Box>
    </Box>
  );
}