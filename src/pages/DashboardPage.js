import React, {useContext, useEffect, useState} from 'react';
import {HouseContext} from "../context/house/HouseContext";
import HouseCard from "../components/cards/HouseCard";
import AccountIcons from "../assets/icons/AccountIcons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Modal, Row} from "react-bootstrap";
import {faPlusCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const DashboardPage = () => {

    const initialForm = {
        name: '',
        country: '',
        city: '',
        address: '',
        zip: ''
    };

    const {houses, addHouse} = useContext(HouseContext);

    // Modal
    const [showAddHouseModal, setShowAddHouseModal] = useState(false);
    const addHouseModalShow = () => setShowAddHouseModal(true);
    const addHouseModalClose = () => setShowAddHouseModal(false);

    // Form

    const [form, setForm] = useState(initialForm);

    const handleSubmitForm = (event) => {
        event.preventDefault();
        const house = {
            name: form.name,
            country: form.country ?? null,
            city: form.city ?? null,
            address: form.address ?? null,
            zip: form.zip ?? null,
            userId: localStorage.getItem('userId'),
            accounts: null
        }
        addHouse(house);
        setShowAddHouseModal(false);
        setForm(initialForm);
    }

    const handleChangeInputForm = (event) => {
        let newForm = {...form};
        newForm[event.target.name] = event.target.value;
        setForm(newForm);
    }

    const handleChangeSelectForm = (event) => setForm({...form, country: event.target.value});

    // Select

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

    return (
        <Container>
            <Row>
                {houses && houses.length
                    ? houses.map((house, index) => {
                        return (
                            <HouseCard key={index} house={house} icon={AccountIcons['faWater']}/>
                        )
                    })
                    : null
                }

                <Col lg="4" sm="6" className="my-3" onClick={addHouseModalShow}>
                    <Card className="card-stats animated-card h-100" style={{minHeight: '250px'}}>
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-center h-100 flex-column">
                                <FontAwesomeIcon icon={faPlusCircle} className="text-warning" size="3x" fixedWidth/>
                                <h5 className="mt-3 text-warning">Add New House</h5>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showAddHouseModal} centered onHide={addHouseModalClose}>
                <Modal.Header>
                    <h3 className="py-0 my-0">New House</h3>
                    <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer" onClick={addHouseModalClose}/>
                </Modal.Header>

                <Modal.Body>
                    <Form id="add-house-form" onSubmit={handleSubmitForm}>
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
                                            <FormLabel htmlFor="country">Country:</FormLabel>
                                        </Col>
                                        <Col md="9">
                                            <Form.Select
                                                value={form.country}
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
                                                         value={form.city}
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
                                                         value={form.address}
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
                                                         value={form.zip}
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

export default DashboardPage;