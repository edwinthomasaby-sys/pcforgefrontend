export const calculateTotal = (selected) => {
  return Object.values(selected).reduce(
    (total, part) => total + (part?.price || 0),
    0
  );
};

export const calculatePower = (selected) => {
  const cpu = selected.cpu;
  const gpu = selected.gpu;

  if (!cpu && !gpu) return 0;

  return (cpu?.tdp || 0) + (gpu?.tdp || 0) + 100;
};