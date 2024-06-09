import InputForm from "../../components/InputForm";
import { useNavigate } from "react-router-dom";
import logo from "../../images/F-Math.png";
import { CreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useState } from "react";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [phone, setPhone] = useState('');

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault()
        await CreateUserWithEmailAndPassword(email, password)
        navigate('/login')
    }

    return (
        <div class="flex bg-primary min-h-screen">
            <img class="w-6/12 min-h-screen" src={logo} alt="Logo" />
            <div class="flex flex-col w-6/12 items-center p-40">
                <p class="text-5xl font-bold mb-8">Đăng ký</p>
                <InputForm text="Tài khoản" type="text" onChange={e => setAccount(e.target.value)} />
                <InputForm text="Họ và tên" type="text" onChange={e => setName(e.target.value)} />
                <InputForm text="Mật khẩu" type="password" onChange={e => setPassword(e.target.value)} />
                <InputForm text="Email" type="text" onChange={e => setEmail(e.target.value)}/>
                <InputForm text="Số điện thoại" type="text" onChange={e => setPhone(e.target.value)} />
                <div className="flex self-start justify-center items-center mb-6 pl-11 text-sm">
                    <label className="font-bold text-gray-500  mr-4">Đối tượng</label>
                    <select class="form-select rounded-lg bg-input text-gray-500 font-bold">
                        <option value="hocsinh">Student</option>
                        <option value="phuhuynh">Parent</option>
                    </select>
                </div>
                <button onClick={onSubmit} class="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-24 pl-24 rounded text-white font-semibold text-xl">Đăng ký</button>
            </div>
        </div>
    );
}

export default Register;