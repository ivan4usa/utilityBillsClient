import React, {useContext, useState} from 'react';
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {Link, Navigate} from "react-router-dom";
import {AuthContext} from "../context/auth/AuthContext";
import {toast, ToastContainer} from "react-toastify";
import {configForColoredToast} from "../context/global/Configs";

const RegisterPage = () => {

    const [inputs, setInputs] = useState({});

    const {register, isAuthenticated, justRegistered} = useContext(AuthContext);

    const onChangeInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({...inputs, [name]: value}));
    }

    const onSubmitRegisterForm = (event) => {
        event.preventDefault();
        if (inputs.email === undefined) {
            toast.error("Email field is required", configForColoredToast);
            return;
        }
        if (inputs.password === undefined) {
            toast.error("Password is required", configForColoredToast);
            return;
        }
        if (inputs.repeat === undefined) {
            toast.error("Password repeat is required", configForColoredToast);
            return;
        }
        if (inputs.repeat && inputs.password && inputs.repeat !== inputs.password) {
            toast.error("Password not match to repeated password", configForColoredToast);
            return;
        }
        register(inputs);
    }

    if (!isAuthenticated && justRegistered) {
        return (
            <Navigate replace to={'/'} />
        )
    }

    return (
        <form className="form" onSubmit={onSubmitRegisterForm}>
            <ToastContainer />
            <div className="card-login  card">
                <div className="card-header">
                    <h3 className="header text-center">Register</h3></div>
                <div className="card-body">
                    <div className="card-body">
                        <div className="form-group">
                            <label>Email address *</label>
                            <input placeholder="Enter email" type="email" className="form-control" name="email"
                            onChange={onChangeInput} />
                        </div>
                        <div className="form-group">
                            <label>Password *</label>
                            <input placeholder="Password" type="password" className="form-control" name="password"
                            onChange={onChangeInput} />
                        </div>
                        <div className="form-group">
                            <label>Repeat Password *</label>
                            <input placeholder="Repeat Password" type="password" className="form-control"
                                   name="repeat" onChange={onChangeInput}/>
                        </div>
                        <div className="form-group">
                            <label>Firstname</label>
                            <input placeholder="Enter firstname" type="text" className="form-control"
                                   name="firstname" onChange={onChangeInput} />
                        </div>
                        <div className="form-group">
                            <label>Lastname</label>
                            <input placeholder="Enter lastname" type="text" className="form-control"
                                   name="lastname" onChange={onChangeInput} />
                        </div>
                    </div>
                </div>
                <div className="ml-auto mr-auto card-footer d-flex flex-column align-items-center">
                    <Button type="submit" variant="default">
                        <FontAwesomeIcon icon={faUserPlus} className="mr-2"/>Register
                    </Button>
                    <span>or</span>
                    <Link to={'/'} className={'btn-link'}>Login</Link>
                </div>
            </div>
        </form>
    );
};

export default RegisterPage;