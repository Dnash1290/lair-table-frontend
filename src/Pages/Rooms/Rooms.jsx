import "./Rooms.css"
import UserCard from "../../Components/WaitingRoom/UserCard"
import { useEffect, useRef, useState } from "react"
import CountDown from "../../Components/CountWatch/CountDown"
import axios from "axios"


export default function Rooms(){
    const [username, setUsername] = useState("")
    const [UserCards, setUserCards] = useState([])
    const [Count, SetCount] = useState()
    const socketRef = useRef()

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
        if (!username) {
            const name = prompt("enter your username:")
            if (name) setUsername(name)
            return
        }
        // makes connection 
        socketRef.current = new WebSocket("ws://localhost:8000/conn_router/ws/testRoom/" + username)
        // gets the players data who joined before the client joined
        socketRef.current.onopen = () => {get_users()}
        socketRef.current.onerror = (err) => alert(err)
        socketRef.current.onmessage = (event) =>{
            const data = JSON.parse(event.data)
            
            if (data.action === "player.log") {
                setUserCards(prev => [...prev, data])}
            else if(data.action === "game.starting"){
             
                SetCount(data.data.game_status.end_time)
            }
            else{
                console.log(data)
            }
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
            {UserCards.map((data, i)=>(
                <UserCard  key={i} payload={data} />
            ))}
            {Count ? <CountDown endTime={Count} />: ""}
            <button onClick={handle_click}>Start Game</button>
        </div>
    )
}