import axios from "axios";

export function AllRequestsInterceptor() {
    axios.interceptors.request.use(
        (req) => {
            const controller = new AbortController();
            const token = localStorage.getItem('token');

            if (!localStorage.getItem('token') && !req.url.includes('/api/user/login')) {
                return controller.abort();
            } else {
                if (req.url.includes('/api/')) req.url = process.env.REACT_APP_SERVER_URI + req.url;
                req.headers['Authorization'] = `Bearer ${token}`;
                req.headers['Content-Type'] = 'application/json';
                return req;
            }
        },
        (err) => {
            return Promise.reject(err);
        }
    );
}