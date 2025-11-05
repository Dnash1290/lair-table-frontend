import "./Rooms.css"
import UserCard from "../../Components/WaitingRoom/UserCard"
import { use, useCallback, useEffect, useRef, useState } from "react"
import CountDown from "../../Components/CountWatch/CountDown"
import axios from "axios"
import leaveLogo from "../../assets/icons/leaveRoom.svg"
import { useAppContext } from "../../WebSocket/WsContext"
import { Link } from "react-router-dom"

export default function Rooms(){
    const {
        username, setUsername, connect, isConnected,
        players, AddPlayerCards
    } = useAppContext()

    const [Count, setCount] = useState(null)
    const GotPlayers = useRef(false)
    const tempRoom = "testRoom"

    function get_users(){
        console.log("ran get users function")
        axios.get("http://127.0.0.1:8000/conn_router/get_users")
        .then((data)=>{
            console.log(data)
            AddPlayerCards(data.data)
        })
        .catch((err)=>{console.log(err)})
    }
    
    useEffect(() => {
        if (!username) {
            const name = prompt("enter your username:")
            if (name) {
                setUsername(name)
                connect(name, tempRoom)// wait till this 
            }
        }

        return () => {
            try{
            socketRef.current.close()
            console.log("socket closed")
            }catch{}
        }
    }, [username])

    useEffect(()=>{
        
        if (players[0]?.IsHost === undefined) return
        if (!players[0].IsHost && !GotPlayers.current){
            get_users()
            GotPlayers.current = true
        } 
        console.log("get users function run", players)
    
    }, [players])


    return(
        <div className="waiting-container" style={{border:"solid blue 5px",minHeight:"200px"}}>
            
            <div style={{height:"20px", padding:"4px 12px",
                backgroundColor: isConnected ? "green": "red"}}>
                {isConnected ? "connected":"disconnected"}
            </div>
            <div className="players-waiting-container">
                <div className="room-details">
                    <div className="room-details-flex">
                        <h1>{tempRoom}</h1>
                        <h3>{players.length ? players.length : players.lenght}/6</h3>
                        <Link to={{pathname:"/"}}><img src={leaveLogo} /></Link>
                    </div>
                    {players.map((data, i)=>(
                        <UserCard  key={i} payload={data} />
                    ))}
                    {Count ? <CountDown endTime={Count} />: ""}
                    <button >Start Game</button>

                    
                </div>
            </div>

        </div>
    )
}