import Button from "../../components/Button";
import InputForm from "../../components/InputForm";
import logo from "../../images/F-Math.png";
import ChooseUser from "../../components/ChooseUser";

function Register({ text, type }) {
    return (
        <div class="flex bg-primary min-h-screen">
            <img class="w-6/12 min-h-screen" src={logo} alt="Logo" />
            <div class="flex flex-col w-6/12 items-center p-40">
                <p class="text-5xl font-bold mb-8">Đăng ký</p>
                <InputForm text="Tài khoản" type="text" />
                <InputForm text="Họ và tên" type="text" />
                <InputForm text="Mật khẩu" type="password" />
                <InputForm text="Email" type="text" />
                <InputForm text="Số điện thoại" type="text" />
                <div className="flex self-start mb-6 pl-11 text-sm">
                    <p className="font-bold text-slate-500 mr-4">Đối tượng</p>
                    <ChooseUser />
                </div>
                <Button nav={true} text={"Đăng ký"} />
            </div>
        </div>
    );
}

export default Register;