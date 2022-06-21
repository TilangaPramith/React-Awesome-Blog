/* eslint-disable default-case */
import axios from 'axios';
import React, { useReducer, useState } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const initialState = {
  loading: false,
  createdPost: null,
  error: '',
  success: false,
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'CREATE_RESET':
      return initialState;
    
    case 'CREATE_REQUEST':
      return {
        ...state,
        loading: true,
      };
    
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loading: false,
        createdPost: action.payload,
        success: true,
        error: '',
      };

    case 'CREATE_FAILED':
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default: return state;
  }
}

export default function CreatePostPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {backendAPI, user} = useContext(ThemeContext);
  const {loading, error, createdPost, success} = state;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  console.log('user =======================+> ', user);

  const reset = () => {
    dispatch({type: 'CREATE_RESET'});
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch({type: 'CREATE_REQUEST'});
    try {
      const {data} = await axios.post(`${backendAPI}/posts`, {
        title,
        body,
        userId: user.id,
        id: Math.floor(Math.random() * 1000000)
      });
      dispatch({type: 'CREATE_SUCCESS', payload: data});
    } catch (error) {
      dispatch({type: 'CREATE_FAILED', payload: error.message});
    }
  };
  return (
    <div>
      <h1>Create Post</h1>
      {success ? (
        <div>
          <p>
            Post titled{' '}
            <strong>{createdPost.title}</strong> {' '}
            has been created.
          </p>
          <button onClick={reset}>Create another post</button>
        </div>
      ) : (
        <form className='form' onSubmit={handleSubmit}>
          <div className='form-item'>
            <label htmlFor='title'>Title: </label>
            <input
              name='title'
              id='title'
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='form-item'>
            <label htmlFor='body'>Body: </label>
            <textarea
              name='body'
              id='body'
              type="text"
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className='form-item'>
            <label></label>
            <button>Create</button>
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
        </form>
      )}
      
    </div>
  )
}
