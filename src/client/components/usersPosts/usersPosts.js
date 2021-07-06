import React from 'react';
import './usersPosts.css';
import UsersPostsItem from '../usersPostsItem/usersPostsItem.js';

const usersPosts = (props) => {
    let list = props.posts.map(item => {
        return <UsersPostsItem
                    key={item._id}
                    handle={item.handle}
                    content={item.content}
                    upvotes={item.upvotes}
                    downvotes={item.downvotes}
                />
    });
    return <ul className="list">{list}</ul>;
}

export default usersPosts;
