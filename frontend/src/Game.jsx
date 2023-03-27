import React from 'react';
import { useContext } from 'react';
import Round from './Round';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { GameContext } from './App';

const Game = () => {

    const navigate = useNavigate();
    const { currentActiveGame } = useContext(GameContext);

    const handleGoBack = () => navigate('/');

    return (
        <>
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
        >
        <Button
            variant="contained"
            color="success"
            onClick={handleGoBack}
          >
            Back To Dashboard
          </Button>
        <Typography variant="h5" gutterBottom>
        Current Streak: {currentActiveGame.streak}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Total Correct: {currentActiveGame.total_correct_guesses}
      </Typography>
        </Stack>
        <Round />
        </>
    );
};

export default Game;
