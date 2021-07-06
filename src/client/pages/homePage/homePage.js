import React, { Component } from 'react';
import UsersPosts from "../../components/usersPosts/usersPosts.js";
import AuthContext from "../../context/context.js";
import './homePage.css';

class HomePage extends Component { //export default
    static contextType = AuthContext;

    constructor() {
        super();
        this.fullName_ref = React.createRef();
        this.email_ref = React.createRef();
        this.reg_handle_ref = React.createRef();
        this.reg_pass_ref = React.createRef();
        this.login_handle_ref = React.createRef();
        this.login_pass_ref = React.createRef();
        this.state = {
            fullName: "",
            email: "",
            reg_handle: "",
            reg_pass: "",
            login_handle: "",
            login_pass: "",
            showReg: true,
            errorStatus: "",
            validStatus: "",
            usersPosts: []
        };
    }

    componentDidMount() {
        if (this.context.isLoggedIn) {
            this.getUsersPosts();
        }
    }

    reset_validStatus = () => {
        this.setState({validStatus: ""});
    }

    validateName = (name) => {
        if (!name || name.indexOf(" ") < 0) {
            return "You need to submit your first and last name.";
        } else {
            let names = [name.substr(0, name.indexOf(' ')), name.substr(name.indexOf(' ')+1)];
            if (names[0].length < 2 || names[1].length < 2) {
                return "That does not look like your full name...";
            } else if (!names[0].match(/^[a-z]+$/i) || !names[1].match(/^[a-z\s]+$/i)) {
                return "Your name should only contain letters...";
            }
            return "";
        }
    };

    validateEmail = (email) => {
        let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        if (!email.match(regex)) {
            return "Not a valid Email";
        }
        return "";
    }

    validatePassword = (password) => {
        if (!password || password.length < 8) {
            return "Password length must be > 7 characters";
        } else if (!password.match(/[0-9]/i)) {
            return "Password must contain a number";
        } else if (!password.match(/[a-z]/)) {
            return "Password must contain a lowercase letter";
        } else if (!password.match(/\@|\!|\#|\$|\%|\^/i)) {
            return "Password must contain @, !, #, $, % or ^";
        } else if (!password.match(/[A-Z]/)) {
            return "Password must contain an uppercase letter";
        }
        return "";
    }

    validateHandle = (handle) => {
        this.setState({validStatus: ""});
        if (!handle || handle.length <= 3 || handle.length >= 16) {
            return "Handle length must be > 3 and < 16 characters";
        } else if (!handle.match(/^[a-z0-9]+$/i)) {
            return "Handle can only contain letters and numbers";
        } else {
            fetch(`http://localhost:8080/validateHandle${handle}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 409) {
                    console.log("Handle is already taken");
                    this.setState({errorStatus: "Handle is already taken"});
                } else if (res.status !== 200 && res.status !== 201) {
                    console.log("Did not send...");
                    throw new Error("Failed...");
                } else {
                    this.setState({validStatus: "Valid Handle"});
                }
            }).catch(err => {
                console.log(err);
            });
        }
    };

    //updates form, imports file
    updateFormData = (event) => {
        if (event.target.name === "fullName") {
            this.setState({fullName: event.target.value});
            this.setState({errorStatus: this.validateName(event.target.value)});
        } else if (event.target.name === "email") {
            this.setState({email: event.target.value});
            this.setState({errorStatus: this.validateEmail(event.target.value)});
        } else if (event.target.name === "reg_handle") {
            this.setState({reg_handle: event.target.value});
            this.setState({errorStatus: this.validateHandle(event.target.value)});
        } else if (event.target.name === "reg_pass") {
            this.setState({reg_pass: event.target.value});
            this.setState({errorStatus: this.validatePassword(event.target.value)});
        } else if (event.target.name === "login_handle") {
            this.setState({login_handle: event.target.value});
        } else if (event.target.name === "login_pass") {
            this.setState({login_pass: event.target.value});
        }
    }

    getUsersPosts = () => {
        console.log("Trying to get " + this.context.usersHandle + " posts...");
        fetch(`http://localhost:8080/getUsersPosts${this.context.usersHandle}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed...");
            }
            return res.json();
        }).then(data => {
            console.log("got data");
            console.log(data.posts);
            this.setState({usersPosts: data.posts});
        }).catch(err => {
            console.log(err);
        });
    }

