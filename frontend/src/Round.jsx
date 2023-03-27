import React, { useState, useEffect, useCallback } from 'react';
import InputCheck from './InputCheck';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Timer from './Timer';
import Spotify from './Spotify';

const Round = () => {

    const [isWon, setIsWon] = useState(null);
    const [randomWord, setRandomWord] = useState('');
    const [songID, setSongID] = useState('');
    const [artists, setArtists] = useState([]);
    const [songTitle, setSongTitle] = useState('');
    const [error, setError] = useState(null);
    const [lyrics, setLyrics] = useState('');

    const [thumbnail, setThumbnail] = useState('');
    const [album, setAlbum] = useState('');
    const [release, setRelease] = useState('');

    const [loading, setLoading] = useState(true);
    const [getNewSong, setGetNewSong] = useState(true);

    const fetchInfoHandler = useCallback(async () => {
        const fetchSongInfoHelper = async () => {
            try {
                // get the random song ID
                const idResponse = await fetch(`${process.env.BACKEND_URI}/songs/random-song`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                });
                if (!idResponse.ok) {
                    throw new Error(`Error fetching random song, status: ${idResponse.status}`);
                }
                let songJson = await idResponse.json();
                // check if API call resulted in an empty items list (no song info) or various aritsts as aritst
                // recursively call helper function if empty items list
                if (songJson.tracks.items.length === 0 || songJson.tracks.items[0].artists[0].name === 'Various Artists') {
                    songJson = await fetchSongInfoHelper();
                }
                return songJson;
            } catch (e) {
                setError(error.message);
                return error;
            }
        };
        const fetchLyricsHelper = async (songID) => {
            try {
                // get the lyrics from random song ID
                const lyricsResponse = await fetch(`${process.env.BACKEND_URI}/songs/lyrics?` + new URLSearchParams({
                    id: songID,
                }));
                if (!lyricsResponse.ok) {
                    throw new Error(`Error fetching song lyrics, status: ${lyricsResponse.status}`);
                }
                const lyricsJson = await lyricsResponse.json();
                const verifiedLyrics = await checkLyricsHelper(lyricsJson);
                return verifiedLyrics;
            } catch (e) {
                setError(error.message);
                return error;
            }
        };
        const checkLyricsHelper = async (lyricsToCheck) => {
            // if didn't get back a proper lyrics response, retry 
            if (!Object.prototype.hasOwnProperty.call(lyricsToCheck, 'one_line_lyrics')) {
                const newSong = await fetchSongInfoHelper();
                const newLyrics = await fetchLyricsHelper(newSong.tracks.items[0].id);
                return newLyrics;
            }
            return lyricsToCheck;
        };
        try {
            const songData = await fetchSongInfoHelper();
            if (songData instanceof Error) return;
            // grab verified lyrics
            const lyricsData = await fetchLyricsHelper(songData.tracks.items[0].id);
            // add information to state
            const artistsToAdd = [];
            const artistsArray = songData.tracks.items[0].artists;
            artistsArray.forEach(artist => artistsToAdd.push(artist.name));
            const songIDInfo = songData.tracks.items[0].id;
            const titleInfo = songData.tracks.items[0].name;
            const thumbnailInfo = songData.tracks.items[0].album.images[0].url;
            const albumInfo = songData.tracks.items[0].album.name;
            const releaseInfo = songData.tracks.items[0].album.release_date;
            const one_line_lyrics = lyricsData.one_line_lyrics;

            // get the random word from lyrics
            const wordResponse = await fetch(`${process.env.BACKEND_URI}/songs/extract-random-word-from-one-line-lyrics?` + new URLSearchParams({
                one_line_lyrics: one_line_lyrics,
            }));
            if (!wordResponse.ok) {
                throw new Error(`Error extracting word from lyrics, status: ${wordResponse.status}`);
            }
            const wordJson = await wordResponse.json();
            const randWord = wordJson.result;
            setSongID(songIDInfo);
            setArtists(artistsToAdd);
            setSongTitle(titleInfo);
            setThumbnail(thumbnailInfo);
            setAlbum(albumInfo);
            setRelease(releaseInfo);
            setLyrics(one_line_lyrics);
            setRandomWord(randWord);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [ error ]);

    // this function to handle getting to next round
    const handleNextRound = async () => {
        setGetNewSong(true);
        setIsWon(null);
    };

    // on each re-render get a random word from a random song
    useEffect(() => {
        if (getNewSong === true) {
        fetchInfoHandler();
        }
        setGetNewSong(false);
    }, [fetchInfoHandler, getNewSong]);

    return (
        <>
            {loading && <h1>Loading...</h1>}
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}
                    justifyContent="center"
                    alignItems="center">
                    {typeof isWon === 'boolean' ?
                        isWon === true ?
                            <Typography variant="h5">
                                Round Won!
                            </Typography> :
                            <Typography variant="h5">
                                Round Lost!
                            </Typography> :
                        <Timer setIsWon={setIsWon} />}
                    {randomWord && <Typography variant="h4">
                        Random Word: {randomWord}
                    </Typography>}
                    <InputCheck
                        setSongID={setSongID}
                        artists={artists}
                        setArtists={setArtists}
                        songTitle={songTitle}
                        setSongTitle={setSongTitle}
                        setLyrics={setLyrics}
                        setThumbnail={setThumbnail}
                        setAlbum={setAlbum}
                        setRelease={setRelease}
                        setIsWon={setIsWon}
                        randomWord={randomWord}
                        isWon={isWon}
                    />
                    {error && <h1>Error generating word please try again {error.message} </h1>}
                    {typeof isWon === 'boolean' ? <>
                        <img src={thumbnail} />
                        <p>{songTitle}</p>
                        <p>by</p>
                        {Array.isArray(artists) ? <p>{artists.join(' ')}</p> : artists}
                        <p>Appears on Album: {album}</p>
                        <p>Released: {release}</p>
                        <p>{lyrics}</p>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextRound}
                        >Next Round</Button>
                    </> : <Button
                        disabled
                        variant="contained"
                        color="primary"
                        onClick={handleNextRound}
                    >Next Round</Button>}
                    {typeof isWon === 'boolean' ? <Spotify URI={[`spotify:track:${songID}`]} /> : null}
                </Stack>
            </Box>
        </>
    );
};

export default Round;
