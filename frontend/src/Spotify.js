import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import Login from './SpotifyLogin';

// pass parameter example: 
// <Spotify URI={['spotify:track:09TlxralXOGX35LUutvw7I']}/>
// Spotify player with token check, enforces sign in if no token
// Feature: Autoplay
function Spotify({ URI }) {

    const [token, setToken] = useState('');

    async function getToken() {
        const response = await fetch(`${process.env.BACKEND_URI}/auth/token`);
        const json = await response.json();
        setToken(json.access_token);
    }


    useEffect(() => {
        getToken();
    }, []);

    return (
        <div>
            {(token === '') ? <Login /> : <SpotifyPlayer
                token={token}
                uris={URI}
                play={true}
            />}
        </div>
    );
}


export default Spotify;