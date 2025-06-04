import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Checkbox,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function Varejos() {
  const [varejos, setVarejos] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('varejos').select('*');
      if (!error) setVarejos(data || []);
    };
    fetchData();
  }, []);

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deletarSelecionados = async () => {
    await supabase.from('varejos').delete().in('id', selecionados);
    setVarejos(varejos.filter((v) => !selecionados.includes(v.id)));
    setSelecionados([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Varejos</Typography>
      <List>
        {varejos.map((v) => (
          <ListItem key={v.id}>
            <Checkbox
              checked={selecionados.includes(v.id)}
              onChange={() => toggleSelecionado(v.id)}
            />
            <ListItemText
              primary={
                <MuiLink
                  component={Link}
                  to={`/varejo/${v.id}`}
                  underline="always"
                  color="primary"
                >
                  {v.name}
                </MuiLink>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" component={Link} to="/novo-varejo">
          Novo Varejo
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
    </div>
  );
}