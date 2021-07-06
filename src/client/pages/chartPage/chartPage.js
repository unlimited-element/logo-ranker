import React, { Component } from 'react';
import RankList from '../../components/rankList/rankList.js';
import AuthContext from "../../context/context.js";
import './chartPage.css';

class ChartPage extends Component { //export default
    static contextType = AuthContext;

    constructor() {
        super();
        this.state = {
            content_ranked: []
        };
    }

    componentDidMount() {
        this.content_rankList();
    }

    //get ranked songs from server
    content_rankList = () => {
        console.log("Trying to get top songs");

        fetch(`http://localhost:8080/getRankedContent${this.context.timesVoted}`,{ // { credentials: 'include' } if using cookies and such
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed...");
            }
            return res.json();
        }).then(data => {
            console.log("got data");
            this.setState({content_ranked: data.content});
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <RankList content_R={this.state.content_ranked}/>
            </div>
        );
    }
}

export default ChartPage;

/*
console.time('benchmark');
//any code here, this tests time it takes to run code
console.timeEnd('benchmark');
*/
