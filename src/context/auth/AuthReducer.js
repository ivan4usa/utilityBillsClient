import {LOGIN, LOGOUT, REGISTER} from "./AuthConstants";

const handlers = {
    [LOGIN]: (state, {payload}) => ({...state, token: payload.jwt, userId: payload.id, isAuthenticated: true}),
    [LOGOUT]: () => ({token: null, userId: null, isAuthenticated: false}),
    [REGISTER]: (state) => ({...state, justRegistered: true}),
    DEFAULT: state => state
}

export const AuthReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
}