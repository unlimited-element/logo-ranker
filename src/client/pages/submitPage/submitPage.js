import React, { Component } from 'react';
import AuthContext from "../../context/context.js";
import "./submitPage.css";

class SubmitPage extends Component {
    static contextType = AuthContext;

    constructor() {
        super();
        this.content_ref = React.createRef();
        this.state = {
            content: ""
        };
    }

    discardForm = () => {
        this.setState({content: ""});
        this.content_ref.current.value = "";
    }

    //updates form, imports file
    updateFormData = (event) => {
        if (event.target.name === "content") {
            this.setState({content: event.target.value});
        }
    }

    //post/submit a song to server
    postContent = () => {
        console.log("posting content...");

        let postedContent = {
            handle: this.context.usersHandle,
            content: this.state.content
        };

        this.discardForm();

        fetch('http://localhost:8080/postContent', {// postSong { credentials: 'include' } if using cookies and such
            method: 'POST',
            body: JSON.stringify(postedContent),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                console.log("Did not send...");
                throw new Error("Failed...");
            }
            console.log("Status: " + res.status);
            console.log(res);
            console.log("Sent!");
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                { this.context.isLoggedIn &&
                    <div className="submit_form">
                        <div className="form_block">
                            <div className="form_section">
                                <label className="form_label_2" htmlFor="form_content">Content:</label>
                                <input className="input_2" name="content" type="text" id="form_content"
                                    onChange={this.updateFormData} ref={this.content_ref}/>
                            </div>
                        </div>

                        <div className="btns">
                            <button className="btn1" onClick={this.postContent}>Submit</button>
                            <button className="btn2" onClick={this.discardForm}>Discard</button>
                        </div>
                    </div>
                }
                {!this.context.isLoggedIn && <div>Log in to Submit content</div>}
            </div>
        );
    }
}

export default SubmitPage;
