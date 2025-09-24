import "./Rooms.css"
import UserCard from "../../Components/WaitingRoom/UserCard"
import { useEffect, useState } from "react"
import { data } from "react-router-dom"

export default function Rooms(){
    const [username, setUsername] = useState("")
    const [UserCards, setUserCards] = useState([])
    

    useEffect(() => {
        if (!username) {
            const name = prompt("enter your username:")
            if (name) setUsername(name)
            return
        }

        const socket = new WebSocket("ws://localhost:8000/conn_router/ws/testRoom/" + username)
        socket.onerror = (err) => alert(err)
        socket.onmessage = (event) =>{ 
            const data = JSON.parse(event.data)
            setUserCards(prev => [...prev, event.data])}

        return () => socket.close()
    }, [username])


    
   
 

    return(
        <div className="waiting-container" style={{border:"solid blue 5px",minHeight:"200px"}}>
            {UserCards.map((data, i)=>(
                <UserCard  key={i} payload={data} />
            ))}
                 {UserCards}
        </div>
    )
}