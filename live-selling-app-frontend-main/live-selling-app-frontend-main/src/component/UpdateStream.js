import React, { Component } from 'react';
import UserDataService from '../Services/UserDataService';
import { withRouter } from './withRouter';
import moment from "moment";
import NavBar from './NavBar';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class UpdateStream extends Component {
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
            currentStream: {
                id: "",
                title: "",
                tempSchedule: ""
            }
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
            UserDataService.selectStream(this.props.params.streamid).then(response => {
                if (response.status === 200) {
                    this.setState(function (prevState) {
                        return {
                            currentStream: {
                                ...prevState.currentStream,
                                id: response.data.id,
                                title: response.data.title,
                                tempSchedule: moment(response.data.schedule).format("YYYY-MM-DDTHH:mm")
                            }
                        }
                    });
                    console.log(response.data);
                }
            }).catch(e => {
                console.log(e);
            });
        }
    }

    onChangeTitle(e) {
        this.setState(function (prevState) {
            return {
                currentStream: {
                    ...prevState.currentStream,
                    title: e.target.value
                }
            }
        });
    }

    onChangeSchedule(e) {
        this.setState(function (prevState) {
            return {
                currentStream: {
                    ...prevState.currentStream,
                    tempSchedule: e.target.value.toString()
                }
            }
        });
    }

    submit() {
        if (this.state.currentStream.tempSchedule !== "" && this.state.currentStream.title !== "") {
            UserDataService.editStream(this.state.currentStream.id, this.state.currentStream).then(response => {
                if (response.status === 200) {
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
                        <h2>Edit Stream</h2>
                        <br />
                        <div className="mb-3">
                            <label htmlFor="Title">Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                required
                                value={this.state.currentStream.title}
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
                                value={this.state.currentStream.tempSchedule}
                                onChange={this.onChangeSchedule}
                                name="tempSchedule"
                            />
                        </div>
                        <button onClick={this.submit} className="btn btn-dark">
                            Edit Stream
                        </button>
                        <button className="btn btn-outline-dark ms-2" onClick={() => this.props.navigate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UpdateStream);