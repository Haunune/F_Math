import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { SignOut } from "../../firebase/auth";
import { child, get, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import { Slide, toast, ToastContainer } from "react-toastify";
import Navbar from "../../components/Navbar";

function Support() {
    const { t } = useTranslation(['support']);
    const location = useLocation();
    const [user, setUser] = useState(location.state);
    const [title_help, setTitleHelp] = useState('');
    const [content_help, setContentHelp] = useState('');
    const [helpArray, setHelpArray] = useState([]);
    const dbRef = ref(database);
    const [checkChoose, setCheckChoose] = useState(true);
    const [countHelp, setCountHelp] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state) {
            setUser(location.state);
        } else {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
    }, [navigate, location.state]);

    useEffect(() => {
        if (!checkChoose) {
            get(child(dbRef, `accounts/${user.id.replace("User", "")}/helps/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setHelpArray(Object.values(snapshot.val()));
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [dbRef, checkChoose])

    const onSignOut = () => {
        SignOut();
        localStorage.removeItem('user');
        navigate('/')
    }

    const onSendHelp = async () => {
        const time = new Date().toUTCString();

        if (title_help === '' || content_help === '' || (title_help === '' && content_help === '')) {
            toast.error("You need to fill in all information!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        } else {
            await set(child(dbRef, `accounts/${user.id.replace("User", "")}/helps/` + countHelp), {
                id: `help` + countHelp,
                title_help,
                content_help,
                time,
                answer: '',
                state: false,
            }).then(() => {
                setTitleHelp('');
                setContentHelp('');
                toast.success("Your question has been recorded. Please wait for information from the administrator!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }).catch((error) => {
                alert("Error Request help:", error.message)
            })
        }
        setCountHelp(Object.keys(helpArray).length + 1);
    }
    return (
        <div>
            <Header onClick={onSignOut} user={user} />
            <Navbar user={user} />
            {/* content */}
            <div className="flex sm:flex-row flex-col bg-navbar min-h-screen p-6">
                <ToastContainer />
                <div className="flex sm:flex-col sm:w-1/3 xl:px-20 sm:pt-10">
                    <button className={`h-14 px-3 sm:mt-4 mx-3 text-xl font-semibold rounded-lg text-white ${checkChoose ? 'bg-orange-600' : 'bg-orange-400'}`} onClick={() => setCheckChoose(true)}>{t('Require supported')}</button>
                    <button className={`h-14 px-3 bg-orange-400 sm:m-3 mt-0 mb-3 text-xl font-semibold rounded-lg text-white ${checkChoose ? 'bg-orange-400' : 'bg-orange-600'}`} onClick={() => setCheckChoose(false)}>{t('History supported')}</button>
                </div>
                {
                    checkChoose ?
                        <div className="flex flex-wrap flex-col sm:w-2/3 items-center">
                            <p className="font-bold text-center text-rose-900 text-4xl">{t('Support')}</p>
                            <div className="w-full flex justify-center">
                                <div className="relative w-[32rem]">

                                    <div className="relative mt-4 w-full min-w-[200px]">
                                        <input
                                            className="peer bg-input min-h-[100px] w-full !resize-none rounded-[7px] border border-blue-rose-200 bg-input px-3 py-2.5 font-sans text-sm font-normal text-blue-rose-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-rose-200 placeholder-shown:border-t-blue-rose-200 focus:border-2 focus:border-rose-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-rose-50"
                                            placeholder=" "
                                            value={title_help}
                                            onChange={(e) => setTitleHelp(e.target.value)}></input>
                                        <label
                                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none font-bold text-rose-900 text-[11px] leading-tight text-blue-rose-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-rose-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-rose-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-rose-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-rose-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-rose-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-rose-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-rose-500">
                                            {t('Title')}
                                        </label>
                                    </div>
                                    <div className="relative mt-5 w-full min-w-[200px]">
                                        <textarea rows="8"
                                            className="peer bg-input h-full min-h-[100px] w-full !resize-none rounded-[7px] border border-blue-rose-200 bg-input px-3 py-2.5 font-sans text-sm font-normal text-blue-rose-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-rose-200 placeholder-shown:border-t-blue-rose-200 focus:border-2 focus:border-rose-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-rose-50"
                                            placeholder=" "
                                            value={content_help}
                                            onChange={(e) => setContentHelp(e.target.value)}></textarea>
                                        <label
                                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none font-bold text-rose-900 text-[11px] leading-tight text-blue-rose-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-rose-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-rose-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-rose-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-rose-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-rose-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-rose-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-rose-500">
                                            {t('Your question')}
                                        </label>
                                    </div>
                                    <div className="flex gap-2w-full justify-between py-1.5">
                                        <button
                                            onClick={onSendHelp}
                                            className="select-none rounded-md bg-violet-400 py-4 px-6 text-center align-middle font-sans font-bold uppercase text-white shadow-md shadow-rose-900/10 transition-all hover:shadow-lg hover:shadow-rose-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            type="button" >
                                            {t('Send your question')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> : <div className="flex flex-col w-2/3 items-center">
                            <p className="text-center text-rose-900 font-bold text-4xl">{t('HISTORY SUPPORTED')}</p>
                            <div className="min-h-max overflow-y-auto max-h-screen flex flex-col mx-20 my-10">
                                <div className="p-5 flex-grow w-full rounded-xl">
                                    <div className="rounded-lg overflow-hidden shadow-lg shadow-amber-200">
                                        <div className="bg-orange-300">
                                            <div className="flex text-xl font-semibold text-center">
                                                <div className="flex-1 border border-slate-300 p-3">ID</div>
                                                <div className="flex-1 border border-slate-300 p-3">{t('Title')}</div>
                                                <div className="flex-1 border border-slate-300 p-3">{t('Content help')}</div>
                                                <div className="flex-1 border border-slate-300 p-3">{t('Answer')}</div>
                                                <div className="flex-1 border border-slate-300 p-3">{t('State')}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            {
                                                helpArray.map((item) => (
                                                    <div className="flex min-h-max overflow-y-auto" key={item.id}>
                                                        <div className="flex-1 text-center border border-slate-300 p-3">{item.id}</div>
                                                        <div className="flex-1 text-center border border-slate-300 p-3">{item.title_help}</div>
                                                        <div className="flex-1 text-center border border-slate-300 p-3">{item.content_help}</div>
                                                        <div className="flex-1 text-center border border-slate-300 p-3">{item.answer}</div>
                                                        <div className="flex-1 text-center border border-slate-300 p-3">{item.state ? <span className="p-2 font-bold text-xl text-emerald-600">{t('Processed')}</span> : <span className="p-2 font-bold text-xl text-red-600">{t('Pending')}</span>}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
            <Footer />
        </div>
    );
}

export default Support;