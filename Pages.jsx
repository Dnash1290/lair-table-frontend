
import { Route , Routes} from "react-router-dom";
import Rooms from "./src/Pages/Rooms/Rooms";
import GameEngine from "./src/Pages/GameEngine/GameEngine";

export default function Pages(){
    return(
    <>
        <Routes>
            <Route path ="/room" element={<Rooms/>}/>
            <Route path="/room/:room_id" element={<GameEngine/>} /> // did i do somthing wrong?
        </Routes>
    </>)
}   