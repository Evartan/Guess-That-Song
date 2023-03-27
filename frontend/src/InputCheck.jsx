import React from 'react';
import { useState, useContext } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { GameContext, AuthContext } from './App';

const InputCheck = (props) => {

    const { authJwt } = useContext(AuthContext);
    const { currentActiveGame, setCurrentActiveGame } = useContext(GameContext);
    const [songInput, setSongInput] = useState('');
    const [artistInput, setArtistInput] = useState('');
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleRightAnswer = async () => {
        const newCorrect = currentActiveGame.total_correct_guesses + 1;
        const newStreak = currentActiveGame.streak + 1;
        // increment streak and total correct 
        const sessionResponse = await fetch(`${process.env.BACKEND_URI}/sessions/${currentActiveGame._id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authJwt}`
            },
            body: JSON.stringify({
                total_correct_guesses: newCorrect,
                streak: newStreak
            }),
        });
        const sessionInfo = await sessionResponse.json();
        const newSession = {...currentActiveGame};
        const sessionToSet = Object.assign(newSession, sessionInfo, {});
        setCurrentActiveGame(sessionToSet);
        props.setIsWon(true);
        return;
    };

    const handleWrongAnswer = async () => {
        // reset streak to 0 if greater than 0
        if (currentActiveGame.streak > 0) {
            const sessionResponse = await fetch(`${process.env.BACKEND_URI}/sessions/${currentActiveGame._id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    streak: 0
                }),
            });
            const sessionInfo = await sessionResponse.json();
            const newSession = {...currentActiveGame};
            const sessionToSet = Object.assign(newSession, sessionInfo, {});
            setCurrentActiveGame(sessionToSet);
        }
        props.setIsWon(false);
        return;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // clean up any preceding errors
        setError(false);
        setErrorMsg('');
        // check if artist and song match the song random word was
        // pulled from
        if (songInput === props.songTitle && props.artists.includes(artistInput)) {
            handleRightAnswer();
            return;
        }
        try {
            // check if info entered matches an acutal song
            const songResponse = await fetch(`${process.env.BACKEND_URI}/songs/search-artist-and-song-by-name?` + new URLSearchParams({
                artist_name: artistInput,
                song_name: songInput,
            }));
            if (!songResponse.ok) {
                throw new Error(`Error fetching your song, status: ${songResponse.status}`);
            }
            const songResponseJson = await songResponse.json();
            // if response JSON is empty then there was no matching song 
            if (Object.keys(songResponseJson.result).length === 0) {
                handleWrongAnswer();
                return;
            }
            const songIdToCheck = songResponseJson.result.song_id;
            const lyricsResponse = await fetch(`${process.env.BACKEND_URI}/songs/lyrics?` + new URLSearchParams({
                id: songIdToCheck,
            }));
            if (!lyricsResponse.ok) {
                throw new Error(`Error fetching song lyrics, status: ${lyricsResponse.status}`);
            }
            const lyricJson = await lyricsResponse.json();
            // Check if lyrics could not be found for user entered song
            if (!Object.prototype.hasOwnProperty.call(lyricJson, 'one_line_lyrics')) {
                throw new Error('Error fetching your song\'s lyrics, try another!');
            }
            const lyrics = lyricJson.one_line_lyrics;
            // look for guess word using regex within user's entered song lyrics
            const expToCheck = new RegExp(props.randomWord, 'gi');
            const matchesFound = lyrics.match(expToCheck);
            // if a word match was found in lyrics set the song info in Round component to user's entered song
            if (Array.isArray(matchesFound)) {
                props.setSongID(songIdToCheck);
                props.setSongTitle(songResponseJson.result.song_name);
                props.setArtists(songResponseJson.result.artist_name);
                props.setLyrics(lyrics);
                props.setThumbnail(songResponseJson.result.thumbnail);
                props.setAlbum(songResponseJson.result.album);
                props.setRelease(songResponseJson.result.release_date);
                handleRightAnswer();
                return;
            } else {
                handleWrongAnswer();
                return;
            }
        } catch (e) {
            setErrorMsg(e.message);
            setError(true);
        }
    };

    return (
        <>
            {error && <p>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <Stack
                    spacing={2}
                    alignItems="center"
                    direction="row"
                    justifyContent="center"
                >
                    <TextField
                        required
                        id="outlined-basic"
                        label="Song"
                        variant="outlined"
                        defaultValue={songInput}
                        onChange={(e) => setSongInput(e.target.value)}
                    />
                    <TextField
                        required
                        id="outlined-basic"
                        label="Artist"
                        variant="outlined"
                        defaultValue={artistInput}
                        onChange={(e) => setArtistInput(e.target.value)}
                    />
                    {props.isWon === null ? <Button type="submit" variant="contained">
                        Submit
                    </Button> : <Button variant="contained" disabled>Submit</Button>}
                </Stack>
            </form>
        </>
    );
};

export default InputCheck;
