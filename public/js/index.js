/* eslint-disable */
import { login, logout } from './login'

// DOM elements
const loginForm = document.querySelector('.form--login');

const logoutBtn = document.querySelector('.btn__logout');

// Delegation
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  })
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);