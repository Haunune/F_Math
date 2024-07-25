import InputForm from "../../components/InputForm";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../images/F-Math.png";
import { CreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useEffect, useState } from "react";
import { database } from "../../firebase/firebase.js";
import { child, get, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Slide, toast, ToastContainer } from "react-toastify";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('Student');
    const [userArray, setUserArray] = useState([]);

    const navigate = useNavigate();
    const dbRef = ref(database);

    useEffect(() => {
        get(child(dbRef, `accounts`)).then((snapshot) => {
            if (snapshot.exists()) {
                setUserArray(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef]);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            if (account) {
                const accountArray = [];
                userArray.forEach(user => {
                    if (user.account) {
                        accountArray.push(user.account);
                    }
                });

                if (accountArray.includes(account)) {
                    toast.error('Username already exist!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                    })
                } else {
                    if (!email || !password || !confirmPw || !name || !account || !phone || !type) {
                        toast.error('Please fill all information!', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Slide,
                        })
                    }

                    if (password !== confirmPw) {
                        toast.error('Re-entered password is incorrect', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Slide,
                        })
                    } else {
                        const userCreate = await CreateUserWithEmailAndPassword(email, password)
                        const user = userCreate.user;
                        await set(child(dbRef, `accounts/` + user.uid), {
                            id: "User" + user.uid,
                            email,
                            password,
                            name,
                            account,
                            phone,
                            type
                        });
                        navigate('/');
                    }


                }
            } else {
                if (!email || !password || !confirmPw || !name || !account || !phone || !type) {
                    toast.error('Please fill all information!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                    })
                }
            }

        } catch (error) {
            const errorType = error.message.split(' ');

            if (errorType[errorType.length - 1] === '(auth/invalid-email).') {
                toast.error('Invalid email. Please re-enter in the correct format!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }
            if (errorType[errorType.length - 1] === '(auth/missing-password).') {
                toast.error('Password does not blank!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }
            if (errorType[errorType.length - 1] === '(auth/email-already-in-use).') {
                toast.error('This email already exists', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }
            if (errorType[errorType.length - 1] === '(auth/weak-password).') {
                toast.error('Weak password. Create a password that must be 6 characters or more', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }

        }
    }

    return (
        <div className="flex justify-center bg-primary min-h-screen">
            <NavLink className="sm:w-6/12 sm:block hidden min-h-screen"  to={'/'}>
                <img className="min-h-screen"  src={logo} alt="Logo" />
            </NavLink>
            <div className="flex flex-col sm:w-6/12 items-center lg:p-16 sm:mt-2">
                <p className="lg:text-5xl text-4xl font-bold lg:mb-8 md:mb-2">Register</p>
                <ToastContainer />
                <form onSubmit={onSubmit} className="flex flex-col w-full items-center">
                    <InputForm text="Tài khoản" type="text" onChange={e => setAccount(e.target.value)} />
                    <InputForm text="Họ và tên" type="text" onChange={e => setName(e.target.value)} />
                    {/* xử lý điền lại mật khẩu */}
                    <InputForm text="Mật khẩu" type="password" onChange={e => setPassword(e.target.value)} />
                    <InputForm text="Nhập lại mật khẩu" type="password" onChange={e => setConfirmPw(e.target.value)} />
                    <InputForm text="Email" type="text" onChange={e => setEmail(e.target.value)} />
                    <InputForm text="Số điện thoại" type="text" onChange={e => setPhone(e.target.value)} />
                    <div className="flex w-screen sm:w-full sm:self-start justify-center items-center lg:mb-6 md:mb-3 mb-6 sm:pl-11 text-sm">
                        <label className="font-bold text-gray-500  mr-4">Đối tượng</label>
                        <select className="form-select rounded-lg bg-input text-gray-500 font-bold" value={type} onChange={e => setType(e.target.value)}>
                            <option value="Student">Student</option>
                            <option value="Parent">Parent</option>
                        </select>
                    </div>
                    <button onClick={onSubmit} className="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-24 pl-24 rounded text-white font-semibold text-xl">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;