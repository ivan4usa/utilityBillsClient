import {useReducer} from "react";
import {HouseReducer} from "./HouseReducer";
import {toast} from "react-toastify";
import axios from "axios";
import {ADD_HOUSE, DELETE_HOUSE, EDIT_HOUSE, GET_HOUSE_BY_ID, GET_HOUSES, GET_STATISTICS} from "./HouseConstants";
import {HouseContext} from "./HouseContext";
import {configForAxiosRequests} from "../global/Configs";

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

        await axios.post(process.env.REACT_APP_SERVER_URI + '/api/house/all', userId, configForAxiosRequests)
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
       await axios.get(process.env.REACT_APP_SERVER_URI + `/api/house/${id}`, configForAxiosRequests)
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
        await axios.post(process.env.REACT_APP_SERVER_URI + `/api/house/add`, house, configForAxiosRequests)
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
        await axios.put(process.env.REACT_APP_SERVER_URI + `/api/house/update`, house, configForAxiosRequests)
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
        await axios.delete(process.env.REACT_APP_SERVER_URI + `/api/house/${id}`, configForAxiosRequests)
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
        await axios.post(process.env.REACT_APP_SERVER_URI + '/api/house/search-statistics', {userId, year}, configForAxiosRequests)
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