import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Modal, Row} from "react-bootstrap";
import {HouseContext} from "../context/house/HouseContext";
import {useLocation, useNavigate} from "react-router-dom";
import AccountCard from "../components/cards/AccountCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import {faArrowAltCircleLeft} from "@fortawesome/free-regular-svg-icons";
import BillTable from "../components/tables/BillTable";
import AccountIcons from "../assets/icons/AccountIcons";
import {AccountContext} from "../context/account/AccountContext";
import {toast, ToastContainer} from "react-toastify";
import {configForColoredToast} from "../context/global/Configs";

const HousePage = () => {
    const {getAllHouses, getHouseById, currentHouse} = useContext(HouseContext);
    const {addAccount, accounts} = useContext(AccountContext);
    const id = useLocation().pathname.split('house/')[1];
    const navigate = useNavigate();
    useEffect(() => {
        getHouseById(id)
    }, [id, accounts]);

    // Modal
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);
    const addAccountModalShow = () => setShowAddAccountModal(true);
    const addAccountModalClose = () => setShowAddAccountModal(false);

    // Form
    const [form, setForm] = useState({
        name: '',
        icon: '',
        company: '',
        edrpou: '',
        accountNumber: '',
        houseId: id,
        house: currentHouse
    });

    const handleSubmitForm = (event) => {
        event.preventDefault();
        let account = {
            name: form.name,
            icon: form.icon ?? null,
            company: form.company ?? null,
            edrpou: form.edrpou ?? null,
            accountNumber: form.accountNumber ?? null,
            houseId: form.houseId ?? null,
            house: form.house ?? null
        }
        setShowAddAccountModal(false);
        addAccount(account);
        getAllHouses();
        toast.success('Account have been successfully created', configForColoredToast);
    }

    const handleChangeInputForm = (event) => {
        let newForm = {...form};
        newForm[event.target.name] = event.target.value;
        setForm(newForm);
    }

    const handleChangeRadioForm = (event) => {
        setForm({...form, icon: event.target.value});
    }


    if (!currentHouse) {
        return null;
    } else return (
        <Container>
            <ToastContainer/>
            <Row>
                <Col>
                    <Card className="card-stats mb-0">
                        <Card.Body>
                            <Row>
                                <Col xs="2">
                                    <div className="icon-big text-center icon-warning">
                                        <i className="nc-icon nc-layers-3 text-warning"/>
                                    </div>
                                </Col>
                                <Col xs="10" md="7">
                                    <div className="numbers text-left">
                                        <p className="card-category">
                                            {`${currentHouse.zip} ${currentHouse.country} - ${currentHouse.city} - ${currentHouse.address}`}</p>
                                        <Card.Title as="h4">{currentHouse.name}</Card.Title>
                                    </div>
                                </Col>
                                <Col xs="12" md="3" className="my-3 text-right">
                                    <Button variant="warning" className="btn-sm" onClick={() => navigate('/')}>
                                        <FontAwesomeIcon icon={faArrowAltCircleLeft} className="mr-2"/>
                                        All Houses
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                {currentHouse.accounts.length > 0
                    ? currentHouse.accounts.map((account, index) => {
                        return (
                            <AccountCard account={account} key={index}/>
                        )
                    })
                    : null
                }

                <Col sm="6" md="4" xl="3" className="my-1">
                    <Card className="card-stats animated-card h-100" style={{minHeight: '50px'}}
                          onClick={addAccountModalShow}>
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-center h-100 flex-column">
                                <FontAwesomeIcon icon={faPlusCircle} className="text-warning" size="3x" fixedWidth/>
                                <h5 className="mt-3 text-warning">Add New Account</h5>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <BillTable page="house"/>
                </Col>
            </Row>

            <Modal show={showAddAccountModal} centered onHide={addAccountModalClose}>
                <Modal.Header>
                    <h3 className="py-0 my-0">New Account</h3>
                    <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer" onClick={addAccountModalClose}/>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmitForm}>
                        <Card className="my-1">
                            <Card.Body>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="name">Name:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <FormControl id="name" name="name" type="text" placeholder="Name"
                                                         onInput={handleChangeInputForm}
                                                         value={form.name}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="icon">Icon:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <div className="d-flex flex-wrap">
                                                {AccountIcons && Object.keys(AccountIcons).length > 0
                                                    ? Object.keys(AccountIcons).map((icon, index) => (
                                                        <div className="custom-control custom-radio mx-3" key={index}>
                                                            <input type="radio"
                                                                   id={"icon" + index}
                                                                   name="icon"
                                                                   value={icon}
                                                                   checked={form.icon === icon}
                                                                   onChange={handleChangeRadioForm}
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label"
                                                                   htmlFor={"icon" + index}>
                                                                <FontAwesomeIcon icon={AccountIcons[icon]}/>
                                                            </label>
                                                        </div>
                                                    ))
                                                    : null}
                                            </div>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="company">Company:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <FormControl id="company" type="text" placeholder="Company"
                                                         value={form.company}
                                                         name="company"
                                                         onInput={handleChangeInputForm}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="edrpou">Edrpou:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <FormControl id="edrpou"
                                                         type="text"
                                                         placeholder="Edrpou"
                                                         onInput={handleChangeInputForm}
                                                         name="edrpou"
                                                         value={form.edrpou}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="accountNumber">Account #:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <FormControl id="accountNumber"
                                                         type="text"
                                                         placeholder="Account Number"
                                                         onInput={handleChangeInputForm}
                                                         name="accountNumber"
                                                         value={form.accountNumber}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>

                            </Card.Body>
                            <Card.Footer className="py-0">
                                <div className="d-flex justify-content-center mb-2">
                                    <Button
                                        type="submit"
                                        variant="success"
                                        size="sm"
                                        className="px-5"
                                        disabled={form.name.trim().length < 1}
                                    >Add</Button>
                                </div>

                            </Card.Footer>
                        </Card>
                    </Form>

                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default HousePage;