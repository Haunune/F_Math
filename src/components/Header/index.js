import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png'
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from "react-icons/md";
import { FaUserCircle, FaUserCog } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { useState } from 'react';

function Header({ user, onClick }) {
    const [isClick, setIsClick] = useState(false)
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    return (
        <div className="bg-navbar">
            <div className="flex items-center h-16">
                <NavLink to={"/"}>
                    <div className="pr-4 pl-4">
                        <div className="flex items-center">
                            <img className="h-14 pr-2" src={logo} alt={"Logo"} />
                            <h2 className="m-0 font-serif font-semibold text-4xl">F-Math</h2>
                        </div>
                    </div>
                </NavLink>
                <div className="absolute flex items-center text-xl end-0">
                    {/* lựa chọn ngôn ngữ */}
                    <div className="flex px-4 items-center">
                        <MdLanguage />
                        <select name='language' className="border-0 border-transparent bg-navbar outline-none focus:ring-0 focus:outline-none" onChange={(e) => changeLanguage(e.target.value)}>
                            <option value={"en"}>English</option>
                            <option value={"vi"}>Vietnamese</option>
                        </select>
                        {/* Đăng nhập - đăng ký */}
                    </div>
                    {user
                        ? <div className='flex items-center cursor-pointer' onClick={() => setIsClick(!isClick)}>
                            <span className='text-lime-600 text-xl'><FaUserCircle /></span>
                            <span className='ml-2 mr-6 text-lime-600'>{`${user.name}`}</span>
                            {isClick && (
                                <div className='absolute top-10 right-6 bg-primary w-fit rounded'>
                                    <div className='absolute top-[-15px] right-1 border-x-transparent border-t-transparent border-b-primary border-8 border-solid'></div>
                                    <NavLink className={"flex items-center p-4"} state={user} to={"/info"}><span className='mr-2'><FaUserCog /></span>Account Settings</NavLink>
                                    <button className='flex items-center p-4' onClick={onClick}><span className='mr-2'><IoIosLogOut /></span>Sign Out</button>
                                </div>
                            )}
                        </div>
                        : <div className="pr-4 pl-4 items-stretch">
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