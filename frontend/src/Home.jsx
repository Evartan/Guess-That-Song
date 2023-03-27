import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import Login from './SpotifyLogin';
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';

const Home = () => {

    const [token, setToken] = useState('');

    async function getToken() {
        const response = await fetch(`${process.env.BACKEND_URI}/auth/token`);
        const json = await response.json();
        setToken(json.access_token);
        return;
    }

    useEffect(() => {
        getToken();
    }, []);

    return (
        <div>
            {(token === '') ? <Login /> :
                <div>
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{ minHeight: '100vh' }}
                        >
                        <Grid item xs={3}>
                            <Link to="/game">
                                <Button variant="contained" color="inherit">Start</Button>
                            </Link>
                        </Grid>
                        <Grid item xs={3}>
                            <Link to="/login">
                                <Button variant="contained" color="inherit">Login</Button>
                            </Link>
                        </Grid>
                        <Grid item xs={3}>
                            <Link to="/register">
                                <Button variant="contained" color="inherit">Register</Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                        }}>
                        <SpotifyPlayer
                            token={token}
                            uris={['spotify:track:09TlxralXOGX35LUutvw7I']}
                            play={true}
                        />
                    </div>
                </div>}
        </div>
    );
};

export default Home;
