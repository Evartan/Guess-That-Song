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
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import fetchToken from './util/FetchToken';
import { AuthContext, FetchLoadingContext } from './App';

const theme = createTheme();

export default function Login() {

    const [error, setError] = useState(null);
    const { setAuthJwt, setUsername, setIsLoggedIn } = useContext(AuthContext);
    const { fetchLoading } = useContext(FetchLoadingContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // attempt to get token from user entered credentials
        try {
            const username = data.get('username');
            const password = data.get('password');
            const result = await fetchToken(username, password);
            if (result instanceof Error) {
                throw result;
            }
            // setAuthJwt(document.cookie.substring(5));

            setAuthJwt(result.access_token); // set access token to state
            localStorage.setItem('token', result.access_token) // store access token to local storage
            setUsername(username);
            setIsLoggedIn(true);
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                
                {fetchLoading ? ("Loading... Fetching your data...") : 
                    (<Box
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
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {error ? <TextField
                                        error
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        helperText="Please enter a valid username."
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
                                Sign In
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to="/register">
                                        Don&#39;t have an account? Sign up
                                    </Link>
                                </Grid>
                            </Grid>
                            {error && <p>{error}</p>}
                        </Box>

                    </Box>

                )}
                
            </Container>
        </ThemeProvider>
    );
}
