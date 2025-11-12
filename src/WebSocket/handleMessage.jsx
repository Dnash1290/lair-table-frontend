import { useNavigate } from "react-router-dom"

export const messageHandlers = ({
        setLogs, setPlayers, setVotes, setHints, setGameState, roomId,
        navigate, setCategory, setWord, setImposter, setInvestigating
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
    },

    "game.starting":(data) =>{
        console.log(data, "game.starting")        
        navigate(`/room/${roomId}`)

        setLogs(prev => [...prev, data])
        setImposter(data.imposter)
        setGameState(data.game_status)
        setCategory(data.word.category)
        setWord(data.word.word)
        console.log("Setting category:", data.word.category)
        console.log("Setting word:", data.word.word)
    },

    "game.investigation":(data) =>{
        console.log("game.investigation", data)
        setInvestigating(data.investigating)
        setGameState(data.game_status)
    },
    "game.voting":(data) =>{
        // setGameState()
    }
})