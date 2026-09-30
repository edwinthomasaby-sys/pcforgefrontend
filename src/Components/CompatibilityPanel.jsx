import { checkCompatibility } from "../Utils/Compatibility";

export default function CompatibilityPanel({ selected }) {
  const results = checkCompatibility(selected);

  if (!results.length) {
    return (
      <div className="card pf-card mt-4">
        <div className="card-body">
          <h5>Compatibility</h5>
          <p className="text-secondary mb-0">
            Select parts to check compatibility.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card pf-card mt-4">
      <div className="card-body">
        <h5>Compatibility</h5>

        {results.map((result) => (
          <div
            key={result.rule}
            className={`compatibility compatibility-${result.status}`}
          >
            <strong>{result.rule}</strong>
            <p className="mb-0">{result.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}