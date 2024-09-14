import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import MainContainer from './components/MainContainer';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<MainContainer/>}>
          <Route path='' element={<Home/>}/>
          <Route path='signup' element={<Signup/>}/>
          <Route path='login' element={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
