import { getDatabase, ref, child, get, set } from "firebase/database";
import { database } from './firebase/firebase.js';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/index.js";
import "./i18n/i18n.js";

function App() {

  // Gọi kết nối firebase 
  const dbRef = ref(database);
  // đọc giá trị từ db
  // get(child(dbRef, `accounts`)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });

  // ghi giá trị từ db
  // set(child(dbRef, `accounts/2`), {
  //   id: 2,
  //   username: "student1",
  //   password: "123456"
  // });

  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route,index) => {
            const Page = route.component
            return <Route key={index} path={route.path} element={<Page />} />
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
