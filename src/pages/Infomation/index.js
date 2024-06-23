import Button from "../../components/Button";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import logo from "../../images/F-Math.png";
import { SignOut } from "../../firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Infomation() {
    const location = useLocation();
    const { t } = useTranslation('info');
    const navigate = useNavigate();

    const onSignOut = () => {
        SignOut();
        navigate("/")
    }

    return (
        <div>
            <Header user={location.state} onClick={onSignOut} />
            <div className=" flex bg-rose-100 min-h-screen p-4">
                <img className="h-80 pl-32" src={logo} alt={"avatar"} />
                <div className="mx-40 text-start leading-loose font-bold text-xl">
                    <p className="text-4xl font-medium mb-6">{t('TITLE')}</p>
                    <p className="leading-loose">{t('account name')} <span className="font-normal">{location.state.account}</span> </p>
                    <p className="leading-loose">{t('name')} <span className="font-normal">{location.state.name}</span> </p>
                    <span className="leading-loose">Email: <span className="font-normal">{location.state.email}</span> </span>
                    <span className="ml-16 leading-loose">{t('telephone')} <span className="font-normal">{location.state.phone}</span> </span>
                    <p className="leading-loose">{t('account type')} <span className="font-normal">{location.state.type}</span> </p>
                    <div className="flex space-x-6 mt-4">
                        <Button nav={false} text={t('add student')} />
                        <Button nav={false} text={t('edit info')} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Infomation;