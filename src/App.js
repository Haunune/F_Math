import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes/index.js";
import "./i18n/i18n.js";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase.js';
import ProtectRoute from './components/ProtectRoute/index.js';

function App() {
  const [authUser, setAuthUser] = useState(null);

  // tạo hook để kiểm tra có user đang đăng nhập hay không
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        const userData = localStorage.getItem('user');
        if (userData) {
          setAuthUser(JSON.parse(userData));
        } else {
          setAuthUser(null);
        }
      }

    });
    return () => {
      listen();
    }
  }, []);

  return (
    //  basename="/F_Math"
    <Router>
      <div className="App">
        <Routes>
          {
            authUser ? (
              privateRoutes.map((route, index) => {
                const Page = route.component
                return <Route key={index} path={route.path} element={<Page />} />
              })
            ) : (
              publicRoutes.map((route, index) => {
                const Page = route.component
                return <Route key={index} path={route.path} element={<Page />} />
              })
            )
          }
          <Route path="*" element={<ProtectRoute authUser={authUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
