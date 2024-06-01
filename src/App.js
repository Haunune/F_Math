import './App.css';
import Home from './pages/Home';
import Infomation from './pages/Infomation';
import Study from './pages/Study';

function App() {
  return (
    <div className="App">
      {/* Muốn hiển thị trang cần thiết kế thì thay đổi ở đây */}
      <Infomation />
    </div>
  );
}

export default App;
