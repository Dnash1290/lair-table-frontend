// src/context/AppContext.jsx
import { createContext, useState, useContext, useRef, useCallback, useEffect } from "react";
import { messageHandlers } from "./handleMessage";
const AppContext = createContext();

// Custom hook to use the context easily
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children, wsUrl = 'ws://127.0.0.1:8000/conn_router' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // player 
  const [username, setUsername] = useState(null);
  
  // Game state
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});
  const [hints, setHints] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [logs, setLogs] = useState([]);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const messageHandler = 0

  const connect = useCallback((clientId, roomId)=>{
    const handles = messageHandlers({setLogs, setPlayers, setVotes, setHints, setGameState})
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
          const handle = handles[action]

          if (handles[action]) { handles[action](data) }
          else {console.log("invalid action", action)}
          console.log(action, "was executed")

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

  const sendMessage = useCallback((action, data = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = { action, ...data };
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    console.error('WebSocket is not connected');
    return false;
  }, []);

  const startGame = useCallback(() => sendMessage('game.start', {}), [sendMessage]);
  const sendPlayerInfo = useCallback((info) => sendMessage('player.info', info), [sendMessage]);
  const sendVote = useCallback((votedFor) => sendMessage('player.vote', { voted_for: votedFor }), [sendMessage]);
  const sendHint = useCallback((hint) => sendMessage('player.hint', { hint }), [sendMessage]);

  const values = {
    isConnected,
    connectionError,
    players,
    votes,
    hints,
    gameState,
    logs,
    username,
    setUsername,
    sendMessage,
    startGame,
    sendPlayerInfo,
    sendVote,
    sendHint,
    //clearState,
    connect
  }


  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};


