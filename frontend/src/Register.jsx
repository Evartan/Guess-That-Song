import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect, useRef, useContext } from 'react';
import { Link as BrowserLink, useNavigate } from 'react-router-dom';
import fetchToken from './util/FetchToken';
import { AuthContext } from './App';

const theme = createTheme();

export default function Register() {

    const [error, setError] = useState(null);
    const [notUnique, setNotUnique] = useState(false);
    const navigate = useNavigate();
    const initialRender = useRef(true);
    const { setAuthJwt, setIsLoggedIn, setUsername, username } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // send data to register endpoint
        try {
            const usernameInfo = data.get('username');
            const password = data.get('password');
            const response = await fetch(`${process.env.BACKEND_URI}/register`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameInfo,
                    password: password,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error occured during registration, status: ${response.status}`);
            }
            const responseJson = await response.json();
            // username exists
            if (Object.prototype.hasOwnProperty.call(responseJson, 'detail')) {
                setNotUnique(true);
                return;
            }
            const result = await fetchToken(usernameInfo, password);
            if (result instanceof Error) {
                throw result;
            }
            setAuthJwt(document.cookie.substring(5));
            setUsername(usernameInfo);
            setIsLoggedIn(true);
        } catch (e) {
            setError(e.message);
        }
    };

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            return navigate('/');
        }
    }, [username, navigate]);

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
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {notUnique ? <TextField
                                    error
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    helperText="Username must be unique."
                                    autoComplete="username"
                                /> : <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                />}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <BrowserLink to="/login">
                                    Already have an account? Sign in
                                </BrowserLink>
                            </Grid>
                        </Grid>
                        {error && <p>{error}</p>}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
