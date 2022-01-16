import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import '@fortawesome/fontawesome-svg-core/styles.css';
import {AuthState} from "./context/auth/AuthState";

ReactDOM.render(
    <AuthState>
        <BrowserRouter>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </BrowserRouter>
    </AuthState>,
    document.getElementById('root')
);
reportWebVitals();
