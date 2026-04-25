import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

import { auth, googleProvider } from './firebase-init.js';

const registerUser = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
    }
}

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Залогинен:', userCredential.user.email);
    } catch (error) {
        console.error(error.code);
    }
}

const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error(error.code);
    }
}

const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
}

export { registerUser, loginUser, logoutUser, loginWithGoogle };


const btnGoogle = document.querySelector('#btn-google');

btnGoogle.addEventListener('click', async () => {
    await loginWithGoogle();
});

const loginRegisterForm = document.querySelector('.login-register_group');

loginRegisterForm.addEventListener('change', (e) => {
    if (e.target.value === 'login') {
        document.querySelector('.login-form').classList.remove('hidden');
        document.querySelector('.register-form').classList.add('hidden');
    } else {
        document.querySelector('.login-form').classList.add('hidden');
        document.querySelector('.register-form').classList.remove('hidden');
    }
})

const formLogin = document.querySelector('.login');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { 'email-login': email, 'password-login': password } = e.target.elements;
    await loginUser(email.value, password.value)
});

const formRegister = document.querySelector('.register');

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { 'email-register': email, 'password-register': password, 'password-register-copy': passwordCopy } = e.target.elements;

    if (password.value !== passwordCopy.value) {
        const copyDiv = formRegister.querySelector('.register-password-copy');
        copyDiv.classList.add('is-invalid');
        return;
    }

    await registerUser(email.value, password.value)
});