import type { NetworkSwitch } from "../../catalog-types";

export const SWITCHES: NetworkSwitch[] = [
  // NVIDIA
  { id: "sn5600", vendor: "nvidia", vendorName: "NVIDIA", name: "Spectrum-X SN5600", asic: "Spectrum-4", rateTbps: 51.2, portsTopology: "64x800G OSFP", ru: 2, released: "2024", note: "Ethernet AI fabric leader." },
  { id: "q3400", vendor: "nvidia", vendorName: "NVIDIA", name: "Quantum-X800 Q3400", asic: "Quantum-3", rateTbps: 144, portsTopology: "144x800Gb XDR", ru: 4, released: "2024", note: "InfiniBand XDR." },
  { id: "nvlink-switch", vendor: "nvidia", vendorName: "NVIDIA", name: "NVLink Switch (NVL72)", asic: "NVSwitch v4", rateTbps: 130, portsTopology: "72-GPU all-to-all", ru: 1, released: "2024", note: "Scale-up fabric inside the NVL72 rack." },
  // Arista (Tomahawk-based)
  { id: "arista-7060x6", vendor: "arista", vendorName: "Arista", name: "7060X6 800G", asic: "Tomahawk 5", rateTbps: 51.2, portsTopology: "64x800G OSFP", ru: 2, released: "2024" },
  { id: "arista-7800r4", vendor: "arista", vendorName: "Arista", name: "7800R4 modular", asic: "Jericho3-AI", rateTbps: 460, portsTopology: "Modular 800G", ru: 16, released: "2024", note: "Deep-buffer scheduled fabric." },
  { id: "arista-7060x5", vendor: "arista", vendorName: "Arista", name: "7060X5 400G", asic: "Tomahawk 4", rateTbps: 25.6, portsTopology: "32x400G", ru: 1, released: "2022" },
  // Cisco
  { id: "cisco-8500", vendor: "cisco", vendorName: "Cisco", name: "Nexus 9332E (Silicon One G200)", asic: "Silicon One G200", rateTbps: 51.2, portsTopology: "32x800G", ru: 2, released: "2024" },
  { id: "cisco-8200", vendor: "cisco", vendorName: "Cisco", name: "Nexus 8200 (G100)", asic: "Silicon One G100", rateTbps: 25.6, portsTopology: "32x400G", ru: 1, released: "2022" },
  // Juniper
  { id: "juniper-ptx10001", vendor: "juniper", vendorName: "Juniper", name: "PTX10001-36MR", asic: "Express 5", rateTbps: 14.4, portsTopology: "36x400G", ru: 1, released: "2023" },
  // Broadcom reference
  { id: "broadcom-th6", vendor: "broadcom", vendorName: "Broadcom", name: "Tomahawk 6 reference", asic: "Tomahawk 6", rateTbps: 102.4, portsTopology: "64x1.6T OSFP-XD", ru: 2, released: "2025", note: "First 102.4 Tbps single chip." },
  { id: "broadcom-th5cpo", vendor: "broadcom", vendorName: "Broadcom", name: "Tomahawk 5 CPO", asic: "Tomahawk 5", rateTbps: 51.2, portsTopology: "co-packaged optics", ru: 1, released: "2024", note: "First commercial CPO switch." },
  // White-box
  { id: "celestica-ds5000", vendor: "celestica", vendorName: "Celestica", name: "DS5000 (Tomahawk 5)", asic: "Tomahawk 5", rateTbps: 51.2, portsTopology: "32x800G", ru: 2, released: "2023", note: "Hyperscaler ODM white-box." },
  { id: "edgecore-aos800", vendor: "edgecore", vendorName: "Edgecore", name: "AOS-800 (TH5)", asic: "Tomahawk 5", rateTbps: 51.2, portsTopology: "32x800G", ru: 2, released: "2024" },
  // Marvell-based
  { id: "ufispace-teralynx10", vendor: "ufispace", vendorName: "UfiSpace", name: "S9601 (Teralynx 10)", asic: "Marvell Teralynx 10", rateTbps: 51.2, portsTopology: "32x800G OSFP", ru: 2, released: "2024" },
];
