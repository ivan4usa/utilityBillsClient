
const {ADD_ACCOUNT, EDIT_ACCOUNT, GET_ACCOUNTS, GET_ACCOUNT_BY_ID, DELETE_ACCOUNT} = require("./AccountConstants");
const handlers = {
    [ADD_ACCOUNT]: (state, {payload}) => ({...state, accounts: [...state.accounts, payload]}),
    [EDIT_ACCOUNT]: (state, {payload}) => ({...state, accounts: [...state.accounts.filter(account => account.id !== payload.id), payload]}),
    [GET_ACCOUNTS]: (state, {payload}) => ({...state, accounts: payload}),
    [GET_ACCOUNT_BY_ID]: (state) => ({...state}),
    [DELETE_ACCOUNT]: (state, {payload}) => ({...state, accounts: state.accounts.filter(account => account.id !== payload)}),
    DEFAULT: state => state
}

export const AccountReducer = (state, action) => {
    const handler = handlers[action.type ||handlers.DEFAULT]
    return handler(state, action);
}