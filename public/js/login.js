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
    showAlert('error', err.response.data);
  }
};