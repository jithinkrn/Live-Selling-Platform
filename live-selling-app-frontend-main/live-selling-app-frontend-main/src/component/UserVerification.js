import React, { Component } from 'react';
import UserDataService from '../Services/UserDataService';
import NavBar from './NavBar';
import { withRouter } from './withRouter';

class UserVerification extends Component {
    constructor(props) {
        super(props);
        this.verifyAccount = this.verifyAccount.bind(this);

        this.state = {
            currentUser: {
                id: "",
                firstName: "",
                lastName: "",
                isVerified: null,
            },
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem('user') === null) {
            this.props.navigate('/home');
        } else {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user.isVerified === true) {
                this.props.navigate('/mystore');
            } else {
                this.setState(function (prevState) {
                    return {
                        currentUser: {
                            ...prevState.currentUser,
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            isVerified: user.isVerified
                        }
                    }
                });
            }
        }
    }

    verifyAccount() {
        UserDataService.verifyUser(this.state.currentUser.id).then(response => {
            if (response.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(response.data));
                this.props.navigate('/mystore');
            }
            console.log(response.data);
        }).catch(e => { console.log(e) });
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container mt-3">
                    {
                        (this.state.currentUser.isVerified === 1) ? null :
                            <>
                                <h1>Welcome, {this.state.currentUser.firstName}!</h1>
                                <p>In order to unlock seller features, you have to verify your account</p>
                                <button onClick={this.verifyAccount} className="btn btn-dark">Verify</button>
                            </>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(UserVerification);