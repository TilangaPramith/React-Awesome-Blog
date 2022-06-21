import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext'

export default function Navbar() {
  const {theme, toggleTheme, user, backendAPI, toggleBackendAPI} = useContext(ThemeContext);
  const history = useHistory();
  const [query, setQuery] = useState('');
  const handleSubmit = (e) => {
    
    // e.preventDefault();
    console.log('wwwwee ==> ', query)
    history.push(`/search/${query}`);
  }
  return (
    <div className='header'>
      <div className='header-item'>
        <Link to='/'>
          <strong>
            Awesome Blog
          </strong>
        </Link>
      </div>
      <div className='header-item'>
        <form onSubmit={() => handleSubmit()} >
          <input type="text" placeholder='search' name='query'
            onChange={(e) => setQuery(e.target.value)}
          />{' '}
          <button type='submit'>Go</button>
        </form>
      </div>
      <div className='header-item'>
        {user ? (
          <><NavLink to='/profile' activeClassName='active'>
            {user?.name}
          </NavLink><NavLink to='/create' activeClassName='active'>
              Create Post
            </NavLink></>
        ) : (
          <NavLink to='/login'>
            Login
          </NavLink>
        )}{' '}
        <button onClick={() => toggleTheme()}>
          {theme === 'light' ? 'Theme: Light' : 'Theme: Dark'}
        </button>{' '}
        <button onClick={toggleBackendAPI}>
          {backendAPI === '/api' ? 'API: Real' : 'API: Mock'}
        </button>
      </div>
      {/* <div className='header-item'>
        <a href='/login'>Login</a>
      </div> */}
    </div>
  )
}
