import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import { SignOut } from '../../firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ExamResult() {
    const { t } = useTranslation();
    const location = useLocation();
    const [user, setUser] = useState(location.state);
    const navigate = useNavigate();

    const onSignOut = () => {
        SignOut();
        navigate('/')
    }
    return ( 
        <div>
            <Header onClick={onSignOut} user={user}/>
            <Navbar user={user}/>
            <div className="flex justify-center items-start min-h-screen bg-navbar p-6">
                <Button color={"sky-300"} colorHover={"green-700"} nav={true} text={t('result.daily')} />
                <Button color={"sky-300"} colorHover={"sky-600"} nav={true} text={t('result.week')} />
            </div>
            <Footer />
        </div>
     );
}

export default ExamResult;