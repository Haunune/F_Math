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
import Avatar from 'react-avatar';
import images from '../../images';
import moment from 'moment';

function ExamResult() {
    const { t } = useTranslation();
    const location = useLocation();
    const [user, setUser] = useState(location.state);
    const [userArray, setUserArray] = useState([]);
    const [scoreArray, setScoreArray] = useState([]);
    const [rankArray, setRankArray] = useState([]);
    const [isClick, setIsClick] = useState(true);
    const dbRef = ref(database);
    const navigate = useNavigate();
    const [filteredScores, setFilteredScores] = useState([]);

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
                rankList.push({ account: user.account, fullname: user.name, score: 0, avatarUrl: user.avatarUrl })
            } else {
                rankList.push({ account: user.account, fullname: user.name, score: user.totalScore.totalScore, avatarUrl: user.avatarUrl })
            }
        })
        setRankArray(rankList.sort((a, b) => b.score - a.score));
    }, [userArray]);

    const [top] = rankArray;

    //Tạo màu ngẫu nhiên cho avatar
    const randomColor = () => {
        const rdNum = Math.floor(Math.random() * 16777215);
        return `#${rdNum.toString(16).padStart(6, '0')}`;
    }
    const topUserColor = randomColor();

     // Hàm lọc theo tuần
     const filterByWeek = (scores) => {
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');
        return scores.filter(score => moment(score.completeAt).isBetween(startOfWeek, endOfWeek));
    };

    // Hàm lọc theo tháng
    const filterByMonth = (scores) => {
        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');
        return scores.filter(score => moment(score.completeAt).isBetween(startOfMonth, endOfMonth));
    };

    useEffect(() => {
        let filtered = rankArray;
        if (isClick) {
            filtered = filterByWeek(rankArray);
        } else {
            filtered = filterByMonth(rankArray);
        }
        setFilteredScores(filtered);
    }, [isClick, rankArray]);


    return (
        <div className='flex flex-col'>
            <Header onClick={onSignOut} user={user} />
            <Navbar user={user} />
            <div className="flex flex-col items-center min-h-screen p-6">
                <div>
                    <button onClick={() => ClickDaily()} className={`sm:p-6 p-4 sm:mb-0 mb-3 mx-10 hover:bg-green-300 rounded-xl font-semibold text-white text-lg ${isClick ? 'bg-green-500' : 'bg-sky-300'}`}>{t('result.week')}</button>
                    <button onClick={() => ClickDaily()} className={`sm:p-6 p-4 mx-10 hover:bg-green-300 rounded-xl font-semibold text-white text-lg ${isClick ? 'bg-sky-300' : 'bg-green-500'}`}>{t('result.month')}</button>
                </div>
                {/* table winner*/}
                {
                    <div className='lg:flex mt-6 w-full text-rose-900'>
                        {
                            top &&
                            <div className="flex flex-col bg-green-100 items-center justify-start text-2xl lg:w-1/3 lg:m-0 mb-8 border shadow-xl p-3 rounded-lg shadow-blue-300">
                                {
                                    top.avatarUrl ? <img className="xl:w-60 lg:w-48 md:w-40 w-48 xl:h-60 lg:h-48 md:h-40 h-48 mt-16 rounded-full" src={top.avatarUrl}  alt='avatar' /> : <Avatar className="my-8" name={top.fullname} size="240" round={true} color={topUserColor} />
                                }
                                <img className="absolute xl:w-80 lg:w-64 md:w-52 w-64 xl:h-80 lg:h-64 md:h-52 h-64 sm:top-[330px] top-[390px]" src={images.win} />
                                <div className="pt-20">{top.account}</div>
                                <div className="pt-3 font-bold text-3xl">{top.fullname}</div>
                            </div>
                        }
                        <div className="lg:w-2/3 pr-5">
                            <div className="font-semibold bg-sky-100 sm:text-lg text-sm w-full min-h-max overflow-y-auto max-h-screen border shadow-xl p-3 lg:mx-6 mx-3 sm:mt-0 mt-6 rounded-lg shadow-green-300">
                                {
                                    filteredScores.map((ranktable, index) => (
                                        <div className={`relative flex flex-wrap items-end pb-10 ${index !== rankArray.length - 1 ? 'border-b-2' : ''}`} key={index}>
                                            {
                                                ranktable.avatarUrl ? <div className='relative left-5 top-5'><img className='flex w-24 h-24 rounded-full p-2' src={ranktable.avatarUrl} alt='avatar' /></div> : <Avatar className="p-3 m-2" name={ranktable.fullname} size="80" round={true} color={index === 0 ? topUserColor : randomColor()} />
                                            }
                                            <div className="flex-1 p-3 ml-4">{ranktable.account}</div>
                                            <div className="flex-1 p-3">{ranktable.fullname}</div>
                                            <div className="flex-1 p-3 text-center">{ranktable.score}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
            <Footer />
        </div >
    );
}

export default ExamResult;