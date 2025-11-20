import { useNavigate } from "react-router-dom"

export const messageHandlers = ({
        setLogs, setPlayers, setVoters, setGameState, roomId,
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
        setGameState(data.game_status)
    },

    "player.vote":(data) => {
        console.log("recived vote")

        setVoters(prev => {
        const updated = [...prev];
        const index = updated.findIndex(a => a.voter === data.voter);

        if (index !== -1) {
            // voter already voted → update their vote
            updated[index] = { voter: data.voter, vote: data.vote };
            console.log("updating vote")
            return updated;
        }
        
        console.log("adding vote")
        // first time voting
        return [...prev, { voter: data.voter, vote: data.vote }];
        });


    setPlayers(prev => {
    return prev.map(player => {
        // ensure votes[] always exists
        const currentVotes = player.votes || [];

        let newVotes = currentVotes;

        // remove old vote if this voter previously voted for this player
        if (currentVotes.includes(data.voter)) {
        newVotes = currentVotes.filter(v => v !== data.voter);
        }

        // add new vote if this is who the voter chose
        if (player.username === data.vote) {
        newVotes = [...newVotes, data.voter];
        }

        return {
        ...player,
        votes: newVotes
        };
    });
    });

    }
})