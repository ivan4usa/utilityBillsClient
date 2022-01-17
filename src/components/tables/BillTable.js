import {Container, Input} from "reactstrap";
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faBalanceScale,
    faCalculator,
    faClock,
    faCoins,
    faCommentDots,
    faFileInvoiceDollar,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import React, {forwardRef, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {
    convertDate,
    deleteBill,
    deleteBillPayment,
    editBill,
    editBillPayment,
    getValueWithCurrency,
    payBill,
    searchBillsByAccount,
    searchBillsByHouse
} from "../../context/bill/BillService";
import {useLocation, useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import moment from "moment";
import AccountIcons from "../../assets/icons/AccountIcons";
import {faCalendarAlt} from "@fortawesome/free-regular-svg-icons";
import no_image from '../../assets/img/no-image.png';
import SweetAlert from "react-bootstrap-sweetalert";
import {configForColoredToast} from "../../context/global/Configs";


const BillTable = (props) => {
    let initialSearchValues = [];
    if (props.page === "account") initialSearchValues = [new Date().getFullYear() + "-01-01", new Date().getFullYear() + "-12-01"];
    if (props.page === "house") initialSearchValues = [moment().format("YYYY-MM") + "-01", moment().format("YYYY-MM") + "-01"];

    const [currentPayment, setCurrentPayment] = useState();
    const [currentBill, setCurrentBill] = useState();
    const [file, setFile] = useState();
    const [alert, setAlert] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showClearImageButton, setShowClearImageButton] = useState({addForm: false, editForm: []});
    const [bills, setBills] = useState(null);
    const [startPage, setStartPage] = useState([]);
    const [searchValue, setSearchValue] = useState(initialSearchValues);
    const [reloadBills, setReloadBills] = useState(false);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Modal Add Payment
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const handleCloseAddPaymentModal = () => setShowAddPaymentModal(false);
    const handleShowAddPaymentModal = (bill) => {
        setFile(null);
        const payment = {
            amount: bill.amount,
            account: bill.account,
            payDate: bill.dateEnd,
            bill,
            paymentFile: ''
        };
        setCurrentPayment({payment, bill});
        setShowAddPaymentModal(true);
    }

    // Add Payment Form
    function clearImageAddPaymentForm(e) {
        e.preventDefault();
        setShowClearImageButton({...showClearImageButton, addForm: false});
        const preview = document.getElementById("preview");
        preview.src = no_image;
        const newPayment = {...currentPayment};
        newPayment['payment'].paymentFile = null;
        setCurrentPayment(newPayment);
        setFile(null);
    }

    function onChangeAddPaymentForm(event) {
        const name = event.target.name;
        const value = event.target.value;
        const newPayment = {...currentPayment};
        if (name === 'payment-amount') {
            newPayment['payment'].amount = value;
        }
        if (name === 'payment-date') {
            newPayment['payment'].payDate = value;
        }
        if (name === 'payment-file') {
            setShowClearImageButton({...showClearImageButton, addForm: true});
            const preview = document.getElementById("preview");
            const file = event.target.files[0]
            preview.src = URL.createObjectURL(file);
            newPayment['payment'].paymentFile = value;
            setFile(file);
        }
        setCurrentPayment(newPayment);
    }

    function onSubmitAddPaymentForm(event) {
        event.preventDefault();
        payBill(currentPayment['payment'], file)
            .then(response => {
                if (response.status === 200 && response.data) {
                    handleCloseAddPaymentModal();
                    toast.success('Payment has been created');
                    setReloadBills(!reloadBills);
                } else {
                    toast.error('Payment has NOT bben created. Try again.');
                }
            })
            .catch(error => {
                toast.error(error);
            })
    }

    // Modal Edit Payment
    const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
    const handleCloseEditPaymentModal = () => setShowEditPaymentModal(false);
    const handleShowEditPaymentModal = (bill) => {
        setFile(null);
        let payments = [];
        let showClearImageButtonOnEditForm = [];
        bill.payments.forEach(payment => {
            showClearImageButtonOnEditForm[payment.id] = !!payment.paymentFile;
            payments.push(payment);
        });
        setShowClearImageButton({...showClearImageButton, editForm: showClearImageButtonOnEditForm})
        setCurrentPayment({payments, bill})
        setShowEditPaymentModal(true);
    };

    // Edit Payment Form
    function clearImageEditPaymentForm(e, payment, index) {
        e.preventDefault();
        let newEditForm = [...showClearImageButton.editForm];
        newEditForm[payment.id] = false;
        setShowClearImageButton({...showClearImageButton, editForm: newEditForm});
        const preview = document.getElementById("previewEdit-" + payment.id);

        preview.src = no_image;
        const newPayment = {...currentPayment};
        newPayment['payments'][index].paymentFile = null;
        // setCurrentPayment(newPayment);
        setFile(null);

    }

    function onChangeEditPaymentForm(event) {
        const [name, index] = event.target.name.split('-');
        let value = event.target.value;
        const newPayment = {...currentPayment};
        if (name === 'paymentFile') {
            const file = event.target.files[0];
            setFile(file);
            const previewEdit = document.getElementById('previewEdit-' + newPayment['payments'][index].id);
            previewEdit.src = URL.createObjectURL(file);
            let editForm = [...showClearImageButton.editForm];
            editForm[newPayment['payments'][index].id] = true;
            setShowClearImageButton({...showClearImageButton, editForm});
        } else {
            newPayment['payments'][index][name] = value;
        }
        setCurrentPayment(newPayment);
    }

    function onSubmitEditPaymentForm(index) {
        const payment = currentPayment['payments'][index];
        editBillPayment(payment, file)
            .then(response => {
                if (response.status === 200 && response.data) {
                    handleCloseEditPaymentModal();
                    toast.success("Payment have been updated");
                    setReloadBills(!reloadBills);
                } else toast.error("Payment have NOT been updated")
            })
            .catch(error => toast.error(error))
    }

    function handleDeletePayment(payment) {
        deleteBillPayment(payment.id)
            .then(() => {
                handleCloseEditPaymentModal();
                toast.success("Payment have been deleted");
                setReloadBills(!reloadBills);
            })
            .catch(error => toast.error(error))
    }

    // Modal Edit Bill
    const [showEditBillModal, setShowEditBillModal] = useState(false);
    const handleCloseEditBillModal = () => setShowEditBillModal(false);
    const handleShowEditBillModal = (bill) => {
        setCurrentBill(bill);
        setShowEditBillModal(true);
    }

    // Edit Bill Form
    const onChangeEditBillForm = (event) => {
        const name = event.target.name.split('editBill-')[1];
        const value = event.target.value;
        setCurrentBill({...currentBill, [name]: value});
    }
    const onChangeEditBillFormDate = (dateStart, dateEnd) => {
        if (dateStart) setCurrentBill({...currentBill, dateStart: moment(dateStart).format("YYYY-MM") + "-01"});
        if (dateEnd) setCurrentBill({...currentBill, dateEnd: moment(dateEnd).format("YYYY-MM") + "-01"});
    }
    const onSubmitEditBillForm = (event) => {
        event.preventDefault();
        editBill(currentBill)
            .then(() => {
                setReloadBills(!reloadBills);
                toast.success('Bill has been updated', configForColoredToast);
            })
            .catch(error => {
                toast.error(error, configForColoredToast);
            })
            .finally(() => {
                setCurrentBill();
                handleCloseEditBillModal();
            })
    }
    const handleDeleteBill = (id) => {
        setAlert(
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={() => {
                    deleteBill(id)
                        .then(() => {
                            setReloadBills(!reloadBills);
                            toast.success('Bill have been successfully deleted', configForColoredToast);
                        }).catch(error => {
                        toast.error("Bill have NOT been deleted. " + error, configForColoredToast)
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

    useEffect(() => {
        let abortController = new AbortController();
        let searchId;
        let search;
        if (props.page === 'account') {
            searchId = location.pathname.split("account/")[1];
            search = searchBillsByAccount([searchId, searchValue], {signal: abortController.signal})
        }
        if (props.page === 'house') {
            searchId = location.pathname.split("house/")[1];
            search = searchBillsByHouse([searchId, searchValue], {signal: abortController.signal})
        }

        search
            .then(response => {
                response.data.bills.forEach(bill => {
                    bill.dateStart = convertDate(bill.dateStart);
                    bill.dateEnd = convertDate(bill.dateEnd);
                    if (bill.payments) bill.payments.forEach(payment => {
                        const newBill = {...bill};
                        delete newBill.payments;
                        payment.bill = newBill;
                        payment.payDate = convertDate(payment.payDate);
                    });
                })
                setBills(response.data.bills);
                setStartPage(response.data.startPage);
            })
            .catch(error => {
                if (!abortController.signal.aborted) {
                    toast.error(error);
                }
            })

        return () => {
            abortController.abort();
        }

    }, [location.pathname, searchValue, reloadBills, props.openTab])

    function getPeriodFromDates(startDate, endDate) {
        const [startYear, startMonth] = startDate.split('-');
        const [endYear, endMonth] = endDate.split('-');
        if (startYear === endYear) {
            if (startMonth === endMonth) {
                return (<div className="bill-date">
                    {months[+startMonth - 1]} ({startYear})
                </div>);
            } else {
                let output = [];
                for (let i = +startMonth; i <= +endMonth; i++) {
                    output.push(<div key={i + 'period'} className="bill-date">{months[i - 1]} ({startYear})</div>);
                }
                return output;
            }
        } else {
            let year = startYear;
            let monthAmount = (12 - +startMonth) + (12 * (endYear - startYear - 1)) + (+endMonth);
            let output = [];
            let month = startMonth;
            for (let i = 0; i <= monthAmount; i++) {
                if (month > 12) {
                    month = 1
                }
                if (month !== +startMonth && month === 1) {
                    year = +startYear + 1;
                }
                output.push(<div key={i + 'period'} className="bill-date">{months[month - 1]} ({year})</div>);
                month++;
            }
            return output;
        }
    }

    function getArrayOfNumbers(value, length) {
        let addZerosCount = length - String(value).length;
        let Zeros = '';
        if (addZerosCount && addZerosCount > 0) {
            for (let i = 0; i < addZerosCount; i++) {
                Zeros += '0';
            }
        } else {
            Zeros = '';
        }
        return (Zeros + value).split("");
    }

    function changeSearchValue(start, end) {
        if (start === 'prev') {
            const currentYear = searchValue[0].slice(0, 4);
            let currentMonth = searchValue[0].slice(5, 7);
            if (props.page === "account") {
                let startDate = (+currentYear - 1) + '-01-01';
                let endDate = (+currentYear - 1) + '-12-01';
                setSearchValue([startDate, endDate]);
            }
            if (props.page === "house") {
                if (currentMonth === "01") {
                    let searchDate = (+currentYear - 1) + '-12-01'
                    setSearchValue([searchDate, searchDate]);
                } else {
                    let addMonth = +currentMonth - 1;
                    if (String(addMonth).length < 2) {

                        addMonth = "0" + addMonth;
                    }
                    let searchDate = currentYear + '-' + addMonth + '-01';
                    setSearchValue([searchDate, searchDate]);
                }
            }

        }
        if (start === 'next') {
            const currentYear = searchValue[1].slice(0, 4);
            const currentMonth = searchValue[1].slice(5, 7);
            if (props.page === "account") {

                let startDate = (+currentYear + 1) + '-01-01';
                let endDate = (+currentYear + 1) + '-12-01';
                setSearchValue([startDate, endDate]);
            }
            if (props.page === "house") {
                if (currentMonth === "12") {
                    let searchDate = (+currentYear + 1) + '-01-01'
                    setSearchValue([searchDate, searchDate]);
                } else {
                    let addMonth = +currentMonth + 1;
                    if (String(addMonth).length < 2) {
                        addMonth = "0" + addMonth
                    }
                    let searchDate = currentYear + '-' + addMonth + '-01';
                    setSearchValue([searchDate, searchDate]);
                }
            }
        } else {
            if (!end && typeof start === "object") {
                const year = start.getFullYear();
                let month = start.getMonth() + 1;
                if (String(month).length < 2) {
                    month = '0' + String(month)
                }
                const startDate = `${year}-${month}-01`;
                setSearchValue([startDate, searchValue[1]])
            }
            if (!start && typeof end === 'object') {
                const year = end.getFullYear();
                let month = end.getMonth() + 1;
                if (String(month).length < 2) {
                    month = '0' + String(month)
                }
                const endDate = `${year}-${month}-01`;
                setSearchValue([searchValue[0], endDate])
            }

        }
    }

    function getTotalPaymentAmount(payments) {
        let totalAmount = 0;
        payments.map(payment => {
            return totalAmount += +payment.amount;
        });
        return totalAmount;
    }

    const CustomInputForDatePicker = forwardRef(({value, onClick}, ref) => (
        <button type="button" className="btn btn-sm btn-warning text-nowrap w-auto px-sm-4 ml-1" onClick={onClick}
                ref={ref}>
            {value}
        </button>
    ));

    if (!bills) {
        return null;
    } else {
        return (
            <>
                <ToastContainer/>
                {alert}
                <Card key={'bill-header'} className="mb-2">
                    <Card.Header className="d-flex justify-content-between text-center">
                        <Card.Title as="h4">Bills</Card.Title>

                        {props.page === "house"
                            ? <Button type="button" variant="warning" size="sm"
                                      onClick={() => navigate('/add-bills', {state: {houseId: location.pathname.split("house/")[1]}})}>
                                Add Bills
                            </Button>
                            : null
                        }

                    </Card.Header>
                    <Card.Body>
                        <Container>
                            <Row className="justify-content-between">
                                <Col sm="6" md="5" lg="4" xl="3" className="d-flex justify-content-start p-0 my-1">
                                    <Button type="button" variant="light" size="sm" className="w-auto px-sm-4"
                                            onClick={() => {
                                                changeSearchValue('prev')
                                            }} disabled={!startPage || searchValue[0] <= startPage}>
                                        <FontAwesomeIcon icon={faArrowLeft}/>
                                    </Button>
                                    <div className="d-flex mx-2 justify-content-center align-items-center">
                                        {props.page === 'account' ? searchValue[1].slice(0, 4) : searchValue[1].slice(0, 7)}
                                    </div>
                                    <Button type="button" variant="light" size="sm" className="w-auto px-sm-4"
                                            onClick={() => {
                                                changeSearchValue('next')
                                            }} disabled={searchValue[1] >= moment().format('YYYY-MM') + "-01"}>
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                    </Button>
                                </Col>

                                <Col sm="6" md="5" lg="4" xl="3"
                                     className="d-flex text-center text-sm-right p-0 my-1 flex-basis-content">
                                    <DatePicker
                                        selected={moment(searchValue[0]).toDate()}
                                        onChange={(date) => changeSearchValue(date, null)}
                                        selectsStart
                                        startDate={new Date(searchValue[0])}
                                        endDate={new Date(searchValue[1])}
                                        dateFormat="MMM yyyy"
                                        showMonthYearPicker
                                        customInput={<CustomInputForDatePicker/>}
                                    />
                                    <DatePicker
                                        selected={moment(searchValue[1]).toDate()}
                                        onChange={(date) => changeSearchValue(null, date)}
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

                {bills.map((bill, index) => (
                        <Card key={index + 'bill'} className="mb-1">
                            <Card.Body>
                                <div className="d-flex flex-column-reverse flex-sm-row">
                                    <div className="d-flex align-items-center">
                                        <div className="d-flex flex-column align-items-center px-2" style={{width: '5em'}}>
                                            <FontAwesomeIcon icon={AccountIcons[bill.account.icon]} className="text-warning"
                                                             size="2x"/>
                                            {bill.account.name}
                                        </div>

                                        <div className="bill-date-wrapper">
                                            {getPeriodFromDates(bill.dateStart, bill.dateEnd)}
                                        </div>
                                        <div className="d-flex flex-column px-2 align-items-center justify-content-center">
                                            <div>
                                                {getArrayOfNumbers(bill.counterEnd, 6).map((symbol, index) => {
                                                    return (
                                                        <div key={symbol + index + 'endDate'} className="bill-counter">
                                                            {symbol}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div>
                                                {getArrayOfNumbers(bill.counterStart, 6).map((symbol, index) => {
                                                    return (
                                                        <div key={symbol + index + 'startDate'} className="bill-counter">
                                                            {symbol}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center px-2">
                                            <div>
                                                {getArrayOfNumbers(+bill.counterEnd - +bill.counterStart, 0).map((symbol, index) => {
                                                    return (
                                                        <div key={index + 'difference'} className="bill-counter">
                                                            {symbol}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex w-100 flex-grow-1">
                                        <div className="bill-comment">
                                            {bill.comment}
                                        </div>
                                        <div className="bill-amount">
                                            {getValueWithCurrency(bill.amount)}
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer className={bill.amount - getTotalPaymentAmount(bill.payments) === 0
                                ? "bg-success py-0" : "bg-danger py-0"}>
                                <div className="bill-card-footer d-flex justify-content-end align-items-center">
                                    <Button size="sm" variant="dark" className="px-3 py-0 ml-2 my-0"
                                            style={{lineHeight: '1.2em'}}
                                            onClick={() => {
                                                handleShowEditBillModal(bill)
                                            }}
                                    >
                                        Edit bill
                                    </Button>
                                    <Button size="sm" variant="danger" className="px-3 py-0 ml-2 my-0 mr-auto"
                                            style={{lineHeight: '1.2em'}}
                                            onClick={() => handleDeleteBill(bill.id)}>
                                        Delete bill
                                    </Button>

                                    {bill.amount - getTotalPaymentAmount(bill.payments) === 0
                                        ? "fully paid"
                                        : "to pay: " + getValueWithCurrency((bill.amount - getTotalPaymentAmount(bill.payments)).toFixed(2))
                                    }
                                    {bill.amount - getTotalPaymentAmount(bill.payments) > 0
                                        ? <Button size="sm" variant="success" className="px-3 py-0 ml-2 my-0"
                                                  style={{lineHeight: '1.2em'}}
                                                  onClick={(e) => handleShowAddPaymentModal(bill)}>Pay</Button>
                                        : null
                                    }
                                    {bill.payments
                                        ? <Button size="sm" variant="info" className="px-3 py-0 ml-2 my-0"
                                                  style={{lineHeight: '1.2em'}}
                                                  onClick={(e) => handleShowEditPaymentModal(bill)}>Edit payment</Button>
                                        : null
                                    }
                                </div>
                            </Card.Footer>
                        </Card>
                    )
                )}

                <Modal size="sm" show={showAddPaymentModal} centered onHide={handleCloseAddPaymentModal}>
                    <Form onSubmit={(e) => {
                        onSubmitAddPaymentForm(e)
                    }}>
                        <Modal.Header>
                            <h3 className="py-0 my-0">Payment</h3>
                            <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer"
                                             onClick={handleCloseAddPaymentModal}/>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                <span className="input-group-text">
                                <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-warning"/>
                                </span>
                                </div>
                                <Input type="text" disabled
                                       value={(currentPayment && (currentPayment['bill'])) ? currentPayment['bill'].account.name + " / " + getValueWithCurrency(currentPayment['bill'].amount) + " / " + currentPayment['bill'].dateEnd.substring(0, 7) : ''}/>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                <span className="input-group-text">
                                <FontAwesomeIcon icon={faCoins} className="text-warning"/>
                                </span>
                                </div>
                                <Input type="number" placeholder="Amount" min="0" step="0.01"
                                       value={currentPayment && currentPayment['payment'] ? currentPayment['payment'].amount : 0}
                                       name="payment-amount"
                                       onInput={(e) => onChangeAddPaymentForm(e)}/>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                <span className="input-group-text">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-warning"/>
                                </span>
                                </div>
                                <Input type="date" value={currentPayment ? currentPayment['payment']?.payDate : ""}
                                       onInput={(e) => onChangeAddPaymentForm(e)} name="payment-date"/>
                            </div>
                            <div className="input-group mb-3">
                                <Input type="file" bsSize="sm" className="text-warning" name="payment-file"
                                       value={currentPayment && currentPayment['payment'] && currentPayment['payment'].paymentFile
                                           ? currentPayment['payment'].paymentFile : ''}
                                       accept=".png, .jpg, .jpeg" onInput={(e) => onChangeAddPaymentForm(e)}/>

                                {showClearImageButton && showClearImageButton.addForm ?
                                    <button type="button" className="btn btn-link"
                                            onClick={(e) => clearImageAddPaymentForm(e)}>
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </button>
                                    : null
                                }
                                <img id="preview" width="250" height="auto" src={no_image} alt="payment screen"
                                     className="mt-2"/>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button size="sm" variant="success" type="submit" className="m-auto">
                                Save
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                <Modal size="sm" show={showEditPaymentModal} centered onHide={handleCloseEditPaymentModal}>
                    <Modal.Header>
                        <h3 className="py-0 my-0">Existing Payments</h3>
                        <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer"
                                         onClick={handleCloseEditPaymentModal}/>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            currentPayment
                                ? <span className="text-warning">{currentPayment['bill'].account.name + " | " +
                                getValueWithCurrency(currentPayment['bill'].amount) + " | " +
                                currentPayment['bill'].dateEnd}</span>
                                : null
                        }
                        {currentPayment && currentPayment['payments'] ? currentPayment['bill'].payments.map((payment, index) => {
                                return (
                                    <Form key={index}>
                                        <Card className="my-1">
                                            <Card.Body>
                                                <Input type="number" name={"amount-" + index}
                                                       value={currentPayment && currentPayment['payments'] ? currentPayment['payments'][index].amount : 0}
                                                       onInput={(e) => {
                                                           onChangeEditPaymentForm(e)
                                                       }}/>
                                                <Input type="date" name={"payDate-" + index}
                                                       value={currentPayment && currentPayment['payments'] ? currentPayment['payments'][index].payDate : ''}
                                                       onInput={(e) => {
                                                           onChangeEditPaymentForm(e)
                                                       }}/>
                                                <Input type="file" bsSize="sm" className="text-warning"
                                                       name={"paymentFile-" + index}
                                                       value={currentPayment && currentPayment['payments'] && currentPayment['payments'][index].paymentFile ? '' : ''}
                                                       accept=".png, .jpg, .jpeg"
                                                       onInput={(e) => onChangeEditPaymentForm(e)}/>
                                                <div className="d-flex justify-content-center">

                                                    {showClearImageButton && showClearImageButton.editForm && showClearImageButton.editForm[payment.id] ?
                                                        <button type="button" className="btn btn-link"
                                                                onClick={(e) => clearImageEditPaymentForm(e, payment, index)}>
                                                            <FontAwesomeIcon icon={faTimes}/>
                                                        </button>
                                                        : null
                                                    }

                                                </div>
                                                <img id={"previewEdit-" + payment.id}
                                                     src={currentPayment && currentPayment['payments'] && currentPayment['payments'][index].paymentFile
                                                     && !file ? "data:image/png;base64," + currentPayment['payments'][index].paymentFile
                                                         : no_image} width="220" height="auto" alt="preview"
                                                     className="mt-2"/>

                                            </Card.Body>
                                            <Card.Footer className="py-0">
                                                <div className="d-flex justify-content-around">
                                                    <Button type="button" variant="success" size="sm" className="px-3"
                                                            onClick={() => {
                                                                onSubmitEditPaymentForm(index)
                                                            }}>Save</Button>
                                                    <Button type="button" variant="danger" size="sm" className="px-3"
                                                            onClick={() => {
                                                                handleDeletePayment(payment)
                                                            }}>Delete</Button>
                                                </div>

                                            </Card.Footer>
                                        </Card>
                                    </Form>
                                )
                            })
                            : null
                        }

                    </Modal.Body>
                </Modal>

                <Modal size="sm" show={showEditBillModal} centered onHide={handleCloseEditBillModal}>
                    <Modal.Header>
                        <h3 className="py-0 my-0">Edit Bill</h3>
                        <FontAwesomeIcon icon={faTimes} className="ml-auto cursor-pointer"
                                         onClick={handleCloseEditBillModal}/>
                    </Modal.Header>

                    <Modal.Body className="pt-3">
                        {
                            currentBill
                                ? (
                                    <>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon className="text-warning mr-2" size="2x"
                                                             icon={AccountIcons[currentBill.account.icon]}/>
                                            <span>{currentBill.account.name}</span>
                                        </div>
                                        <Form onSubmit={(event) => onSubmitEditBillForm(event)}>
                                            <Form.Group as={Row} className="my-2 justify-content-center">
                                                <DatePicker
                                                    selected={moment(currentBill.dateStart).toDate()}
                                                    onChange={(date) => onChangeEditBillFormDate(date, null)}
                                                    selectsStart
                                                    startDate={moment(currentBill.dateStart).toDate()}
                                                    endDate={moment(currentBill.dateEnd).toDate()}
                                                    dateFormat="MMM yyyy"
                                                    showMonthYearPicker
                                                    customInput={<CustomInputForDatePicker/>}
                                                />
                                                <DatePicker
                                                    selected={moment(currentBill.dateEnd).toDate()}
                                                    onChange={(date) => onChangeEditBillFormDate(null, date)}
                                                    selectsEnd
                                                    startDate={moment(currentBill.dateStart).toDate()}
                                                    endDate={moment(currentBill.dateEnd).toDate()}
                                                    dateFormat="MMM yyyy"
                                                    showMonthYearPicker
                                                    customInput={<CustomInputForDatePicker/>}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Row} className="my-2" controlId="editBill-counterStart">
                                                <Form.Label column sm="5">
                                                    <FontAwesomeIcon icon={faClock} className="text-warning mr-2"/> Start:
                                                </Form.Label>
                                                <Col sm="7">
                                                    <Form.Control type="number" value={currentBill.counterStart}
                                                                  name="editBill-counterStart" step="1" min="0"
                                                                  onChange={(event) => onChangeEditBillForm(event)}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="my-2" controlId="editBill-counterEnd">
                                                <Form.Label column sm="5">
                                                    <FontAwesomeIcon icon={faClock} className="text-warning mr-2"/> End:
                                                </Form.Label>
                                                <Col sm="7">
                                                    <Form.Control type="number" value={currentBill.counterEnd}
                                                                  name="editBill-counterEnd" step="1" min="0"
                                                                  onChange={(event) => onChangeEditBillForm(event)}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="my-2" controlId="editBill-tariff">
                                                <Form.Label column sm="5">
                                                    <FontAwesomeIcon icon={faBalanceScale}
                                                                     className="text-warning mr-1"/> Tariff:
                                                </Form.Label>
                                                <Col sm="7">
                                                    <Form.Control type="number" value={currentBill.tariff}
                                                                  name="editBill-tariff" step="0.01"
                                                                  onChange={(event) => onChangeEditBillForm(event)}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="my-2" controlId="editBill-amount">
                                                <Form.Label column sm="5">
                                                    <FontAwesomeIcon icon={faCalculator}
                                                                     className="text-warning mr-2"/> Amount:
                                                </Form.Label>
                                                <Col sm="7">
                                                    <Form.Control type="number" value={currentBill.amount}
                                                                  name="editBill-amount" step="0.01"
                                                                  onChange={(event) => onChangeEditBillForm(event)}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="my-2" controlId="editBill-comment">
                                                <Form.Label column sm="5" className="text-nowrap">
                                                    <FontAwesomeIcon icon={faCommentDots} className="text-warning mr-2"/>Comment:
                                                </Form.Label>
                                                <Col sm="7">
                                                    <Form.Control type="text" value={currentBill.comment}
                                                                  name="editBill-comment" maxLength="20"
                                                                  onChange={(event) => onChangeEditBillForm(event)}/>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="my-2">
                                                <Button size="sm" type="submit" variant="warning"
                                                        className="mx-auto mt-3 px-3">
                                                    Edit
                                                </Button>
                                            </Form.Group>
                                        </Form>
                                    </>
                                )
                                : null
                        }
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default BillTable;