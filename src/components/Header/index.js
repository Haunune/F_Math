import { NavLink } from 'react-router-dom';
import logo from '../../images/logo.png'
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from "react-icons/md";

function Header({ user, onClick }) {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    return (
        <div class="bg-navbar">
            <div class="flex items-center h-16">
                <NavLink to={"/"}>
                    <div class="pr-4 pl-4">
                        <div class="flex items-center">
                            <img class="h-14 pr-2" src={logo} alt={"Logo"} />
                            <h2 class="m-0 font-serif font-semibold text-4xl">F-Math</h2>
                        </div>
                    </div>
                </NavLink>
                <div class="absolute flex items-center text-xl end-0">
                    {/* lựa chọn ngôn ngữ */}
                    <div class="flex px-4 items-center">
                        <MdLanguage />
                        <select name='language' class="border-0 border-transparent bg-navbar outline-none focus:ring-0 focus:outline-none" onChange={(e) => changeLanguage(e.target.value)}>
                            <option value={"en"}>English</option>
                            <option value={"vi"}>Vietnamese</option>
                        </select>
                        {/* Đăng nhập - đăng ký */}
                    </div>
                    {user ? <div>{`Đăng nhập bởi ${user.email}`}<button onClick={onClick}>Sign Out</button></div>
                        : <div class="pr-4 pl-4 items-stretch">
                            <NavLink to={"/login"}>
                                <Button nav={false} text={t('header.login')} />
                            </NavLink>
                            <NavLink to={"/register"}>
                                <Button nav={false} text={t('header.register')} />
                            </NavLink>
                        </div>}
                </div>
            </div>
        </div>
    );
}

export default Header;