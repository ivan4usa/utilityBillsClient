import {Table, Button, Card, Col, OverlayTrigger, Row, Tooltip, Modal, Form} from "react-bootstrap";
import {CardBody, Container, Input} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight, faCoins,
    faEdit,
    faFileInvoiceDollar,
    faTimes,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import DatePicker from "react-datepicker";
import React, {forwardRef, useEffect, useState} from "react";
import {searchPaymentsByAccount, convertDate, getValueWithCurrency, deleteBillPayment, editBillPayment} from '../../context/bill/BillService';
import {useLocation} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import no_image from '../../assets/img/no-image.png';
import SweetAlert from "react-bootstrap-sweetalert";
import {faCalendarAlt} from "@fortawesome/free-regular-svg-icons";

export const PaymentTable = (props) => {

    const initialSearchValues = [
        moment().format("yyyy") + "-01-01",
        moment().format("yyyy") + "-12-31"
    ];

    const [searchValue, setSearchValue] = useState(initialSearchValues);
    const [pages, setPages] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);

    const [payments, setPayments] = useState([]);
    const accountId = useLocation().pathname.split('/account/')[1];
    const [alert, setAlert] = useState(null);
    const [reloadPayments, setReloadPayments] = useState(false);
    const [file, setFile] = useState();

    const handleDeletePayment = (id) => {
        setAlert(
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => {
                    deleteBillPayment(id)
                        .then(() => {
                            setReloadPayments(!reloadPayments);
                        toast.success('Payment have been successfully deleted', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored"
                        });
                    }).catch(error => {
                        toast.error("Payment have NOT been deleted. " + error, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored"
                        })
                    })
                        .finally(() => {
                            setAlert(null);
                        })
                }}
                onCancel={() => setAlert(null)}
                focusCancelBtn
            >
                You will not be able to recover this data!
            </SweetAlert>
        );
    }

    const handleEditPayment = (payment) => {
        if (payment.payDate && typeof payment.payDate === 'object') {
            payment.payDate = convertDate(payment.payDate);
        }
        setShowModal(true);
        setCurrentPayment(payment);
    }

    const CustomInputForDatePicker = forwardRef(({value, onClick}, ref) => (
        <button className="btn btn-sm btn-warning text-nowrap w-auto px-sm-4 ml-1" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    const generatePages = (startPage) => {
        if (startPage) {
            let lastPage = moment().format('yyyy');
            let pages = [];
            for (startPage; startPage <= lastPage; +startPage++) {
                pages.push(startPage);
            }
            return pages;
        } else return [];
    }

    const changeSearchPeriod = (start, end) => {
        if (start === 'prev') {
            setSearchValue([
                +searchValue[0].split('-')[0] - 1 + '-01-01',
                +searchValue[1].split('-')[0] - 1 + '-12-31'
            ])
        }
        if (start === 'next') {
            setSearchValue([
                +searchValue[0].split('-')[0] + 1 + '-01-01',
                +searchValue[1].split('-')[0] + 1 + '-12-31'
            ]);
        } else {
            if (!end && typeof start === "object") {
                const year = start.getFullYear();
                let month = start.getMonth() + 1;
                if (String(month).length < 2) {month = '0' + String(month)}
                const startDate = `${year}-${month}-01`;
                setSearchValue([startDate,searchValue[1]])
            }
            if (!start && typeof end === 'object') {
                const endDate = moment(end).add(1, 'month').add(-1, "day").format("yyyy-MM-D");
                setSearchValue([searchValue[0], endDate])
            }
        }
    }

    const changeCurrentPayment = (event) => {
        let newCurrentPayment = {...currentPayment};
        if (event.target.name === 'paymentFile') {
            newCurrentPayment[event.target.name] = event.target.files[0];
            setFile(event.target.files[0]);
            event.target.value = '';
        } else {
            newCurrentPayment[event.target.name] = event.target.value;
        }
        setCurrentPayment(newCurrentPayment);
    }

    const clearFileOnPayment = () => {
        let newCurrentPayment = {...currentPayment};
            newCurrentPayment.paymentFile = null;
        setCurrentPayment(newCurrentPayment);
        setFile();
    }

    const editPayment = (event) => {
        event.preventDefault();
        editBillPayment(currentPayment, file)
            .then(response => {
                let newPayments = payments.map(payment => {
                    return payment.id === response.data.id ? response.data : payment
                });
                setPayments(newPayments);
            })
            .catch(error => {
                toast.error(error);
            })
            .finally(() => {
                setShowModal(false);
            })
    }

    useEffect(() => {
        const abortController = new AbortController();
        searchPaymentsByAccount([accountId, searchValue], {signal: abortController.signal})
            .then(response => {
                setPayments(response.data.payments);
                setPages(generatePages(response.data.startPage.split('-')[0]));
            })
            .catch(e => {
                if (!abortController.signal.aborted) {
                    toast.error(e);
                }
            })
        return () => {
            abortController.abort();
        }
    },[accountId, searchValue, reloadPayments, props.openTab])


    return (
        <>
            <ToastContainer />
            {alert}
            <Card className="mb-2">
                <Card.Header className="d-flex justify-content-between text-center">
                    <Card.Title as="h4">Payments</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Container>
                        <Row className="justify-content-between">
                            <Col sm="6" md="5" lg="4" xl="3" className="d-flex justify-content-start p-0 my-1">
                                <Button type="button" variant="light" size="sm" className="w-auto px-sm-4"
                                        onClick={() => {changeSearchPeriod('prev')}}
                                        disabled={!pages || pages.length < 1 || searchValue[0].split('-')[0] <= pages[0]}>
                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                </Button>
                                <div className="d-flex mx-2 justify-content-center align-items-center">
                                    {searchValue[0].split('-')[0]}
                                </div>
                                <Button type="button" variant="light" size="sm" className="w-auto px-sm-4"
                                        onClick={() => {changeSearchPeriod('next')}}
                                        disabled={searchValue[0].split('-')[0] >= moment().format('yyyy')}>
                                    <FontAwesomeIcon icon={faArrowRight}/>
                                </Button>
                            </Col>

                            <Col sm="6" md="5" lg="4" xl="3" className="d-flex text-center text-sm-right p-0 my-1 flex-basis-content">
                                <DatePicker
                                    selected={moment(searchValue[0]).toDate()}
                                    onChange={(date) => {changeSearchPeriod(date, null)}}
                                    selectsStart
                                    startDate={new Date(searchValue[0])}
                                    endDate={new Date(searchValue[1])}
                                    dateFormat="MMM yyyy"
                                    showMonthYearPicker
                                    customInput={<CustomInputForDatePicker/>}
                                />
                                <DatePicker
                                    selected={moment(searchValue[1]).toDate()}
                                    onChange={(date) => {changeSearchPeriod(null, date)}}
                                    selectsEnd
                                    startDate={new Date(searchValue[0])}
                                    endDate={new Date(searchValue[1])}
                                    dateFormat="MMM yyyy"
                                    showMonthYearPicker
                                    customInput={<CustomInputForDatePicker/>}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
            <Card>
                <CardBody>
                    <Table>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Payment Amount</th>
                            <th className="text-center">File</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>

                        {payments && payments.length > 0
                        ? payments.map((payment, index) => (
                                <tr key={index}>
                                    <td>{convertDate(payment.payDate)}</td>
                                    <td>{getValueWithCurrency(payment.amount)}</td>
                                    <td className="text-center"><img
                                        src={payment.paymentFile ? "data:image/png;base64," + payment.paymentFile : no_image}
                                        alt="payment"
                                        height="100"/>
                                    </td>
                                    <td className="td-actions text-center text-wrap">
                                        <OverlayTrigger
                                            onClick={(e) => e.preventDefault()}
                                            overlay={
                                                <Tooltip id="tooltip-981231696">Edit Payment</Tooltip>
                                            }
                                        >
                                            <Button
                                                className="btn-link btn-xs"
                                                onClick={() => {handleEditPayment(payment)}}
                                                variant="success"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            onClick={(e) => e.preventDefault()}
                                            overlay={<Tooltip>Remove payment</Tooltip>}
                                        >
                                            <Button
                                                className="btn-link btn-xs"
                                                onClick={() => handleDeletePayment(payment.id)}
                                                variant="danger"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))

                            : null
                        }
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            <Modal size="sm" show={showModal} centered onHide={() => setShowModal(false)}>
                <Form onSubmit={(e) => {editPayment(e)}}>
                    <Modal.Header>
                        <h3 className="py-0 my-0">Edit Payment</h3>
                        <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer" onClick={() => setShowModal(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                <FontAwesomeIcon icon={faCoins} className="text-warning" />
                                </span>
                            </div>
                            <Input type="number" min="0" step="0.01" max="999999.99"
                                   value={currentPayment ? currentPayment.amount : 0}
                                   onInput={(e) => changeCurrentPayment(e)}
                                   name="amount"/>
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-warning" />
                                </span>
                            </div>
                            <Input type="date"
                                   value={currentPayment ? currentPayment.payDate : ""}
                                   onInput={(e) => changeCurrentPayment(e)}
                                   name="payDate"/>
                        </div>

                        <div className="input-group mb-3">
                            <Input type="file" bsSize="sm" className="text-warning" name="paymentFile"
                                   accept=".png, .jpg, .jpeg"
                                   onInput={(e) => changeCurrentPayment(e)} />

                            { currentPayment && currentPayment.paymentFile ?
                                <button type="button" className="btn btn-link"
                                        onClick={() => clearFileOnPayment()}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                                : null
                            }

                            <img id="preview" width="250" height="auto"
                                 src={currentPayment && currentPayment.paymentFile && typeof currentPayment.paymentFile === 'string'
                                     ? "data:image/png;base64," + currentPayment.paymentFile
                                     : (currentPayment && currentPayment.paymentFile && typeof currentPayment.paymentFile === 'object'
                                     ? URL.createObjectURL(currentPayment.paymentFile)
                                         : no_image)}
                                 alt="payment screen" className="mt-2"/>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className="py-0">
                        <div className="d-flex justify-content-around w-100 mb-4">
                            <Button type="submit" variant="success" size="sm" className="px-3">Save</Button>
                        </div>

                    </Modal.Footer>
                </Form>
            </Modal>


        </>
    )
}