import Header from "../../components/Header";
import { FaUserCog, FaBook } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { TbHelpOctagonFilled } from "react-icons/tb";
import { GrDocumentUpdate } from "react-icons/gr";
import { useLocation, useNavigate } from "react-router-dom";
import { SignOut } from "../../firebase/auth";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

function Admin() {
    const location = useLocation();
    const navigate = useNavigate();

    const onSignOut = () => {
       SignOut();
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);


    return (
        <div className="">
            <Header onClick={onSignOut} user={location.state}/>
            <div className="flex flex-col min-h-screen w-1/5 py-10 bg-orange-200">
                {/* các components */}
                <button className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"> <FaUserCog className="mr-4 mt-1"/> Quản lý tài khoản user</button>
                <button className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><FaBook className="mr-4 mt-1"/>Quản lý học tập</button>
                <button className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><MdAccessTimeFilled className="mr-4 mt-1"/>Thống kê truy cập</button>
                <button className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><TbHelpOctagonFilled className="mr-4 mt-1"/>Trả lời help</button>
                <button className="flex text-xl p-6 hover:bg-blue-300 focus:bg-blue-300"><GrDocumentUpdate className="mr-4 mt-1"/>Update tuyên dương</button>
            </div>
            <div className="flex w-4/5">
                <div>
                    
                </div>
            </div>
        </div>
    );
}

export default Admin;