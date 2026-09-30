import { calculatePower } from "./BuildCalc";

export const checkCompatibility = (selected) => {
  const results = [];

  const { cpu, motherboard, ram, gpu, storage, psu, case: pcCase } =
    selected;

  if (cpu && motherboard) {
    results.push({
      rule: "CPU Socket",
      status: cpu.socket === motherboard.socket ? "ok" : "error",
      message:
        cpu.socket === motherboard.socket
          ? `${cpu.socket} socket is compatible.`
          : `CPU uses ${cpu.socket}, but motherboard uses ${motherboard.socket}.`
    });
  }

  if (ram && motherboard) {
    results.push({
      rule: "RAM Type",
      status: ram.type === motherboard.ramType ? "ok" : "error",
      message:
        ram.type === motherboard.ramType
          ? `${ram.type} RAM is compatible.`
          : `RAM is ${ram.type}, but motherboard requires ${motherboard.ramType}.`
    });
  }

  if (motherboard && pcCase) {
    const compatible = pcCase.supportedFormFactors.includes(
      motherboard.formFactor
    );

    results.push({
      rule: "Form Factor",
      status: compatible ? "ok" : "error",
      message: compatible
        ? `${motherboard.formFactor} motherboard fits the case.`
        : `${motherboard.formFactor} motherboard does not fit this case.`
    });
  }

  if (gpu && pcCase) {
    const compatible = gpu.lengthMM <= pcCase.maxGpuLengthMM;

    results.push({
      rule: "GPU Length",
      status: compatible ? "ok" : "error",
      message: compatible
        ? `${gpu.lengthMM}mm GPU fits.`
        : `${gpu.lengthMM}mm GPU is too long for this ${pcCase.maxGpuLengthMM}mm case.`
    });
  }

  if (psu) {
    const power = calculatePower(selected);
    const recommended = power * 1.25;

    let status = "ok";

    if (psu.wattage < power) {
      status = "error";
    } else if (psu.wattage < recommended) {
      status = "warning";
    }

    results.push({
      rule: "PSU Wattage",
      status,
      message:
        status === "error"
          ? `${psu.wattage}W PSU is below the estimated ${power}W requirement.`
          : status === "warning"
          ? `${psu.wattage}W PSU works, but ${Math.ceil(
              recommended
            )}W or higher is recommended.`
          : `${psu.wattage}W PSU has sufficient headroom.`
    });
  }

  if (storage && motherboard) {
    const compatible =
      storage.interface === "NVMe"
        ? motherboard.m2Slots > 0
        : motherboard.sataPorts > 0;

    results.push({
      rule: "Storage Interface",
      status: compatible ? "ok" : "error",
      message: compatible
        ? `${storage.interface} storage is supported.`
        : `${storage.interface} storage is not supported by this motherboard.`
    });
  }

  return results;
};