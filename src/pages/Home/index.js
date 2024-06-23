import Carousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import images from "../../images";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { SignOut } from "../../firebase/auth";
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Home() {
    const [authUser, setAuthUser] = useState(null);
    const [informationsArray, setInformationsArray] = useState([]);
    const dbRef = ref(database);
    const navigate = useNavigate();

    get(child(dbRef, `informations`)).then((snapshot) => {
        if (snapshot.exists()) {
            setInformationsArray(Object.values(snapshot.val()));
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

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

    const onSignOut = () => {
        SignOut();
    }
    return (
        <div>
            <Header onClick={onSignOut} user={authUser} />
            <Navbar user={authUser}/>
            <div className="min-h-screen bg-navbar">
                <div className="flex min-h-80">
                    <div className="flex w-2/4 p-4 justify-center items-center">
                        <div className="w-2/5 ml-14">
                            <img src={images.logo} alt="Logo" />
                        </div>
                        <div className="w-3/5 pl-20 text-xl leading-loose">
                            <div>tintt</div>
                            <div>Trần Trung Tín</div>
                            <div>Điểm số: <span>9</span></div>
                        </div>
                    </div>
                    <div className="w-2/4">
                        <Carousel />
                    </div>
                </div>
                <div className="flex bg-navbar max-w-screen min-h-screen">
                    {
                        informationsArray.map((item, index) => (
                            <div key={index} className="flex flex-col max-w-prose max-h-full p-8">
                                <img className="h-2/4" src={item.imageUrl} alt="Advertise website" />
                                <span className="font-bold text-2xl mt-8">{item.title}</span>
                                <div className="text-ellipsis text-justify overflow-hidden text-wrap">{item.content}</div>
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