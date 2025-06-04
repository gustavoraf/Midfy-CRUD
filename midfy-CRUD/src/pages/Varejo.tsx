import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import {
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Varejo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [associados, setAssociados] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('varejos').select('*').eq('id', id).single();
      if (data) setNome(data.name);

      const assoc = await supabase
        .from('fornecedor_varejo')
        .select('id_fornecedor')
        .eq('id_varejo', id);

      const all = await supabase.from('fornecedores').select('*');

      if (assoc.data && all.data) {
        setAssociados(all.data.filter((f) => assoc.data.some((a) => a.id_fornecedor === f.id)));
        setFornecedores(all.data);
      }
    };
    fetchData();
  }, [id]);

  const salvar = async () => {
    setLoading(true);
    const { error } = await supabase.from('varejos').update({ name: nome }).eq('id', id);
    setLoading(false);
    if (error) {
      setSnackbar({ open: true, message: 'Erro ao atualizar varejo.', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Varejo atualizado com sucesso!', severity: 'success' });
    }
  };

  const deletar = async () => {
    await supabase.from('fornecedor_varejo').delete().eq('id_varejo', id);
    await supabase.from('varejos').delete().eq('id', id);
    navigate('/varejos');
  };

  const adicionarFornecedor = async () => {
    if (!selecionado) return;
    const { error } = await supabase.from('fornecedor_varejo').insert({ id_varejo: id, id_fornecedor: selecionado });
    if (error) {
      setSnackbar({ open: true, message: 'Erro ao associar fornecedor.', severity: 'error' });
    } else {
      const { data } = await supabase.from('fornecedores').select('*').eq('id', selecionado).single();
      if (data) setAssociados((prev) => [...prev, data]);
      setSelecionado('');
    }
  };

  const removerAssociado = async (idFornecedor: number) => {
    const { error } = await supabase.from('fornecedor_varejo').delete().match({ id_varejo: id, id_fornecedor: idFornecedor });
    if (error) {
      setSnackbar({ open: true, message: 'Erro ao desassociar fornecedor.', severity: 'error' });
    } else {
      setAssociados((prev) => prev.filter((f) => f.id !== idFornecedor));
    }
  };

  const disponiveis = fornecedores.filter((f) => !associados.some((a) => a.id === f.id));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Detalhes de {nome}</Typography>

      <Stack spacing={2} maxWidth={400}>
        <Box>
          <Typography variant="subtitle1">Nome:</Typography>
          <TextField value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
        </Box>

        <Box>
          <Typography variant="subtitle1">Fornecedores associados:</Typography>
          <Stack spacing={1}>
            {associados.map((f) => (
              <Box key={f.id} display="flex" alignItems="center" gap={1}>
                <IconButton size="small" onClick={() => removerAssociado(f.id)} sx={{ color: 'red' }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography>{f.name}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle1">Adicionar fornecedor:</Typography>
          <Box display="flex" gap={2}>
            <TextField
              select
              SelectProps={{ native: true }}
              value={selecionado}
              onChange={(e) => setSelecionado(e.target.value)}
              fullWidth
            >
              <option value="">Selecione</option>
              {disponiveis.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </TextField>
            <Button variant="outlined" onClick={adicionarFornecedor}>Adicionar</Button>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={salvar} disabled={loading}>Salvar</Button>
          <Button variant="outlined" color="error" onClick={deletar}>Deletar Varejo</Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}