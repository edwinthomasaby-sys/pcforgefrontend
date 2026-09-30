import { useEffect, useState } from "react";
import { deleteBuild, getBuilds } from "../Services/BuildService";
import { Link } from "react-router-dom";
import { formatPrice, formatDate } from "../Utils/Format";
import Pagination from "../Components/Pagination";
import UseDebounce from "../Hooks/UseDebounce";
import Loader from "../Components/Loader";

export default function MyBuilds() {
  const [builds, setBuilds] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = UseDebounce(search, 500);
  const limit = 6;

  const loadBuilds = async () => {
    try {
      setLoading(true);

      const result = await getBuilds({
        q: debouncedSearch,
        _page: page,
        _limit: limit,
        _sort: "id",
        _order: "desc"
      });

      setBuilds(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuilds();
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this build?")) return;

    await deleteBuild(id);
    loadBuilds();
  };

  if (loading) return <Loader />;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container py-5">
      <h1>My Builds</h1>

      <input
        className="form-control my-4"
        placeholder="Search builds..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {!builds.length ? (
        <div className="text-center py-5">
          <h4>No builds found.</h4>
        </div>
      ) : (
        <div className="row g-4">
          {builds.map((build) => (
            <div className="col-md-6 col-lg-4" key={build.id}>
              <div className="card pf-card h-100">
                <div className="card-body">
                  <span className="badge bg-info text-dark">
                    {build.mode}
                  </span>

                  <h4 className="mt-3">{build.name}</h4>

                  <p className="pf-price">
                    {formatPrice(build.totalPrice)}
                  </p>

                  <p className="text-secondary">
                    {formatDate(build.createdAt)}
                  </p>

                  <div className="d-flex gap-2">
                    <Link
                      className="btn btn-accent"
                      to={`/builds/${build.id}`}
                    >
                      View
                    </Link>

                    <Link
                      className="btn btn-outline-info"
                      to={`/build/${build.id}/edit`}
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(build.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
}