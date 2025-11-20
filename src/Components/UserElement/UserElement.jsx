import "./UserElement.css"
import profileImg from "../../assets/icons/profile.png"
import { useAppContext } from "../../WebSocket/WsContext"
import { useEffect, useState } from "react"

export default function UserElement({player}){
    const { investigating, gameState, sendVote, username, 
        sendHint, setPlayers} = useAppContext()
    const [isInvestigated, setIsInvestigated] = useState(false)
    const [isUserInvestigated, setIsUserInvestigated] = useState(false)
    const [state, setState] = useState(null)
    const [hint, setHint] = useState(null)

    const handleClick = () => {
        sendVote(player.username)
        console.log("voted",player.username)
    }

    const handleDownKey = (e) => {
        if (e.key === "Enter") {
            setIsUserInvestigated(false)
            sendHint(hint)
            setPlayers(prev => {
                const updateArray = [...prev]
                const index = updateArray.findIndex(a => a.username === player?.username)
                if (index === -1){return}
                // append the words list inside the player object
                updateArray[index] = {...updateArray[index], 
                    words: [...updateArray[index].words, hint]}

                return updateArray
            })
        }
    }

    // need to add when the user is been investigated
    useEffect(() =>{   
        console.log("dsjl") 
        setIsUserInvestigated(false)
        setIsInvestigated(false)

        if (investigating?.username !== player?.username){return} 
        //investigating?.username === username
        if ( investigating?.username === username){
            setIsUserInvestigated(true)
            console.log("user",investigating?.username, "===", player?.username, "investigating")
            return
        }
        setIsInvestigated(true)

    },[investigating])

    useEffect(()=>{
        if (gameState === "game.investigating"){
            setState(<div className="thinking">Thinking.....</div>)
            return
        }
        if (gameState === "game.voting"){ // testing
            setState(
                <div className="voting">
                    <button onClick={handleClick}>Vote</button>
                <span>{JSON.stringify(player) || "nigger"}</span>    
                </div>
            )
        }
    },[gameState])

    return(
    <div className={`user-element ${isInvestigated ? "user-element-selected":""}`}>
        <div className="profile-container">
            <img src={profileImg}/>
            <div>
                <h2>{player?.username || "ifk"}</h2>
                {gameState === "game.investigating" ? (
                    <div className="thinking">Thinking...</div>
                ) : (
                    <div className="voting">
                        <button onClick={handleClick}>Vote</button>
                    <span>{JSON.stringify(player?.votes?.length) || "nigger"}</span>    
                    </div>
                )}
            </div>
        </div>
        <div className="words-container">
            {player?.words?.map((word)=>(
                <p>{word}</p>
            ))} 
        </div>
        <div className="hint-input-container">{isUserInvestigated ? 
                <input placeholder="temp input" 
                    onKeyDown={handleDownKey} 
                    onChange={(e)=>setHint(e.target.value)}/> :
                ""
            }
            {isUserInvestigated}
        </div>
    </div>
    )
}