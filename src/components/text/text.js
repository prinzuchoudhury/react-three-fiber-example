import React, { useEffect, useState } from 'react';
import './text.css';
const Text = () => {
    var work = ["sdadsa", "mlopki", "qwerty"];
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => (seconds === 2 ? 0 : seconds + 1));
        }, 6000);
    }, [seconds]);

    return (
        <div>
            <h2>{work[seconds]}</h2>
        </div>
    );
}
 
export default Text;