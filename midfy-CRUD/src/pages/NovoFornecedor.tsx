import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../services/supabase';
import {
  Typography,
  Box,
  Button,
  Stack,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

const fornecedorSchema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  cnpj: Yup.string()
    .required('CNPJ é obrigatório')
    .matches(/^\d{14}$/, 'CNPJ deve conter exatamente 14 números'),
});

export default function NovoFornecedor() {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const uploadLogo = async (file: File, fornecedorId: number) => {
    const path = `fornecedores/${fornecedorId}/${file.name}`;
    const { data, error } = await supabase.storage
      .from('midfy-crud')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { publicUrl } = supabase.storage.from('midfy-crud').getPublicUrl(data.path).data;
    return publicUrl;
  };

  const salvar = async (values: { name: string; cnpj: string }) => {
    setUploading(true);
    const { data, error } = await supabase.from('fornecedores').insert({ name: values.name, logo: '' }).select().single();

    if (error || !data) {
      setUploading(false);
      setSnackbar({ open: true, message: 'Erro ao criar fornecedor.', severity: 'error' });
      return;
    }

    let logoUrl = '';
    if (logoFile) {
      try {
        logoUrl = await uploadLogo(logoFile, data.id);
        await supabase.from('fornecedores').update({ logo: logoUrl }).eq('id', data.id);
      } catch (e) {
        setUploading(false);
        setSnackbar({ open: true, message: 'Erro ao enviar logo.', severity: 'error' });
        return;
      }
    }

    const { error: cnpjError } = await supabase.from('cnpj_fornecedores').insert({ id: data.id, cnpj: values.cnpj });
    setUploading(false);

    if (cnpjError) {
      setSnackbar({ open: true, message: 'Erro ao salvar CNPJ.', severity: 'error' });
      return;
    }

    setSnackbar({ open: true, message: 'Fornecedor criado com sucesso!', severity: 'success' });
    setTimeout(() => navigate('/fornecedores'), 1500);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>Novo Fornecedor</Typography>

      <Formik
        initialValues={{ name: '', cnpj: '' }}
        validationSchema={fornecedorSchema}
        onSubmit={salvar}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1">Nome:</Typography>
                <Field component={TextField} name="name" label="Nome" fullWidth />
              </Box>

              <Box>
                <Typography variant="subtitle1">CNPJ:</Typography>
                <Field component={TextField} name="cnpj" label="CNPJ" fullWidth />
              </Box>

              <Box>
                <Typography variant="subtitle1">Logo (imagem):</Typography>
                {logoPreview && (
                  <Avatar
                    src={logoPreview}
                    alt="Preview"
                    variant="square"
                    sx={{ width: 100, height: 100, mb: 1 }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {uploading && <CircularProgress size={24} sx={{ mt: 1 }} />}
              </Box>

              <Button type="submit" variant="contained" disabled={isSubmitting || uploading}>
                Salvar
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

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