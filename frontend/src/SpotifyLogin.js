import React from 'react';

function Login() {
    return (
        <div>
            <a className="btn-spotify" href={`${process.env.BACKEND_URI}/auth/login`}>
                Must login with Spotify to access Player
            </a>
        </div>
    );
}

export default Login;
