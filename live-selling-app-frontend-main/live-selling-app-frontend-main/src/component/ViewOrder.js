import { faCheck, faXmark, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import Stack from 'react-bootstrap/Stack';
import OrderDataService from '../Services/OrderDataService';
import NavBar from './NavBar';
import { withRouter } from './withRouter';

class ViewOrder extends Component {
    constructor(props) {
        super(props);
        this.retrieveOrderProducts = this.retrieveOrderProducts.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.getTotalOrderCost = this.getTotalOrderCost.bind(this);

        this.state = {
            currentUser: {
                id: "",
                firstName: "",
                lastName: ""
            },
            orderProducts: [],
            currentOrder: {
                id: "",
                customerName: "",
                status: "",
            },
            totalCost: 0
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
            this.retrieveOrderProducts(this.props.params.orderid);
            OrderDataService.getOrderById(this.props.params.orderid).then(response => {
                this.setState(function (prevState) {
                    return {
                        currentOrder: {
                            ...prevState.currentOrder,
                            id: response.data.id,
                            customerName: response.data.user.firstName + " " + response.data.user.lastName,
                            status: response.data.status
                        }
                    }
                });
                console.log(response.data);
            }).catch(e => {
                console.log(e);
            });
        }
    }

    retrieveOrderProducts(e) {
        OrderDataService.getProductsInOrder(e)
            .then(response => {
                this.setState({
                    orderProducts: response.data
                });
                this.getTotalOrderCost(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    getTotalOrderCost(e) {
        let cost = 0;
        for (let i = 0; i < e.length; i++) {
            cost += e[i].quantity * e[i].product.price;
        }
        this.setState({
            totalCost: cost
        });
    }

    updateOrderStatus(e1, e2) {
        OrderDataService.updateOrderStatus(e1, e2).then(response => {
            if (response.status === 200) {
                this.props.navigate('/mystore');
            }
        }).catch(e => { console.log(e) });
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container mt-3">
                    <div className="text-start">
                        <h2>List Of Ordered Products:</h2>
                        <p>Order ID: {this.state.currentOrder.id}</p>
                        <p>Customer: {this.state.currentOrder.customerName}</p>
                        <p>Total Cost: S${this.state.totalCost.toFixed(2)}</p>
                        <br />
                        <div className="d-flex mb-3">
                            <div>
                                <button className="btn btn-outline-dark" onClick={() => this.props.navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                            </div>
                            <div className="ms-auto">
                                {
                                    (this.state.currentOrder.status === "CONFIRMED") ? null :
                                        <Stack direction="horizontal" gap={2}>
                                            <button onClick={() => this.updateOrderStatus(this.state.currentOrder.id, "CONFIRMED")} className="btn btn-outline-dark"><FontAwesomeIcon icon={faCheck} /> Accept</button>
                                            <button onClick={() => this.updateOrderStatus(this.state.currentOrder.id, "REJECT")} className="btn btn-outline-dark"><FontAwesomeIcon icon={faXmark} /> Reject</button>
                                        </Stack>
                                }
                            </div>
                        </div>

                        <table className="table table-striped" style={{ tableLayout: 'fixed', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    {/* <th>Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.orderProducts.length === 0) ?
                                    <tr align="center">
                                        <td colSpan="5">No Products Available</td>
                                    </tr> :
                                    this.state.orderProducts.map((item, i) => (
                                        <tr key={i}>
                                            <td className="text-truncate">{item.product.name}</td>
                                            <td>{item.product.category}</td>
                                            <td className="text-truncate">{item.product.description}</td>
                                            <td>S${item.product.price.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            {/* <td>
                                        <div style={{ whiteSpace: 'nowrap' }}>
                                            <button className="btn btn-dark" onClick={() => this.updateProduct(item.id)}>Update</button>
                                            <button className="btn btn-dark ms-2" onClick={() => this.deleteProduct(item.id)}>Remove</button>
                                        </div>
                                    </td> */}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                        <button className="btn btn-outline-dark" onClick={() => this.props.navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ViewOrder);