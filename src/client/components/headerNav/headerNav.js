import React from 'react';
import { NavLink } from "react-router-dom";
import "./headerNav.css";

const headerNav = (props) => (
    <div className="navHead_container">
        <header className="header">
            <h1 className="title">Ranker</h1>
        </header>
        <nav className="navbar">
            <ul>
                <li><NavLink className="link" to="/home">Home</NavLink></li>
                <li><NavLink className="link" to="/submit">Submit</NavLink></li>
                <li><NavLink className="link" to="/vote">Vote</NavLink></li>
                <li><NavLink className="link" to="/chart">Chart</NavLink></li>
            </ul>
        </nav>
    </div>
);

export default headerNav;
