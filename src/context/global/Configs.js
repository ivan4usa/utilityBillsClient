export const configForAxiosRequests = {
    headers: {
        Authorization: localStorage.getItem('token') ?
            `Bearer ${localStorage.getItem('token')}`: '',
        'Content-Type' : 'application/json'
    }
}

export const configForColoredToast = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
};