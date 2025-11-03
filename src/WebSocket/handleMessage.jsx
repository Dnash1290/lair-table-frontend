export const messageHandlers = ({ setLogs, setPlayers, setVotes, setHints, setGameState }) => ({
    "player.log":(data) => {
        setLogs(prev => [...prev, data])
        console.log(data)
    }
})