import { useEffect, useMemo, useState } from "react";
import { getBuilds } from "../Services/BuildService";
import Loader from "../Components/Loader";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

ChartJS.defaults.color = "#ffffff";
ChartJS.defaults.borderColor = "#26334d";

export default function Dashboard() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getBuilds({
          _limit: 1000
        });

        setBuilds(result.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = builds.length;

    const average =
      total > 0
        ? builds.reduce(
            (sum, build) => sum + (build.totalPrice || 0),
            0
          ) / total
        : 0;

    const downloads = builds.reduce(
      (sum, build) => sum + (build.downloadCount || 0),
      0
    );

    return {
      total,
      average,
      downloads
    };
  }, [builds]);

  const manualBuilds = builds.filter(
    (build) => build.mode === "manual"
  ).length;

  const autoBuilds = builds.filter(
    (build) => build.mode === "auto"
  ).length;

  const modeData = {
    labels: ["Manual", "Auto"],

    datasets: [
      {
        label: "Builds",

        data: [
          manualBuilds,
          autoBuilds
        ],

        backgroundColor: [
          "#00e5ff",
          "#8b5cf6"
        ],

        borderColor: "#131a2a",

        borderWidth: 3
      }
    ]
  };

  const priceData = {
    labels: builds.map((build) => build.name),

    datasets: [
      {
        label: "Price",

        data: builds.map(
          (build) => build.totalPrice || 0
        ),

        backgroundColor: "#00e5ff",

        borderColor: "#00e5ff",

        pointBackgroundColor: "#00e5ff",

        pointBorderColor: "#ffffff",

        pointRadius: 5,

        borderWidth: 3,

        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,

    plugins: {
      legend: {
        display: true,

        labels: {
          color: "#ffffff",

          font: {
            size: 14
          },

          padding: 15,

          usePointStyle: true
        }
      },

      tooltip: {
        enabled: true
      }
    },

    scales: {
      x: {
        ticks: {
          color: "#ffffff"
        },

        grid: {
          color: "#26334d"
        }
      },

      y: {
        ticks: {
          color: "#ffffff"
        },

        grid: {
          color: "#26334d"
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,

    plugins: {
      legend: {
        display: true,

        position: "bottom",

        labels: {
          color: "#ffffff",

          font: {
            size: 16,
            weight: "bold"
          },

          padding: 20,

          usePointStyle: true,

          generateLabels: (chart) => {
            const data = chart.data;

            if (!data.labels.length) {
              return [];
            }

            return data.labels.map((label, index) => ({
              text: `${label}: ${data.datasets[0].data[index]}`,

              fillStyle:
                data.datasets[0].backgroundColor[index],

              strokeStyle:
                data.datasets[0].backgroundColor[index],

              lineWidth: 2,

              hidden: false,

              index
            }));
          }
        }
      },

      tooltip: {
        enabled: true,

        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw} builds`;
          }
        }
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container py-5">

      <h1>Dashboard</h1>

      <p className="text-secondary">
        Overview of your PCForge builds.
      </p>

      <div className="row g-4 my-3">

        <Stat
          title="Total Builds"
          value={stats.total}
        />

        <Stat
          title="Average Price"
          value={`₹${Math.round(
            stats.average
          ).toLocaleString("en-IN")}`}
        />

        <Stat
          title="Downloads"
          value={stats.downloads}
        />

      </div>

      <div className="row g-4">

        {/* Manual / Auto */}

        <div className="col-lg-5">

          <div className="card pf-card p-3">

            <h5>Build Modes</h5>

            <Doughnut
              data={modeData}
              options={doughnutOptions}
            />

          </div>

        </div>

        {/* Price Line Chart */}

        <div className="col-lg-7">

          <div className="card pf-card p-3">

            <h5>Price Per Build</h5>

            <Line
              data={priceData}
              options={chartOptions}
            />

          </div>

        </div>

        {/* Price Bar Chart */}

        <div className="col-12">

          <div className="card pf-card p-3">

            <h5>Build Prices</h5>

            <Bar
              data={priceData}
              options={chartOptions}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="col-md-4">

      <div className="card pf-card">

        <div className="card-body">

          <p className="text-secondary mb-1">
            {title}
          </p>

          <h2 className="pf-price">
            {value}
          </h2>

        </div>

      </div>

    </div>
  );
}