export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center gap-2 my-4">
      <button
        className="btn btn-outline-info"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>

      <span className="btn btn-accent">
        {page} / {totalPages}
      </span>

      <button
        className="btn btn-outline-info"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}