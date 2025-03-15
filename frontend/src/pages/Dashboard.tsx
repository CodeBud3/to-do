import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      Dashboard page
      <Link to="/login">Sign in</Link>
      <Link to="/signup">Sign up</Link>
    </>
  );
}
