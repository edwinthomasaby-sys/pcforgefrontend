import { createContext, useContext, useState } from "react";

const BuildContext = createContext();

const emptyBuild = {
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  storage: null,
  psu: null,
  case: null
};

export function BuildProvider({ children }) {
  const [selected, setSelected] = useState(emptyBuild);

  const selectPart = (category, part) => {
    setSelected((current) => ({
      ...current,
      [category]: part
    }));
  };

  const clearBuild = () => {
    setSelected(emptyBuild);
  };

  const loadBuild = (build) => {
    setSelected(build);
  };

  return (
    <BuildContext.Provider
      value={{
        selected,
        selectPart,
        clearBuild,
        loadBuild
      }}
    >
      {children}
    </BuildContext.Provider>
  );
}

export const useBuild = () => useContext(BuildContext);