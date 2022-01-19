import React, {useContext, useEffect, useState} from "react";
import {Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faFlag, faLocationArrow, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faPeriscope} from "@fortawesome/free-brands-svg-icons";
import AccountIcons from "../../assets/icons/AccountIcons";
import {useNavigate} from "react-router-dom";
import {HouseContext} from "../../context/house/HouseContext";
import SweetAlert from 'react-bootstrap-sweetalert';
import {ToastContainer, toast} from 'react-toastify';
import axios from "axios";

const HouseCard = (props) => {
    const navigate = useNavigate();

    const {editHouse, deleteHouse} = useContext(HouseContext);
    const [alert, setAlert] = React.useState(null);

    const onDeleteAlert = (id) => {
        setAlert(
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => {
                    deleteHouse(id);
                    setAlert(null);
                    toast.success('House have been successfully deleted', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored"
                    });
                }}
                onCancel={() => setAlert(null)}
                focusCancelBtn
            >
                You will not be able to recover this data!
            </SweetAlert>
        );
    }

    // Modal
    const [showEditHouseModal, setShowEditHouseModal] = useState(false);
    const editHouseModalShow = () => setShowEditHouseModal(true);
    const editHouseModalClose = () => setShowEditHouseModal(false);

    // Form

    const handleSubmitForm = (event) => {
        event.preventDefault();
        setShowEditHouseModal(false);
        editHouse(updatedHouse);
        toast.success('House have been successfully updated', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

    const [updatedHouse, setUpdatedHouse] = useState(props.house);

    const handleChangeInputForm = (event) => {
        let newUpdatedHouse = {...updatedHouse};
        newUpdatedHouse[event.target.name] = event.target.value;
        setUpdatedHouse(newUpdatedHouse);
    }

    const handleChangeSelectForm = (event) => setUpdatedHouse({...updatedHouse, country: event.target.value});

    const [countries, setCountries] = useState(['Ukraine']);

    useEffect(() => {
        const abortController = new AbortController();

        async function getCountries() {
            let countries = [];
            try {
                let response = await axios.get('https://restcountries.com/v3.1/all', {signal: abortController.signal});
                response.data.forEach(item => {
                    countries.push(item.name.common);
                });
                setCountries(countries.sort());
            } catch (e) {
                if (!abortController.signal.aborted) {
                    console.log(e);
                }
            }

        }

        getCountries().then();

        return () => {
            abortController.abort();
        }

    }, [])

    const navigateTo = (id) => {
        navigate(`/house/${id}`);
    }

    return (
        <Col lg="4" sm="6" className="my-3">
            <ToastContainer/>
            {alert}
            <Card className="card-stats animated-card h-100">
                <Card.Body onClick={() => navigateTo(props.house.id)}>
                    <Row>
                        <Col xs="3">
                            <div className="icon-big text-center icon-warning">
                                <i className="nc-icon nc-layers-3 text-warning"/>
                            </div>
                        </Col>
                        <Col xs="9">
                            <div className="numbers text-warning font-weight-bold">
                                <Card.Title as="h4">{props.house.name}</Card.Title>
                            </div>
                        </Col>
                    </Row>
                    <hr></hr>
                    <div className="stats d-flex align-items-center">
                        <FontAwesomeIcon icon={faFlag} className="mr-2"/>
                        {props.house.country}
                        <span className="ml-auto"> {props.house.zip}</span>
                    </div>
                    <div className="stats">
                        <FontAwesomeIcon icon={faPeriscope} className="mr-2"/>
                        {props.house.city}
                    </div>
                    <div className="stats">
                        <FontAwesomeIcon icon={faLocationArrow} className="mr-2"/>
                        {props.house.address}
                    </div>
                    <hr></hr>
                    <h5 className="text-center text-muted">Accounts:</h5>
                    {
                        props.house.accounts ?
                            props.house.accounts.map((account, index) => {
                                return (
                                    <div className="stats" key={index}>
                                        <FontAwesomeIcon icon={AccountIcons[account.icon]} className="mr-2"/>
                                        {account.name}
                                    </div>
                                );
                            })
                            : null
                    }
                </Card.Body>
                <Card.Footer className="p-0 d-flex">
                    <button className="btn btn-warning btn-sm p-0 text-white w-50 my-0" style={{borderRadius: '0'}}
                            onClick={editHouseModalShow}>
                        <FontAwesomeIcon icon={faEdit}/>
                    </button>
                    <button className="btn btn-danger btn-sm p-0 text-white w-50 my-0" style={{borderRadius: '0'}}
                            onClick={() => onDeleteAlert(props.house.id)}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>
                </Card.Footer>
            </Card>


            <Modal show={showEditHouseModal} centered onHide={editHouseModalClose}>
                <Modal.Header>
                    <h3 className="py-0 my-0">New House</h3>
                    <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer" onClick={editHouseModalClose}/>
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
                                                         value={updatedHouse.name}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="country">Country:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <Form.Select
                                                value={updatedHouse.country}
                                                onChange={handleChangeSelectForm}
                                                name="country"
                                                id="country"
                                                className="form-control"
                                            >
                                                <option disabled value="" className="text-muted">Select Country</option>
                                                {countries && countries.length > 0 ? countries.map((country, index) => (
                                                    <option key={index} value={country}>{country}</option>
                                                )) : null}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="city">City:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <FormControl id="city" type="text" placeholder="City"
                                                         value={updatedHouse.city}
                                                         name="city"
                                                         onInput={handleChangeInputForm}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="address">Address:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <FormControl id="address"
                                                         type="text"
                                                         placeholder="Address"
                                                         onInput={handleChangeInputForm}
                                                         name="address"
                                                         value={updatedHouse.address}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup className="my-3">
                                    <Row>
                                        <Col md="3">
                                            <FormLabel htmlFor="zip">Zip:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <FormControl id="zip"
                                                         type="number"
                                                         placeholder="00000"
                                                         min="0"
                                                         step="1"
                                                         max="99999"
                                                         onInput={handleChangeInputForm}
                                                         name="zip"
                                                         value={updatedHouse.zip}
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
                                        disabled={updatedHouse.name.trim().length < 1}
                                    >Edit</Button>
                                </div>

                            </Card.Footer>
                        </Card>
                    </Form>

                </Modal.Body>
            </Modal>
        </Col>
    );
}

export default HouseCard;