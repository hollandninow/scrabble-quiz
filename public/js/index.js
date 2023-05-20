/* eslint-disable */
import { login } from './login'

// DOM elements
const loginForm = document.querySelector('.form--login');

// Delegation
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  })
}