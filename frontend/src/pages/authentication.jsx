import React, { useState, useContext } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Snackbar,
  Box,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../context/Authcontext';

const theme = createTheme();

export default function Authentication() {
  const { handleRegister, handleLogin } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState(0); // 0: login, 1: register
  const [open, setOpen] = useState(false);

  const handleAuth = async () => {
  
    try {
      if (formState === 0) {
        let result =await handleLogin(username,password)
        console.log(result);
      }
       if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setMessage(result);
        setUsername('')
        setOpen(true);
        setError('');
        setFormState(0)
        setPassword('')
      }
    } catch (err) {
      console.error(err);
      let message = err?.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant={formState === 0 ? 'contained' : 'text'}
              onClick={() => setFormState(0)}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? 'contained' : 'text'}
              onClick={() => setFormState(1)}
            >
              Sign Up
            </Button>
          </Box>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            {formState === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleAuth}
            >
              {formState === 0 ? 'Login' : 'Register'}
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar open={open} autoHideDuration={4000} message={message} onClose={() => setOpen(false)} />
    </ThemeProvider>
  );
}
