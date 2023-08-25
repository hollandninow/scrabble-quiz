/* eslint-disable */
import axios from 'axios';
import util from 'util';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/app');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging in! Please try again.');
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.assign('/login');
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error logging out! Please try again.');
  }
}
