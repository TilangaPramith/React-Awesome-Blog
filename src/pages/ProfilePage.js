import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';
import { useContext } from 'react'
import { ThemeContext } from '../ThemeContext';

const initialState = {
  loading: false,
  updatedUser: null,
  error: '',
  success: false,
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'UPDATE_REQUEST':
      return {
        ...state,
        loading: true,
      };
      case 'UPDATE_SUCCESS':
        return {
          ...state,
          updatedUser: action.payload,
          success: true,
          loading: false,
          error: '',
        };
        case 'UPDATE_FAILED':
          return {
            ...state,
            error: action.payload,
            loading: false,
            success: false,
          };

    default: return state;
  }
}

export default function ProfilePage() {
  const {user, setUser, backendAPI} = useContext(ThemeContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState(user?.password);
  const [phone, setPhone] = useState(user?.phone);
  const [website, setWebsite] = useState(user?.website);
  const {loading, error, updatedUser, success} = state;
  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch({type: 'UPDATE_REQUEST'});
    try {
      const {data} = await axios.put(`${backendAPI}/users/${user?.id}`, {
        id: user?.id,
        name,
        email,
        password,
        website,
        phone,
      });
      dispatch({type: 'UPDATE_SUCCESS', payload: data});
    } catch (error) {
      dispatch({type: 'UPDATE_FAILED', payload: error.message});
    }
  }

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null)
  }

  useEffect(() => {
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      setName(user?.name)
      setEmail(user?.email)
      setPassword(user?.password)
      setPhone(user?.phone)
      setWebsite(user?.website)
    }
  }, [updatedUser]);
  return (
    <div>
      <h1>{user?.name}'s Profile</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-item'>
          <label>Name</label>
          <input
            type='text'
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className='form-item'>
          <label>Email</label>
          <input
            type='email'
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className='form-item'>
          <label>Password</label>
          <input
            type='password'
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className='form-item'>
          <label>Phone</label>
          <input
            type='text'
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></input>
        </div>
        <div className='form-item'>
          <label>Website</label>
          <input
            type='text'
            id="website"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          ></input>
        </div>
        <div className='form-item'>
          <label></label>
          <button>Update</button>
        </div>
        <div className='form-item'>
          <label></label>
          <button onClick={logout}>Logout</button>
        </div>
        {loading && (
          <div className='form-item'>
            <label></label>
            <span>Processing..</span>
          </div>
        )}
        {error && (
          <div className='form-item'>
            <label></label>
            <span className='error'>{error}</span>
          </div>
        )}
        {success && (
          <div className='form-item'>
            <label></label>
            <span className='success'>Profile updated successfully</span>
          </div>
        )}
      </form>
      
    </div>
  )
}
