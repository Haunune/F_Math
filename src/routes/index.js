import Home from '../pages/Home';
import Infomation from '../pages/Infomation';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Study from '../pages/Study';

const publicRoutes = [
    {path: '/', component: Home},
    {path: '/info', component: Infomation},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/study', component: Study},
]

const privateRoutes = [

]

export { publicRoutes, privateRoutes }