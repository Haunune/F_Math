import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes/index.js";
import "./i18n/i18n.js";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase.js';

function App() {
  const [authUser, setAuthUser] = useState(null);

  // tạo hook để kiểm tra có user đang đăng nhập hay không
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    }
  }, []);

  return (
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
