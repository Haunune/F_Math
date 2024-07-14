import Header from "../../components/Header";
import { FaUserCog, FaBook } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { TbHelpOctagonFilled } from "react-icons/tb";
import { GrDocumentUpdate } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
import { SignOut } from "../../firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../../firebase/firebase";
import { child, get, ref, set } from "firebase/database";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [title, setTitleLecture] = useState('');
    const [lecture_content, setContentLecture] = useState('');
    const [resultLecture, setResultLecture] = useState('');

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
    }, []);

    const deleteUser = async (userId) => {
        try {
            await dbRef.firestore().collection('users').doc(userId).delete();
            setUsers(users.filter(user => user.id !== userId));
            alert('User deleted successfully!');
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
            if(user.helps){
                userHelps.push({ id: user.id, help: user.helps });
            }
        });
        setHelp(userHelps)
    }, [users]);

    return (
        <>
            <Header onClick={onSignOut} user={location.state} />
            <div className="flex">
                <div className="flex flex-col min-h-screen w-1/5 py-10 bg-orange-200">
                    {/* các components */}
                    <button onClick={() => { setUserManager(!isUserManager); setIsclickStudy(false); setIsClickHelp(false) }} className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"> <FaUserCog className="mr-4 mt-1" /> Quản lý tài khoản user</button>
                    <button onClick={() => { setIsclickStudy(!isclickStudy); setUserManager(false); setIsClickHelp(false) }} className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><FaBook className="mr-4 mt-1" />Quản lý học tập</button>
                    <button className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><MdAccessTimeFilled className="mr-4 mt-1" />Thống kê truy cập</button>
                    <button onClick={() => { setIsClickHelp(!isclickHelp); setUserManager(false); setIsclickStudy(false)}} className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><TbHelpOctagonFilled className="mr-4 mt-1" />Trả lời help</button>
                    <button className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><GrDocumentUpdate className="mr-4 mt-1" />Update tuyên dương</button>
                </div>
                {/* Handle User Manager */}
                {
                    isUserManager ?
                        <div className="flex jutify-center w-screen h-fit p-10">
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
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="border border-slate-300 p-3">{user.id}</td>
                                            <td className="border border-slate-300 p-3">{user.account}</td>
                                            <td className="border border-slate-300 p-3">{user.email}</td>
                                            <td className="border border-slate-300 p-3">{user.name}</td>
                                            <td className="border border-slate-300 p-3">{user.phone}</td>
                                            <td className="border border-slate-300 p-3">{user.type}</td>
                                            <td className="border border-slate-300 p-3"><button className="bg-red-400 p-3 rounded" onClick={() => deleteUser(user.id)}>Delete</button></td>
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
                                    <th className="border border-slate-300 p-3">ID</th>
                                    <th className="border border-slate-300 p-3">Title</th>
                                    <th className="border border-slate-300 p-3">Content</th>
                                    <th className="border border-slate-300 p-3">Time</th>
                                    <th className="border border-slate-300 p-3">Answer</th>
                                    <th className="border border-slate-300 p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helps.map(help => (
                                    <tr key={help.id}>
                                        <td className="border border-slate-300 p-3">{help.id}</td>
                                        <td className="border border-slate-300 p-3">{help.title_help}</td>
                                        <td className="border border-slate-300 p-3">{help.content_help}</td>
                                        <td className="border border-slate-300 p-3">{help.answer}</td>
                                        <td className="border border-slate-300 p-3">{help.time}</td>
                                        <td className="border border-slate-300 p-3"><button className="bg-red-400 p-3 rounded" onClick={() => deleteUser(help.id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    : ""
                }

            </div>
        </>
    );
}

export default Admin;