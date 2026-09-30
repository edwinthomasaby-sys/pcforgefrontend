import { calculatePower } from "./BuildCalc";
import { checkCompatibility } from "./Compatibility";

const shares = {
  gpu: 0.35,
  cpu: 0.22,
  motherboard: 0.12,
  ram: 0.09,
  storage: 0.08,
  psu: 0.07,
  case: 0.07
};

const pickBest = (items, budget, category) => {
  const candidates = items
    .filter((item) => item.category === category)
    .filter((item) => item.price <= budget);

  return candidates.sort((a, b) => {
    if (b.tier !== a.tier) return b.tier - a.tier;
    return a.price - b.price;
  })[0];
};

export const generateAutoBuild = (components, budget) => {
  if (!budget || budget <= 0) return null;

  const grouped = components.reduce((acc, part) => {
    if (!acc[part.category]) acc[part.category] = [];
    acc[part.category].push(part);
    return acc;
  }, {});

  let best = null;

  for (let scale = 0.4; scale <= 1.6001; scale += 0.02) {
    const cpuBudget = budget * shares.cpu * scale;

    const cpu =
      pickBest(grouped.cpu || [], cpuBudget, "cpu") ||
      [...(grouped.cpu || [])].sort((a, b) => a.price - b.price)[0];

    if (!cpu) continue;

    const motherboard = (grouped.motherboard || [])
      .filter((m) => m.socket === cpu.socket)
      .filter((m) => m.price <= budget * shares.motherboard * scale)
      .sort((a, b) => b.tier - a.tier || a.price - b.price)[0];

    if (!motherboard) continue;

    const ram = (grouped.ram || [])
      .filter((r) => r.type === motherboard.ramType)
      .filter((r) => r.price <= budget * shares.ram * scale)
      .sort((a, b) => b.tier - a.tier || a.price - b.price)[0];

    if (!ram) continue;

    const gpu = pickBest(
      grouped.gpu || [],
      budget * shares.gpu * scale,
      "gpu"
    );

    if (!gpu) continue;

    const partial = {
      cpu,
      motherboard,
      ram,
      gpu,
      storage: null,
      psu: null,
      case: null
    };

    const power = calculatePower(partial);

    const psu = (grouped.psu || [])
      .filter((p) => p.wattage >= power * 1.25)
      .filter((p) => p.price <= budget * shares.psu * scale)
      .sort((a, b) => b.tier - a.tier || a.price - b.price)[0];

    if (!psu) continue;

    const pcCase = (grouped.case || [])
      .filter((c) =>
        c.supportedFormFactors.includes(motherboard.formFactor)
      )
      .filter((c) => c.maxGpuLengthMM >= gpu.lengthMM)
      .filter((c) => c.price <= budget * shares.case * scale)
      .sort((a, b) => b.tier - a.tier || a.price - b.price)[0];

    if (!pcCase) continue;

    const storage = (grouped.storage || [])
      .filter((s) => s.price <= budget * shares.storage * scale)
      .filter((s) =>
        s.interface === "NVMe"
          ? motherboard.m2Slots > 0
          : motherboard.sataPorts > 0
      )
      .sort((a, b) => b.tier - a.tier || a.price - b.price)[0];

    if (!storage) continue;

    const build = {
      cpu,
      motherboard,
      ram,
      gpu,
      storage,
      psu,
      case: pcCase
    };

    const totalPrice = Object.values(build).reduce(
      (sum, part) => sum + part.price,
      0
    );

    if (totalPrice > budget) continue;

    const errors = checkCompatibility(build).filter(
      (result) => result.status === "error"
    );

    if (errors.length) continue;

    const score =
      gpu.tier * 3 +
      cpu.tier * 2 +
      motherboard.tier +
      ram.tier +
      storage.tier +
      psu.tier +
      pcCase.tier;

    const candidate = {
      selected: build,
      totalPrice,
      score
    };

    if (
      !best ||
      candidate.score > best.score ||
      (candidate.score === best.score &&
        candidate.totalPrice < best.totalPrice)
    ) {
      best = candidate;
    }
  }

  return best;
};