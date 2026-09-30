import { useEffect, useMemo, useState } from "react";
import { getComponents } from "../Services/ComponentService";
import PartCard from "../Components/PartCard";
import Pagination from "../Components/Pagination";
import Loader from "../Components/Loader";

const categories = [
  "all",
  "cpu",
  "motherboard",
  "ram",
  "gpu",
  "storage",
  "psu",
  "case"
];

export default function Components() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 8;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getComponents();
        setParts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return parts.filter((part) => {
      const matchesCategory =
        category === "all" || part.category === category;

      const matchesSearch =
        part.name.toLowerCase().includes(search.toLowerCase()) ||
        part.brand.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [parts, search, category]);

  const totalPages = Math.ceil(filtered.length / perPage);

  const visibleParts = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <h1>Components</h1>
      <p className="text-secondary">
        Browse PC components available in PCForge.
      </p>

      <input
        className="form-control mb-4"
        placeholder="Search components..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((item) => (
          <button
            key={item}
            className={`btn ${
              category === item
                ? "btn-accent"
                : "btn-outline-secondary"
            }`}
            onClick={() => setCategory(item)}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {!visibleParts.length ? (
        <div className="text-center py-5">
          <h4>No components found</h4>
        </div>
      ) : (
        <div className="row g-4">
          {visibleParts.map((part) => (
            <div className="col-sm-6 col-lg-3" key={part.id}>
              <PartCard part={part} />
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