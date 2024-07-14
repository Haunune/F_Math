import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import { SignOut } from '../../firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { child, get, ref, set } from 'firebase/database';
import { database } from '../../firebase/firebase';

function ExamResult() {
    const { t } = useTranslation();
    const location = useLocation();
    const [user, setUser] = useState(location.state);
    const [userArray, setUserArray] = useState([]);
    const [scoreArray, setScoreArray] = useState([]);
    const [isClick, setIsClick] = useState(true);
    const dbRef = ref(database);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const onSignOut = () => {
        SignOut();
        navigate('/')
    }

    const ClickDaily = () => {
        setIsClick(!isClick);
    }

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


    // lấy thông tin điểm
    useEffect(() => {
        const userScores = [];
        userArray.forEach(user => {
            if (user.completedLectures) {
                userScores.push({ id: user.id, scoreList: user.completedLectures });
            }
        });
        setScoreArray(userScores)
    }, [userArray]);


    // useEffect(() => {
    //     scoreArray.forEach(list => {
    //         const listScore = Object.values(list.scoreList)
    //         const totalScore = listScore.reduce((total, scores) => total + Number(scores.score), 0);
    //         const fecthData = async () => {
    //             await set(child(dbRef, `accounts/${list.id}/` + `/totalScore`), {
    //                 totalScore,
    //             }).catch((error) => {
    //                 alert("Error Creating Data:", error.message)
    //             });
    //         }
    //     });
    // }, []);

    return (
        <div className='flex flex-col'>
            <Header onClick={onSignOut} user={user} />
            <Navbar user={user} />
            <div className="flex flex-col items-center min-h-screen bg-navbar p-6">
                <div>
                    <button onClick={() => ClickDaily()} className={`p-6 mx-10 hover:bg-green-300 rounded-xl font-semibold text-white text-lg ${isClick ? 'bg-green-500' : 'bg-sky-300'}`}>{t('result.daily')}</button>
                    <button onClick={() => ClickDaily()} className={`p-6 mx-10 hover:bg-green-300 rounded-xl font-semibold text-white text-lg ${isClick ? 'bg-sky-300' : 'bg-green-500'}`}>{t('result.week')}</button>
                </div>
                {/* table winner*/}
                {
                    scoreArray.map(() => {

                    })
                }
                <div className='flex mt-12 bg-cyan-100 w-full min-h-max'>
                    <div className="w-1/3">
                        winer 1
                    </div>
                    <div className="w-2/3">
                        <table className="table-auto border-collapse border border-slate-400">
                            <thead className="bg-blue-300">
                                <tr>
                                    <th className="border border-slate-300 p-3">Avatar</th>
                                    <th className="border border-slate-300 p-3">Account Name</th>
                                    <th className="border border-slate-300 p-3">Full Name</th>
                                    <th className="border border-slate-300 p-3">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="border border-slate-300 p-3">{user.id}</td>
                                        <td className="border border-slate-300 p-3">{user.account}</td>
                                        <td className="border border-slate-300 p-3">{user.email}</td>
                                        <td className="border border-slate-300 p-3">{user.name}</td>
                                        <td className="border border-slate-300 p-3">{user.phone}</td>
                                        <td className="border border-slate-300 p-3">{user.type}</td>
                                        <td className="border border-slate-300 p-3"><button className="bg-red-400 p-3 rounded" onClick={() => deleteUser(user.id)}>Delete</button></td>
                                    </tr>
                                ))} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ExamResult;