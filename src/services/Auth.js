import axios from "axios";

export default {
    /**
     * SendLogin send the user credentials for authentication
     * @param {*} user user object that contains the credentials for backend authentication
     * @returns data of authenticaction
     */
    Sendlogin(user) {
        return axios.post('login', user).then(response => {
            if (response.data.access_token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
    },

    /**
     * delete user credentials in localstorage
     */
    Sendlogout() {
        localStorage.removeItem('user');
        return axios.post('logout').then();
    }
}