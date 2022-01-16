import React, {useContext, useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import Auth from "./layouts/Auth";
import Admin from "./layouts/Admin";
import {AuthContext} from "./context/auth/AuthContext";

function App() {
    const {isAuthenticated, autoLogin} = useContext(AuthContext);
    useEffect(() => {
        autoLogin();
    }, []);
    return (
        <Routes>
            {isAuthenticated ? <Route path={'/*'} element={<Admin/>}/> : <Route path={'/*'} element={<Auth/>}/>}
        </Routes>
    );
}
export default App;
