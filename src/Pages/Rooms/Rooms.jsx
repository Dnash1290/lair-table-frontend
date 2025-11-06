import "./Rooms.css"
import UserCard from "../../Components/WaitingRoom/UserCard"
import { use, useCallback, useEffect, useRef, useState } from "react"
import CountDown from "../../Components/CountWatch/CountDown"
import axios from "axios"
import leaveLogo from "../../assets/icons/leaveRoom.svg"
import { useAppContext } from "../../WebSocket/WsContext"
import { Link, useNavigate } from "react-router-dom"

export default function Rooms(){
    const {
        username, setUsername, connect, isConnected,
        players, AddPlayerCards, IsHost, startGame
    } = useAppContext()
    const [Test, setTest] = useState(["a","b","c","d"])
    const [Error, setError] = useState("")
    const [Count, setCount] = useState(null)
    const GotPlayers = useRef(false)
    const tempRoom = "testRoom"
    const minPlayersRequired = 2
    const Navigate = useNavigate()
    const temp = Test.filter(a => a !== "b")

    const removeElement = () =>{
        setTest(temp)
    }

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
    }, [players])

    useEffect(()=>{
        if (!Error) return

        const errorTimer = setTimeout(()=>{
            setError("")
        }, 3000)

        return () => clearTimeout(errorTimer)
    },[Error])

    function start_game(){
        if (!players[0].IsHost) {
            console.log(username)
            setError("vroo you are NOT the host vrooo, sob")
            return
        }

        if (players.length <= minPlayersRequired){
            setError("need more then 3 players to start the game")
            return
        }

        startGame()
    }


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
                        <h3>{players.length ? players.length : 0}/6</h3>
                        <Link to={{pathname:"/"}}><img src={leaveLogo} /></Link>
                    </div>
                    {players.map((data, i)=>(
                        <UserCard  key={i} payload={data} />
                    ))}
                    {Count ? <CountDown endTime={Count} />: ""}
                    <button onClick={start_game}>Start Game</button>
                </div>
            </div>
            <div style={{
                transition: "opacity 0.4s ease", background:"red",
                borderRadius: "8px", marginTop:"8px", opacity:Error ? 1: 0,
                height: "24px" ,padding: "4px 12px  "
            }}>
                {Error}
            </div>
            
        </div>
    )
}