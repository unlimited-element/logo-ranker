import React from 'react';
import './rankListItem.css';

const rankListItem = (props) => (
    <li>
        <div className="content">
            <div className="text">
                <p className="text_1">{props.handle + ": "}</p>
                <p>{props.content}</p>
            </div>
            <div className="votes">
                <p className="ups">{"Ups: " + props.upvotes}</p>
                <p className="downs">{"Downs: " + props.downvotes}</p>
            </div>
        </div>
    </li>
);

export default rankListItem;
