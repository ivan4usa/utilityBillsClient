import {ADD_HOUSE, DELETE_HOUSE, EDIT_HOUSE, GET_HOUSE_BY_ID, GET_HOUSES, GET_STATISTICS} from "./HouseConstants";

const handlers = {
    [ADD_HOUSE]: (state, {payload}) => ({...state, houses: [...state.houses, payload] }),
    [EDIT_HOUSE]: (state, {payload}) => ({...state, houses: [...state.houses.filter(house => house.id !== payload.id), payload]}),
    [GET_HOUSES]: (state, {payload}) => ({...state, houses: payload}),
    [GET_HOUSE_BY_ID]: (state, {payload}) => ({...state, currentHouse: payload}),
    [DELETE_HOUSE]: (state, {payload}) => ({...state, houses: state.houses.filter(house => house.id !== payload)}),
    [GET_STATISTICS]: (state, {payload}) => ({...state, statistics: payload}),
    DEFAULT: state => state
}

export const HouseReducer = (state, action) => {
    const handler = handlers[action.type ||handlers.DEFAULT]
    return handler(state, action);
}