import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

const reducer = (state, action) => {
  switch(action.type) {
    case 'REGISTRATION_REQUEST':
      return {
        ...state,
        loading: true
      };

      case 'REGISTRATION_SUCCESS':
        return {
          ...state,
          loading: false,
          error: '',
          loggedInUser: action.payload,
        };

      case 'REGISTRATION_FAILED':
          return {
            ...state,
            loading: false,
            error: action.payload,
            loggedInUser: {}
          };

    default: return state;
  }
} 

export default function RegistrationPage() {
  const {user, setUser, backendAPI} = useContext(ThemeContext);
  const [name, setName] = useState('');
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
      type: 'REGISTRATION_REQUEST'
    });
    try {
      console.log('ssss ====> ', email, password);
      const {data} = await axios.post(`
      ${backendAPI}/users
      `, {
        name,
        email,
        password,
        id: Math.floor(Math.random() * 1000000)
      });
      console.log('data ====> ', data);
      dispatch({
        type: 'REGISTRATION_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'REGISTRATION_FAILED',
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
  }, [loggedInUser, backendAPI])

  return (
    <div>
      <h1>Register User</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-item'>
          <label htmlFor='name'>Name</label>
          <input 
            name='name'
            id='name'
            required
            type='text'
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          <button>Register</button>
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
          <span>Already have an account? <Link to='/login'>Login</Link></span>
        </div>
      </form>
    </div>
  )
}
