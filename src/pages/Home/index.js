import Carousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import images from "../../images";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { SignOut } from "../../firebase/auth";
import { child, get, ref, set } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Home() {
    const {t} = useTranslation();
    const [authUser, setAuthUser] = useState(null);
    const [informationsArray, setInformationsArray] = useState([]);
    const dbRef = ref(database);
    const [userArray, setUserArray] = useState([]);
    const [scoreArray, setScoreArray] = useState([]);
    const [rankArray, setRankArray] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(authUser));
    }, [authUser]);

    useEffect(() => {
        get(child(dbRef, `informations`)).then((snapshot) => {
            if (snapshot.exists()) {
                setInformationsArray(Object.values(snapshot.val()));
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [dbRef])

    // tạo hook để kiểm tra có user đang đăng nhập hay không
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                get(child(dbRef, `accounts/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userDetails = snapshot.val();
                        setAuthUser(userDetails);
                        if (userDetails.name === "ADMIN") {
                            navigate("/admin", { state: userDetails });
                        }
                    } else {
                        console.log("No data available");
                        if (user.photoURL) {
                            set(child(dbRef, `accounts/` + user.uid), {
                                id: "User" + user.uid,
                                email: user.email,
                                password: '',
                                name: user.displayName,
                                account: 'anonymous users',
                                phone: '',
                                type: 'Student',
                            });
                        }
                    }
                }).catch((error) => {
                    console.error(error);
                });

            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        }
    }, [dbRef, navigate]);


    useEffect(() => {
        const reloadFlag = localStorage.getItem('reloadFlag');

        if (authUser === null && !reloadFlag) {
            localStorage.setItem('reloadFlag', 'true');
            window.location.reload();
        } else if (authUser !== null) {
            localStorage.removeItem('reloadFlag');
        }
    }, [authUser]);

    const onSignOut = () => {
        localStorage.removeItem('user');
        SignOut();
        navigate("/");
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

    useEffect(() => {
        const fetchData = async (list, totalLectureScore, totalBasicScore, totalAdvancedScore, totalScore) => {
            if (isNaN(totalLectureScore) || isNaN(totalBasicScore) || isNaN(totalAdvancedScore)) {
                totalLectureScore = 0;
                totalBasicScore = 0;
                totalAdvancedScore = 0;
            }
            try {
                await set(child(dbRef, `accounts/${list.id.replace("User", "")}/totalScore`), {
                    totalLectureScore,
                    totalBasicScore,
                    totalAdvancedScore,
                    totalScore
                });
            } catch (error) {
                alert("Lỗi tạo dữ liệu:", error);
            }
        };

        scoreArray.forEach(list => {
            let totalBasicScore = 0;
            let totalAdvancedScore = 0;

            // điểm lecture
            const listScore = Object.entries(list.scoreList)
                .filter(([key, value]) => key !== 'basic' && key !== 'advanced')
                .map(([key, value]) => value);

            const totalLectureScore = listScore.reduce((total, scores) => total + Number(scores.score), 0);

            // điểm basic
            if (list.scoreList.basic) {
                const listBasicScore = Object.values(list.scoreList.basic);
                totalBasicScore = listBasicScore.reduce((total, scores) => total + Number(scores.score), 0);
            }

            // điểm advanced
            if (list.scoreList.advanced) {
                const listAdvancedScore = Object.values(list.scoreList.advanced);
                totalAdvancedScore = listAdvancedScore.reduce((total, scores) => total + Number(scores.score), 0);
            }

            const totalScore = totalLectureScore + totalBasicScore + totalAdvancedScore;

            fetchData(list, totalLectureScore, totalBasicScore, totalAdvancedScore, totalScore);
        });
    }, [dbRef, scoreArray]);

    useEffect(() => {
        const rankList = [];
        userArray.forEach(user => {
            if (user.totalScore === undefined) {
                rankList.push({ account: user.account, fullname: user.name, score: 0 })
            } else {
                rankList.push({ account: user.account, fullname: user.name, score: user.totalScore.totalScore })
            }
        })
        setRankArray(rankList.sort((a, b) => b.score - a.score));
    }, [userArray]);

    const [top] = rankArray;

    return (
        <div>
            <Header onClick={onSignOut} user={authUser}/>
            <Navbar user={authUser} />
            <div className="min-h-screen bg-navbar">
                <div className="flex flex-col sm:flex-row min-h-80 ">
                    {top &&
                        <div className="relative flex sm:w-2/4 p-4 justify-center items-center">
                            <div className="sm:w-2/5 w-1/3 mx-5 mt-5">
                                <img alt="avt" className=" border sm:shadow-xl shadow-lg rounded-full bg-red-600 shadow-orange-300" src={images.usertop} />
                            </div>
                            <p className="absolute 2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm w-full sm:top-9 top-2 left-9 font-bold text-sky-600">{t('carousel.Honor')}</p>
                            <div className="sm:w-3/5 w-2/3 lg:pl-10 leading-loose">
                                <div className="pt-3 font-semibold 2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-lg font-mono text-red-400">{t('carousel.Name')}{top.fullname}</div>
                                <div className="pt-5 font-semibold 2xl:text-2xl xl:text-xl lg:text-lg md:text-sm text-base font-mono text-red-400">{t('carousel.Score')}{top.score}</div>
                            </div>
                        </div>
                    }
                    <div className="sm:w-2/4 my-4">
                        <Carousel />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row bg-navbar max-w-screen min-h-screen text-orange-900">
                    {
                        informationsArray.map((item, index) => (
                            <div key={index} className="flex flex-col sm:max-w-prose sm:max-h-full sm:p-8 p-2">
                                <img className="xl:h-1/3" src={item.imageUrl} alt="Advertise website" />
                                <span className="font-bold sm:text-2xl text-xl sm:mt-8 mt-4">{item.title}</span>
                                <div className="text-ellipsis text-justify overflow-hidden max-w-md leading-relaxed">{item.content}</div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Home;