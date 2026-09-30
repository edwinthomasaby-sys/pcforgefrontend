import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import Builder from "./Pages/Builder";
import Components from "./Pages/Components";
import AutoBuild from "./Pages/AutoBuild";
import MyBuilds from "./Pages/MyBuilds";
import BuildDetails from "./Pages/BuildDetails";
import Dashboard from "./Pages/Dashboard";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build" element={<Builder />} />
          <Route path="/build/:id/edit" element={<Builder />} />
          <Route path="/auto-build" element={<AutoBuild />} />
          <Route path="/components" element={<Components />} />
          <Route path="/builds" element={<MyBuilds />} />
          <Route path="/builds/:id" element={<BuildDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="*"
            element={
              <div className="container py-5 text-center">
                <h1>404</h1>
                <p>Page not found.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}