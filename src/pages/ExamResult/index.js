import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';

function ExamResult() {
    const { t } = useTranslation();

    return ( 
        <div>
            <Header />
            <Navbar />
            <div class="flex justify-center items-start min-h-screen bg-navbar p-6">
                <Button color={"sky-300"} colorHover={"green-700"} nav={true} text={t('result.daily')} />
                <Button color={"sky-300"} colorHover={"sky-600"} nav={true} text={t('result.week')} />
            </div>
            <Footer />
        </div>
     );
}

export default ExamResult;