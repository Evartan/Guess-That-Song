import React from 'react';
import { useState, useContext } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AuthContext, GameContext, FetchLoadingContext } from './App';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate();
    const { authJwt, username } = useContext(AuthContext);
    const { currentActiveGame, setCurrentActiveGame, userID } = useContext(GameContext);
    const { fetchLoading } = useContext(FetchLoadingContext);
    const [error, setError] = useState(null);
    const gameHasStarted = Object.keys(currentActiveGame).length !== 0;

    const handleRedirectToGame = () => {
        navigate('/game');
    };

    // this function handles the onclick for new game button when current active game is empty object
    const handleNewGame = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URI}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${authJwt}`
                },
                body: JSON.stringify({
                    user_id: userID,
                }),
            });
            const gameToAdd = await response.json();
            setCurrentActiveGame(gameToAdd);
            handleRedirectToGame();
        } catch (e) {
            setError(e);
            console.log(e);
        }
    };

    // welcome page here
    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={4}
        >
            {fetchLoading ? ("Loading... Fetching your data...") : (

                <div>
                    <Typography variant="h2" gutterBottom>
                        Welcome {username}!
                    </Typography>
                    { gameHasStarted ? <Typography variant="h5" gutterBottom>
                        Current Streak: {currentActiveGame.streak}
                    </Typography> : 
                    <Typography variant="h5" gutterBottom>
                        Current Streak: 0
                    </Typography> }
                    { gameHasStarted ? 
                    <Typography variant="h5" gutterBottom>
                    Total Correct Guesses: {currentActiveGame.total_correct_guesses}
                    </Typography> : 
                    <Typography variant="h5" gutterBottom>
                    Total Correct Guesses: 0
                    </Typography> }
                    {gameHasStarted ?
                        <Button variant="contained" onClick={handleRedirectToGame}>
                            Continue Game
                        </Button>
                        : <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleNewGame}
                        >
                            Begin New Game
                        </Button>}
                </div>
                
            )}
        </Stack>
    );
};

export default Dashboard;
