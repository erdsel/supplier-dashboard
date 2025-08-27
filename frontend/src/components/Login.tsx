import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
} from '@mui/material';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginByName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.loginByName(name);
      localStorage.setItem('token', response.token);
      localStorage.setItem('vendor', JSON.stringify(response.vendor));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('vendor', JSON.stringify(response.vendor));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffeff6 0%, #F8BBD9 50%, #E8B4E3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={12} sx={{ 
          padding: 5, 
          width: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,239,246,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          border: '1px solid rgba(232, 180, 227, 0.2)',
          boxShadow: '0 20px 40px rgba(232, 180, 227, 0.4)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography component="h1" variant="h3" sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.02em'
            }}>
              LONCA.CO
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'text.secondary',
              fontWeight: 500
            }}>
              Vendor Dashboard
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'text.secondary',
              mt: 1
            }}>
              Satış performansınızı analiz edin
            </Typography>
          </Box>

          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="İsimle Giriş" />
            <Tab label="Email ile Giriş" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {tab === 0 ? (
            <Box component="form" onSubmit={handleLoginByName}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Tedarikçi Adı"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !name}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleLoginWithPassword}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Adresi"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Şifre"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !email || !password}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;