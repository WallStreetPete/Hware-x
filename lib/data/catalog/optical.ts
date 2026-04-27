import type { OpticalSku } from "../../catalog-types";

export const OPTICAL: OpticalSku[] = [
  // ── 800G — current AI cluster default
  { id: "800g-dr8", vendor: "innolight", vendorName: "Innolight", name: "800G OSFP DR8", rate: "800G", formFactor: "OSFP", reach: "500m", optics: "DR8", laser: "EML", powerW: 16, released: "2023", note: "Most-shipped 800G in NVIDIA clusters." },
  { id: "800g-2xfr4", vendor: "innolight", vendorName: "Innolight", name: "800G OSFP 2xFR4", rate: "800G", formFactor: "OSFP", reach: "2km", optics: "2xFR4", laser: "EML", powerW: 16, released: "2024" },
  { id: "800g-2xlr4", vendor: "coherent", vendorName: "Coherent", name: "800G OSFP 2xLR4", rate: "800G", formFactor: "OSFP", reach: "10km", optics: "2xLR4", laser: "EML", powerW: 18, released: "2024" },
  { id: "800g-osfp-dr8-c", vendor: "coherent", vendorName: "Coherent", name: "800G OSFP DR8", rate: "800G", formFactor: "OSFP", reach: "500m", optics: "DR8", laser: "EML", powerW: 16, released: "2023" },
  { id: "800g-eopto-dr8", vendor: "eoptolink", vendorName: "Eoptolink", name: "800G OSFP DR8", rate: "800G", formFactor: "OSFP", reach: "500m", optics: "DR8", laser: "EML", powerW: 16, released: "2024", note: "Lower-cost alternative; ramping at AWS." },
  { id: "800g-lpo", vendor: "marvell", vendorName: "Marvell (DSP)", name: "800G LPO Reference", rate: "800G", formFactor: "OSFP", reach: "500m", optics: "DR8 LPO", laser: "EML", powerW: 12, released: "2024", note: "Linear-pluggable; ~25% less power." },
  { id: "800g-zr+", vendor: "ciena", vendorName: "Ciena", name: "WaveLogic 6 800ZR+", rate: "800G", formFactor: "OSFP", reach: "1000+ km", optics: "Coherent ZR+", laser: "InP coherent", powerW: 25, released: "2024", note: "Long-haul DCI." },

  // ── 1.6T — 2025 ramp
  { id: "1.6t-dr8", vendor: "innolight", vendorName: "Innolight", name: "1.6T OSFP-XD DR8", rate: "1.6T", formFactor: "OSFP-XD", reach: "500m", optics: "DR8 200G/lane", laser: "EML", powerW: 22, released: "2025", note: "First 1.6T volume; 200G/lane PAM4." },
  { id: "1.6t-2xfr4", vendor: "coherent", vendorName: "Coherent", name: "1.6T OSFP-XD 2xFR4", rate: "1.6T", formFactor: "OSFP-XD", reach: "2km", optics: "2xFR4", laser: "EML", powerW: 24, released: "2025" },
  { id: "1.6t-eopto", vendor: "eoptolink", vendorName: "Eoptolink", name: "1.6T OSFP-XD DR8", rate: "1.6T", formFactor: "OSFP-XD", reach: "500m", optics: "DR8", laser: "EML", powerW: 22, released: "2025" },

  // ── 400G — still huge install base
  { id: "400g-dr4", vendor: "innolight", vendorName: "Innolight", name: "400G QSFP-DD DR4", rate: "400G", formFactor: "QSFP-DD", reach: "500m", optics: "DR4", laser: "EML", powerW: 9, released: "2021" },
  { id: "400g-fr4", vendor: "lumentum", vendorName: "Lumentum (component)", name: "400G FR4 EML", rate: "400G", formFactor: "QSFP-DD", reach: "2km", optics: "FR4", laser: "EML", powerW: 10, released: "2020" },
  { id: "400g-zr", vendor: "acacia-cisco", vendorName: "Acacia/Cisco", name: "400ZR QSFP-DD", rate: "400G", formFactor: "QSFP-DD", reach: "120 km", optics: "Coherent ZR", laser: "InP", powerW: 14, released: "2021", note: "DCI campus interconnect." },

  // ── CPO (next-gen)
  { id: "cpo-tomahawk5", vendor: "broadcom", vendorName: "Broadcom", name: "Tomahawk 5 CPO 51.2T", rate: "800G", formFactor: "CPO", reach: "500m", optics: "Si Photonics", laser: "External CW", powerW: 0, released: "2024", note: "Co-packaged, no separate transceiver per port." },
  { id: "cpo-quantum-x", vendor: "nvidia", vendorName: "NVIDIA", name: "Quantum-X CPO", rate: "800G", formFactor: "CPO", reach: "—", optics: "Si Photonics", laser: "External", powerW: 0, released: "2025" },

  // ── 200G specialty / shorter
  { id: "200g-fr4", vendor: "innolight", vendorName: "Innolight", name: "200G QSFP56 FR4", rate: "200G", formFactor: "QSFP56", reach: "2km", optics: "FR4", laser: "EML", powerW: 5, released: "2020" },

  // ── 100G — legacy but still huge
  { id: "100g-lr4", vendor: "lumentum", vendorName: "Lumentum", name: "100G QSFP28 LR4", rate: "100G", formFactor: "QSFP56", reach: "10km", optics: "LR4", laser: "EML", powerW: 4, released: "2017", note: "Still the metro DCI workhorse." },
];
