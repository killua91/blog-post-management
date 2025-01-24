import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const createPost = async (post) => {
  const response = await axios.post(API_URL, post);
  return response.data;
};

export const getPosts = async (params) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};