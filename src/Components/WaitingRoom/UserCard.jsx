import "./UserCard.css"

export default function UserCard({payload}){
    const userCardColors = [
        "--usercard-color-1",
        "--usercard-color-2",
        "--usercard-color-3",
        "--usercard-color-4",
        "--usercard-color-5",
        "--usercard-color-6",
    ];

    function getRandomCardColor() {
        const randomVar = userCardColors[Math.floor(Math.random() * userCardColors.length)];
        console.log(userCardColors.indexOf(randomVar))
        //const index = userCardColors.indexOf(randomVar)
        //userCardColors.splice(index, 1)
        return `var(${randomVar})`;
    }


    return(
        <div className="waiting-room-user"
        // style={{
        //     display: "flex", alignItems:"center",
        //     flexDirection: "space-around",
        //     padding: "4px 12px",
        //     width:"500px", marginBottom: "4px",
        //     backgroundColor: "var(--usercard-color-3)"
        // }}
        >
            <h2>{payload.username}</h2>{payload.IsHost ? 
                <p>Host</p>: ""}
        </div>
    )
}