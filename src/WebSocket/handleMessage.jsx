export const messageHandlers = ({ setLogs, setPlayers, setVotes, setHints, setGameState }) => ({
    "player.join":(data) => {
        setLogs(prev => [...prev, data])
        console.log(data)
        setPlayers(prev =>[...prev, data.client])
    }
})