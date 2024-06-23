import InputForm from "../../components/InputForm";
import logo from "../../images/F-Math.png";
import { ResetPassword, SignInWithEmailAndPassword, SignInWithGoogle } from "../../firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { RiLockPasswordLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgot, setForgot] = useState(false);
    const [notify, setNotify] = useState("");
    const { t } = useTranslation('login')
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

    const resetPassword = () => {
        ResetPassword(email)
        setForgot(false)
    }

    return (
        <div className="flex bg-primary min-h-screen">
            <img className="w-6/12 max-h-screen" src={logo} alt="Logo" />

            <div className="flex flex-col w-6/12 items-center py-40 px-36">
                <p className="text-5xl font-bold mb-8">{t('signin')}</p>
                <InputForm text="Email" type="email" onChange={e => setEmail(e.target.value)} />
                <InputForm text={t('password')} type="password" onChange={e => setPassword(e.target.value)} />
                <p onClick={() => setForgot(true)} className="flex self-end mr-12 mt-2 mb-6 underline underline-offset-1">{t('forgot')}</p>
                <button onClick={onSubmit} className="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{t('signin')}</button>
                <button onClick={onGoogleSignIn} className="flex items-center bg-white hover:bg-slate-200 mt-4 mr-6 ml-6 p-3 px-20 rounded text-slate-600 font-semibold text-xl">
                    <div className="size-4">
                        <FcGoogle />
                    </div>
                    <p className="ml-4">{t('signin Google')}</p>
                </button>
            </div>
            {
                forgot && 
                <div className="absolute min-w-full min-h-screen">
                    <div className="absolute min-w-full min-h-screen bg-black opacity-50"></div>
                    <div className="absolute p-8 left-1/3 top-1/4 z-50 bg-navbar w-1/3 min-h-60 rounded-xl">
                        <p className="flex items-center space-x-2 font-bold text-xl mb-8">
                            <span><RiLockPasswordLine /></span>
                            <span>{t('forgot')}</span>
                        </p>
                        <InputForm text="Email" type="email" onChange={e => setEmail(e.target.value)} />
                        <button onClick={() => resetPassword()} className="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl mt-4">{t('changepassword')}</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default Login;