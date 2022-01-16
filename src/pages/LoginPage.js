import React, {useContext, useState} from 'react';
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faKey} from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import {AuthContext} from "../context/auth/AuthContext";

const LoginPage = () => {
    const [inputs, setInputs] = useState({});
    const {login} = useContext(AuthContext);

    const changeInputs = (event) => {
        const name = event.target.name;
        let value = event.target.value;
        if (name === 'longExpirationMode') {
            value = event.target.checked;
            }
        setInputs(inputs => ({...inputs, [name]: value}));
    }

    const onSubmitLoginForm = (event) => {
        event.preventDefault();
        login(inputs);
    }

    return (
        <form className="form" onSubmit={onSubmitLoginForm}>
            <div className="card-login  card">
                <div className="card-header">
                    <h3 className="header text-center">Login</h3></div>
                <div className="card-body">
                    <div className="card-body">
                        <div className="form-group">
                            <label>Email address</label>
                            <input placeholder="Enter email" name="email" type="email" className="form-control" onChange={changeInputs} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input placeholder="Password" name="password" type="password" className="form-control" onChange={changeInputs} />
                        </div>

                        <div className="form-check-inline">
                            <input type="checkbox" className="form-check-input" name="longExpirationMode" onChange={changeInputs} />
                            <label className="form-check-label mb-0">Remember me</label>
                        </div>
                    </div>
                </div>
                <div className="ml-auto mr-auto card-footer d-flex flex-column align-items-center">
                    <Button type="submit" variant="success">
                        <FontAwesomeIcon icon={faKey} className="mr-2"/>Login
                    </Button>
                    <span>or</span>
                    <Link to={'/register'} className={'btn-link'}>
                        Register
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default LoginPage;