/* eslint-disable default-case */
import axios from 'axios';
import React, { useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'

const reducer = (state, action) => {
  switch (action.type) {
    case 'POST_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'POST_SUCCESS':
      return {
        ...state,
        loading: false,
        post: action?.payload,
        error: '',
      };
    case 'POST_FAILED':
      return {
        ...state,
        loading: false,
        error: action?.payload,
      };
    default: return state;
  }
};

export default function PostPage() {
  const {postId} = useParams();
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    post: {},
  });

  const {loading, error, post} = state;
  
  const fetchPost = async () => {
    dispatch({
      type: 'POST_REQUEST'
    });
    try {
      const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      const { data: userData } = await axios.get(`https://jsonplaceholder.typicode.com/users/${data?.userId}`);
      dispatch({
        type: 'POST_SUCCESS',
        payload: {...data, userData},
      });
    } catch (error) {
      dispatch({
        type: 'POST_FAILED',
        payload: error?.message,
      });
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);
  console.log('post ===> ', post);
  return (
    <div>
      <Link to={'/'}>Back to posts</Link>
      {/* <h1>{postId}</h1> */}
      <div className='blog'>
        <div className='content'>
          {loading ? (
            <div>loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div>
              <h1>{post?.title}</h1>
              <p>{post?.body}</p>
            </div>
          )}
        </div>
        <div className='sidebar'>
          <div>
            <h2>{post?.userData?.name}</h2>
            <ul>
              <li>Email: {post?.userData?.email}</li>
              <li>Phone: {post?.userData?.phone}</li>
              <li>Website: {post?.userData?.website}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
