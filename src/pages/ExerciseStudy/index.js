import { child, get, ref } from "firebase/database";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { database } from "../../firebase/firebase";
import { SignOut } from "../../firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import BlocklySpace from "../../components/BlocklySpace";

function ExerciseStudy() {
    const { t } = useTranslation(['study']);
    const [lecturessArray, setLecturesArray] = useState([]);
    const dbRef = ref(database);
    const location = useLocation();
    const [user, setUser] = useState(location.state.user);
    const [lesson, setLessonr] = useState(location.state.lesson);
    const [IdLectures, setIdLectures] = useState(location.state.IdLectures);
    const navigate = useNavigate();

    useEffect(() => {
        get(child(dbRef, `lectures/${IdLectures.charAt(IdLectures.length - 1)}/lessons`)).then((snapshot) => {
            if (snapshot.exists()) {
                setLecturesArray(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [])

    const onSignOut = () => {
        SignOut();
        navigate('/')
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
                        <button className="p-6 text-xl text-indigo-700 font-bold hover:bg-lime-400 focus:bg-lime-400 border">Semester 1</button>
                            {
                                lecturessArray.map((lecture) => (
                                    <button key={lecture.id} className={`p-3 text-normal text-indigo-700 font-bold hover:bg-amber-400 focus:bg-amber-500 border ${lesson.id===lecture.id ? 'bg-amber-500' : 'bg-lime-100'}`}>{lecture.title}</button>
                                ))
                            }
                        </div>

                        <div className="w-4/5 bg-lime-100 min-h-screen">
                            <BlocklySpace lesson={lesson}/>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div >
    );
}

export default ExerciseStudy;