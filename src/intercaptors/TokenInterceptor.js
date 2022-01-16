import axios from "axios";
import {useContext} from "react";
import {AuthContext} from "../context/auth/AuthContext";

export const TokenInterceptor = () => {
    // const {token} = useContext(AuthContext);
    // const defaultOptions = {
    //     baseURL: process.env.REACT_APP_SERVER_URI,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Access-Control-Allow-Origin': '*'
    //     },
    // };
    // let instance = axios.create(defaultOptions);
    //
    // instance.interceptors.request.use((request) => {
    //     request.headers.Authorization =  token ? `Bearer ${token}` : '';
    //     return request;
    // });

    // const {token} = useContext(AuthContext);

    return axios.interceptors.request.use(
        (req) => {
            // req.headers.Authorization =  token ? `Bearer ${token}` : '';
            req.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
            return req;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
}