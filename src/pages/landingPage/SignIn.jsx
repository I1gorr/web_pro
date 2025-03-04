import React from "react";
import BasicButtons from "./button"; // Ensure correct path

function Signin() {
    return (
    <div className="signin">
        <div className="emoji-background"></div> {/* Move it inside signin */}
            <h1>Knowledge Shared is Knowledge Squared.</h1>
            <BasicButtons />
    </div>
);
}

export default Signin;
