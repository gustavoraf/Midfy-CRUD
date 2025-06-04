import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import {
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';

export default function Fornecedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fornecedor, setFornecedor] = useState<any>(null);
  const [cnpj, setCnpj] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('fornecedores').select('*').eq('id', id).single();
      setFornecedor(data);
      const { data: cnpjData } = await supabase.from('cnpj_fornecedores').select('cnpj').eq('id', id).single();
      if (cnpjData) setCnpj(cnpjData.cnpj);
    };
    fetch();
  }, [id]);

  const salvar = async () => {
    const { error: err1 } = await supabase.from('fornecedores').update({ name: fornecedor.name, logo: fornecedor.logo }).eq('id', id);
    const { error: err2 } = await supabase.from('cnpj_fornecedores').update({ cnpj }).eq('id', id);

    if (err1 || err2) {
      setSnackbar({ open: true, message: 'Erro ao salvar fornecedor.', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Fornecedor atualizado com sucesso!', severity: 'success' });
    }
  };

  const deletar = async () => {
    if (fornecedor.logo) {
      const path = fornecedor.logo.split('/').slice(-3).join('/');
      await supabase.storage.from('midfy-crud').remove([path]);
    }
    await supabase.from('cnpj_fornecedores').delete().eq('id', id);
    await supabase.from('fornecedores').delete().eq('id', id);
    navigate('/fornecedores');
  };

  if (!fornecedor) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 500 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        {fornecedor.logo && <Avatar src={fornecedor.logo} alt="Logo" variant="square" sx={{ width: 60, height: 60 }} />}
        <Typography variant="h4" gutterBottom>Fornecedor</Typography>
      </Box>

      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle1">Nome:</Typography>
          <TextField
            value={fornecedor.name}
            onChange={(e) => setFornecedor({ ...fornecedor, name: e.target.value })}
            fullWidth
          />
        </Box>

        <Box>
          <Typography variant="subtitle1">CNPJ:</Typography>
          <TextField
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            fullWidth
          />
        </Box>

        <Box>
          <Typography variant="subtitle1">Logo (URL):</Typography>
          <TextField
            value={fornecedor.logo}
            onChange={(e) => setFornecedor({ ...fornecedor, logo: e.target.value })}
            fullWidth
          />
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={salvar}>Salvar</Button>
          <Button variant="outlined" color="error" onClick={deletar}>Deletar Fornecedor</Button>
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