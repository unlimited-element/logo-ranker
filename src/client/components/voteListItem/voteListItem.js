import React from 'react';
import './voteListItem.css';

const voteListItem = (props) => {
    //update content votes based on how client just voted on that content
    let upvotes = props.upvotes;
    let downvotes = props.downvotes;
    if (props.vote === "up") {
        upvotes = upvotes + 1;
    } else if (props.vote === "dn") {
        downvotes = downvotes + 1;
    }

    return (
        <li className="each_item">
            {props.vote !== "-" && (
            <div className="content">
                <div className="text">
                    <p className="text_1">{props.handle + ": "}</p>
                    <p>{props.content}</p>
                </div>
                <div className="votes">
                    <p className="ups">{"Ups: " + upvotes}</p>
                    <p className="downs">{"Downs: " + downvotes}</p>
                </div>
            </div> )}
            {props.vote === "-" && (<div className="content"><p>{props.content}</p></div>)}
            {props.vote === "-" && (<button className="btn1"
            onClick={props.onVote.bind(this, "up", props.ind)}>Up</button>)}
            {props.vote === "-" && (<button className="btn2"
            onClick={props.onVote.bind(this, "dn", props.ind)}>Down</button>)}
            {props.vote === "-" && (<button className="btn3"
            onClick={props.onVote.bind(this, "in", props.ind)}>REPORT</button>)}
        </li>
    );
}

export default voteListItem;