    onRegister = () => {
        let postedContent = {
            fullName: this.state.fullName,
            email: this.state.email,
            handle: this.state.reg_handle,
            password: this.state.reg_pass
        };

        fetch('http://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify(postedContent),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                console.log("Did not send...");
                throw new Error("Failed...");
            } else {
                console.log("Status: " + res.status);
                console.log("Sent!");
                this.setState({validStatus: "Successfully registered, you can now login"});
                setTimeout(this.reset_validStatus, 5000);
                this.fullName_ref.current.value = "";
                this.email_ref.current.value = "";
                this.reg_handle_ref.current.value = "";
                this.reg_pass_ref.current.value = "";
            }
        }).catch(err => {
            console.log(err);
        });
    }

    onLogin = () => {
        let postedContent = {
            handle: this.state.login_handle,
            password: this.state.login_pass
        };

        fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify(postedContent),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 201 && res.status !== 409) {
                throw new Error("Failed...");
            }
            return res.json();
        }).then(data => {
            if (data.error) {
                this.setState({errorStatus: "Wrong Username or Password"});
            } else {
                this.context.setUsersCreds(data.creds.name, data.creds.email, data.creds.handle);
                this.login_handle_ref.current.value = "";
                this.login_pass_ref.current.value = "";
                this.setState({errorStatus: ""});
                this.setState({validStatus: "Successfully logged in"});
                this.context.updateLoggedIn(true);
                setTimeout(this.reset_validStatus, 5000);
                this.getUsersPosts();
            }
        }).catch(err => {
            console.log(err);
        });
    }

    logout = () => {
        this.context.updateLoggedIn(false);
    }

    toggleRegister = () => {
        this.setState({showReg: true});
        this.setState({errorStatus: ""});
        this.setState({validStatus: ""});
    }

    toggleLogin = () => {
        this.setState({showReg: false});
        this.setState({errorStatus: ""});
        this.setState({validStatus: ""});
    }

    onSubmit = () => {
        if (this.state.showReg && (this.state.errorStatus || !this.fullName_ref.current.value ||
            !this.email_ref.current.value || !this.reg_handle_ref.current.value ||
            !this.reg_pass_ref.current.value) ) {
            this.setState({errorStatus: "Form is invalid"});
        } else {
            if (this.state.showReg) {
                this.onRegister();
            } else {
                this.onLogin();
            }
        }
    }

    render() {
        return (
            <div>

                <div id="errorStatus">{this.state.errorStatus}</div>
                <div id="validStatus">{this.state.validStatus}</div>

                <div className="content_container">
                    <div className="title_and_regLogin_btns">
                        {!this.context.isLoggedIn &&
                            <h1 className="homePage_title">Just A Simple React App</h1>
                        }
                        {!this.context.isLoggedIn &&
                            <div className="reg_login_btns">
                                <button id="reg_btn" onClick={this.toggleRegister}>Register</button>
                                <button id="login_btn" onClick={this.toggleLogin}>Login</button>
                                <button id="submit_btn" onClick={this.onSubmit}>Submit</button>
                            </div>
                        }
                    </div>

                    {this.context.isLoggedIn &&
                        <div id="profile_header">
                            <div id="profile_creds">{"Name: " + this.context.usersName + ", Email: " + this.context.usersEmail + ", Handle: " + this.context.usersHandle}</div>
                            <button id="logout_btn" onClick={this.logout}>Logout</button>
                        </div>
                    }

                    {!this.context.isLoggedIn &&
                        <div className="homePage_forms">
                            {this.state.showReg &&
                                <div id="register_form">
                                        <div className="form_section">
                                            <label className="form_label" htmlFor="fullName">Full Name:</label>
                                            <input className="input_feild" name="fullName" type="text" id="fullName"
                                                onChange={this.updateFormData} ref={this.fullName_ref}/>
                                        </div>
                                        <div className="form_section">
                                            <label className="form_label" htmlFor="email">Email:</label>
                                            <input className="input_feild" name="email" type="text" id="email"
                                                onChange={this.updateFormData} ref={this.email_ref}/>
                                        </div>
                                        <div className="form_section">
                                            <label className="form_label" htmlFor="reg_handle">Handle:</label>
                                            <input className="input_feild" name="reg_handle" type="text" id="reg_handle"
                                                onChange={this.updateFormData} ref={this.reg_handle_ref}/>
                                        </div>
                                        <div className="form_section">
                                            <label className="form_label" htmlFor="reg_pass">Password:</label>
                                            <input className="input_feild" name="reg_pass" type="password" id="reg_pass"
                                                onChange={this.updateFormData} ref={this.reg_pass_ref}/>
                                        </div>
                                </div>
                            }

                            {!this.state.showReg &&
                                <div id="login_form">
                                        <div className="form_section">
                                            <label className="form_label" htmlFor="login_handle">Handle:</label>
                                            <input className="input_feild" name="login_handle" type="text" id="login_handle"
                                                onChange={this.updateFormData} ref={this.login_handle_ref}/>
                                        </div>
                                        <div className="form_section">
                                            <label className="form_label" htmlFor="login_pass">Password:</label>
                                            <input className="input_feild" name="login_pass" type="password" id="login_pass"
                                                onChange={this.updateFormData} ref={this.login_pass_ref}/>
                                        </div>
                                </div>
                            }
                        </div>
                    }
                </div>

                {this.context.isLoggedIn &&
                    <div>
                        {this.state.usersPosts.length === 0
                            ? <h3>You have not submitted any Content</h3>
                            : <UsersPosts posts={this.state.usersPosts}/>
                        }
                    </div>
                }

            </div>
        );
    }
}

export default HomePage;

/*
console.time('benchmark');
//any code here, this tests time it takes to run code
console.timeEnd('benchmark');


*/
