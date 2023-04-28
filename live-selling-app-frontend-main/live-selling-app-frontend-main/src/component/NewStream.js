import React, { Component } from 'react';
import UserDataService from '../Services/UserDataService';
import NavBar from './NavBar';
import { withRouter } from './withRouter';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from "moment";

class NewStream extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeSchedule = this.onChangeSchedule.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            currentUser: {
                id: "",
                firstName: "",
                lastName: ""
            },
            stream: {
                title: "",
                tempSchedule: "",
            },
            errorMsg: ""
        };
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
        }
    }

    onChangeTitle(e) {
        this.setState(function (prevState) {
            return {
                stream: {
                    ...prevState.stream,
                    title: e.target.value
                }
            }
        });
    }

    onChangeSchedule(e) {
        if (moment(e.target.value).isAfter(moment().format("YYYY-MM-DDTHH:mm"))) {
            this.setState(function (prevState) {
                return {
                    stream: {
                        ...prevState.stream,
                        tempSchedule: e.target.value.toString()
                    }
                }
            });
            this.setState({
                errorMsg: ""
            });
        } else {
            this.setState({
                errorMsg: "*Stream schedule cannot be in the past"
            });
        }
        
    }

    submit() {
        if (this.state.stream.tempSchedule !== "" && this.state.stream.title !== "") {
            UserDataService.addNewStream(this.state.currentUser.id, this.state.stream).then(response => {
                if (response.status === 201) {
                    this.props.navigate('/mystore');
                }
            }).catch(e => {
                console.log(e);
            });
        }

    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container mt-3">
                    <div className="text-start">
                        <h2>Add New Stream</h2>
                        {this.state.errorMsg === null ? <br /> : <p style={{ color: "#ff0000", whiteSpace: "pre-line" }}>{this.state.errorMsg}</p>}
                        <div className="mb-3">
                            <label htmlFor="Title">Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                required
                                value={this.state.stream.title}
                                onChange={this.onChangeTitle}
                                name="title"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="schedule">Schedule:</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="tempSchedule"
                                required
                                value={this.state.stream.tempSchedule}
                                onChange={this.onChangeSchedule}
                                name="tempSchedule"
                            />
                        </div>
                        <button onClick={this.submit} className="btn btn-dark">
                            Add Stream
                        </button>
                        <button className="btn btn-outline-dark ms-2" onClick={() => this.props.navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(NewStream);