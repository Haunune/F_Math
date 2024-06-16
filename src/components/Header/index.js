import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png'
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from "react-icons/md";
import { FaUserCircle, FaUserCog } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { useState } from 'react';

function Header({ user, onClick }) {
    const [isHover, setIsHover] = useState(false)
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();

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
                    {user
                        ? <div className='flex items-center cursor-pointer' onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                            <span className='text-lime-600 text-xl'><FaUserCircle /></span>
                            <span className='ml-2 mr-6 text-lime-600'>{`${user.name}`}</span>
                            {isHover && (
                                <div className='absolute top-10 right-6 bg-primary w-fit rounded'>
                                    <div className='absolute top-[-15px] right-1 border-x-transparent border-t-transparent border-b-primary border-8 border-solid'></div>
                                    <NavLink className={"flex items-center p-4"} to={"info"}><span className='mr-2'><FaUserCog /></span>Account Settings</NavLink>
                                    <button className='flex items-center p-4' onClick={onClick}><span className='mr-2'><IoIosLogOut /></span>Sign Out</button>
                                </div>
                            )}
                        </div>
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