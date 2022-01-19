import {AuthContext} from "./AuthContext";
import {useReducer} from "react";
import {AuthReducer} from "./AuthReducer";
import axios from "axios";
import {LOGIN, LOGOUT, REGISTER} from "./AuthConstants";
import {toast} from "react-toastify";
import {configForAxiosRequests} from "../global/Configs";

export const AuthState = ({children}) => {
    const initialState = {
        token: null,
        isAuthenticated: false,
        userId: null,
        justRegistered: false
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    const login = async (inputs) => {
        await axios.post(process.env.REACT_APP_SERVER_URI + '/api/user/login', inputs, configForAxiosRequests)
            .then(response => {
                if (typeof response.data === "object") {
                    const expirationDate = response.data.expirationDate;
                    const token = response.data.jwt.split('Bearer ')[1];
                    localStorage.setItem('token', token);
                    localStorage.setItem('userId', response.data.id);
                    localStorage.setItem('expirationDate', expirationDate);

                    dispatch(autoLogout(response.data.expirationDate));
                    authSuccess(response.data);
                } else {
                    toast.error(response.data);
                }
            })
            .catch(error => {
                toast.error(error);
            });
    }

    const authSuccess = (data) => {
        dispatch({
            type: LOGIN,
            payload: data
        });
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expirationDate');
        dispatch({type: LOGOUT});
    }

    const register = async (inputs) => {
        const sendInputs = {...inputs};
        delete sendInputs.repeat;
        await axios.post(process.env.REACT_APP_SERVER_URI + '/api/user/register', sendInputs, configForAxiosRequests)
            .then(response => {
                if (response.data === 'success') {
                    toast.success("User successfully registered");
                    dispatch({
                        type: REGISTER
                    })
                } else {
                    toast.error(response.data);
                }
            })
            .catch(error => {
                toast.error(error ?? 'Something went wrong');
            });
    }

    const deleteUser = () => {

    }

    const autoLogin = () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const expirationDate = localStorage.getItem('expirationDate');

            if (!token || !userId || !expirationDate) {
                logout()
            } else {
                const expirationDate = new Date(+localStorage.getItem('expirationDate'));
                if (expirationDate <= new Date()) {
                    logout();
                } else {
                    authSuccess(token);
                    autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000);
                }
            }
    }

    const autoLogout = (time) => {
        return () => {
            setTimeout(() => {
                logout()
            }, time * 1000)
        }
    }

    const {token, isAuthenticated, userId, justRegistered} = state;

    return (
        <AuthContext.Provider value={{login, autoLogin, logout, register, deleteUser, token, isAuthenticated, userId, justRegistered}}>
            {children}
        </AuthContext.Provider>
    )
}