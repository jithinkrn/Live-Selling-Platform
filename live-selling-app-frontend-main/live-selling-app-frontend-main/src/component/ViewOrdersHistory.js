import { faBackwardFast, faChevronLeft, faForwardFast, faListUl, faStepBackward, faStepForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dateFormat from 'dateformat';
import React, { Component } from 'react';
import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import OrderDataService from '../Services/OrderDataService';
import NavBar from './NavBar';
import { withRouter } from './withRouter';

class ViewOrdersHistory extends Component {
    constructor(props) {
        super(props);
        this.retrieveOrderProductsHistory = this.retrieveOrderProductsHistory.bind(this);

        this.state = {
            currentUser: {
                id: "",
                firstName: "",
                lastName: ""
            },
            orders: [],
            currentPage: 1,
            itemsPerPage: 10
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem('user') === null) {
            this.props.navigate('/home');
        } else {
            const user = JSON.parse(sessionStorage.getItem('user'));
            this.setState(function (prevState) {
                return {
                    currentUser: {
                        ...prevState.currentUser,
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName
                    },
                    orderId: this.props.params.orderid,
                }
            });
            this.retrieveOrderProductsHistory(user.id);
        }
    }

    retrieveOrderProductsHistory(e) {
        OrderDataService.getChannelOrdersHistory(e)
            .then(response => {
                this.setState({
                    orders: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
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
                        <h2>Orders History:</h2>
                        <br />
                        <div className="d-flex mb-3">
                            <div>
                                <button className="btn btn-outline-dark" onClick={() => this.props.navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                            </div>
                        </div>

                        <table className="table table-striped table-hover" style={{ tableLayout: 'fixed', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Product</th>
                                    {/* <th>Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (this.state.orders.length === 0) ?
                                        <tr align="center">
                                            <td colSpan="5">No Orders Available</td>
                                        </tr> :
                                        currentOrderPage.map((order, i) => (
                                            <tr key={i}>
                                                <td className="text-truncate">{order.id}</td>
                                                <td className="text-truncate">{order.user.firstName} {order.user.lastName}</td>
                                                <td className="text-truncate">{dateFormat(order.orderDateTime, "dd-mm-yyyy h:MM TT")}</td>
                                                <td>{order.status}</td>
                                                <td><button className="btn btn-dark ms-2" onClick={() => this.props.navigate('/vieworder/' + order.id)}><FontAwesomeIcon icon={faListUl} /> View</button></td>
                                                {/* <td>
                                            <div style={{ whiteSpace: 'nowrap' }}>
                                                <button className="btn btn-dark" onClick={() => this.updateOrderStatus(order.id, "CONFIRMED")}>Accept</button>
                                                <button className="btn btn-dark ms-2" onClick={null}>Reject</button>
                                            </div>
                                        </td> */}
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

export default withRouter(ViewOrdersHistory);