import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { supabase } from '../services/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const varejoSchema = Yup.object({
  name: Yup.string().required('Obrigatório'),
});

export default function NovoVarejo() {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Novo Varejo</Typography>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={varejoSchema}
        onSubmit={async (values, { resetForm }) => {
          const { error } = await supabase.from('varejos').insert([values]);
          if (error) {
            setSnackbar({ open: true, message: 'Erro ao criar varejo.', severity: 'error' });
          } else {
            setSnackbar({ open: true, message: 'Varejo criado com sucesso!', severity: 'success' });
            resetForm();
            setTimeout(() => navigate('/varejos'), 1500);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: 300 }}>
              <Field component={TextField} name="name" label="Nome" fullWidth />
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Salvar
              </Button>
            </Box>
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