import { useNavigate } from "react-router-dom"



export const messageHandlers = ({
        setLogs, setPlayers, setVotes, setHints, setGameState, roomId
    }) => ({

    "player.join":(data) => {
        setLogs(prev => [...prev, data])
        setPlayers(prev =>[...prev, data.client])
        console.log("player.join")
    },

    "player.left":(data) =>{
        console.log( "player.left", data.client)
        setLogs(prev => [...prev, data.message])
        setPlayers(prev => prev.filter(a => a.username !== data.client))
     
        console.log(players[0].client, data.client)
        // setPlayers(prev => [...prev, data])
       
    },
    "game.starting":(data) =>{
        const navigate = useNavigate()
        setLogs(prev => [...prev, data])
        navigate(`/room/${roomId}`)
        console.log(data, "game.starting")
    }

})