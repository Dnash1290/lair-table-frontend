// src/context/AppContext.jsx
import { createContext, useState, useContext, useRef, useCallback, useEffect } from "react";
import { messageHandlers } from "./handleMessage";
import { useNavigate } from "react-router-dom";
const AppContext = createContext();

// Custom hook to use the context easily
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children, wsUrl = `wss://${import.meta.env.VITE_WS_URL}/conn_router`}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // room

  // player 
  const [username, setUsername] = useState(null);
  const [imposter, setImposter] = useState(null);
  
  // Game stateg
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [investigating, setInvestigating] = useState(null)
  const [category, setCategory] = useState(null)
  const [word, setWord] = useState(null)

  //votes
  const [voteResult, setVoteResult] = useState()
  const [voters, setVoters] = useState([{voter:null, vote:null}]);
  const [logs, setLogs] = useState([]);
  
  const navigate = useNavigate()
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const messageHandler = 0

  const connect = useCallback((clientId, roomId)=>{
    const handles = messageHandlers({
      setLogs, setPlayers, setVoters, setGameState, roomId,
      navigate, setCategory, setWord, setImposter, setInvestigating,
      setVoteResult
    })
    if (wsRef.current?.readyState == WebSocket.OPEN) {return}
    
    try {
      const ws = new WebSocket(`${wsUrl}/ws/${roomId}/${clientId}`)
      wsRef.current = ws
      ws.onopen = (()=>{
        console.log("connected")
        setIsConnected(true)  
        setConnectionError(null)
        reconnectAttemptsRef.current = 0
      })

      ws.onmessage = ((event)=>{
        try {

          const message = JSON.parse(event.data)
          const {action, data} = message
          console.log(data) /// prints like object

          if (handles[action]) {handles[action](data) }
          else {console.log("invalid action", action)}

        } catch (error) {

        }

      })

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
     };

    } catch (error) {
      console.log("connection failed handshake",error)
    }
   })

  const AddPlayerCards = useCallback((data) => {
    console.log(data.clients, "array??")
    data.clients.forEach((clientData) => {
      if (username === clientData.client.username) {
        return
      } 
      setPlayers(prev => [...prev, clientData.client]);
    });
        
  })

  const sendMessage = useCallback((action, data = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = { action, data };
      console.log(message, "this is the playload")
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    console.error('WebSocket is not connected');
    return false;
  }, []);

  const startGame = useCallback(() => sendMessage('game.start', {}), [sendMessage]);
  const sendPlayerInfo = useCallback((info) => sendMessage('player.info', info), [sendMessage]);
  const sendVote = useCallback((votedFor) => sendMessage('player.vote', { vote: votedFor }), [sendMessage]);
  const sendHint = useCallback((hint) => sendMessage('player.hint', { word: hint }), [sendMessage]);

  const values = {
    isConnected,
    connectionError,
    players,
    gameState,
    logs,
    username,
    category,     // Add these three
    word,         // values to the
    imposter,     // context
    AddPlayerCards,
    investigating,
    voteResult,
    setPlayers,
    setUsername,
    sendMessage,
    startGame,
    sendPlayerInfo,
    sendVote,
    sendHint,
    connect
  }


  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};


