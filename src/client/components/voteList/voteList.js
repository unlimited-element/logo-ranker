import React from 'react';
import './voteList.css';
import VoteListItem from '../voteListItem/voteListItem.js';

const voteList = (props) => {
    let list = props.content_V.map((item, index) => {
        return <VoteListItem
                    key={index}
                    ind={index}
                    onVote={props.voteFunc} //function when client votes on this song
                    vote={props.votes[index]} //"-", up, down
                    handle={item.handle}
                    content={item.content}
                    upvotes={item.upvotes}
                    downvotes={item.downvotes}
                    inappropriate={item.inappropriate}

                />
    });
    return <ul className="list">{list}</ul>;
}

export default voteList;
