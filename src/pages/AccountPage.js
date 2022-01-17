import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Row, Nav, TabContent, Tab, TabPane} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleLeft} from "@fortawesome/free-regular-svg-icons";
import AccountIcons from "../assets/icons/AccountIcons";
import {useLocation, useNavigate} from "react-router-dom";
import BillTable from "../components/tables/BillTable";
import {PaymentTable} from "../components/tables/PaymentTable";
import {AccountContext} from "../context/account/AccountContext";
import {toast} from "react-toastify";

const AccountPage = () => {
    const navigate = useNavigate();
    const accountId = useLocation().pathname.split("account/")[1];
    const [openPaymentsTab, setOpenPaymentsTab] = useState(false);
    const [openBillsTab, setOpenBillsTab] = useState(false);
    const [account, setAccount] = useState();
    const {fetchAccountById} = useContext(AccountContext);

    useEffect(() => {
        let abortController = new AbortController();
        fetchAccountById(accountId, {signal: abortController.signal})
            .then(response => {
                setAccount(response.data);
            })
            .catch(error => {
                if (!abortController.signal.aborted) {
                    toast.error(error);
                }
            })
        return() => {
            abortController.abort();
        }
    },[accountId])

    if (!account) {
        return null;
    } else return (
                <Container>
                    <Row>
                        <Col>
                            <Card className="card-stats pb-0 mb-0">
                                <Card.Body>
                                    <Row>
                                        <Col xs="2">
                                            <div className="icon-big text-center icon-warning">
                                                <FontAwesomeIcon icon={AccountIcons[account.icon]} className="text-warning"/>
                                            </div>
                                        </Col>
                                        <Col xs="10" md="7">
                                            <div className="numbers text-left">
                                                <p className="card-category">
                                                    {`${account.company} (EDRPOU - ${account.edrpou}, Number -  ${account.accountNumber})`}</p>
                                                <Card.Title as="h4">{account.name}</Card.Title>
                                            </div>
                                        </Col>
                                        <Col xs="12" md="3" className="my-3 text-right">
                                            <Button variant="warning" className="ml-1 btn-sm w-100"
                                                    onClick={() => navigate('/')}>
                                                <FontAwesomeIcon icon={faArrowAltCircleLeft} className="mr-2"/>
                                                All Houses
                                            </Button>
                                            <Button variant="warning" className="ml-1 btn-sm w-100"
                                                    onClick={() => navigate(`/house/${account.houseId}`)}>
                                                <FontAwesomeIcon icon={faArrowAltCircleLeft} className="mr-2"/>
                                                Accounts
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>



                    <Tab.Container
                        id="page-subcategories-tabs-example"
                        defaultActiveKey="bills-page-subcategories"
                    >
                        <div className="nav-container">
                            <Nav
                                role="tablist"
                                variant="tabs"
                                className="justify-content-center border-0 nav-icons"
                            >
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="bills-page-subcategories"
                                        className="border-0 bg-transparent cursor-pointer px-4 py-1"
                                        onClick={() => {setOpenBillsTab(!openBillsTab)}}
                                    >
                                        <i className="nc-icon nc-single-copy-04 mr-2" />
                                        Bills
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="payments-page-subcategories"
                                        className="border-0 bg-transparent cursor-pointer px-4 py-1"
                                        onClick={() => {setOpenPaymentsTab(!openPaymentsTab)}}
                                    >
                                        <i className="nc-icon nc-money-coins mr-2" />
                                        Payments
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                        <Tab.Content>
                            <Tab.Pane eventKey="bills-page-subcategories">
                                <Row>
                                    <Col xs="12">
                                        <BillTable page="account" openTab={openBillsTab}/>
                                    </Col>
                                </Row>

                            </Tab.Pane>
                            <Tab.Pane eventKey="payments-page-subcategories">
                                <Row>
                                    <Col xs="12">
                                        <PaymentTable openTab={openPaymentsTab}/>
                                    </Col>
                                </Row>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Container>
            )
}

export default AccountPage;