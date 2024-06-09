import InputForm from "../../components/InputForm";
import logo from "../../images/F-Math.png";
import { SignInWithEmailAndPassword, SignInWithGoogle } from "../../firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault()
        await SignInWithEmailAndPassword(email, password)
        navigate('/')
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        SignInWithGoogle()
        navigate('/')
    }

    return (
        <div class="flex bg-primary min-h-screen">
            <img class="w-6/12 min-h-screen" src={logo} alt="Logo" />

            <div class="flex flex-col w-6/12 items-center py-40 px-36">
                <p class="text-5xl font-bold mb-8">Đăng nhập</p>
                <InputForm text="Email" type="email" onChange={e => setEmail(e.target.value)} />
                <InputForm text="Mật khẩu" type="password" onChange={e => setPassword(e.target.value)} />
                {/* thẻ link đến quên mật khẩu chưa làm để tạm */}
                <p class="flex self-end mr-12 mt-2 mb-6 underline underline-offset-1">Quên mật khẩu</p>
                <button onClick={onSubmit} class="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">Đăng nhập</button>
                <button onClick={onGoogleSignIn} class="flex items-center bg-white hover:bg-slate-200 mt-4 mr-6 ml-6 p-3 px-20 rounded text-slate-600 font-semibold text-xl">
                    <div class="size-4">
                        <FcGoogle />
                    </div>
                    <p class="ml-4">Đăng nhập với Google</p>
                </button>
            </div>
        </div>
    );
}

export default Login;