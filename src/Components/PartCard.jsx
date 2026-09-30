import { formatPrice } from "../Utils/Format";

export default function PartCard({ part, onSelect }) {
  return (
    <div className="card pf-card h-100">
      <div className="card-body">
        <span className="badge text-bg-dark mb-2">
          Tier {part.tier}
        </span>

        <h5>{part.name}</h5>

        <p className="text-secondary mb-1">{part.brand}</p>

        <div className="pf-price mb-3">
          {formatPrice(part.price)}
        </div>

        {part.category === "cpu" && (
          <small>
            {part.cores} Cores · {part.threads} Threads · {part.socket}
          </small>
        )}

        {part.category === "gpu" && (
          <small>
            {part.lengthMM}mm · {part.tdp}W
          </small>
        )}

        {part.category === "ram" && (
          <small>
            {part.capacityGB}GB · {part.type} · {part.speedMHz}MHz
          </small>
        )}

        {part.category === "storage" && (
          <small>
            {part.capacityGB}GB · {part.interface}
          </small>
        )}

        {part.category === "psu" && (
          <small>
            {part.wattage}W · {part.efficiency}
          </small>
        )}

        {part.category === "motherboard" && (
          <small>
            {part.socket} · {part.ramType} · {part.formFactor}
          </small>
        )}

        {part.category === "case" && (
          <small>
            {part.formFactor} · Max GPU {part.maxGpuLengthMM}mm
          </small>
        )}

        {onSelect && (
          <button
            className="btn btn-accent w-100 mt-3"
            onClick={() => onSelect(part)}
          >
            Select
          </button>
        )}
      </div>
    </div>
  );
}