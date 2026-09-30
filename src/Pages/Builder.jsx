import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getComponents } from "../Services/ComponentService";
import { getBuildById } from "../Services/BuildService";
import { useBuild } from "../Context/BuildContext";
import { categoryLabels, categories } from "../Utils/Slots";
import BuildSummary from "../Components/BuildSummary";
import CompatibilityPanel from "../Components/CompatibilityPanel";
import SaveBuildForm from "../Components/SaveBuildForm";
import Loader from "../Components/Loader";

export default function Builder() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { selected, selectPart, clearBuild, loadBuild } = useBuild();

  const [parts, setParts] = useState([]);
  const [existingBuild, setExistingBuild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const componentData = await getComponents();
        setParts(componentData);

        if (id) {
          const build = await getBuildById(id);
          setExistingBuild(build);

          const selectedParts = {};

          categories.forEach((category) => {
            selectedParts[category] =
              componentData.find(
                (part) => part.id === build.parts[category]
              ) || null;
          });

          loadBuild(selectedParts);
        } else if (location.state?.autoBuild) {
          loadBuild(location.state.autoBuild);
        } else {
          clearBuild();
        }
      } catch (error) {
        console.error(error);
        if (id) navigate("/builds");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>{id ? "Edit Build" : "PC Builder"}</h1>
          <p className="text-secondary">
            Choose every component for your PC.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={clearBuild}>
          Clear
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card pf-card">
            <div className="card-body">
              {categories.map((category) => {
                const options = parts.filter(
                  (part) => part.category === category
                );

                return (
                  <div className="mb-4" key={category}>
                    <label className="form-label fw-bold">
                      {categoryLabels[category]}
                    </label>

                    <select
                      className="form-select"
                      value={selected[category]?.id || ""}
                      onChange={(e) => {
                        const part = options.find(
                          (item) =>
                            item.id === Number(e.target.value)
                        );

                        selectPart(category, part || null);
                      }}
                    >
                      <option value="">
                        Select {categoryLabels[category]}
                      </option>

                      {options.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name} — ₹
                          {part.price.toLocaleString("en-IN")}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          <CompatibilityPanel selected={selected} />

          <SaveBuildForm
            selected={selected}
            existingBuild={existingBuild}
          />
        </div>

        <div className="col-lg-4">
          <BuildSummary selected={selected} />
        </div>
      </div>
    </div>
  );
}