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
        throw error;
    }
}

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Залогинен:', userCredential.user.email);
    } catch (error) {
        throw error;
    }
}

const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        throw error;
    }
}

const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
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
const formRegister = document.querySelector('.register');

const showError = (form, selector, message = null) => {
    const div = form.querySelector(selector);
    if (message) div.querySelector('.error-message').textContent = message;
    div.classList.add('is-invalid');
};

const addClearListeners = (form, fields) => {
    fields.forEach(({ name, selector }) => {
        const input = form.querySelector(`[name="${name}"]`);
        input?.addEventListener('input', () => {
            input.closest(selector)?.classList.remove('is-invalid');
        });
    });
};

addClearListeners(formLogin, [
    { name: 'email-login', selector: '.login-email' },
    { name: 'password-login', selector: '.login-password' },
]);

addClearListeners(formRegister, [
    { name: 'email-register', selector: '.register-email' },
    { name: 'password-register', selector: '.register-password' },
    { name: 'password-register-copy', selector: '.register-password-copy' },
]);


formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.elements['email-login'];
    const password = e.target.elements['password-login']

    if (!email.value.includes('@')) {
        showError(formLogin, '.login-email', 'Введите валидный email');
        return;
    }

    try {
        await loginUser(email.value, password.value);
    } catch (error) {
        if (error.code === 'auth/invalid-credential') {
            showError(formLogin, '.login-password');
        }
    }
});

document.querySelectorAll('.eye-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.closest('.js-password');
        const input = parent.querySelector('input');

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        const openIcon = btn.querySelector('.bi-eye');
        const closedIcon = btn.querySelector('.bi-eye-slash');

        openIcon.classList.toggle('hidden');
        closedIcon.classList.toggle('hidden');
    });
});

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.elements['email-register'];
    const password = e.target.elements['password-register'];
    const passwordCopy = e.target.elements['password-register-copy'];

    if (password.value !== passwordCopy.value) {
        showError(formRegister, '.register-password-copy', 'Пароли не совпадают');
        return;
    }

    if (!email.value.includes('@')) {
        showError(formRegister, '.register-email', 'Введите валидный Email');
        return;
    }

    try {
        await registerUser(email.value, password.value)
    } catch (error) {

        if (error.code === 'auth/email-already-in-use') {
            showError(formRegister, '.register-email', 'Email уже зарегистрирован');
        }

        if (error.code === 'auth/weak-password') {
            showError(formRegister, '.register-password', 'Пароль слишком короткий');
        }
    }
});

const confirmInput = formRegister.querySelector('.register-password-copy');
['paste', 'drop'].forEach(eventType => {
    confirmInput.addEventListener(eventType, (e) => {
        e.preventDefault();
        showError(formRegister, '.register-password-copy', 'Введите пароль вручную');
    });
});