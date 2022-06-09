import { BrowserRouter, Route, Link, Switch, Router } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const {theme} = useContext(ThemeContext);

  return (
    <BrowserRouter>
      <div className={`container ${theme}`}>
        <Navbar />
        <div className='main'>
          <Switch>
            <PrivateRoute 
              path='/profile' 
              component={ProfilePage}
            ></PrivateRoute>
            <Route path='/login'>
              <LoginPage />
            </Route>
            <Route path='/post/:postId'>
              <PostPage />
            </Route>
            <Route path='/search/:query?'>
              <HomePage />
            </Route>
            <Route path='/user/:userId?'>
              <HomePage />
            </Route>
            <Route path='/'>
              <HomePage />
            </Route>
          </Switch>
        </div>
        <div className='footer'>
          Awesome blog. All rigth reserved.
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
