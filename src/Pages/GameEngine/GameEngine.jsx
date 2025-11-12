import "./GameEngine.css"
import { useAppContext } from "../../WebSocket/WsContext"
import CountDown from "../../Components/CountWatch/CountDown"
import { use, useEffect, useState } from "react"
import UserElement from "../../Components/UserElement/UserElement"


const playload = [
    {username:"low", IsHost:true, words:["a","b","c"]},
    {username:"low2", IsHost:false, words:["a","b","c"]},
    {username:"low3", IsHost:false, words:["a","b","c"]},
]

export default function GameEngine(){
    //console.log(gameState)
    const {
        players, vote, gameState, username, category, word, imposter
    } = useAppContext()

    const [role, setRole] = useState(null)
    const [heading, setHeading] = useState(null)
    const [colour, setColour] = useState(false)

    useEffect(() => {
        if (username !== imposter) {
            setRole("Investgayter")
            setColour(false)
            return
        }
        setRole("Imposter")
        setColour(true)
    }, [imposter])

    useEffect(()=>{
        if (gameState?.status === "game.investigating") {setHeading("Who is the liar ?")}
        if (gameState?.status === "game.starting") {setHeading("Starting game")}
        if (gameState?.status === "game.voting") {setHeading("Pick your vote")}

        setHeading("Starting game")

    },[gameState])

    return(
        <div className="game-ui">
            <h1>{heading || "Loading..."}</h1>
            {JSON.stringify(gameState)}
            <p>voting ending in <CountDown endTime={gameState?.end_time} /></p>
            <div className="game-details-container">
                <div className="game-details-left">
                    <h3>Role:
                        <span style={{color: colour ? "red" : "white"}}> {role}</span>
                    </h3>
                    <p>Category: {category || "Loading..."}</p>
                    <p>Word: {word || "Loading..."}</p>
                </div>
                <div className="game-details-right">
                    <h3>Round:</h3>
                    <p>Status: {gameState?.status || "Loading..."}</p>
                    <p>Username: {username || "Loading..."}</p>
                </div>
            </div>
            <div className="players-container">
                {players.map((player, index)=>(
                    <UserElement key={index} player={player}/>
                ))}
 
            </div>
        </div>
    )
}