import React, { useEffect, useState, useContext, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import { GameContext, AuthContext } from './App';

const Timer = ({ setIsWon }) => {

    const { authJwt } = useContext(AuthContext);
    const { currentActiveGame, setCurrentActiveGame } = useContext(GameContext);
    const [counter, setCounter] = useState(30);

    const handleCountdown = useCallback(async () => {
        if (counter > 0) {
            setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            if (currentActiveGame.streak > 0) {
                const sessionResponse = await fetch(`${process.env.BACKEND_URI}/sessions/${currentActiveGame._id}`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authJwt}`
                    },
                    body: JSON.stringify({
                        streak: 0
                    }),
                });
                const sessionInfo = await sessionResponse.json();
                const newSession = { ...currentActiveGame };
                const sessionToSet = Object.assign(newSession, sessionInfo, {});
                setCurrentActiveGame(sessionToSet);
            }
            setIsWon(false);
        }
    }, [counter]);

    useEffect(() => {
        handleCountdown();
    }, [counter, handleCountdown]);

    return (
        <Typography variant="h5">
            Seconds Remaining: {counter}
        </Typography>
    );
};

export default Timer;
