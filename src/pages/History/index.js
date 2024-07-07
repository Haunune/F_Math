import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { SignOut } from "../../firebase/auth";

function History() {
    const location = useLocation();
    const navigate = useNavigate();
    const dbRef = ref(database);
    const [lessonCompleted, setLessonCompleted] = useState([]);

    useEffect(() => {
        get(child(dbRef, `accounts/${location.state.id.replace("User", "")}/completedLectures`)).then((snapshot) => {
            if (snapshot.exists()) {
                setLessonCompleted(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    const onSignOut = () => {
        SignOut();
        navigate("/")
    }

    return (
        <div className="bg-navbar text-center justify-center">
            <Header user={location.state} onClick={onSignOut} />
            <Navbar />
            <p className="font-semibold text-3xl mt-5">STUDY HISTORY</p>
            <div className="min-h-screen flex flex-col ml-20 mr-20 mt-10">
                <table className="table-auto border-collapse border border-slate-400">
                    <thead className="bg-blue-300">
                        <tr>
                            <th className="border border-slate-300 p-3">Lesson Name</th>
                            <th className="border border-slate-300 p-3">Time Completed</th>
                            <th className="border border-slate-300 p-3">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lessonCompleted.map((lesson, index) => (
                                <tr key={index}>
                                    <td className="border border-slate-300 p-3">{lesson.title}</td>
                                    <td className="border border-slate-300 p-3">{lesson.completeAt}</td>
                                    <td className="border border-slate-300 p-3">10</td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default History;