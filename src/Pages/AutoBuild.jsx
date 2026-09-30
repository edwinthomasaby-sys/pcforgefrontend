import { useEffect, useMemo, useState } from "react";
import { getComponents } from "../Services/ComponentService";
import { generateAutoBuild } from "../Utils/AutoBuildLogic";
import BuildSummary from "../Components/BuildSummary";
import CompatibilityPanel from "../Components/CompatibilityPanel";
import SaveBuildForm from "../Components/SaveBuildForm";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";

export default function AutoBuild() {
  const [budget, setBudget] = useState(80000);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getComponents();
        setComponents(data);
      } catch (error) {
        console.error("Auto build error:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const result = useMemo(
    () => generateAutoBuild(components, Number(budget)),
    [components, budget]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container py-5">

      <h1>Budget Auto-Build</h1>

      <p className="text-secondary">
        Enter a budget and PCForge will generate a compatible build.
      </p>

      <div className="card pf-card mb-4">

        <div className="card-body">

          <label className="form-label">
            Budget
          </label>

          <input
            type="number"
            className="form-control"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <div className="d-flex flex-wrap gap-2 mt-3">

            {[50000, 75000, 100000, 150000].map((amount) => (
              <button
                key={amount}
                className="btn btn-outline-info"
                onClick={() => setBudget(amount)}
              >
                ₹{amount.toLocaleString("en-IN")}
              </button>
            ))}

          </div>

        </div>

      </div>

      {!result ? (
        <div className="alert alert-warning">
          No compatible build could be generated for this budget.
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">

            <h3>
              Generated Build
            </h3>

            <button
              className="btn btn-outline-info"
              onClick={() =>
                navigate("/build", {
                  state: {
                    autoBuild: result.selected
                  }
                })
              }
            >
              Edit in Builder
            </button>

          </div>

          <div className="row g-4">

            <div className="col-lg-8">

              <CompatibilityPanel
                selected={result.selected}
              />

              <SaveBuildForm
                selected={result.selected}
                mode="auto"
              />

            </div>

            <div className="col-lg-4">

              <BuildSummary
                selected={result.selected}
              />

            </div>

          </div>
        </>
      )}

    </div>
  );
}