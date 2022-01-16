import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, Container, Row} from "react-bootstrap";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {toast, ToastContainer} from "react-toastify";
import {fetchStatistics, getValueWithCurrency} from "../context/bill/BillService";
import {configForColoredToast} from "../context/global/Configs";

export const StatisticsPage = () => {
    const initialYear = new Date().getFullYear();
    const userId = localStorage.getItem('userId');
    const statisticsRef = useRef();
    const [dataForAllHousesChart, setDataForAllHousesChart] = useState();
    const [yearForAllHousesChart, setYearForAllHousesChart] = useState(initialYear);
    const [yearsForHouseCharts, setYearsForHouseCharts] = useState();
    const [dataForHouseCharts, setDataForHouseCharts] = useState();

    useEffect(() => {
        let abortController = new AbortController();
        fetchStatistics(userId, yearForAllHousesChart, {signal: abortController.signal})
            .then(response => {
                if (!response.data || response.data.length < 1) {
                    toast.warning('No data for statistics', configForColoredToast);
                    return;
                }
                const receivedData = generateDataForAllHousesChart(response.data);
                statisticsRef.current = response.data;
                setDataForAllHousesChart(receivedData);

                if (!yearsForHouseCharts) {
                    let newYears = {};
                    response.data.map(item => newYears[item.house.name] = initialYear);
                    setYearsForHouseCharts(newYears);
                }

            })
            .catch(error => {
                if (!abortController.signal.aborted) {
                    toast.error(error, configForColoredToast);
                }
            })
        return () => {
            abortController.abort();
        }
    }, [yearForAllHousesChart]);

    useEffect(() => {
        if (yearsForHouseCharts) {
            // Initial data Load for house charts
            if (!yearsForHouseCharts.currentChangesOn) {
                let array = [];
                let data = null;
                let dataPie = null;
                Object.keys(dataForAllHousesChart[0]).forEach(houseName => {
                    if (houseName !== 'name') {
                        data = generateDataForAllHousesChart(statisticsRef.current, houseName);
                        dataPie = convertStatisticsToPieChartData(statisticsRef.current, houseName);
                        array.push({houseName, data, dataPie});
                    }

                });
                setDataForHouseCharts(array);
            }
            // Load data for current house chart
            else {
                const houseName = yearsForHouseCharts.currentChangesOn;
                const year = yearsForHouseCharts[houseName];
                let abortController = new AbortController();
                fetchStatistics(userId, year, {signal: abortController.signal})
                    .then(response => {
                        const receivedData = generateDataForAllHousesChart(response.data, houseName);
                        const receivedDataPie = convertStatisticsToPieChartData(response.data, houseName);
                        let newData = [...dataForHouseCharts];

                        newData.forEach(item => {
                            if (item.houseName === houseName) {
                                item.data = receivedData;
                                item.dataPie= receivedDataPie;
                            }
                        })
                        setDataForHouseCharts(newData);
                    })
                    .catch(error => {
                        if (!abortController.signal.aborted) {
                            toast.error(error, configForColoredToast);
                        }
                    })
            }
        }
    }, [yearsForHouseCharts])

    function generateDataForAllHousesChart(statisticsArray, houseName) {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let data = [];
        for (let i = 0; i < 12; i++) {
            let dataItem = {};
            dataItem['name'] = months[i];
            statisticsArray.forEach(stat => {
                if (houseName) {
                    if (stat.house.name === houseName) {
                        dataItem[stat.house.name] = 0;
                        stat.dataList.forEach(item => {
                            dataItem[stat.house.name] += item.billsAmountsByMonth[i];
                        });
                    }
                } else {
                    dataItem[stat.house.name] = 0;
                    stat.dataList.forEach(item => {
                        dataItem[stat.house.name] += item.billsAmountsByMonth[i];
                    });
                }
            })
            data.push(dataItem);
        }
        return data;
    }

    function convertStatisticsToPieChartData(statisticsArray, houseName) {
        let statisticsItem = statisticsArray.find(item => item.house.name === houseName);
        let array = [];
        let data = null;
        if (statisticsItem) {
            statisticsItem.dataList.forEach((accountItem, index) => {
                let amount = 0;
                accountItem.billsAmountsByMonth.forEach(value => {
                    amount += value;
                })
                data = {name: accountItem.account.name, value: amount, color: COLORS[index] ?? randomColor()};
                array.push(data);
            })
        }
        return array;
    }

    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Container>
            <ToastContainer/>
            {
                dataForAllHousesChart && dataForAllHousesChart.length > 0
                    ? (
                        <Row>
                            <Col className="col-12">
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h4">Total Amount of Bills for All Houses</Card.Title>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="card-category">By Month</p>
                                            <div className="d-flex">
                                                <button className="btn btn-sm btn-info" type="button"
                                                        onClick={() => {
                                                            setYearForAllHousesChart(yearForAllHousesChart - 1)
                                                        }}
                                                >
                                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                                </button>
                                                <span className="mx-2">{yearForAllHousesChart}</span>
                                                <button className="btn btn-sm btn-info" type="button"
                                                        onClick={() => {
                                                            setYearForAllHousesChart(yearForAllHousesChart + 1)
                                                        }}
                                                ><FontAwesomeIcon icon={faArrowRight}/>
                                                </button>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body style={{height: '450px'}}>

                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={dataForAllHousesChart}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="name"/>
                                                <YAxis/>
                                                {/*<Tooltip />*/}
                                                <Legend/>
                                                {Object.keys(dataForAllHousesChart[0]).map((item, index) => (
                                                    item === 'name' ? null :
                                                        <Bar key={index} dataKey={item} stackId={index}
                                                             fill={COLORS[index] ?? randomColor()}/>
                                                ))}

                                                {/*<Bar dataKey="house_2" stackId="b" fill="#82ca9d" />*/}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )
                    : null
            }
            {
                dataForHouseCharts && dataForHouseCharts.length > 0
                    ? dataForHouseCharts.map((item, index) => (
                        <Row key={`chart-group-${item.houseName}-${index}`}>
                            <Col className="col-12 col-md-7">
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h4">Total Amount:<br />{item.houseName}</Card.Title>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="card-category">By Month</p>
                                            <div className="d-flex">
                                                <button className="btn btn-sm btn-info" type="button"
                                                        onClick={() => {
                                                            setYearsForHouseCharts({
                                                                ...yearsForHouseCharts,
                                                                [item.houseName]: yearsForHouseCharts[item.houseName] - 1,
                                                                currentChangesOn: item.houseName
                                                            })
                                                        }}
                                                >
                                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                                </button>
                                                <span className="mx-2">
                                                        {yearsForHouseCharts && yearsForHouseCharts[item.houseName]
                                                            ? yearsForHouseCharts[item.houseName] : '0'}
                                                    </span>
                                                <button className="btn btn-sm btn-info" type="button"
                                                        onClick={() => {
                                                            setYearsForHouseCharts({
                                                                ...yearsForHouseCharts,
                                                                [item.houseName]: yearsForHouseCharts[item.houseName] + 1,
                                                                currentChangesOn: item.houseName
                                                            })
                                                        }}
                                                >
                                                    <FontAwesomeIcon icon={faArrowRight}/>
                                                </button>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex" style={{height: '300px'}}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    width={500}
                                                    height={400}
                                                    data={item.data}
                                                    margin={{
                                                        top: 10,
                                                        right: 30,
                                                        left: 0,
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3"/>
                                                    <XAxis dataKey="name"/>
                                                    <YAxis/>
                                                    {/*<Tooltip />*/}
                                                    <Area type="monotone" dataKey={item.houseName} stroke="#8884d8"
                                                          fill="#8884d8"/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>


                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-12 col-md-5">
                                <Card>
                                    <Card.Header>
                                        <Card.Title as="h4">Total Amount per Year:<br />{item.houseName}</Card.Title>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="card-category">By Account</p>
                                            <div className="d-flex">
                                                <button className="btn btn-sm btn-info" type="button"
                                                        onClick={() => {
                                                            setYearsForHouseCharts({
                                                                ...yearsForHouseCharts,
                                                                [item.houseName]: yearsForHouseCharts[item.houseName] - 1,
                                                                currentChangesOn: item.houseName
                                                            })
                                                        }}
                                                >
                                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                                </button>
                                                <span className="mx-2">
                                                        {yearsForHouseCharts && yearsForHouseCharts[item.houseName]
                                                            ? yearsForHouseCharts[item.houseName] : '0'}
                                                    </span>
                                                <button className="btn btn-sm btn-info" type="button"
                                                        onClick={() => {
                                                            setYearsForHouseCharts({
                                                                ...yearsForHouseCharts,
                                                                [item.houseName]: yearsForHouseCharts[item.houseName] + 1,
                                                                currentChangesOn: item.houseName
                                                            })
                                                        }}
                                                >
                                                    <FontAwesomeIcon icon={faArrowRight}/>
                                                </button>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex flex-column">
                                            <div style={{height: '236px'}}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart width={400} height={400}>
                                                        <Pie
                                                            data={item.dataPie}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={renderCustomizedLabel}
                                                            outerRadius={100}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {item.dataPie.map((entry, index) => (
                                                                <Cell key={`cell-${index}`}
                                                                      fill={entry.color}/>
                                                            ))}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <ul className="list-unstyled">
                                                {item.dataPie.map((entry, index) => (
                                                    <li className="d-flex align-items-center" key={index}>
                                                        <div className="chart-icon-list mr-2"
                                                             style={{backgroundColor: entry.color}}/>
                                                        {entry.name}:
                                                        <span className="ml-2">{getValueWithCurrency(entry.value.toFixed(2))}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))
                    : null
            }
        </Container>
    )
}