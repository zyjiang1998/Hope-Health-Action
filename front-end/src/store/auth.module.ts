// export interface User {
//     username: string
//     department: string
// }
// export interface RegisterUserInfo {
//     username: string
//     password: string
//     department: string
// }

// ref: https://www.bezkoder.com/vue-3-authentication-jwt/
import AuthService from "@/services/auth.service";

const user = JSON.parse(localStorage.getItem('user')!);
const initialState = user  
    ? { status: { loggedIn: true }, user}
    : { status: { loggedIn: false }, user: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, user) {
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            )
        },
        logout({ commit }) {
            AuthService.logout();
            commit('logout');
        },
        register(user) {
            return AuthService.register(user).then(
                response => {
                    return Promise.resolve(response.data);
                },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        isTokenValid({ commit }){
            return AuthService.isTokenValid().then(
                response => {
                    if(response.status == 202){
                        commit('loginSuccess', user);
                    } else {
                        commit('loginFailure');
                    }
                    return Promise.resolve(response);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        }
    }
};