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
      background: 'linear-gradient(135deg, #532d3c 0%, #3a1f2a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={12} sx={{ 
          padding: 5, 
          width: '100%',
          background: 'linear-gradient(135deg, rgba(107, 63, 79, 0.95) 0%, rgba(83, 45, 60, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 0, // Dikdörtgen form
          border: '1px solid rgba(232, 180, 227, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography component="h1" variant="h3" sx={{ 
              fontWeight: 700,
              color: '#FFFFFF',
              mb: 2,
              fontFamily: '"Roboto Flex", sans-serif, "Nantes", "Times New Roman", Times, serif',
              letterSpacing: '0.02em'
            }}>
              LONCA.CO
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#F5E6F3',
              fontWeight: 500
            }}>
              Vendor Dashboard
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#F5E6F3',
              mt: 1
            }}>
              Satış performansınızı analiz edin
            </Typography>
          </Box>

          <Tabs 
            value={tab} 
            onChange={(e, newValue) => setTab(newValue)} 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': { color: '#F5E6F3' },
              '& .Mui-selected': { color: '#FFFFFF' },
              '& .MuiTabs-indicator': { backgroundColor: '#E8B4E3' }
            }}
          >
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
                sx={{
                  '& .MuiInputLabel-root': { color: '#F5E6F3' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FFFFFF' },
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: 'rgba(245, 230, 243, 0.3)' },
                    '&:hover fieldset': { borderColor: '#F5E6F3' },
                    '&.Mui-focused fieldset': { borderColor: '#E8B4E3' },
                  },
                  '& .MuiOutlinedInput-input': { color: '#FFFFFF' },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  backgroundColor: '#E8B4E3',
                  color: '#532d3c',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#D897D1',
                  }
                }}
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
                sx={{
                  '& .MuiInputLabel-root': { color: '#F5E6F3' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FFFFFF' },
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: 'rgba(245, 230, 243, 0.3)' },
                    '&:hover fieldset': { borderColor: '#F5E6F3' },
                    '&.Mui-focused fieldset': { borderColor: '#E8B4E3' },
                  },
                  '& .MuiOutlinedInput-input': { color: '#FFFFFF' },
                }}
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
                sx={{
                  '& .MuiInputLabel-root': { color: '#F5E6F3' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#FFFFFF' },
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: 'rgba(245, 230, 243, 0.3)' },
                    '&:hover fieldset': { borderColor: '#F5E6F3' },
                    '&.Mui-focused fieldset': { borderColor: '#E8B4E3' },
                  },
                  '& .MuiOutlinedInput-input': { color: '#FFFFFF' },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  backgroundColor: '#E8B4E3',
                  color: '#532d3c',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#D897D1',
                  }
                }}
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