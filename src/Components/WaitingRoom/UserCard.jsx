export default function UserCard({payload}){
    console.log(payload)
    return(
        <div className="waiting-room-user"
        style={{
            border:"orange solid 3px",
            width:"500px"
        }}>
            <h2>{payload?.data?.message ?? JSON.stringify(payload)}</h2>
        </div>
    )
}