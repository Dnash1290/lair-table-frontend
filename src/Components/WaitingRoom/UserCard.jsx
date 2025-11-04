export default function UserCard({payload}){
    return(
        <div className="waiting-room-user"
        style={{
            border:"orange solid 3px",
            width:"500px"
        }}>
            <h2>{ JSON.stringify(payload)}</h2>
        </div>
    )
}