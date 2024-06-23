import { child, get, ref } from "firebase/database";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { database } from "../../firebase/firebase";
import { SignOut } from "../../firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

function Study() {
    const { t } = useTranslation(['study']);
    const [lecturessArray, setLecturesArray] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [checkSemester, setCheckSemester] = useState(false);
    const [checkLesson, setCheckLesson] = useState(false);
    const dbRef = ref(database);
    const location = useLocation();
    const [user, setUser] = useState(location.state);
    const [IdLectures, setIdLectures] = useState(null);
    const navigate = useNavigate();

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
    }, [])

    const Semester1 = () => {
        setLectures(lecturessArray.slice(0, 4));
        setCheckSemester(true);
    }

    const Semester2 = () => {
        setLectures(lecturessArray.slice(4, 8));
        setCheckSemester(true);
    }

    const selectLectures = (lectures) => {
        setIdLectures(lectures.id)
        setLessons(lectures.lessons)
        setCheckSemester(false)
        setCheckLesson(true)
    }

    const onSignOut = () => {
        SignOut();
        navigate('/')
    }

    const selectLessons = (lesson) => {
        navigate(`${IdLectures}/${lesson.id}`, {state: {IdLectures, user, lesson}})
    }

    return (
        <div>
            <Header onClick={onSignOut} user={user} />
            <Navbar user={user} />
            <div className=" flex bg-navbar min-h-screen p-4 justify-center">
                <div className="text-center">
                    <p className=" font-semibold text-4xl font-medium mb-6">{t('Learning math is always fun')}</p>
                    <div className="flex justify-center">
                        <div className="bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl ">{t('Learn by topic')}</div>
                        <button className="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{t('Basic exercises')}</button>
                        <button className="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{t('Advanced exercises')}</button>
                    </div>
                    {/* content */}
                    <div className="flex min-h-screen w-full mt-6 border rounded border-black">
                        <div className="flex flex-col w-1/5 bg-lime-100 min-h-screen border-r-2 border-black">
                            <button onClick={Semester1} className="p-6 text-xl text-indigo-700 font-bold hover:bg-lime-400 focus:bg-lime-400 border">Semester 1</button>
                            <button onClick={Semester2} className="p-6 text-xl text-indigo-700 font-bold hover:bg-lime-400 focus:bg-lime-400 border">Semester 2</button>
                        </div>

                        <div className="w-4/5 bg-lime-100 min-h-screen p-3 pr-0">
                            {
                                checkSemester ?
                                    lectures.map((lecture) => (
                                        <div onClick={() => selectLectures(lecture)} key={lecture.id} className="mb-4 mr-3 p-4 bg-orange-300 text-indigo-700 rounded shadow hover:bg-orange-400 cursor-pointer">
                                            <h3 className="text-2xl font-bold">{lecture.title}</h3>
                                        </div>
                                    )) :
                                    <div className="flex flex-wrap">
                                        {
                                            checkLesson ? lessons.map((lesson) => (
                                                <div onClick={() => selectLessons(lesson)} key={lesson.id} className="my-6 mx-12 p-4  w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-orange-300 text-indigo-700 rounded shadow hover:bg-orange-400 cursor-pointer">
                                                    <h3 className="text-2xl font-bold">{lesson.title}</h3>
                                                </div>
                                            )) : <div className="flex justify-center min-w-full text-justify text-2xl text-indigo-700 pt-4 pl-10 font-bold"><span>Please choose the Semester</span></div>
                                        }
                                    </div>
                            }
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div >
    );
}

export default Study;