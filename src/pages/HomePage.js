/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'POSTS_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'POSTS_SUCCESS':
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: ''
      };
    case 'POSTS_FAILED':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'USERS_REQUEST':
        return {
          ...state,
          loadingUsers: true,
        };
    case 'USERS_SUCCESS':
        return {
          ...state,
          users: action.payload,
          loadingUsers: false,
          errorUsers: ''
        };
    case 'USER_SUCCESS':
          return {
            ...state,
            user: action.payload,
            loadingUsers: false,
            errorUsers: ''
          };
    case 'USERS_FAILED':
        return {
          ...state,
          loadingUsers: false,
          errorUsers: action.payload,
        };
  

    default: return state;
  }
}

export default function HomePage() {

  const {query, userId, ...rest} = useParams();

  const {backendAPI} = useContext(ThemeContext);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    posts: [],
    loadingUsers: false,
    users: [],
    errorUsers: '',
    user: {},
  });

  const { loading, error, posts, loadingUsers, users, errorUsers, user } = state;

  const loadPosts = async () => {
    dispatch({
      type: 'POSTS_REQUEST'
    });
    try {
      const { data } = await axios.get(
        userId 
          ? `${backendAPI}/posts?userId=${userId}` 
          : `${backendAPI}/posts`
      );
      const filteredPosts = query ? data.filter((item) => 
        (item.title.indexOf(query) >= 0)
        || (item.body.indexOf(query) >= 0))
        : data;
      dispatch({
        type: 'POSTS_SUCCESS',
        payload: filteredPosts,
      });
    } catch (error) {
      dispatch({
        type: 'POSTS_FAILED',
        payload: error?.message,
      });
    }
  }

  const loadUsers = async () => {
    dispatch({
      type: 'USERS_REQUEST'
    });
    try {
      const { data } = await axios.get(
        userId 
        ? `${backendAPI}/users/${userId}`
        : `${backendAPI}/users`
      );
      dispatch({
        type: userId ? 'USER_SUCCESS' : 'USERS_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'USERS_FAILED',
        payload: error?.message,
      });
    }
  }

  useEffect(() => {
    loadPosts();
    loadUsers();
  }, [query, userId, backendAPI]);
  return (
    <div className='blog'>
      <div className='content'>
        <h1>{query 
          ? `Results for "${query}"`
          : userId
          ? `${user?.name}'s Posts`
          : 'Posts'}
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : posts?.length === 0 ? (
          <div>No post found</div>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post?.id}>
                <Link to={`/post/${post?.id}`}>
                  <h2>{post?.title}</h2>
                  <h2>{post?.id}</h2>
                </Link>
                <p>{post?.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='sidebar'>
        <h2>Authors</h2>
        {loadingUsers ? (
          <div>Loading...</div>
        ) : errorUsers ? (
          <div>Error: {errorUsers}</div>
        ) : users?.length === 0 ? (
          <div>No users found</div>
        ) : (
          userId ? (
            <div>
              <h2>{user?.name}</h2>
              <ul>
                <li>Email: {user?.email}</li>
                <li>Phone: {user?.phone}</li>
                <li>Website: {user?.website}</li>
              </ul>
            </div>
          ) : (
            <div>
              {/* <h2>Authors</h2> */}
              <ul>
                {users.map((user) => (
                  <li key={user?.id}>
                    <Link to={`/user/${user.id}`}>{user?.name}</Link>
                    
                  </li>
                ))}
              </ul>
            </div>
          )
          
        )}
      </div>
    </div>
  )
}
