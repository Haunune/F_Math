import Button from "../Button";

function Navbar() {
    return (
        <div class="flex flex-wrap justify-between bg-primary h-[76px] items-center ">
            <Button nav={true} text="Học Thử"/>
            <Button nav={true} text="Học tập cùng F-Math"/>
            <Button nav={true} text="Kết quả thi"/>
            <Button nav={true} text="Hỗ trợ"/>
        </div>
    );
}

export default Navbar;