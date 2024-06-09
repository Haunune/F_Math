import Carousel from "../../components/Carousel";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import images from "../../images";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { SignOut } from "../../firebase/auth";

function Home() {
    const [authUser, setAuthUser] = useState(null);

    // tạo hook để kiểm tra có user đang đăng nhập hay không
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user){
                setAuthUser(user);
            }else{
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        }
    },[]);

    const onSignOut = () =>{
        SignOut();
    }

    return (
        <div>
            <Header onClick={onSignOut} user={authUser}/>
            <Navbar />
            <div class="min-h-screen bg-navbar">
                <div class="flex min-h-80">
                    <div class="flex w-2/4 p-4 justify-center items-center">
                        <div class="w-2/5 ml-14">
                            <img src={images.logo} alt="Logo"/>
                        </div>
                        <div class="w-3/5 pl-20 text-xl leading-loose">
                            <div>tintt</div>
                            <div>Trần Trung Tín</div>
                            <div>Điểm số: <span>9</span></div>
                        </div>
                    </div>
                    <div class="w-2/4">
                    <Carousel />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;