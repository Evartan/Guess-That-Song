import React, { useEffect, useState, useCallback, createContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Game from './Game';
import Layout from './Layout';
import About from './About';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import Spotify from './Spotify';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext(null);
export const GameContext = createContext(null);
export const FetchLoadingContext = createContext(null);

const App = () => {

  const [currentActiveGame, setCurrentActiveGame] = useState({});
  const [userID, setUserID] = useState('');
  const [authJwt, setAuthJwt] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const authValues = {
    authJwt,
    setAuthJwt,
    isLoggedIn,
    setIsLoggedIn,
    username,
    setUsername,
  };
  const gameValues = {
    currentActiveGame,
    setCurrentActiveGame,
    userID,
  };
  const fetchLoadingValues ={
    fetchLoading
  }

  // pulls down jwt from cookie each app refresh and checks if it is present and not expired 
  const checkLoggedIn = useCallback(async () => {
    // check if jwt is present and not expired, return user to login page if either condition fails
    try {

      // check user is login, token in local storage
      const token = localStorage.getItem('token')
      if (!token) return;

      // stop loading render
      setFetchLoading(true)

      const idResponse = await fetch(`${process.env.BACKEND_URI}/users/me`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      if (!idResponse.ok) {
        // stop loading render
        setFetchLoading(false)
        throw new Error(`Error fetching user info, status: ${idResponse.status}`);
      }
      const userInfo = await idResponse.json();
      setUserID(userInfo._id);
      setAuthJwt(token);
      setUsername(userInfo.username);
      setIsLoggedIn(true);
      setFetchLoading(false);
    } catch (e) {
    // if there was error inform user
    setError(e.message);
  }
}, []);

const fetchCurrentGame = useCallback(async () => {
  try {
    
    // begin loading render
    setFetchLoading(true)

    const sessionsResponse = await fetch(`${process.env.BACKEND_URI}/sessions/user/${userID}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authJwt}`
      },
    });
    if (!sessionsResponse.ok) {

      // stop loading render
      setFetchLoading(false);
      throw new Error(`Error fetching sessions, status: ${sessionsResponse.status}`);
    }
    // user will only ever have one game going at a time, retrieve that game here
    const session = await sessionsResponse.json();
    if (session[0] !== undefined) {
      setCurrentActiveGame(session[0]);
    }
    // stop loading render
    setFetchLoading(false);
  } catch (e) {
    console.log(e);
  }
}, [authJwt, userID]);

// check if user is already logged in
useEffect(() => {
  checkLoggedIn();
}, [checkLoggedIn]);

// trigger loading rendering
useEffect(() => {
  fetchLoading;
}, [setFetchLoading]);

// if user is logged in get their active game sessions
useEffect(() => {
  if (isLoggedIn) {
    fetchCurrentGame();
  }
}, [isLoggedIn, fetchCurrentGame]);

return (
  <>
  <AuthContext.Provider value={authValues}>
    <GameContext.Provider value={gameValues}>
    <FetchLoadingContext.Provider value={fetchLoadingValues}>
      <Routes>
        <Route element={<Layout />} >
          <Route path='/' element={isLoggedIn ? <Dashboard /> : <Login />} />
          <Route path='/game' element={<Game />} />
          <Route path='/about' element={<About />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
          <Route path='/spotify' element={<Spotify />} />
        </Route>
      </Routes>
      </FetchLoadingContext.Provider>
    </GameContext.Provider>
  </AuthContext.Provider>
  {error && <p>{error}</p>}
  </>
);
};

export default App;
