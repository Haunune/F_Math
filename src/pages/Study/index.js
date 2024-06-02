import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

function Study() {
    return (
        <div>
            <Header />
            <Navbar />
            <div class=" bg-navbar min-h-screen p-4">
                <p class="font-semibold text-4xl font-medium mb-6">HỌC TOÁN LUÔN VUI</p>
                <div>
                    <button class="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">Học theo chủ đề</button>
                    <button class="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">Bài tập cơ bản</button>
                    <button class="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">Bài tập nâng cao</button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Study;