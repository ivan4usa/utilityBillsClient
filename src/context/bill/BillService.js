import axios from "axios";

export const searchBillsByAccount = ([id, searchValue]) => {
    const searchBill = {id, startDate: searchValue[0], endDate: searchValue[1]};
    return axios.post('/api/bill/search-by-account', searchBill);
}

export const searchBillsByHouse = ([id, searchValue]) => {
    const searchBill = {id, startDate: searchValue[0], endDate: searchValue[1]}
    return axios.post('/api/bill/search-by-house', searchBill);
}

export const addBills = (bills) => {
    return axios.post('/api/bill/add-many', bills);
}

export const payBill = (payment, file) => {
    payment.paymentFile = null;
    if (!file) {
        return axios.post('/api/payment/add', payment);
    } else {
        const data = new FormData();
        const blob = new Blob([JSON.stringify(payment)], {type: "application/json"});
        data.append('file', file);
        data.append('payment', blob);
        return axios.post('/api/payment/add-with-file', data);
    }
}

export const deleteBillPayment = (id) => {
    return axios.delete(`/api/payment/delete/${id}`);
}

export const editBillPayment = (payment, file) => {
    if (!file) {
        return axios.put('/api/payment/update', payment);
    } else {
        payment.paymentFile = null;
        const data = new FormData();
        const blob = new Blob([JSON.stringify(payment)], {type: "application/json"});
        data.append('file', file);
        data.append('payment', blob);
        return axios.put('/api/payment/update-with-file', data);
    }
}

export const searchPaymentsByAccount = ([accountId, searchValue]) => {
    const searchPayment = {id: accountId, startDate: searchValue[0], endDate: searchValue[1]};
    return axios.post('/api/payment/search-by-account', searchPayment);
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
    return axios.post('/api/house/search-statistics', {userId, year});
}

export function editBill(bill) {
    return axios.put('/api/bill/update', bill);
}

export function deleteBill(id) {
    return axios.delete(`/api/bill/delete/${id}`);
}
