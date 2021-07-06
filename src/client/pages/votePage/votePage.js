import React, { Component } from 'react';
import VoteList from '../../components/voteList/voteList.js';
import AuthContext from "../../context/context.js";
import './votePage.css';

class VotePage extends Component { //export default
    static contextType = AuthContext;

    constructor() {
        super();
        this.state = {
            content_toVote: [],
            toVote_StateArray: []
        };
    }

    componentDidMount() {
        this.content_voteList();
    }

    castVoteFunc = (vote, index) => {
        let contentId = this.state.content_toVote[index]._id;
        let list = this.state.toVote_StateArray;
        list[index] = vote;
        this.setState({toVote_StateArray: list});
        this.context.updateContext(this.state.content_toVote[index]);
        this.context.updateTimesVoted();

        fetch(`http://localhost:8080/castVote${vote+"_"+contentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                console.log("Did not send...");
                throw new Error("Failed...");
            }
            console.log("Status: " + res.status);
            console.log("Sent!");
        }).catch(err => {
            console.log(err);
        });
    }

    //get songs to vote on from server
    content_voteList = () => {
        console.log("Trying to get songs for voting");
        let lst = {lst: this.context.alreadyVoted};

        fetch(`http://localhost:8080/getVoteContent${this.context.usersHandle}`,{ // { credentials: 'include' } if using cookies and such
            method: 'POST',
            body: JSON.stringify(lst),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed...");
            }
            return res.json();
        }).then(data => {
            console.log("got data");
            let arr = [];
            for (let i = 0; i < data.content.length; i++) {
                arr.push("-");
            }
            this.setState({content_toVote: data.content, toVote_StateArray: arr});
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                { this.context.isLoggedIn &&
                    <VoteList
                        voteFunc={this.castVoteFunc}
                        content_V={this.state.content_toVote}
                        votes={this.state.toVote_StateArray}
                    />
                }
                {!this.context.isLoggedIn && <div>Log in to Vote on content</div>}
            </div>
        );
    }
}


export default VotePage;

/*
console.time('benchmark');
//any code here, this tests time it takes to run code
console.timeEnd('benchmark');
*/
