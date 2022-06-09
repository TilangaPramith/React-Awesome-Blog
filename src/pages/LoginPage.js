import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

const reducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true
      };

      case 'LOGIN_SUCCESS':
        return {
          ...state,
          loading: false,
          error: '',
          loggedInUser: action.payload,
        };

      case 'LOGIN_FAILED':
          return {
            ...state,
            loading: false,
            error: action.payload,
            loggedInUser: {}
          };

    default: return state;
  }
} 

export default function LoginPage() {
  const {user, setUser} = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  if (user) {
    history.push('/profile');
  }

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    loggedInUser: null,
  });

  const { loading, error, loggedInUser } = state;


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({
      type: 'LOGIN_REQUEST'
    });
    try {
      console.log('ssss ====> ', email, password);
      const {data} = await axios.get(`
        https://jsonplaceholder.typicode.com/users?email=${email}&password=${password}
      `);
      if (data.length > 0) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: data[0],
        });
      } else {
        dispatch({
          type: 'LOGIN_FAILED',
          payload: 'Invalid email or password',
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILED',
        payload: error.message,
      });
    }
  }

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      return history.push('/profile');
      // <Redirect to='/profile' />
    }
  }, [loggedInUser])

  return (
    <div>
      <h1>Login User</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-item'>
          <label htmlFor='email'>Email</label>
          <input 
            name='email'
            id='email'
            required
            type='email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-item'>
          <label htmlFor='password'>Password</label>
          <input 
            name='password'
            id='password'
            required
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='form-item'>
          <label></label>
          <button>Login</button>
        </div>
        {loading && (
          <div className='form-item'>
            <label></label>
            <span>Processing...</span>
          </div>
        )}
        {error && (
          <div className='form-item'>
            <label></label>
            <span className='error'>{error}</span>
          </div>
        )}
        <div className='form-item'>
          <label></label>
          <span>New User? <Link to='/register'>Register</Link></span>
        </div>
        <div className='form-item'>
          <label></label>
          <span>Or user email: Sincere@april.biz password: 123</span>
        </div>
      </form>
    </div>
  )
}
