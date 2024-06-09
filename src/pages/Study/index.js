import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useTranslation } from 'react-i18next';

function Study() {
    const { t } = useTranslation(['study']);

    return (
        <div>
            <Header />
            <Navbar />
            <div class=" flex bg-navbar min-h-screen p-4 justify-center">
                <div class="text-center">
                    <p class=" font-semibold text-4xl font-medium mb-6">HỌC TOÁN LUÔN VUI</p>
                    <div class="flex justify-center">
                        <button class="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{ t('Learn by topic')}</button>
                        <button class="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{ t('Basic exercises')}</button>
                        <button class="bg-sky-300 hover:bg-blue-500 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{ t('Advanced exercises')}</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Study;