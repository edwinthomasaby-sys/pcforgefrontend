import { Link } from "react-router-dom";
import { FaMicrochip, FaBolt, FaChartLine } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <section className="hero py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <p className="text-info fw-bold">PC BUILDING PLATFORM</p>

              <h1 className="display-2 fw-bold">
                Forge Your
                <span className="text-info"> Perfect PC.</span>
              </h1>

              <p className="lead text-secondary mt-3">
                Build, compare and validate custom PCs with real-time
                compatibility checking.
              </p>

              <div className="d-flex gap-3 mt-4">
                <Link to="/build" className="btn btn-accent btn-lg">
                  Start Building
                </Link>

                <Link
                  to="/auto-build"
                  className="btn btn-outline-info btn-lg"
                >
                  Auto Build
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <Feature
            icon={<FaMicrochip />}
            title="Choose Components"
            text="Browse CPUs, GPUs, RAM, storage, motherboards, PSUs and cases."
          />

          <Feature
            icon={<FaBolt />}
            title="Check Compatibility"
            text="Detect socket, RAM, case, GPU, storage and PSU problems."
          />

          <Feature
            icon={<FaChartLine />}
            title="Track Your Builds"
            text="Save builds and view your PC building statistics."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="col-md-4">
      <div className="card pf-card h-100">
        <div className="card-body">
          <div className="feature-icon">{icon}</div>
          <h4>{title}</h4>
          <p className="text-secondary">{text}</p>
        </div>
      </div>
    </div>
  );
}