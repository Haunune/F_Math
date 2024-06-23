import InputForm from "../../components/InputForm";
import { useNavigate } from "react-router-dom";
import logo from "../../images/F-Math.png";
import { CreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useState } from "react";
import { database } from "../../firebase/firebase.js";
import { child, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('Student')

    const navigate = useNavigate();

    const onSubmit = async () => {
        const userCreate = await CreateUserWithEmailAndPassword(email, password)
        const user = userCreate.user;
        const dbRef = ref(database);

        await set(child(dbRef, `accounts/` + user.uid), {
            id: "User" + user.uid,
            email,
            password,
            name,
            account,
            phone,
            type
        }).catch((error) => {
            alert("Error Creating Account:", error.message)
        })
        navigate('/')
    }

    return (
        <div className="flex bg-primary min-h-screen">
            <img className="w-6/12 min-h-screen" src={logo} alt="Logo" />
            <div className="flex flex-col w-6/12 items-center p-40">
                <p className="text-5xl font-bold mb-8">Đăng ký</p>
                <InputForm text="Tài khoản" type="text" onChange={e => setAccount(e.target.value)} />
                <InputForm text="Họ và tên" type="text" onChange={e => setName(e.target.value)} />
                <InputForm text="Mật khẩu" type="password" onChange={e => setPassword(e.target.value)} />
                <InputForm text="Nhập lại mật khẩu" type="password" onChange={e => setPassword(e.target.value)} />
                <InputForm text="Email" type="text" onChange={e => setEmail(e.target.value)} />
                <InputForm text="Số điện thoại" type="text" onChange={e => setPhone(e.target.value)} />
                <div className="flex self-start justify-center items-center mb-6 pl-11 text-sm">
                    <label className="font-bold text-gray-500  mr-4">Đối tượng</label>
                    <select className="form-select rounded-lg bg-input text-gray-500 font-bold" value={type} onChange={e => setType(e.target.value)}>
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                    </select>
                </div>
                <button onClick={onSubmit} className="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-24 pl-24 rounded text-white font-semibold text-xl">Đăng ký</button>
            </div>
        </div>
    );
}

export default Register;