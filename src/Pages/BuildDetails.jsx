import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBuildById } from "../Services/BuildService";
import { getComponents } from "../Services/ComponentService";
import { categoryLabels } from "../Utils/Slots";
import { formatPrice } from "../Utils/Format";
import { checkCompatibility } from "../Utils/Compatibility";
import { calculatePower } from "../Utils/BuildCalc";
import CompatibilityPanel from "../Components/CompatibilityPanel";
import Loader from "../Components/Loader";

export default function BuildDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [build, setBuild] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [buildData, components] = await Promise.all([
          getBuildById(id),
          getComponents()
        ]);

        const selectedParts = {};

        Object.entries(buildData.parts).forEach(([category, partId]) => {
          selectedParts[category] = components.find(
            (part) => part.id === partId
          );
        });

        setBuild(buildData);
        setSelected(selectedParts);
      } catch {
        navigate("/builds");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1>{build.name}</h1>
          <p className="text-secondary">
            {build.mode} build
          </p>
        </div>

        <Link
          className="btn btn-outline-info"
          to={`/build/${build.id}/edit`}
        >
          Edit Build
        </Link>
      </div>

      <div className="card pf-card mt-4">
        <div className="card-body">
          <h4>Parts</h4>

          {Object.entries(selected).map(([category, part]) => (
            <div
              className="d-flex justify-content-between border-bottom py-3"
              key={category}
            >
              <span>{categoryLabels[category]}</span>

              <span>
                {part?.name} — {formatPrice(part?.price)}
              </span>
            </div>
          ))}

          <div className="mt-4 d-flex justify-content-between">
            <strong>Total</strong>
            <strong className="pf-price">
              {formatPrice(build.totalPrice)}
            </strong>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>Power Estimate</span>
            <span>{calculatePower(selected)}W</span>
          </div>
        </div>
      </div>

      <CompatibilityPanel selected={selected} />
    </div>
  );
}