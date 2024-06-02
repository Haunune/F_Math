import { NavLink } from 'react-router-dom';
import logo from '../../images/logo.png'
import Button from '../Button';

function Header({ text }) {
    return (
        <div class="bg-navbar">
            <div class="flex flex-wrap justify-between items-center h-16">
                <div class="pr-4 pl-4">
                    <div class="flex items-center">
                        <img class="h-14 pr-2" src={logo} alt={"Logo"} />
                        <h2 class="m-0 font-serif font-semibold text-4xl">F-Math</h2>
                    </div>
                </div>
                <div class="pr-4 pl-4 items-stretch">
                    <NavLink to={"/login"}>
                        <Button nav={false} text="Đăng nhập" />
                    </NavLink>
                    <NavLink to={"/register"}>
                        <Button nav={false} text="Đăng ký" />
                    </NavLink>
                </div>
            </div>
            {/* <nav class="navbar navbar-expand-sm navbar-dark">
                <div class="container-fluid">
                    <ul class="navbar-nav w-100">
                        <li class="nav-item flex-fill text-center">
                            <a class="nav-link active">Trang chủ</a>
                        </li>
                        <li class="nav-item flex-fill text-center">
                            <a class="nav-link" href="TrangHocTap.html"
                            >Học tập cùng F-Math</a
                            >
                        </li>
                        <li class="nav-item flex-fill text-center">
                            <a class="nav-link" href="TrangKetQua.html">Kết quả thi</a>
                        </li>
                        <li class="nav-item flex-fill text-center">
                            <a class="nav-link" href="TrangHoTro.html">Hỗ trợ</a>
                        </li>
                    </ul>
                </div>
            </nav> */}
        </div>
    );
}

export default Header;