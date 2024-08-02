import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { SignOut } from "../../firebase/auth";

function History() {
    const location = useLocation();
    const { t } = useTranslation('history');
    const navigate = useNavigate();
    const dbRef = ref(database);
    const [lessonCompleted, setLessonCompleted] = useState([]);

    useEffect(() => {
        get(child(dbRef, `accounts/${location.state.id.replace("User", "")}/completedLectures`)).then((snapshot) => {
            if (snapshot.exists()) {
                const lessonList = []
                if (snapshot.val().basic) {
                    lessonList.push((Object.values(snapshot.val().basic)));
                }
                if (snapshot.val().advanced) {
                    lessonList.push((Object.values(snapshot.val().advanced)));
                }
                lessonList.push(Object.values(snapshot.val()).slice(2));
                setLessonCompleted(lessonList.flat())
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    console.log(lessonCompleted)

    const onSignOut = () => {
        SignOut();
        navigate("/")
    }

    return (
        <div className="bg-navbar text-center justify-center">
            <Header user={location.state} onClick={onSignOut} />
            <Navbar />
            <p className="font-bold text-4xl mt-10 text-rose-900">{t('STUDY HISTORY')}</p>
            <div className="min-h-max overflow-y-auto max-h-screen flex flex-col sm:mx-20 sm:my-10">
                <div className="border p-5 flex-grow w-full rounded-xl shadow-lg shadow-violet-300">
                    <div className="rounded-lg overflow-hidden text-rose-900">
                        <div className="bg-indigo-300 text-xl">
                            <div className="flex">
                                <div className="border border-slate-300 p-3 flex-1 font-bold text-center">{t('Lesson Name')}</div>
                                <div className="border border-slate-300 p-3 flex-1 font-bold text-center">{t('Time Completed')}</div>
                                <div className="border border-slate-300 p-3 flex-1 font-bold text-center">{t('Score')}</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {
                                lessonCompleted.map((lesson, index) => (
                                    <div key={index} className="flex sm:text-base text-sm">
                                        <div className="border border-slate-300 p-3 flex-1 text-center">{lesson.title}</div>
                                        <div className="border border-slate-300 p-3 flex-1 text-center">{lesson.completeAt}</div>
                                        <div className="border border-slate-300 p-3 flex-1 text-center">{lesson.score}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;