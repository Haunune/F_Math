import Header from "../../components/Header";
import { FaUserCog, FaBook } from "react-icons/fa";
import { TbHelpOctagonFilled } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateUserWithEmailAndPassword, SignOut } from "../../firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../../firebase/firebase";
import { child, get, ref, remove, set, update } from "firebase/database";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImCancelCircle } from "react-icons/im";
import InputForm from "../../components/InputForm";
import CryptoJS from 'crypto-js';


function Admin() {
    const location = useLocation();
    const navigate = useNavigate();
    const dbRef = ref(database);
    const [lecturesArray, setLecturesArray] = useState([]);
    const [lecturesArray1, setLecturesArray1] = useState([]);
    const [lecturesArray2, setLecturesArray2] = useState([]);

    const [isclickStudy, setIsclickStudy] = useState(false);
    const [isUserManager, setUserManager] = useState(false);
    const [isclickformStudy, setIsclickFormStudy] = useState(false);
    const [isclickHelp, setIsClickHelp] = useState(false);
    const [isanswerHelp, setIsAnswerHelp] = useState(false);
    const [isclickAddUser, setIsclickAddUser] = useState(false);
    const [isclickEditUser, setIsclickEditUser] = useState(false);
    const [title, setTitleLecture] = useState('');
    const [lecture_content, setContentLecture] = useState('');
    const [resultLecture, setResultLecture] = useState('');
    const [answer, setAnswer] = useState('');
    const [editUser, setEditUser] = useState(null);

    const [checkSemester, setCheckSemester] = useState('Semester1');
    const [chooseTopic, setChooseTopic] = useState('');

    const [isclickformBasicEx, setIsclickFormBasicEx] = useState(false);
    const [isclickformAdvancedEx, setIsclickFormAdvancedEx] = useState(false);


    const [contentBs, setContentBasicEx] = useState('');
    const [resultBsEx, setResultBasicEx] = useState('');
    const [titleBsEx, setTitleBasicEx] = useState('');

    const [contentAd, setContentAdvancedEx] = useState('');
    const [resultAdEx, setResultAdvancedEx] = useState('');
    const [titleAdEx, setTitleAdvancedEx] = useState('');

    const [countStudy, setCountStudy] = useState(30);
    const [countBasic, setCountBasic] = useState(2);
    const [countAdvanced, setCountAdvanced] = useState(2);

    const [users, setUsers] = useState([]);

    const [helps, setHelp] = useState([]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('Student');

    useEffect(() => {
        get(child(dbRef, `accounts`)).then((snapshot) => {
            if (snapshot.exists()) {
                setUsers(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef]);

    const deleteUser = async (userId) => {
        try {
            if (window.confirm('Deleting this account will erase all your data, do you still want to delete it?')) {
                await remove(child(dbRef, `accounts/${userId.replace("User", "")}/`));
                setUsers(users.filter(user => user.id !== userId));
                alert('User deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting user: ', error);
            alert('Failed to delete user.');
        }
    };
    


    const notify = () => {
        toast.success("Upload data success!", {
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
    }

    const submitStudy = async () => {
        let lectureId = '';

        const selectedLecture = lecturesArray.find(lecture => lecture.title === chooseTopic);
        if (selectedLecture) {
            lectureId = selectedLecture.id;
        }

        await set(child(dbRef, `lectures/${lectureId.charAt(lectureId.length - 1)}/lessons/${countStudy}`), {
            id: 'hk1_' + countStudy,
            lecture_content,
            title,
            resultLecture
        }).catch((error) => {
            alert("Error Creating Account:", error.message)
        })

        // when upload done
        setCountStudy(countStudy + 1);
        setTitleLecture('');
        setContentLecture('');
        setResultLecture('');
        notify();
    }

    const submitBasicEx = async () => {

        await set(child(dbRef, `basic_exercise/${countBasic}`), {
            id: 'bse' + countBasic,
            contentBs,
            resultBsEx
        }).catch((error) => {
            alert("Error Creating Account:", error.message)
        })

        // when upload done
        setCountBasic(countBasic);
        setContentBasicEx('');
        setResultBasicEx('');
        notify();
    }

    const submitAdEx = async () => {

        await set(child(dbRef, `advanced_exercise/${countAdvanced}`), {
            id: 'ade' + countAdvanced,
            contentAd,
            resultAdEx
        }).catch((error) => {
            alert("Error Creating Account:", error.message)
        })

        // when upload done
        setCountAdvanced(countAdvanced);
        setContentAdvancedEx('');
        setResultAdvancedEx('');
        notify();
    }

    const checkclickStudy = () => {
        setIsclickFormStudy(true)
        setIsclickFormBasicEx(false)
        setIsclickFormAdvancedEx(false)
    }

    const checkclickBasicEx = () => {
        setIsclickFormStudy(false)
        setIsclickFormBasicEx(true)
        setIsclickFormAdvancedEx(false)
    }

    const checkclickAdvancedEx = () => {
        setIsclickFormStudy(false)
        setIsclickFormBasicEx(false)
        setIsclickFormAdvancedEx(true)
    }
    const onSignOut = () => {
        localStorage.removeItem('user');
        SignOut();
    }

    useEffect(() => {
        get(child(dbRef, `lectures`)).then((snapshot) => {
            if (snapshot.exists()) {
                setLecturesArray(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {

            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        setLecturesArray1(lecturesArray.slice(0, 4));
        setLecturesArray2(lecturesArray.slice(4, 8));
    }, [lecturesArray])

    /* Answer help */
    useEffect(() => {
        const userHelps = [];
        users.forEach(user => {
            if (user.helps) {
                const helpsArray = Object.values(user.helps).map(helpItem => ({
                    ...helpItem, idUser: user.id, nameUser: user.account
                }));
                userHelps.push(...helpsArray);
            }
        });
        setHelp(userHelps)
    }, [users]);

    const handleAnswer = async (event, helpItem) => {
        event.preventDefault();
        setIsAnswerHelp(false);
        console.log(helpItem)

        await update(child(dbRef, `accounts/${helpItem.idUser.replace("User", "")}/helps/${helpItem.id.replace("help", "")}`), {
            answer,
            state: true,
        }).then(() => {
            setAnswer(answer)

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

    const onSubmit = async (event) => {
        setIsclickAddUser(false)
        event.preventDefault();
        const userCreate = await CreateUserWithEmailAndPassword(email, password)
        const user = userCreate.user;
        const passCrypto = CryptoJS.AES.encrypt(password, '24092002').toString();
        const newUser = {
            id: "User" + user.uid,
            email,
            password: passCrypto,
            name,
            account,
            phone,
            type
        };

        await set(child(dbRef, `accounts/` + user.uid), newUser);

        setUsers([...users, newUser]);

    }

    const onSave = async (e, id) => {
        e.preventDefault();
        setIsclickEditUser(false);
        
        await update(child(dbRef, `accounts/${id.replace("User", "")}/`), {
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

        window.location.reload();
    }

    return (
        <>
            <Header onClick={onSignOut} user={location.state} />
            <div className="flex">
                <ToastContainer />
                {/* handle add user */}
                {
                    isclickAddUser ?
                        <>
                            <div className="flex absolute justify-center items-center top-0 w-full h-full bg-gray-200 bg-opacity-50 z-40 text-rose-900">
                                <div className="bg-white z-20 border rounded-lg w-1/3 p-10">
                                    <div onClick={() => setIsclickAddUser(false)} className="flex justify-end text-3xl" ><ImCancelCircle /></div>
                                    <p className="text-2xl font-bold text-rose-900 pt-5 text-center">Add New User</p>
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

                            <div className="flex absolute justify-center top-0 w-full h-full bg-black opacity-70"></div>
                        </> : ""
                }

                <div className="flex flex-col min-h-screen w-1/5 py-10 bg-orange-200">
                    {/* các components */}
                    <button onClick={() => { setUserManager(!isUserManager); setIsclickStudy(false); setIsClickHelp(false) }} className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"> <FaUserCog className="mr-4 mt-1" /> Quản lý tài khoản user</button>
                    <button onClick={() => { setIsclickStudy(!isclickStudy); setUserManager(false); setIsClickHelp(false) }} className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><FaBook className="mr-4 mt-1" />Quản lý học tập</button>
                    <button onClick={() => { setIsClickHelp(!isclickHelp); setUserManager(false); setIsclickStudy(false) }} className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><TbHelpOctagonFilled className="mr-4 mt-1" />Trả lời help</button>
                </div>
                {/* Handle User Manager */}
                {
                    isUserManager ?
                        <div className="flex flex-col jutify-center w-screen h-fit p-10">
                            <button className=" w-28 mb-3 bg-green-400 p-3 text-white font-semibold rounded" onClick={() => setIsclickAddUser(true)}>Add User</button>

                            <table className="table-auto border-collapse border border-slate-400">
                                <thead className="bg-blue-300">
                                    <tr>
                                        <th className="border border-slate-300 p-3">ID</th>
                                        <th className="border border-slate-300 p-3">Account Name</th>
                                        <th className="border border-slate-300 p-3">Email</th>
                                        <th className="border border-slate-300 p-3">Full Name</th>
                                        <th className="border border-slate-300 p-3">Phone Number</th>
                                        <th className="border border-slate-300 p-3">Account Type</th>
                                        <th className="border border-slate-300 p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.map(user => (
                                        <tr key={user.id}>
                                            <td className="border border-slate-300 p-3">{user.id}</td>
                                            <td className="border border-slate-300 p-3">{user.account}</td>
                                            <td className="border border-slate-300 p-3">{user.email}</td>
                                            <td className="border border-slate-300 p-3">{user.name}</td>
                                            <td className="border border-slate-300 p-3">{user.phone}</td>
                                            <td className="border border-slate-300 p-3">{user.type}</td>
                                            <td className="border border-slate-300 py-3 pl-7">
                                                <button className="bg-red-400 p-3 rounded text-white font-semibold" onClick={() => deleteUser(user.id)}>Delete</button>
                                                <button className="bg-yellow-400 py-3 px-[22px] mt-4 rounded text-white font-semibold" onClick={() => { setIsclickEditUser(true); setEditUser(user) }} >Edit</button>
                                            </td>
                                            {
                                                isclickEditUser && editUser &&
                                                <>
                                                    <div className="flex absolute justify-center items-center left-0 top-0 w-full h-full bg-gray-200 bg-opacity-50 z-40 text-rose-900">
                                                        <div className="bg-white z-20 border rounded-lg w-1/3 p-10">
                                                            <div onClick={() => setIsclickEditUser(false)} className="flex justify-end text-3xl" ><ImCancelCircle /></div>
                                                            <p className="text-2xl font-bold text-rose-900 pt-5 text-center">Edit Information</p>
                                                            <form onSubmit={e => onSave(e,editUser.id)} className="flex flex-col w-full items-center">
                                                                <InputForm text={editUser.account || "Tài khoản"} type="text" onChange={e => setAccount(e.target.value)} />
                                                                <InputForm text={editUser.name || "Họ và tên"} type="text" onChange={e => setName(e.target.value)} />
                                                                <InputForm text={editUser.email || "Email"} type="text" onChange={e => setEmail(e.target.value)} />
                                                                <InputForm text={editUser.phone || "Số điện thoại"} type="text" onChange={e => setPhone(e.target.value)} />
                                                                <div className="flex w-screen sm:w-full sm:self-start justify-center items-center lg:mb-6 md:mb-3 mb-6 sm:pl-11 text-sm">
                                                                    <label className="font-bold text-gray-500  mr-4">Đối tượng</label>
                                                                    <select className="form-select rounded-lg bg-input text-gray-500 font-bold" value={type} onChange={e => setType(e.target.value)}>
                                                                        <option value="Student">Student</option>
                                                                        <option value="Parent">Parent</option>
                                                                    </select>
                                                                </div>
                                                                <button className="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-24 pl-24 rounded text-white font-semibold text-xl">Save</button>
                                                            </form>
                                                        </div>
                                                    </div>

                                                </>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        : ""
                }

                {/* Handle Study Button */}
                {
                    isclickStudy ?
                        <div className="flex flex-col w-4/5 p-10">
                            <ToastContainer />
                            <div className="flex flex-wrap h-fit w-full justify-center">
                                <button onClick={checkclickStudy} className="text-xl p-6 m-6 bg-violet-300 rounded-lg hover:bg-indigo-400 focus:bg-indigo-400">Quản lý bài học</button>
                                <button onClick={checkclickBasicEx} className="text-xl p-6 m-6 bg-violet-300 rounded-lg hover:bg-indigo-400 focus:bg-indigo-400">Quản lý bài tập cơ bản</button>
                                <button onClick={checkclickAdvancedEx} className="text-xl p-6 m-6 bg-violet-300 rounded-lg hover:bg-indigo-400 focus:bg-indigo-400">Quản lý bài tập nâng cao</button>
                            </div>

                            {
                                isclickformStudy ?
                                    <div className="flex flex-col h-fit border-solid border-2 border-indigo-600 rounded-lg p-6">
                                        <select onChange={(e) => setCheckSemester(e.target.value)} className="rounded-lg">
                                            <option value={"Semester1"}>Semester1</option>
                                            <option value={"Semester2"}>Semester2</option>
                                        </select>
                                        {
                                            checkSemester === 'Semester1' ? <select className="rounded-lg mt-4" onChange={e => setChooseTopic(e.target.value)}>
                                                {
                                                    lecturesArray1.map((lecture) => (
                                                        <option key={lecture.id} value={lecture.title}>{lecture.title}</option>
                                                    ))
                                                }
                                            </select> : <select className="rounded-lg mt-4" onChange={e => setChooseTopic(e.target.value)}>
                                                {
                                                    lecturesArray2.map((lecture) => (
                                                        <option key={lecture.id} value={lecture.title}>{lecture.title}</option>
                                                    ))
                                                }
                                            </select>
                                        }

                                        <input value={title} placeholder="Tiêu đề" className="rounded-lg my-4" onChange={e => setTitleLecture(e.target.value)} />
                                        <textarea value={lecture_content} className="rounded-lg" placeholder="Nội dung bài học" onChange={e => setContentLecture(e.target.value)}></textarea>
                                        <input value={resultLecture} placeholder="Kết quả" className="rounded-lg my-4" onChange={e => setResultLecture(e.target.value)} />
                                        <div className="flex justify-end">
                                            <button className="bg-amber-600 text-xl font-semibold rounded-full m-2 p-4 w-1/4 " onClick={submitStudy}>Upload</button>
                                        </div>
                                    </div> : ""
                            }

                            {/* bài tập cơ bản*/}
                            {
                                isclickformBasicEx ?
                                    <div className="flex flex-col h-fit border-solid border-2 border-indigo-600 rounded-lg p-6">
                                        <input value={titleBsEx} placeholder="Tiêu đề" className="rounded-lg my-4" onChange={(e) => setTitleBasicEx(e.target.value)} />
                                        <textarea value={contentBs} className="rounded-lg" placeholder="Nội dung bài tập cơ bản" onChange={(e) => setContentBasicEx(e.target.value)}></textarea>
                                        <input value={resultBsEx} placeholder="Kết quả" className="rounded-lg my-4" onChange={(e) => setResultBasicEx(e.target.value)} />
                                        <div className="flex justify-end">
                                            <button className="bg-amber-600 text-xl font-semibold rounded-full m-2 p-4 w-1/4 " onClick={submitBasicEx}>Upload</button>
                                        </div>
                                    </div> : ""
                            }

                            {/* bài tập nâng cao*/}
                            {
                                isclickformAdvancedEx ?
                                    <div className="flex flex-col h-fit border-solid border-2 border-indigo-600 rounded-lg p-6">
                                        <input value={titleAdEx} placeholder="Tiêu đề" className="rounded-lg my-4" onChange={(e) => setTitleAdvancedEx(e.target.value)} />
                                        <textarea value={contentAd} className="rounded-lg" placeholder="Nội dung bài tập nâng cao" onChange={(e) => setContentAdvancedEx(e.target.value)}></textarea>
                                        <input value={resultAdEx} placeholder="Kết quả" className="rounded-lg my-4" onChange={(e) => setResultAdvancedEx(e.target.value)} />
                                        <div className="flex justify-end">
                                            <button className="bg-amber-600 text-xl font-semibold rounded-full m-2 p-4 w-1/4 " onClick={submitAdEx}>Upload</button>
                                        </div>
                                    </div> : ""
                            }

                        </div> : ""
                }

                {/* Handle Answer Help */}
                {
                    isclickHelp ?
                        <div className="flex jutify-center w-screen h-fit p-10">
                            <table className="table-auto border-collapse border border-slate-400">
                                <thead className="bg-blue-300">
                                    <tr>
                                        <th className="border border-slate-300 p-3">User</th>
                                        <th className="border border-slate-300 p-3">ID</th>
                                        <th className="border border-slate-300 p-3">Title</th>
                                        <th className="border border-slate-300 p-3">Content</th>
                                        <th className="border border-slate-300 p-3">Time</th>
                                        <th className="border border-slate-300 p-3">Answer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {helps.map(helpItem => (
                                        helpItem.state ? "" :
                                            <tr key={helpItem.id}>
                                                <td className="border border-slate-300 p-3">{helpItem.nameUser}</td>
                                                <td className="border border-slate-300 p-3">{helpItem.id}</td>
                                                <td className="border border-slate-300 p-3">{helpItem.title_help}</td>
                                                <td className="border border-slate-300 p-3">{helpItem.content_help}</td>
                                                <td className="border border-slate-300 p-3">{helpItem.time}</td>
                                                <td className="border border-slate-300 p-3">
                                                    <button onClick={() => setIsAnswerHelp(true)} className="bg-green-500 p-3 rounded-lg">Answer</button>
                                                    {
                                                        isanswerHelp ?
                                                            <div key={helpItem.id} className="flex absolute justify-center items-center top-0 left-10 w-full h-full bg-gray-200 bg-opacity-50 z-10">
                                                                <div className="bg-white z-20 border rounded-lg w-1/2 p-10">
                                                                    <div onClick={() => setIsAnswerHelp(false)} className="flex justify-end text-3xl" ><ImCancelCircle /></div>
                                                                    <p className="text-2xl font-bold text-black pt-5 text-center text-5xl">Answer</p>
                                                                    <div className="flex flex-col">
                                                                        <div className="flex items-center pt-5 w-full">
                                                                            <span className="ml-5 min-w-32 text-red-500 font-semibold text-2xl">Question:</span>
                                                                            <div>{helpItem.content_help}</div>
                                                                        </div>
                                                                        <div className="flex items-center pt-5 w-full">
                                                                            <span className="ml-5 min-w-32 text-red-500 font-semibold text-2xl">Answer:</span>
                                                                            <textarea onChange={e => setAnswer(e.target.value)} className="mr-5 rounded-lg" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-end pt-5">
                                                                        <button onClick={e => handleAnswer(e, helpItem)} className="bg-blue-500 text-white px-5 py-3 mr-5 rounded-lg">Accept</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : ""
                                                    }
                                                </td>
                                            </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                        : ""
                }

            </div >
        </>
    );
}

export default Admin;