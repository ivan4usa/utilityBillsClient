import React, {useContext, useState} from "react";
import {Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Modal, Row,} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBuilding, faEdit, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import AccountIcons from "../../assets/icons/AccountIcons";
import {useNavigate} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import {toast, ToastContainer} from "react-toastify";
import {AccountContext} from "../../context/account/AccountContext";
import {HouseContext} from "../../context/house/HouseContext";

const AccountHouse = (props) => {
    const navigate = useNavigate();

    const navigateTo = (id) => {
        navigate(`/account/${id}`);
    }
    const [alert,setAlert] = React.useState(null);
    const {editAccount, deleteAccount} = useContext(AccountContext);
    const {getAllHouses} = useContext(HouseContext);

    const onDeleteAlert = (id) => {
        setAlert(

            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => {
                    deleteAccount(id);
                    getAllHouses();
                    setAlert(null);
                    toast.success('Account have been successfully deleted', {
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
    const [showEditAccountModal, setShowEditAccountModal] = useState(false);
    const editAccountModalShow = () => setShowEditAccountModal(true);
    const editAccountModalClose = () => setShowEditAccountModal(false);

    // Form

    const handleSubmitForm = (event) => {
        event.preventDefault();
        setShowEditAccountModal(false);
        editAccount(updatedAccount);
        getAllHouses();
        toast.success('Account have been successfully updated', {
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

    const [updatedAccount, setUpdatedAccount] = useState(props.account);

    const handleChangeInputForm = (event) => {
        let newUpdatedAccount = {...updatedAccount};
        newUpdatedAccount[event.target.name] = event.target.value;
        setUpdatedAccount(newUpdatedAccount);
    }

    return (
        <Col sm="6" md="4" xl="3" className="my-1">
            {alert}
            <ToastContainer />
            <Card className="card-stats animated-card h-100 mb-2">
                <Card.Body onClick={() => navigateTo(props.account.id)}>
                    <Row>
                        <Col xs="4">
                            <div className="icon-medium text-center icon-warning">
                                <FontAwesomeIcon icon={AccountIcons[props.account.icon]} className="text-warning"/>
                            </div>
                        </Col>
                        <Col xs="8">
                            <div className="numbers text-warning font-weight-bold">
                                <Card.Title as="h4">{props.account.name}</Card.Title>
                            </div>
                        </Col>
                    </Row>
                    <hr className="m-0" />
                    <div className="stats text-uppercase my-2">
                        <FontAwesomeIcon icon={faBuilding} className="text-warning mr-2"/>
                        {props.account.company}
                    </div>
                    <div className="stats">
                        <span className="text-muted text-warning font-italic mr-2">EDRPOU:</span>
                        {props.account.edrpou}
                    </div>
                    <div className="stats">
                        <span className="text-muted text-warning font-italic mr-2">Number:</span>
                        {props.account.accountNumber}
                    </div>
                </Card.Body>
                <Card.Footer className="p-0 d-flex" >
                    <button className="btn btn-warning btn-sm p-0 text-white w-50 my-0" style={{borderRadius: '0'}}
                            onClick={editAccountModalShow}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-danger btn-sm p-0 text-white w-50 my-0" style={{borderRadius: '0'}}
                            onClick={() => onDeleteAlert(props.account.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </Card.Footer>
            </Card>


            <Modal show={showEditAccountModal} centered onHide={editAccountModalClose}>
                <Modal.Header>
                    <h3 className="py-0 my-0">Edit Account</h3>
                    <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer" onClick={editAccountModalClose}/>
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
                                                         value={updatedAccount.name}
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
                                                                   checked={updatedAccount.icon === icon}
                                                                   onChange={handleChangeInputForm}
                                                                   className="custom-control-input"/>
                                                            <label className="custom-control-label" htmlFor={"icon" + index}>
                                                                <FontAwesomeIcon icon={AccountIcons[icon]} />
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
                                                         value={updatedAccount.company}
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
                                                         value={updatedAccount.edrpou}
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
                                                         value={updatedAccount.accountNumber}
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
                                        disabled={updatedAccount.name.trim().length < 1}
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

export default AccountHouse;