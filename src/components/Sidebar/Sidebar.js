import React, {useContext, useState} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import {Collapse, Nav,} from "react-bootstrap";
import logo from '../../assets/img/logo.png';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {HouseContext} from "../../context/house/HouseContext";
import AccountIcons from "../../assets/icons/AccountIcons";

function Sidebar({image, background}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuCollapseState, setMenuCollapseState] = useState({});
    const {getAllHouses, houses} = useContext(HouseContext);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {

            // console.log('ggg')
            getAllHouses();
        }
    }, []);

    const activeRoute = (routeName) => location.pathname === routeName ? "active" : "";

    const toggleMenuCollapse = (index) => {
        setMenuCollapseState(menuCollapseState => ({...menuCollapseState, [index]: !menuCollapseState[index]}));
    }

    const showHousePage = (house) => {
        let path = `/house/${house.id}`;
        navigate(path);
    }

    const createHouseLinks = (houses) => {
        return houses.map((house, index) => {
            return (
                <Nav.Item className={menuCollapseState[index] ? "active" : "info"} as="li" key={index}>
                    <Nav.Link
                        className={menuCollapseState[index] ? "collapsed" : null}
                        data-toggle="collapse"
                        aria-expanded={menuCollapseState[index]}
                    >
                        <i onClick={() => showHousePage(house)} className={'nc-icon nc-layers-3'}/>
                        <p onClick={() => toggleMenuCollapse(index)}
                           style={{marginLeft: '50px'}}>
                            {house.name}
                            {
                                house.accounts?.length > 0
                                    ? <b className="caret"/>
                                    : null
                            }
                        </p>
                    </Nav.Link>

                    <Collapse id="collapseExample" in={menuCollapseState[index]}>
                        <div>
                            <Nav as="ul">
                                {createAccountLinks(house)}
                            </Nav>
                        </div>
                    </Collapse>
                </Nav.Item>
            );
        });
    }

    const createAccountLinks = (house) => {
        if (!house.accounts || house.accounts.length === 0) {
            return null
        }

        return house.accounts.map((account, index) => {
            return (
                <Nav.Item as="li" key={index} className={activeRoute('/account/' + account.id) ? 'active' : null}>
                    <Nav.Link className={'nav-link'} to={'/account/' + account.id} as={Link}>
                        <div className={'d-flex align-items-center'}>
                            <FontAwesomeIcon icon={AccountIcons[account.icon]} size={'lg'} fixedWidth pull="left"/>
                            <p>{account.name}</p>
                        </div>
                    </Nav.Link>
                </Nav.Item>
            );
        });
    }

    return (
        <>
            <div className="sidebar" data-color={background} data-image={image}>
                <div className="sidebar-wrapper">
                    <div className="logo">
                        <NavLink to={'/'} className="simple-text logo-mini">
                            <div className="logo-img">
                                <img src={logo} alt="UB" style={{top: "0"}}/>
                            </div>
                        </NavLink>
                        <NavLink to="/" className="simple-text logo-normal">
                            UTILITY BILLS
                        </NavLink>
                    </div>
                    <Nav as="ul">
                        {createHouseLinks(houses)}

                        <Nav.Item className={location.pathname === '/statistics' ? "active" : "info"} as="li">
                            <Nav.Link onClick={() => {navigate('/statistics')}}>
                                <i className={'nc-icon nc-chart-bar-32'}/>
                                <p style={{marginLeft: '50px'}}>
                                    Statistics
                                </p>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="sidebar-background"
                     style={{
                         backgroundImage: "url('" + image + "')",
                     }}
                />
            </div>
        </>
    );
}

export default Sidebar;
