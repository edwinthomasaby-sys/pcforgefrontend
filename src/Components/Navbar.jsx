import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark pf-navbar sticky-top">
      <div className="container">
        <NavLink className="navbar-brand pf-logo" to="/">
          PC<span>Forge</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>

            <NavLink className="nav-link" to="/components">
              Components
            </NavLink>

            <NavLink className="nav-link" to="/build">
              Build PC
            </NavLink>

            <NavLink className="nav-link" to="/auto-build">
              Auto Build
            </NavLink>

            <NavLink className="nav-link" to="/builds">
              My Builds
            </NavLink>

            <NavLink className="nav-link" to="/dashboard">
              Dashboard
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}