import React, {forwardRef, useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import moment from "moment";
import DatePicker from "react-datepicker";
import {useLocation, useNavigate} from "react-router-dom";
import {Table} from "react-bootstrap";
import AccountIcons from "../assets/icons/AccountIcons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Input} from "reactstrap";
import {HouseContext} from "../context/house/HouseContext";
import {searchBillsByAccount, addBills} from "../context/bill/BillService";
import {faArrowLeft, faRedo, faTimes} from "@fortawesome/free-solid-svg-icons";
import {toast, ToastContainer} from "react-toastify";
import {configForColoredToast} from "../context/global/Configs";

export const AddBillsPage = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const houseId = state.houseId;
    const [reload, setReload] = useState(false);
    const [date, setDate] = useState(moment.now());
    const [formValues, setFormValues] = useState([]);
    const {currentHouse, getHouseById} = useContext(HouseContext);

    useEffect(() => {
        const abortController = new AbortController();
        getHouseById(houseId);
        let bills = [];
        try {
            const getBills = async () => {
                return Promise.all(currentHouse.accounts.map(async account => {
                    const response = await searchBillsByAccount([account.id, [moment().format("YYYY-MM") + "-01",
                        moment().format("YYYY-MM") + "-01"]], {signal: abortController.signal});
                    const lastBill = response.data.lastBill;
                    bills.push({
                        amount: 0,
                        counterStart: lastBill?.counterEnd ?? 0,
                        counterEnd: lastBill?.counterEnd ?? 0,
                        comment: '',
                        tariff: lastBill?.tariff ?? '',
                        dateStart: date,
                        dateEnd: date,
                        account: account,
                        accountName: account.name,
                        accountIcon: account.icon
                    })
                }))
            }
            getBills().then(() => {
                setFormValues(bills);
            })
        } catch (e) {
            if (!abortController.signal.aborted) {
                console.log(e)
            }
        }

        return () => {
            abortController.abort();
        }
    }, [reload])

    const CustomInputForDatePicker = forwardRef(({value, onClick}, ref) => (
        <button type="button" className="btn btn-sm btn-warning text-nowrap w-auto px-sm-4 ml-1" onClick={onClick}
                ref={ref}>
            {value}
        </button>
    ));

    const changeDate = (field, index, date) => {
        if (field === 'all') {
            let newValue = [...formValues];
            newValue.forEach(bill => {
                bill.dateStart = date;
                bill.dateEnd = date;
            })
            setFormValues(newValue);
            setDate(date);
        } else {
            let newValue = [...formValues];
            newValue[index][field] = date;
            setFormValues(newValue);
        }

    }

    const onChangeForm = (event) => {
        const [field, index] = event.target.name.split("-");
        const value = event.target.value;
        let newValue = [...formValues];

        if (field === 'tariff') {
            if (String(value).charAt(0) === "*") {
                newValue[index]['amount'] = value.substring(1, value.length);
            } else {
                newValue[index]['amount'] = Math.round(value * (newValue[index]['counterEnd'] - newValue[index]['counterStart']) * 100) / 100;
            }
        }
        if (field === 'counterStart') {
            if (String(newValue[index]['tariff']).charAt(0) === "*") {
                newValue[index]['amount'] = newValue[index]['tariff'].substring(1, newValue[index]['tariff'].length);
            } else {
                newValue[index]['amount'] = Math.round(newValue[index]['tariff'] * (newValue[index]['counterEnd'] - value) * 100) / 100;
            }

        }
        if (field === 'counterEnd') {
            if (String(newValue[index]['tariff']).charAt(0) === "*") {
                newValue[index]['amount'] = newValue[index]['tariff'].substring(1, newValue[index]['tariff'].length);
            } else {
                newValue[index]['amount'] = Math.round(newValue[index]['tariff'] * (value - newValue[index]['counterStart']) * 100) / 100;
            }

        }
        newValue[index][field] = value;
        setFormValues(newValue);
    }

    const deleteBill = index => {
        let newValues = [...formValues];
        newValues = newValues.filter((item, i) => newValues[i] !== newValues[index]);
        setFormValues(newValues);
    }

    const submitForm = (event) => {
        event.preventDefault();
        let bills = [];
        formValues.map(item => {
            return bills.push({
                dateStart: moment(item.dateStart).format("YYYY-MM") + "-01",
                dateEnd: moment(item.dateEnd).format("YYYY-MM") + "-01",
                amount: item.amount,
                counterStart: item.counterStart,
                counterEnd: item.counterEnd,
                comment: item.comment,
                tariff: item.tariff,
                account: item.account
            });
        })
        addBills(bills).then(response => {
            if (response.status === 200 && response.data) {
                navigate('/account', {replace: true});
            } else {
                toast.error('ERROR: bills NOT created!', configForColoredToast);
            }
        }).catch(error => {
            toast.error(error, configForColoredToast);
        })
    }

    return (
        <Container>
            <ToastContainer />
            <Row>
                <Col xs="12">
                    <Card>
                        <Card.Header className="d-flex w-100 justify-content-between">
                            <Card.Title>New Bills</Card.Title>
                            <div>
                                <button className="btn btn-sm btn-info mr-1"
                                        onClick={() => navigate(`/house/${houseId}`, {replace: true})}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="text-white mr-2"/>Back
                                </button>
                                <button className="btn btn-sm btn-light" type="button"
                                        onClick={() => setReload(!reload)}>
                                    <FontAwesomeIcon icon={faRedo} className="text-white mr-2"/>
                                    Reload
                                </button>
                                <DatePicker
                                    selected={date}
                                    onChange={(date) => changeDate('all', 0, date)}
                                    dateFormat="MMM yyyy"
                                    showMonthYearPicker
                                    customInput={<CustomInputForDatePicker/>}
                                />
                            </div>
                        </Card.Header>
                        <hr/>
                        <Card.Body>
                            <Form onSubmit={(event) => submitForm(event)}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Counter start</th>
                                        <th>Counter end</th>
                                        <th>Difference</th>
                                        <th>Tariff</th>
                                        <th>Amount</th>
                                        <th>Comment</th>
                                        <th>Period</th>
                                        <th>x</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(formValues && formValues.length > 0) ? formValues.map((value, index) => (
                                        <tr key={index}>
                                            <td>
                                                <FontAwesomeIcon icon={AccountIcons[value?.accountIcon] ?? faTimes}
                                                                 className="text-warning mr-2"/>{value?.accountName ?? ''}
                                            </td>
                                            <td>
                                                <Input className="input-counter" name={"counterStart-" + index}
                                                       value={value?.counterStart ?? 0} onInput={(e) => onChangeForm(e)}
                                                       type="number" step="1" min="0"/>
                                            </td>
                                            <td>
                                                <Input className="input-counter" name={"counterEnd-" + index}
                                                       value={value?.counterEnd ?? 0} onInput={(e) => onChangeForm(e)}
                                                       type="number" step="1" min="0"/>
                                            </td>
                                            <td className="text-center text-muted">
                                                <span>{value?.counterEnd - value?.counterStart}</span>
                                            </td>
                                            <td className="text-center text-muted">
                                                <Input className="input-counter" value={value?.tariff ?? ''} type="text"
                                                       onInput={(e) => onChangeForm(e)} name={"tariff-" + index}/>
                                            </td>
                                            <td>
                                                <Input className="input-counter" name={"amount-" + index} type="number"
                                                       onInput={(e) => onChangeForm(e)}
                                                       value={value?.amount ?? 0}
                                                       step="0.01" min="0"/>
                                            </td>
                                            <td>
                                                <Input type="text" name={"comment-" + index} value={value.comment}
                                                       maxLength="20"
                                                       onInput={(e) => onChangeForm(e)}/>
                                            </td>
                                            <td className="min">
                                                <div className="d-flex flex-column">
                                                    <DatePicker
                                                        selected={value.dateStart}
                                                        selectsStart
                                                        onChange={(date) => changeDate("dateStart", index, date)}
                                                        startDate={value.dateStart}
                                                        endDate={value.dateEnd}
                                                        dateFormat="MMM yyyy"
                                                        showMonthYearPicker
                                                        customInput={<CustomInputForDatePicker/>}
                                                    />
                                                    <DatePicker
                                                        selected={value.dateEnd}
                                                        selectsEnd
                                                        onChange={(date) => changeDate("dateEnd", index, date)}
                                                        startDate={value.dateStart}
                                                        endDate={value.dateEnd}
                                                        dateFormat="MMM yyyy"
                                                        showMonthYearPicker
                                                        customInput={<CustomInputForDatePicker/>}
                                                    />
                                                </div>
                                            </td>

                                            <td className="min text-right">
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Remove Bill</Tooltip>}
                                                >
                                                    <Button
                                                        className="btn-link btn-xs" type="button"
                                                        onClick={(e) => deleteBill(index)}
                                                        variant="danger"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="text-danger"/>
                                                    </Button>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    )) : null
                                    }
                                    </tbody>
                                </Table>
                                <div className="text-center my-2">
                                    <button type='submit' className="btn btn-success">Submit</button>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>

                </Col>

            </Row>
        </Container>
    )
}