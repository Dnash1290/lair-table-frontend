import { useNavigate } from "react-router-dom"

export const messageHandlers = ({
        setLogs, setPlayers, setVotes, setGameState, roomId,
        navigate, setCategory, setWord, setImposter, setInvestigating,
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

    "player.hint":(data) => {
        setPlayers(prev =>{
            const updateArray = [...prev]
            const index = updateArray.findIndex(a => a.username === data.username)
            if (index === -1) return

            const { hint, ...cleanData } = data;
            updateArray[index] = cleanData
            return updateArray
        })
    },

    "game.voting":(data) =>{
        // setGameState()
    }
})