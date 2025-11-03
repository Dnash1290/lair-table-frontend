import "./Rooms.css"
import UserCard from "../../Components/WaitingRoom/UserCard"
import { use, useCallback, useEffect, useRef, useState } from "react"
import CountDown from "../../Components/CountWatch/CountDown"
import axios from "axios"
import { useAppContext } from "../../WebSocket/WsContext"

export default function Rooms(){
    const {username, setUsername, connect, IsConnected} = useAppContext()
    const [UserCards, setUserCards] = useState([])
    const [Count, setCount] = useState(null)
    console.log(username, "nigges")

    function get_users(){
        axios.get("http://localhost:8000/conn_router/get_users")
        .then((msg)=>{
            const clients = msg.data.clients
            const filClients = clients.filter((payload)=>(
                payload.data.client !== username
            )
        )
            filClients.map((payload,i)=>{
                setUserCards(prev => [...prev,payload])
            })
        })
       .catch((err)=>{console.log(err)})
    }
    

    useEffect(() => {
        console.log("this run")
        if (!username) {
            const name = prompt("enter your username:")
            if (name) {
                setUsername(name)
                connect(name, "testRoom")
            }
            return
        }

        return () => {
            socketRef.current.close()
            console.log("socket closed")
        }
    }, [username])

    const handle_click = () =>{
        console.log("button clicked")
        if (socketRef.current.readyState !== WebSocket.OPEN){
            console.log("connection closed")
            return}

        socketRef.current.send(JSON.stringify({
            action: "game.start",
            data: {player_type: "host"}
            }))
    }
    
 
    return(
        <div className="waiting-container" style={{border:"solid blue 5px",minHeight:"200px"}}>
            
            <div style={{height:"20px", 
                backgroundColor: IsConnected ? "green": "red"}}>
            </div>
            {username}
            {UserCards.map((data, i)=>(
                <UserCard  key={i} payload={data} />
            ))}
            {Count ? <CountDown endTime={Count} />: ""}
            <button onClick={handle_click}>Start Game</button>
        </div>
    )
}