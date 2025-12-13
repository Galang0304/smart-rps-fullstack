import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <h1>SMART RPS HOME - LOADING TEST</h1>
      <p>If you can see this, the routing works!</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}
