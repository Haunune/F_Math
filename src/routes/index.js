import Home from '../pages/Home';
import Infomation from '../pages/Infomation';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Study from '../pages/Study';
import ExamResult from '../pages/ExamResult';
import TryStudy from '../pages/TryStudy';
import Admin from '../pages/Admin';

const publicRoutes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/try', component: TryStudy},
]

const privateRoutes = [
    {path: '/admin', component: Admin},
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/info', component: Infomation},
    {path: '/study', component: Study},
    {path: '/result', component: ExamResult},
]

export { publicRoutes, privateRoutes }