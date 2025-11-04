import "./Rooms.css"
import UserCard from "../../Components/WaitingRoom/UserCard"
import { use, useCallback, useEffect, useRef, useState } from "react"
import CountDown from "../../Components/CountWatch/CountDown"
import axios from "axios"
import { useAppContext } from "../../WebSocket/WsContext"

export default function Rooms(){
    const {
        username, setUsername, connect, isConnected,
        players, AddPlayerCards
    } = useAppContext()

    const [Count, setCount] = useState(null)
    const GotPlayers = useRef(false)

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
                connect(name, "testRoom")// wait till this 
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
            
            <div style={{height:"20px", 
                backgroundColor: isConnected ? "green": "red"}}>
            </div>
            {username} {JSON.stringify(players)}
            {players.map((data, i)=>(
                <UserCard  key={i} payload={data} />
            ))}
            {Count ? <CountDown endTime={Count} />: ""}
            <button >Start Game</button>
        </div>
    )
}