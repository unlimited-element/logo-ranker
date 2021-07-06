import React from "react";

export default React.createContext({
    alreadyVoted: [],
    updateContext: (item) => {},
    timesVoted: 0,
    updateTimesVoted: () => {},
    isLoggedIn: false,
    updateLoggedIn: (bool) => {},
    usersName: "",
    usersEmail: "",
    usersHandle: "",
    setUsersCreds: (name, email, handle) => {}
});
