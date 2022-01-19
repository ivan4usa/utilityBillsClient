import {useReducer} from "react";
import {HouseReducer} from "./HouseReducer";
import {toast} from "react-toastify";
import axios from "axios";
import {ADD_HOUSE, DELETE_HOUSE, EDIT_HOUSE, GET_HOUSE_BY_ID, GET_HOUSES, GET_STATISTICS} from "./HouseConstants";
import {HouseContext} from "./HouseContext";

export const HouseState = ({children}) => {
    const initialState = {
        houses: [],
        currentHouse: null,
        accounts: [],
        statistics: []
    }

    const [state, dispatch] = useReducer(HouseReducer, initialState);

    const getAllHouses = async () => {
        const userId = +localStorage.getItem('userId');
        await axios.post('/api/house/all', userId)
            .then(response => {
                dispatch({
                    type: GET_HOUSES,
                    payload: response.data
                });
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const getHouseById = async (id) => {
       await axios.get(`/api/house/${id}`)
            .then(response => {
                dispatch({
                    type: GET_HOUSE_BY_ID,
                    payload: response.data
                });
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const addHouse = async (house) => {
        await axios.post(`/api/house/add`, house)
            .then(response => {
                dispatch({
                    type: ADD_HOUSE,
                    payload: response.data
                })
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const editHouse = async (house) => {
        await axios.put(`/api/house/update`, house)
            .then(response => {
                dispatch({
                    type: EDIT_HOUSE,
                    payload: response.data
                })
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const deleteHouse = async (id) => {
        await axios.delete(`/api/house/${id}`)
            .then(() => {
                dispatch({
                    type: DELETE_HOUSE,
                    payload: id
                })
            })
            .catch(error => {
                toast.error(error);
            })
    }

    const getStatisticsData = async (userId, year) => {
        await axios.post('/api/house/search-statistics', {userId, year})
            .then(response => {
                dispatch({
                    type: GET_STATISTICS,
                    payload: response.data
                })
                return response.data;
            })
            .catch(error => {
                return toast.error(error);
            });
    }

    const {houses, currentHouse, statistics} = state;

    return (
        <HouseContext.Provider
        value={{getAllHouses, getHouseById, addHouse, editHouse, deleteHouse, getStatisticsData, houses, currentHouse, statistics}}>
            {children}
        </HouseContext.Provider>
    )
}