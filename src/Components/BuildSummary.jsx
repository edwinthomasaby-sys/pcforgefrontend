import { formatPrice } from "../Utils/Format";
import { calculatePower, calculateTotal } from "../Utils/BuildCalc";
import { categoryLabels } from "../Utils/Slots";

export default function BuildSummary({ selected }) {
  const total = calculateTotal(selected);
  const power = calculatePower(selected);

  return (
    <div className="card pf-card pf-sticky">
      <div className="card-body">
        <h4>Build Summary</h4>

        {Object.entries(selected).map(([category, part]) => (
          <div
            key={category}
            className="d-flex justify-content-between border-bottom py-2"
          >
            <span>{categoryLabels[category]}</span>
            <span>
              {part ? formatPrice(part.price) : "Not selected"}
            </span>
          </div>
        ))}

        <div className="mt-3">
          <div className="d-flex justify-content-between">
            <strong>Total</strong>
            <strong className="pf-price">{formatPrice(total)}</strong>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <span>Estimated Power</span>
            <span>{power}W</span>
          </div>
        </div>
      </div>
    </div>
  );
}