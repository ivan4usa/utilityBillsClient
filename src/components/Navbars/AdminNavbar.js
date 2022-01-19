import React, {useContext} from "react";
import {Button, Container, Dropdown, Nav, Navbar,} from "react-bootstrap";
import {AuthContext} from "../../context/auth/AuthContext";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars, faEllipsisV} from "@fortawesome/free-solid-svg-icons";


const AdminNavbar = (props) => {
    const {logout} = useContext(AuthContext);
    const [collapseOpen, setCollapseOpen] = React.useState(false);

    return (
        <>
            <Navbar expand="lg">
                <Container fluid>
                    <div className="navbar-wrapper">
                        <div className="navbar-minimize">
                            <Button
                                data-color={props.currentBackgroundColor}
                                variant="outline-light"
                                className="btn-round btn-icon d-none d-lg-block toggle-menu-btn"
                                onClick={() => document.body.classList.toggle("sidebar-mini")}
                            >
                                <FontAwesomeIcon icon={faEllipsisV} className="visible-on-sidebar-regular" fixedWidth/>
                                <FontAwesomeIcon icon={faBars} className="visible-on-sidebar-mini" fixedWidth/>
                            </Button>

                            <Button
                                data-color={props.currentBackgroundColor}
                                className="btn-round btn-icon d-block d-lg-none toggle-menu-btn"
                                variant="outline-light"
                                onClick={() =>
                                    document.documentElement.classList.toggle("nav-open")
                                }
                            >
                                <FontAwesomeIcon icon={faEllipsisV} className="visible-on-sidebar-regular" fixedWidth/>
                                <FontAwesomeIcon icon={faBars} className="visible-on-sidebar-mini" fixedWidth/>
                            </Button>
                        </div>
                    </div>
                    <button
                        className="navbar-toggler navbar-toggler-right border-0"
                        type="button"
                        onClick={() => setCollapseOpen(!collapseOpen)}
                    >
                        <span className="navbar-toggler-bar burger-lines"/>
                        <span className="navbar-toggler-bar burger-lines"/>
                        <span className="navbar-toggler-bar burger-lines"/>
                    </button>
                    <Navbar.Collapse className="justify-content-end" in={collapseOpen}>
                        <Nav className="nav mr-auto" navbar>
                        </Nav>
                        <Nav navbar>
                            <Dropdown as={Nav.Item}>
                                <Dropdown.Toggle
                                    as={Nav.Link}
                                    variant="default"
                                >
                                    <i className="nc-icon nc-palette mr-2"/>
                                    Themes
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {props.sidebarBackgrounds.map((color, index) => {

                                        return (
                                            <Dropdown.Item className={'d-flex align-items-center'}
                                                           onClick={(e) => props.changeBackground(color)} key={index}
                                            >
                                                <div style={{
                                                    backgroundColor: color,
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    border: '1px solid #c7b3ff',
                                                    marginRight: '.5em'
                                                }}/>
                                                {color}
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown as={Nav.Item}>
                                <Dropdown.Toggle
                                    as={Nav.Link}
                                    variant="default"
                                >
                                    <i className="nc-icon nc-album-2 mr-2"/>
                                    Image
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {props.sidebarImages.map((image, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            className={image === props.sidebarImage ? "active" : ""}
                                            onClick={() => props.changeImage(props.sidebarImages[index])}
                                        >
                                            <img alt={`sidebar background ${index}`} src={props.sidebarImages[index]}
                                                 style={{width: '50px', height: '50px'}}/> Image {index + 1}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown as={Nav.Item}>
                                <Dropdown.Toggle
                                    as={Nav.Link}
                                    variant="default"
                                >
                                    <i className="nc-icon nc-globe-2 mr-2"/>
                                    {props.currentCurrency || "Currencies"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {props.currencies.map((currency, index) => {

                                        return (
                                            <Dropdown.Item className={'d-flex align-items-center'}
                                                           onClick={(e) => props.changeCurrency(currency)} key={index}
                                            >
                                                {currency}
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Nav.Item>
                                <Nav.Link
                                    onClick={logout}
                                    variant="default"
                                >
                                    <i className={'nc-icon nc-button-power mr-2'}/>
                                    Logout
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default AdminNavbar;
