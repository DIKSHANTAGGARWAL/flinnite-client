import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import MainContainer from './components/MainContainer';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Group from './components/Group';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<MainContainer/>}>
          <Route path='' element={<Home/>}/>
          <Route path='signup' element={<Signup/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='group/:id' element={<Group/>}/>
          <Route path='group/chat/:id/' element={<ChatRoom/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
