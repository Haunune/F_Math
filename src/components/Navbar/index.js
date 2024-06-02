import { NavLink } from "react-router-dom";
import Button from "../Button";

function Navbar() {
    return (
        <div class="flex flex-wrap justify-between bg-primary h-[76px] items-center ">
            <NavLink to={"/"}>
                <Button nav={true} text="Học Thử" />
            </NavLink>
            <NavLink to={"/study"}>
                <Button nav={true} text="Học tập cùng F-Math" />
            </NavLink>
            <NavLink to={"/"}>
                <Button nav={true} text="Kết quả thi" />
            </NavLink>
            <NavLink to={"/"}>
                <Button nav={true} text="Hỗ trợ" />
            </NavLink>
        </div>
    );
}

export default Navbar;