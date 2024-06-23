import Home from '../pages/Home';
import Infomation from '../pages/Infomation';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Study from '../pages/Study';
import ExamResult from '../pages/ExamResult';
import TryStudy from '../pages/TryStudy';
import Admin from '../pages/Admin';
import Support from '../pages/Support';
import ExerciseStudy from '../pages/ExerciseStudy';

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
    {path: '/study/:IdLectures/:IdLesson', component: ExerciseStudy},
    {path: '/result', component: ExamResult},
    {path: '/support', component: Support},
]

export { publicRoutes, privateRoutes }