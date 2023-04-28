import React, { Component } from "react";
import LoginDataService from "../Services/LoginDataService";
import NavBar from "./NavBar";
import { withRouter } from './withRouter';
import { faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Home.css';
import logo from '../live-selling-logo.png'


class Home extends Component {
    constructor(props) {
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.submit = this.submit.bind(this);
        this.register = this.register.bind(this);

        this.state = {
            username: "",
            password: "",
            errorMsg: ""
        };

    }

    componentDidMount() {
        if (sessionStorage.getItem('user') !== null) {
            this.props.navigate('/verification');
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    submit() {
        var data = {
            username: this.state.username,
            password: this.state.password
        };
        LoginDataService.loginCheck(data).then(response => {
            if (response.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(response.data))
                this.props.navigate('/verification');
            }
            console.log(response.data);
        }).catch(e => {
            console.log(e);
            if (e.response.status === 404) {
                this.setState({
                    errorMsg: "*Username/Password incorrect"
                });
            }
        });
    }

    register() {
        this.props.navigate('/register');
    }

    render() {
        return (
            <div>
                <div className="body-bg">
                    <section>
                        <div className="color"></div>
                        <div className="color"></div>
                        <div className="color"></div>
                        <div className="box">
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                            <div className="card"></div>
                        </div>
                        <NavBar />
                        <div className="container_">
                            <div className="container mt-3">
                                <div align="center">
                                    <h1><img style={{ height: '50px' }} src={logo} alt="logo"/> Welcome!</h1>
                                    <br />
                                    <div className="text-start" style={{ width: '300px' }}>
                                        <div className="form-group my-2">
                                            <label htmlFor="username">Username:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="username"
                                                required
                                                value={this.state.username}
                                                onChange={this.onChangeUsername}
                                                name="username"
                                            />
                                        </div>
                                        <div className="form-group my-2">
                                            <label htmlFor="password">Password:</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                required
                                                value={this.state.password}
                                                onChange={this.onChangePassword}
                                                name="password"
                                            />
                                        </div>
                                        <button onClick={this.submit} className="btn btn-dark my-2"><FontAwesomeIcon icon={faRightToBracket} /> Sign in</button>
                                        <button onClick={this.register} className="btn btn-outline-dark ms-2"><FontAwesomeIcon icon={faUserPlus} /> Register</button>
                                        {this.state.errorMsg === "" ? null : <p style={{ color: "#ff0000" }}>{this.state.errorMsg}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default withRouter(Home);
