import Button from "../../components/Button";
import Header from "../../components/Header";
import logo from "../../images/F-Math.png";

function Infomation() {
    return (
        <div>
            <Header/>
            <div class=" flex bg-primary min-h-screen p-4">
                <img class="h-80 pl-32" src={logo} alt={"avatar"}/>
                <div class="mx-40 text-start leading-loose">
                    <p class="text-4xl font-medium mb-6">THÔNG TIN TÀI KHOẢN</p>
                    <p>Tên tài khoản: </p>
                    <p>Họ và tên: </p>
                    <span>Email: </span>
                    <span class="ml-60">Số điện thoại: </span>
                    <p>Loại tài khoản: </p>                    
                    <Button nav={false} text={"Thêm học sinh"}/>
                    <Button nav={false} text={"Chỉnh sửa thông tin"}/>
                </div>
            </div>
        </div>
    );
}

export default Infomation;