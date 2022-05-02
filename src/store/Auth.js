import AuthService from '../services/Auth';

const user = JSON.parse(localStorage.getItem('user'));


/**
 * login status control
 */

const initialState = user ? {
    status: {
        loggedIn: true
    },
    user
} : {
    status: {
        loggedIn: false
    },
    user: null
};

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        /**
         * 
         * @param {*} user user object that contains the credentials for backend authentication
         * @returns user credentials (access token) or failed login
         */
        login({
            commit
        }, user) {
            return AuthService.Sendlogin(user).then(
                user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        /**
         * validate logout of appliacation
         */
        logout({
            commit
        }) {
            AuthService.Sendlogout();
            commit('logout');
        },
    },
    mutations: {
        /**
         * validate the login status
         * @param {*} state estate login
         * @param {*} user credentials user
         */
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        /**
         * validate the login status
         * @param {*} state estate login
         * @param {*} user credentials user
         */
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },

        /**
         * validate the logout status
         * @param {*} state estate login
         * @param {*} user credentials user
         */
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
    }
};