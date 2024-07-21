import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { SignOut } from "../../firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Avatar from 'react-avatar';
import { FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { child, get, ref, update } from "firebase/database";
import { database } from "../../firebase/firebase";
import { Slide, toast, ToastContainer } from "react-toastify";

function Infomation() {
    const location = useLocation();
    const { t } = useTranslation('info');
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [score, setScore] = useState(location.state.totalScore);
    const [email, setEmail] = useState(location.state.email);
    const [name, setName] = useState(location.state.name);
    const [account, setAccount] = useState(location.state.account);
    const [phone, setPhone] = useState(location.state.phone);
    const [type, setType] = useState('Student');
    const dbRef = ref(database);

    console.log(location)

    //Tạo màu ngẫu nhiên cho avatar
    const randomColor = () => {
        const rdNum = Math.floor(Math.random() * 16777215);
        return `#${rdNum.toString(16).padStart(6, '0')}`;
    }

    const onSignOut = () => {
        SignOut();
        navigate("/")
    }

    const saveChange = async (event) => {
        event.preventDefault();
        setIsEdit(false);

        await update(child(dbRef, `accounts/${location.state.id.replace("User", "")}/`), {
            account,
            email,
            name,
            phone,
            type,
        }).then(() => {
            setAccount(account);
            setName(name);
            setEmail(email);
            setPhone(phone);
            setType(type);
    
            toast.success('Update information successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }).catch((error) => {
            alert("Error Updating Data:", error.message);
        });
    }

    return (
        <div className="relative">
            <Header user={location.state} onClick={onSignOut} />
            <div className="flex min-h-screen p-20">
                <ToastContainer />
                <div className="flex flex-col items-center max-content w-1/3 border shadow-xl p-3 rounded-lg shadow-rose-300">
                    {/* avatar */}
                    <Avatar className="mt-7" name={name} size="250" round={true} color={randomColor()} />
                    <div className="mt-10 font-bold text-3xl">{account}</div>
                    <button className={`p-6 my-5 bg-orange-500 hover:bg-orange-300 rounded-xl font-semibold text-white text-lg`} onClick={() => setIsEdit(true)} >{t('edit profile')}</button>
                </div>

                <div className="flex flex-col items-center w-2/3 ml-5 leading-loose border shadow-xl p-10 rounded-lg shadow-orange-300 text-xl">
                    <p className="text-5xl font-bold mb-6">{t('TITLE')}</p>
                    <div className="flex flex-col w-full justify-start pl-20">
                        <p className="leading-loose">{t('name')} <span className="font-semibold">{name}</span> </p>
                        <span className="">Email: <span className="font-semibold">{email}</span> </span>
                        <span className="">{t('telephone')} <span className="font-semibold">{phone}</span> </span>
                        <p className="leading-loose">{t('account type')} <span className="font-semibold">{type}</span> </p>
                    </div>
                    <div className="flex m-10 text-xl">
                        <div className="text-xl border p-5 flex-grow w-full rounded-xl">
                            <div className="flex justify-between items-center mb-5">
                                <h1 className="font-semibold">Practice</h1>
                                <h1 className="font-semibold">Total score: <span className="text-red-500">{score.totalScore}</span></h1>
                            </div>
                            <div className="flex justify-around">
                                <div className="flex flex-col items-center border shadow-xl rounded-xl p-5 m-5 text-green-500">
                                    <div className="text-6xl">{score.totalLectureScore}</div>
                                    <div className="mt-2 text-lg font-semibold">Lecture Exercise</div>
                                    <div className="mt-2"> <FaRegHeart /></div>
                                </div>
                                <div className="flex flex-col items-center border shadow-xl rounded-xl p-5 m-5 text-orange-500">
                                    <div className="text-6xl">{score.totalBasicScore}</div>
                                    <div className="mt-2 text-lg font-semibold">Basic Exercise</div>
                                    <div className="mt-2"> <FaRegHeart /></div>
                                </div>
                                <div className="flex flex-col items-center border shadow-xl rounded-xl p-5 m-5 text-red-500">
                                    <div className="text-6xl">{score.totalAdvancedScore}</div>
                                    <div className="mt-2 text-lg font-semibold">Advanced Exercise</div>
                                    <div className="mt-2"> <FaRegHeart /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                isEdit ?
                    <>
                        <div className="flex absolute justify-center items-center top-0 w-full h-full bg-gray-200 bg-opacity-50 z-10">
                            <div className="bg-white z-20 border rounded-lg w-1/3 p-10">
                                <div onClick={() => setIsEdit(false)} className="flex justify-end text-3xl" ><ImCancelCircle /></div>
                                <p className="text-2xl font-bold text-black pt-5 text-center">Change Profile</p>
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center pt-5 w-full">
                                        <span className="ml-5">Account Name</span>
                                        <input className="mr-5 w-1/2 rounded-lg" placeholder={account} value={account} 
                                            onChange={e => setAccount(e.target.value)}/>
                                    </div>
                                    <div className="flex justify-between items-center pt-5 w-full">
                                        <span className="ml-5">Full Name</span>
                                        <input className="mr-5 w-1/2 rounded-lg" placeholder={name} value={name} 
                                            onChange={e => setName(e.target.value)}/>
                                    </div>
                                    <div className="flex justify-between items-center pt-5 w-full">
                                        <span className="ml-5">Email</span>
                                        <input className="mr-5 w-1/2 rounded-lg" placeholder={email} value={email} 
                                            onChange={e => setEmail(e.target.value)}/>
                                    </div>
                                    <div className="flex justify-between items-center pt-5 w-full">
                                        <span className="ml-5">Phone number</span>
                                        <input className="mr-5 w-1/2 rounded-lg" placeholder={phone} value={phone} 
                                            onChange={e => setPhone(e.target.value)}/>
                                    </div>
                                    <div className="flex justify-between items-center pt-5 w-full">
                                        <span className="ml-5">Account Type</span>
                                        <select className="form-select rounded-lg mr-5 w-1/2 rounded-lg bg-input text-gray-500 font-bold" value={type} onChange={e => setType(e.target.value)}>
                                            <option value="Student">Student</option>
                                            <option value="Parent">Parent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-5">
                                    <button onClick={saveChange} className="bg-purple-400 text-white px-5 py-3 mr-5 rounded-lg">Save change</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex absolute justify-center top-0 w-full h-full bg-black opacity-70"></div>
                    </>

                    : ""
            }

            <Footer />
        </div>
    );
}

export default Infomation;