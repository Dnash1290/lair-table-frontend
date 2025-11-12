import "./UserElement.css"
import profileImg from "../../assets/icons/profile.png"
import { useAppContext } from "../../WebSocket/WsContext"
import { useEffect, useState } from "react"

export default function UserElement({player}){
    const { investigating, gameState, sendVote, username} = useAppContext()
    const [isInvestigated, setIsInvestigated] = useState(false)
    const [isUserInvestigated, setIsUserInvestigated] = useState(false)
    const [state, setState] = useState(null)

    const handleClick = () =>{
        sendVote(player.username)
        console.log("voted",player.username)
    }

    // need to add when the user is been investigated
    useEffect(() =>{    
        setIsUserInvestigated(false)
        setIsInvestigated(false)

        if (investigating?.username !== player?.username){return} 

        if (investigating?.username === username){// testing
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
        if (gameState === "game.voting"){
            setState(
                <div className="voting"><button onClick={handleClick}>Vote</button></div>
            )
        }

    },[gameState])



    return(
    <div className={`user-element ${isInvestigated ? "user-element-selected":""}`}>
        <div className="profile-container">
            <img src={profileImg}/>
            <div>
                <h2>{player?.username || "ifk"}</h2>
                {state}
            </div>
        </div>
        <div className="words-container">
            <p>fdrgrwea</p>
            <p>fdfdsfa</p>
            <p>ftfwda</p>
        </div>
        <div className="hint-input-container">{isUserInvestigated ? 
                <input placeholder="temp input"/> : ""
            }
            {isUserInvestigated}
        </div>
    </div>
    )
}