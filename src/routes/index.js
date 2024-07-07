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
import History from '../pages/History';

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
    {path: '/study/semester1', component: Study},
    {path: '/study/semester1/:IdLectures/:IdLesson', component: ExerciseStudy},
    {path: '/study/semester2', component: Study},
    {path: '/study/semester2/:IdLectures/:IdLesson', component: ExerciseStudy},
    {path: '/study/basic-exercise', component: Study},
    {path: '/study/advanced-exercise', component: Study},
    {path: '/result', component: ExamResult},
    {path: '/support', component: Support},
    {path: '/history', component: History},
]

export { publicRoutes, privateRoutes }