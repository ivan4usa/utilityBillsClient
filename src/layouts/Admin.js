import React, {useState} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.js";
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import AdminFooter from "../components/Footers/AdminFooter.js";

import image1 from "../assets/img/full-screen-image-1.jpg";
import image2 from "../assets/img/full-screen-image-2.jpg";
import image3 from "../assets/img/full-screen-image-3.jpg";
import image4 from "../assets/img/full-screen-image-4.jpg";
import DashboardPage from "../pages/DashboardPage";
import HousePage from "../pages/HousePage";
import AccountPage from "../pages/AccountPage";
import {HouseState} from "../context/house/HouseState";
import {AccountState} from "../context/account/AccountState";
import {AddBillsPage} from "../pages/AddBillsPage";
import {StatisticsPage} from "../pages/StatisticsPage";


const Admin = () => {
    const [sidebarImage, setSidebarImage] = React.useState(localStorage.getItem('theme-image') ?? image3);
    const [sidebarBackground, setSidebarBackground] = React.useState(localStorage.getItem('theme-color') ?? "black");
    const [currency, setCurrency] = useState(localStorage.getItem('currency') ?? 'UAH');
    const changeBackground = (color) => {
        localStorage.setItem('theme-color', color);
        setSidebarBackground(color)
    }
    const changeImage = (image) => {
        localStorage.setItem('theme-image', image);
        setSidebarImage(image)
    }
    const changeCurrency = (currency) => {
        localStorage.setItem('currency', currency);
        setCurrency(currency);
    }

    return (
        <HouseState>
            <AccountState>
                <div className="wrapper">
                    <Sidebar
                        image={sidebarImage}
                        background={sidebarBackground}
                    />
                    <div className="main-panel">
                        <AdminNavbar
                            sidebarBackground={sidebarBackground}
                            sidebarImages={[image1, image2, image3, image4]}
                            sidebarBackgrounds={[
                                "black",
                                "azure",
                                "green",
                                "orange",
                                "red",
                                "purple",
                            ]}
                            currencies={[
                                "USD",
                                "EUR",
                                "RUB",
                                "UAH"
                            ]}
                            sidebarImage={sidebarImage}
                            changeBackground={changeBackground}
                            changeImage={changeImage}
                            changeCurrency={changeCurrency}
                            currentCurrency={currency}
                            currentBackgroundColor={sidebarBackground}
                        />

                        <div className="content p-2">
                            <Routes>
                                <Route path={'/'} element={<DashboardPage/>}/>
                                <Route path={'/house/:id'} element={<HousePage/>}/>
                                <Route path={'/account/:id'} element={<AccountPage/>}/>
                                <Route path={'/add-bills'} element={<AddBillsPage/>}/>
                                <Route path={'/statistics'} element={<StatisticsPage/>}/>
                                <Route path={'*'} element={<Navigate replace to={'/'}/>}/>
                            </Routes>
                        </div>

                        <AdminFooter/>
                        <div
                            className="close-layer"
                            onClick={() =>
                                document.documentElement.classList.toggle("nav-open")
                            }
                        />
                    </div>
                </div>
            </AccountState>
        </HouseState>
    );
}

export default Admin;
