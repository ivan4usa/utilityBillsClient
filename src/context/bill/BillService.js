import axios from "axios";
import {configForAxiosRequests} from "../global/Configs";

export const searchBillsByAccount = ([id, searchValue]) => {
    const searchBill = {id, startDate: searchValue[0], endDate: searchValue[1]};
    return axios.post(process.env.REACT_APP_SERVER_URI + '/api/bill/search-by-account', searchBill, configForAxiosRequests);
}

export const searchBillsByHouse = ([id, searchValue]) => {
    const searchBill = {id, startDate: searchValue[0], endDate: searchValue[1]}
    return axios.post(process.env.REACT_APP_SERVER_URI + '/api/bill/search-by-house', searchBill, configForAxiosRequests);
}

export const addBills = (bills) => {
    return axios.post(process.env.REACT_APP_SERVER_URI + '/api/bill/add-many', bills, configForAxiosRequests);
}

export const payBill = (payment, file) => {
    payment.paymentFile = null;
    if (!file) {
        return axios.post(process.env.REACT_APP_SERVER_URI + '/api/payment/add', payment, configForAxiosRequests);
    } else {
        const data = new FormData();
        const blob = new Blob([JSON.stringify(payment)], {type: "application/json"});
        data.append('file', file);
        data.append('payment', blob);
        return axios.post(process.env.REACT_APP_SERVER_URI + '/api/payment/add-with-file', data, configForAxiosRequests);
    }
}

export const deleteBillPayment = (id) => {
    return axios.delete(process.env.REACT_APP_SERVER_URI + `/api/payment/delete/${id}`, configForAxiosRequests);
}

export const editBillPayment = (payment, file) => {
    if (!file) {
        return axios.put(process.env.REACT_APP_SERVER_URI + '/api/payment/update', payment, configForAxiosRequests);
    } else {
        payment.paymentFile = null;
        const data = new FormData();
        const blob = new Blob([JSON.stringify(payment)], {type: "application/json"});
        data.append('file', file);
        data.append('payment', blob);
        return axios.put(process.env.REACT_APP_SERVER_URI + '/api/payment/update-with-file', data, configForAxiosRequests);
    }
}

export const searchPaymentsByAccount = ([accountId, searchValue]) => {
    const searchPayment = {id: accountId, startDate: searchValue[0], endDate: searchValue[1]};
    return axios.post(process.env.REACT_APP_SERVER_URI + '/api/payment/search-by-account', searchPayment, configForAxiosRequests);
}

export function convertDate(date) {
    let [year, month, day] = date;
    if (String(month).length === 1) month = "0" + month;
    if (String(day).length === 1) day = "0" + day;
    return String(year) + "-" + String(month) + "-" + day;
}

export function getValueWithCurrency(value) {
    let currency = localStorage.getItem('currency');
    if (!currency) {
        currency = 'UAH';
    }
    switch (currency) {
        case 'UAH':
            return `${value} грн`;
        case 'USD':
            return `$${value}`;
        case 'EUR':
            return `€${value}`;
        case 'RUB':
            return `${value} руб`;
        default:
            return true;
    }
}

export function fetchStatistics(userId, year) {
    return axios.post(process.env.REACT_APP_SERVER_URI + '/api/house/search-statistics', {userId, year}, configForAxiosRequests);
}

export function editBill(bill) {
    return axios.put(process.env.REACT_APP_SERVER_URI + '/api/bill/update', bill, configForAxiosRequests);
}

export function deleteBill(id) {
    return axios.delete(process.env.REACT_APP_SERVER_URI + `/api/bill/delete/${id}`, configForAxiosRequests);
}
