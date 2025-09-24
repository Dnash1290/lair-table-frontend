
import { Route , Routes} from "react-router-dom";
import Rooms from "./src/Pages/Rooms/Rooms";


export default function Pages(){
    return(
    <>
        <Routes>
            <Route path ="/rooms" element={<Rooms/>}/>
        </Routes>
    </>)
}