// Shared product / catalog types used across all catalog tables.

export interface SiliconProduct {
  id: string;
  vendor: string;          // Company id from companies.ts
  vendorName: string;
  family: "GPU" | "CPU" | "AI Accel" | "DPU" | "NPU" | "Memory" | "Switch ASIC";
  name: string;
  released: string;        // YYYY or YYYY-MM
  process: string;         // e.g. "TSMC N4P"
  transistors?: string;    // e.g. "208B"
  diceSize?: string;
  memory?: string;
  bandwidth?: string;
  tdpW?: number;
  perfFP16?: string;       // training-relevant
  perfFP8?: string;
  perfINT8?: string;
  perfFP4?: string;
  msrpUSD?: number;
  segment: "Datacenter" | "Workstation" | "Consumer" | "Edge" | "Mobile";
  notes?: string;
}

export interface EnergyProvider {
  id: string;
  name: string;
  ticker?: string;
  hq: string;
  type: "IPP" | "Regulated Utility" | "Nuclear" | "Renewables" | "BESS" | "Hyperscale Self-Gen";
  capacityGW?: number;       // total nameplate
  cleanShare?: number;       // % carbon-free 0-100
  nuclearGW?: number;
  renewablesGW?: number;
  gasGW?: number;
  marketCapUSD?: number;     // billions
  hyperscalerDeals: string[];// list of headline deals
  region: string;
  note: string;
}

export interface FiberProvider {
  id: string;
  name: string;
  ticker?: string;
  hq: string;
  type: "Carrier (dark fiber)" | "Cable maker" | "Submarine" | "DCI optics" | "Hyperscaler-owned";
  routeMiles?: number;       // total fiber route
  longHaulMiles?: number;
  metroMiles?: number;
  buildings?: number;        // on-net
  capacityTbps?: string;     // peak per route
  hyperscalerExposure: string[];
  marketCapUSD?: number;
  note: string;
}

export interface OpticalSku {
  id: string;
  vendor: string;
  vendorName: string;
  name: string;
  rate: "100G" | "400G" | "800G" | "1.6T" | "200G";
  formFactor: "SFP" | "QSFP-DD" | "OSFP" | "QSFP56" | "OSFP-XD" | "CPO";
  reach: string;             // e.g. "500m", "10km"
  optics: string;            // e.g. "DR8", "FR4", "LR4", "ZR"
  laser: string;             // e.g. "EML", "VCSEL", "Si Photonics"
  powerW?: number;
  released?: string;
  note?: string;
}

export interface DcCampus {
  id: string;
  name: string;
  operator: string;
  operatorId?: string;
  location: string;
  region: string;
  capacityMW: number;
  ultimateMW?: number;
  liveMW?: number;
  primaryTenants: string[];
  cooling?: string;
  powerSource?: string;
  status: "Operating" | "Under Construction" | "Announced";
  note?: string;
}

export interface NetworkSwitch {
  id: string;
  vendor: string;
  vendorName: string;
  name: string;
  asic: string;             // e.g. "Tomahawk 5"
  rateTbps: number;         // total switching capacity
  portsTopology: string;    // e.g. "32x800G OSFP"
  ru: number;               // rack-units
  released: string;
  note?: string;
}

export interface StorageSku {
  id: string;
  vendor: string;
  vendorName: string;
  name: string;
  type: "All-flash array" | "Disaggregated" | "QLC SSD" | "TLC SSD" | "HDD" | "Object";
  capacityTB?: number;
  formFactor?: string;
  perfGBs?: number;          // throughput
  iops?: string;
  note?: string;
}

export interface CoolingProduct {
  id: string;
  vendor: string;
  vendorName: string;
  name: string;
  type: "Direct-to-Chip" | "Rear-Door HX" | "Immersion (1P)" | "Immersion (2P)" | "Chiller / CDU" | "Evaporative";
  capacityKW?: number;
  fluid?: string;
  released?: string;
  note?: string;
}
