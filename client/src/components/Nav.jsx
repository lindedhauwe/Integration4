import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <header>
            <nav>
                <Link to="/">Home</Link>{' | '}
                <Link to="/recommendations">Recommendation</Link>{' | '}
                <Link to="/thespot">The Spot</Link>{' | '}
                <Link to="/map">Map</Link>{' | '}
                <Link to="/account">Account</Link>{' | '}
                <Link to="/otherbar">Other Bar</Link>
            </nav>
        </header>
    );
}
