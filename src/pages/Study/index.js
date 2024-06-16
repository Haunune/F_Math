import { child, get, ref } from "firebase/database";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { database } from "../../firebase/firebase";

function Study() {
    const { t } = useTranslation(['study']);
    const [lecturessArray, setLecturesArray] = useState([]);
    const [lectures, setLectures] = useState([]);
    const dbRef = ref(database);

    get(child(dbRef, `lectures`)).then((snapshot) => {
        if (snapshot.exists()) {
            // setLecturesArray(snapshot.val());
            setLecturesArray(Object.values(snapshot.val()));
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

    const Semester1 = () => {
        setLectures(lecturessArray.slice(0, 4));
        console.log(lectures)
    }

    const Semester2 = () => {
        setLectures(lecturessArray.slice(4, 8));
        console.log(lectures)

    }

    return (
        <div>
            <Header />
            <Navbar />
            <div className=" flex bg-navbar min-h-screen p-4 justify-center">
                <div className="text-center">
                    <p className=" font-semibold text-4xl font-medium mb-6">{t('Learning math is always fun')}</p>
                    <div className="flex justify-center">
                        <button className="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{t('Learn by topic')}</button>
                        <button className="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{t('Basic exercises')}</button>
                        <button className="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{t('Advanced exercises')}</button>
                    </div>
                    {/* content */}
                    <div className="flex min-h-screen w-full mt-6 border rounded border-black">
                        <div className="flex flex-col w-1/5 bg-lime-100 min-h-screen border-r-2 border-black">
                            <button onClick={Semester1} className="p-6 text-xl hover:bg-lime-400 focus:bg-lime-400 border">Semester 1</button>
                            <button onClick={Semester2} className="p-6 text-xl hover:bg-lime-400 focus:bg-lime-400 border">Semester 2</button>
                        </div>
                        <div className="w-4/5 bg-lime-100 min-h-screen">
                            {
                                lectures.map((index, lecture) => (
                                    <div key={lecture.id} className="mb-4 p-4 bg-white rounded shadow">
                                        <h3 className="text-2xl font-bold">{lecture.title}</h3>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Study;