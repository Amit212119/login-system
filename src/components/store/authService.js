import axios from 'axios';

const API_URL = 'http://localhost:5000/register';

export const registerUserService = async (userData) => {
  const res = await axios.get(API_URL);
  const existUser = res.data.find((item) => item.email === userData.email);
  if (existUser) {
    throw new Error('Email already Registered !');
  }

  const response = await axios.post(API_URL, userData);
  return { isAuth: true, userData: response.data, msg: 'Registration successful !', isErr: false };
};

export const loginUserService = async (userData) => {
  const res = await axios.get(API_URL);
  const loginCredential = res.data.find((item) => item.email === userData.email);
  if (loginCredential.password === userData.password) {
    localStorage.setItem('user', JSON.stringify(loginCredential));
    return { isAuth: true, userData: loginCredential, msg: 'Login success', isErr: false };
  } else {
    throw new Error('Invalid credentials');
  }
};

export const updateUserService = async (data) => {
  const { id, updateData } = data;
  console.log(id, updateData);
  const response = await axios.put(`${API_URL}/${id}`, updateData);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};
export const logoutUserService = () => {
  localStorage.removeItem('user');
};
