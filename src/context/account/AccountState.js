import {useReducer} from "react";
import {AccountReducer} from "./AccountReducer";
import axios from "axios";
import {toast} from "react-toastify";
import {AccountContext} from "./AccountContext";
import {ADD_ACCOUNT, DELETE_ACCOUNT, EDIT_ACCOUNT, GET_ACCOUNT_BY_ID, GET_ACCOUNTS} from "./AccountConstants";

export const AccountState = ({children}) => {
    const initialState = {
        accounts: [],
        currentAccount: null,
        bills: [],
        payments: []
    }

    const [state, dispatch] = useReducer(AccountReducer, initialState);

    const getAllAccounts = async () => {
        const userId = localStorage.getItem('userId');

        await axios.post('/api/account/all', userId)
            .then(response => {
                dispatch({
                    type: GET_ACCOUNTS,
                    payload: response.data
                });
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const addAccount = async (account) => {
        await axios.post('/api/account/add', account)
            .then(response => {
                dispatch({
                    type: ADD_ACCOUNT,
                    payload: response.data
                })
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const editAccount = async (account) => {
        await axios.put('/api/account/update', account)
            .then(response => {
                dispatch({
                    type: EDIT_ACCOUNT,
                    payload: response.data
                })
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const deleteAccount = async (id) => {
        await axios.delete(`/api/account/delete/${id}`)
            .then(() => {
                dispatch({
                    type: DELETE_ACCOUNT,
                    payload: id
                })
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const findAccountById = async (id) => {
        await axios.get(`/api/account/${id}`)
            .then((response) => {
                dispatch({
                    type: GET_ACCOUNT_BY_ID,
                    payload: response.data
                })
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const fetchAccountById = (id) => {
        return  axios.get(`/api/account/${id}`);
    }

    const {accounts, currentAccount} = state;

    return (
        <AccountContext.Provider
            value={{getAllAccounts, addAccount, editAccount, deleteAccount, findAccountById, fetchAccountById, accounts, currentAccount}}>
            {children}
        </AccountContext.Provider>
    )
}