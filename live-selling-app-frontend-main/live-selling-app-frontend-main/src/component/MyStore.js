import { faArchive, faBackwardFast, faCheck, faClipboard, faForwardFast, faListUl, faMagnifyingGlass, faPenToSquare, faPlus, faRefresh, faStepBackward, faStepForward, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dateFormat from 'dateformat';
import React, { Component } from 'react';
import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import Stack from 'react-bootstrap/Stack';
import OrderDataService from '../Services/OrderDataService';
import UserDataService from '../Services/UserDataService';
import NavBar from './NavBar';
import { withRouter } from './withRouter';


class MyStore extends Component {
    constructor(props) {
        super(props);
        this.deleteStream = this.deleteStream.bind(this);
        this.editStream = this.editStream.bind(this);
        this.getOrderList = this.getOrderList.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.searchOrder = this.searchOrder.bind(this);
        this.getStreamList = this.getStreamList.bind(this);


        this.state = {
            currentUser: {
                id: "",
                firstName: "",
                lastName: ""
            },
            streams: [],
            orders: [],
            currentPage: 1,
            itemsPerPage: 5,
            search: ""
        }

    }

    componentDidMount() {
        if (sessionStorage.getItem('user') === null) {
            this.props.navigate('/home');
        } else {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user.isVerified === false) {
                this.props.navigate('/home');
            } else {
                this.setState(function (prevState) {
                    return {
                        currentUser: {
                            ...prevState.currentUser,
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName
                        }
                    }
                });
                this.getStreamList(user.id);
                this.getOrderList(user.id);
            }
        }
    }

    getStreamList(e) {
        UserDataService.getAllUserStreamsPending(e).then(response => {
            this.setState({
                streams: response.data
            });
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
    }

    deleteStream(e) {
        UserDataService.deleteStream(e).then(response => {
            if (response.status === 200) {
                this.setState({
                    streams: this.state.streams.filter(stream => stream.id !== e)
                });
            }
        }).catch(e => { console.log(e) });
    }

    editStream(e) {
        this.props.navigate('/updatestream/' + e);
    }

    getOrderList(e) {
        OrderDataService.getChannelOrdersPendingByUserId(e).then(response => {
            this.setState({
                orders: response.data
            });
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
    }

    updateOrderStatus(e1, e2) {
        OrderDataService.updateOrderStatus(e1, e2).then(response => {
            if (response.status === 200) {
                this.setState({
                    orders: this.state.orders.filter(order => order.id !== e1)
                });
            }
        }).catch(e => { console.log(e) });
    }

    changePage = event => {
        this.setState({
            [event.target.name]: parseInt(event.target.value),
        });
    };

    toFirstPage = () => {
        this.setState({
            currentPage: 1,
        });
    }

    toLastPage = () => {
        const totalPages = Math.ceil(this.state.orders.length / this.state.itemsPerPage);
        this.setState({
            currentPage: totalPages,
        });
    }

    prevPage = () => {
        this.setState({
            currentPage: this.state.currentPage - 1,
        });
    };

    nextPage = () => {
        this.setState({
            currentPage: this.state.currentPage + 1,
        })
    };

    onChangeSearch(e) {
        this.setState({
            search: e.target.value
        });
    }

    searchOrder() {
        var data = {
            search: this.state.search,
        };
        OrderDataService.searchOrder(data, this.state.currentUser.id).then(response => {
            if (response.status === 200) {
                this.setState({
                    orders: response.data,
                });
            }
        }).catch(e => {
            console.log(e);
        });
    }


    render() {
        const { orders, currentPage, itemsPerPage } = this.state;
        const lastIndex = currentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        const currentOrderPage = orders.slice(firstIndex, lastIndex);
        const totalPages = Math.ceil(orders.length / itemsPerPage);
        const pageNumCss = {
            width: "45px",
            border: "1px solid black",
            color: "black",
            textAlign: "center",
            fontWeight: "bold"
        };

        return (
            <div>
                <NavBar />
                <div className="container mt-3">
                    <div className="text-start">
                        <h1>Welcome, {this.state.currentUser.firstName}!</h1>
                        <Stack direction="horizontal" gap={2}>
                            <button onClick={() => this.props.navigate('/productlist')} className="btn btn-dark"><FontAwesomeIcon icon={faClipboard} /> Manage Products</button>
                            <button onClick={() => this.props.navigate('/newstream')} className="btn btn-dark"><FontAwesomeIcon icon={faPlus} /> Add Stream</button>
                        </Stack>
                        <br />
                        <br />
                        <br />
                        <Stack direction="horizontal" gap={2}>
                            <h2 id="scheduled_streams">Scheduled streams: </h2>
                            <button onClick={() => this.getStreamList(this.state.currentUser.id)} className="btn btn-outline-dark"><FontAwesomeIcon icon={faRefresh} /></button>
                            <button onClick={() => this.props.navigate('/newstream')} className="btn btn-outline-dark"><FontAwesomeIcon icon={faPlus} /> Add Stream</button>
                        </Stack>
                        <br />
                        <div className="row">
                            {
                                (this.state.streams.length === 0) ?
                                    <p align="center">No Streams Scheduled</p> :
                                    this.state.streams.map(
                                        (stream, index) => (
                                            <Card className="mx-3" style={{ width: '18rem' }} key={index}>
                                                <Card.Img variant="top" src="" />
                                                <Card.Body>
                                                    <Card.Title>{stream.title}</Card.Title>
                                                    <Card.Text>
                                                        {dateFormat(stream.schedule, "dd-mm-yyyy")}
                                                        <br />
                                                        {dateFormat(stream.schedule, "h:MM TT")}
                                                    </Card.Text>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <Button variant="dark" onClick={() => this.editStream(stream.id)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</Button>
                                                        <Button variant="dark" onClick={() => this.deleteStream(stream.id)}><FontAwesomeIcon icon={faTrashCan} /> Delete</Button>
                                                    </Stack>
                                                </Card.Body>
                                            </Card>
                                        )
                                    )
                            }
                        </div>
                        <br />
                        <br />
                        <br />
                        <div className="d-flex">
                            <div>
                                <Stack direction="horizontal" gap={2}>
                                    <h2 id="outstanding_orders">Outstanding Order List:</h2>
                                    <button onClick={() => this.getOrderList(this.state.currentUser.id)} className="btn btn-outline-dark"><FontAwesomeIcon icon={faRefresh} /></button>
                                    <button onClick={() => this.props.navigate('/vieworderhistory')} className="btn btn-outline-dark"><FontAwesomeIcon icon={faArchive} /> Order History</button>
                                </Stack>
                            </div>
                            <div className="ms-auto">
                                <Stack direction="horizontal" gap={2}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="search"
                                            required
                                            value={this.state.search}
                                            placeholder="Search orders"
                                            onChange={this.onChangeSearch}
                                            name="search"
                                        />
                                    </div>
                                    <button onClick={this.searchOrder} className="btn btn-outline-dark"><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                                </Stack>
                            </div>
                        </div>
                        <br />
                        <table className="table table-striped table-hover" style={{ tableLayout: 'fixed', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Product</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (this.state.orders.length === 0) ?
                                        <tr align="center">
                                            <td colSpan="6">No Orders Available</td>
                                        </tr> :
                                        currentOrderPage.map((order, i) => (
                                            <tr key={i}>
                                                <td className="text-truncate">{order.id}</td>
                                                <td className="text-truncate">{order.user.firstName} {order.user.lastName}</td>
                                                <td className="text-truncate">{dateFormat(order.orderDateTime, "dd-mm-yyyy h:MM TT")}</td>
                                                <td>{order.status}</td>
                                                <td><button className="btn btn-dark ms-2" onClick={() => this.props.navigate('/vieworder/' + order.id)}><FontAwesomeIcon icon={faListUl} /> View</button></td>
                                                <td>
                                                    <div style={{ whiteSpace: 'nowrap' }}>
                                                        <button className="btn btn-dark" onClick={() => this.updateOrderStatus(order.id, "CONFIRMED")}><FontAwesomeIcon icon={faCheck} /> Accept</button>
                                                        <button className="btn btn-dark ms-2" onClick={() => this.updateOrderStatus(order.id, "REJECT")}><FontAwesomeIcon icon={faXmark} /> Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>

                        {
                            orders.length > 0 ? (
                                <Card.Footer>
                                    <div style={{ float: "left" }}>
                                        Showing Page {currentPage} of {totalPages} - Total {this.state.orders.length} orders
                                    </div>
                                    <div style={{ float: "right" }}>
                                        <InputGroup size="sm">
                                            <Button type="button" variant="outline-dark" disabled={currentPage === 1 ? true : false}
                                                onClick={this.toFirstPage}>
                                                <FontAwesomeIcon icon={faBackwardFast} />
                                            </Button>
                                            <Button type="button" variant="outline-dark" disabled={currentPage === 1 ? true : false}
                                                onClick={this.prevPage}>
                                                <FontAwesomeIcon icon={faStepBackward} />
                                            </Button>
                                            <FormControl style={pageNumCss} name="currentPage" value={currentPage}
                                                onChange={this.changePage} />
                                            <Button type="button" variant="outline-dark" disabled={currentPage === totalPages ? true : false}
                                                onClick={this.nextPage}>
                                                <FontAwesomeIcon icon={faStepForward} />
                                            </Button>
                                            <Button type="button" variant="outline-dark" disabled={currentPage === totalPages ? true : false}
                                                onClick={this.toLastPage}>
                                                <FontAwesomeIcon icon={faForwardFast} />
                                            </Button>
                                        </InputGroup>
                                    </div>
                                </Card.Footer>) : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(MyStore);
