import React, { Component } from "react";
import ProductDataService from "../Services/ProductDataService"
import { withRouter } from "./withRouter";
import { Card, InputGroup, FormControl, Button } from "react-bootstrap";
import { faStepBackward, faStepForward, faBackwardFast, faForwardFast, faSort, faMagnifyingGlass, faRefresh, faPlus, faPenToSquare, faTrashCan, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Stack from 'react-bootstrap/Stack';
import NavBar from "./NavBar";

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.retrieveProducts = this.retrieveProducts.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.sortByProductName = this.sortByProductName.bind(this);
        this.sortByProductCat = this.sortByProductCat.bind(this);
        this.sortByProductPrice = this.sortByProductPrice.bind(this);
        this.sortByProductQty = this.sortByProductQty.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.searchProduct = this.searchProduct.bind(this);

        this.state = {
            currentUser: {
                id: "",
                firstName: "",
                lastName: ""
            },
            products: [],
            sorted: "ascending",
            currentPage: 1,
            productsPerPage: 5,
            search: ""
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
                    }
                }
            });
            this.retrieveProducts(user.id);
        }
    }

    retrieveProducts(e) {
        ProductDataService.getProductsByUserId(e)
            .then(response => {
                this.setState({
                    products: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateProduct(p) {
        this.props.navigate('/updateproduct/' + p);
    }

    deleteProduct(e) {
        ProductDataService.deleteProduct(e).then(response => {
            if (response.status === 200) {
                this.setState({
                    products: this.state.products.filter(product => product.id !== e)
                });
            }
        }).catch(e => { console.log(e) });
    }

    sortByProductName() {
        ProductDataService.getProductsByUserIdSorted(this.state.currentUser.id, this.state.sorted).then(response => {
            if (response.status === 200) {
                this.setState({
                    products: response.data,
                    sorted: this.state.sorted === "descending" ? "ascending" : "descending"
                });
                console.log(response.data);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    sortByProductCat() {
        ProductDataService.getProductsByUserIdCatSorted(this.state.currentUser.id, this.state.sorted).then(response => {
            if (response.status === 200) {
                this.setState({
                    products: response.data,
                    sorted: this.state.sorted === "descending" ? "ascending" : "descending"
                });
                console.log(response.data);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    sortByProductPrice() {
        ProductDataService.getProductsByUserIdPriceSorted(this.state.currentUser.id, this.state.sorted).then(response => {
            if (response.status === 200) {
                this.setState({
                    products: response.data,
                    sorted: this.state.sorted === "descending" ? "ascending" : "descending"
                });
                console.log(response.data);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    sortByProductQty() {
        ProductDataService.getProductsByUserIdQtySorted(this.state.currentUser.id, this.state.sorted).then(response => {
            if (response.status === 200) {
                this.setState({
                    products: response.data,
                    sorted: this.state.sorted === "descending" ? "ascending" : "descending"
                });
                console.log(response.data);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    onChangeSearch(e) {
        this.setState({
            search: e.target.value
        });
    }

    searchProduct() {
        var data = {
            search: this.state.search,
        };
        ProductDataService.searchProduct(data, this.state.currentUser.id).then(response => {
            if (response.status === 200) {
                this.setState({
                    products: response.data,
                });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    changePage = event => {
        this.setState({
            [event.target.name]: parseInt(event.target.value),
        });
    }

    toFirstPage = () => {
        this.setState({
            currentPage: 1,
        });
    }

    toLastPage = () => {
        const totalPages = Math.ceil(this.state.products.length / this.state.productsPerPage);
        this.setState({
            currentPage: totalPages,
        });
    }

    prevPage = () => {
        this.setState({
            currentPage: this.state.currentPage - 1,
        });
    }

    nextPage = () => {
        this.setState({
            currentPage: this.state.currentPage + 1,
        })
    }

    render() {
        const { products, currentPage, productsPerPage } = this.state;
        const lastIndex = currentPage * productsPerPage;
        const firstIndex = lastIndex - productsPerPage;
        const currentProducts = products.slice(firstIndex, lastIndex);
        const totalPages = Math.ceil(products.length / productsPerPage);
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
                        <h2>List Of Products: </h2>
                        <br/>
                        <div className="d-flex mb-3">
                            <div>
                                <button className="btn btn-outline-dark" onClick={() => this.props.navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                            </div>
                            <div className="ms-auto">
                                <Stack direction="horizontal" gap={2}>
                                    <button onClick={() => this.retrieveProducts(this.state.currentUser.id)} className="btn btn-outline-dark"><FontAwesomeIcon icon={faRefresh} /></button>
                                    <button onClick={() => this.props.navigate('/addproduct')} className="btn btn-outline-dark"><FontAwesomeIcon icon={faPlus} /> Add Product</button>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="search"
                                            required
                                            value={this.state.search}
                                            placeholder="Search products"
                                            onChange={this.onChangeSearch}
                                            name="search"
                                        />
                                    </div>
                                    <button onClick={this.searchProduct} className="btn btn-outline-dark"><FontAwesomeIcon icon={faMagnifyingGlass} /> Search</button>
                                </Stack>
                            </div>
                        </div>
                        <table className="table table-striped" style={{ tableLayout: 'fixed', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead className="table-dark">
                                <tr>
                                    <th onClick={this.sortByProductName}>Name <FontAwesomeIcon icon={faSort} /></th>
                                    <th onClick={this.sortByProductCat}>Category <FontAwesomeIcon icon={faSort} /></th>
                                    <th>Description</th>
                                    <th onClick={this.sortByProductPrice}>Price <FontAwesomeIcon icon={faSort} /></th>
                                    <th onClick={this.sortByProductQty}>Quantity <FontAwesomeIcon icon={faSort} /></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products.length === 0 ?
                                        <tr align="center">
                                            <td colSpan="6">No Products Available</td>
                                        </tr> :
                                        currentProducts.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td>{item.description}</td>
                                                <td>S${item.price.toFixed(2)}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    <Stack direction="horizontal" gap={2}>
                                                        <button className="btn btn-dark" onClick={() => this.updateProduct(item.id)}><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                                                        <button className="btn btn-dark" onClick={() => this.deleteProduct(item.id)}><FontAwesomeIcon icon={faTrashCan} /> Delete</button>
                                                    </Stack>
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>

                        {products.length > 0 ? (
                            <Card.Footer>
                                <div style={{ float: "left" }}>
                                    Showing Page {currentPage} of {totalPages} - Total {this.state.products.length} products
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
                            </Card.Footer>) : null}
                    </div>
                </div>
            </div>


        );
    }
}
export default withRouter(ProductList);


