import { useState } from "react";
import { createBuild, updateBuild } from "../Services/BuildService";
import { calculatePower, calculateTotal } from "../Utils/BuildCalc";
import { useNavigate } from "react-router-dom";

export default function SaveBuildForm({
  selected,
  existingBuild = null,
  mode = "manual",
  onSaved
}) {
  const [name, setName] = useState(
    existingBuild?.name || ""
  );

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleSave = async () => {

    if (!name.trim()) {
      alert("Please enter a build name.");
      return;
    }

    if (Object.values(selected).some((part) => !part)) {
      alert("Please select all components.");
      return;
    }

    const build = {
      name: name.trim(),

      mode: existingBuild?.mode || mode,

      parts: Object.fromEntries(
        Object.entries(selected).map(
          ([key, part]) => [key, part.id]
        )
      ),

      totalPrice: calculateTotal(selected),

      powerEstimate: calculatePower(selected),

      image: "",

      createdAt:
        existingBuild?.createdAt ||
        new Date().toISOString()
    };

    try {

      setSaving(true);

      if (existingBuild) {

        await updateBuild(
          existingBuild.id,
          build
        );

        alert("Build updated successfully.");

        navigate(
          `/builds/${existingBuild.id}`
        );

      } else {

        const saved = await createBuild(build);

        alert("Build saved successfully.");

        navigate(
          `/builds/${saved.id}`
        );
      }

      onSaved?.();

    } catch (error) {

      console.error(error);

      alert(
        error.friendlyMessage ||
        "Could not save build."
      );

    } finally {

      setSaving(false);

    }
  };

  return (
    <div className="card pf-card mt-4">

      <div className="card-body">

        <h5>
          {existingBuild
            ? "Update Build"
            : "Save Build"}
        </h5>

        <input
          className="form-control mb-3"
          placeholder="Build name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <button
          className="btn btn-accent w-100"
          disabled={saving}
          onClick={handleSave}
        >
          {saving
            ? "Saving..."
            : existingBuild
            ? "Update Build"
            : "Save Build"}
        </button>

      </div>

    </div>
  );
}