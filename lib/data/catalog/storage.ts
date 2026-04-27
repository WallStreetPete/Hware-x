import type { StorageSku } from "../../catalog-types";

export const STORAGE: StorageSku[] = [
  // ── Disaggregated / AI-native
  { id: "vast-ceres", name: "VAST DataStore (Ceres node)", vendor: "vast", vendorName: "VAST Data", type: "Disaggregated", capacityTB: 1024, formFactor: "1U C-node + JBOFs", perfGBs: 1500, note: "All-QLC + Optane (legacy) shared-everything." },
  { id: "weka-pod", name: "WEKA Pod", vendor: "weka", vendorName: "WEKA", type: "Disaggregated", capacityTB: 500, perfGBs: 720, note: "POSIX parallel FS for ML training." },
  { id: "ddn-exascaler", name: "DDN AI400X2", vendor: "ddn", vendorName: "DDN", type: "Disaggregated", capacityTB: 1500, perfGBs: 90, note: "Lustre-based ExaScaler appliance." },

  // ── All-flash arrays
  { id: "pure-flashblade", name: "Pure FlashBlade//EXA", vendor: "pure-storage", vendorName: "Pure Storage", type: "All-flash array", capacityTB: 1500, perfGBs: 1000, note: "Designed for AI training; Meta standard." },
  { id: "pure-flasharray", name: "Pure FlashArray//XL", vendor: "pure-storage", vendorName: "Pure Storage", type: "All-flash array", capacityTB: 5000, formFactor: "9U", perfGBs: 36, note: "Block storage flagship." },
  { id: "netapp-aff-c800", name: "NetApp AFF C800", vendor: "netapp", vendorName: "NetApp", type: "All-flash array", capacityTB: 8000, formFactor: "4U", perfGBs: 30 },
  { id: "dell-powerstore", name: "Dell PowerStore 9200T", vendor: "dell", vendorName: "Dell", type: "All-flash array", capacityTB: 3500, perfGBs: 25 },

  // ── QLC SSDs
  { id: "solidigm-d5p5336", name: "Solidigm D5-P5336 (61.44TB)", vendor: "solidigm", vendorName: "Solidigm", type: "QLC SSD", capacityTB: 61.44, formFactor: "U.2 / E1.L", perfGBs: 7, iops: "1M random read", note: "Highest cap QLC SSD; AI training data lake." },
  { id: "micron-6500-ion", name: "Micron 6500 ION (30.72TB)", vendor: "micron", vendorName: "Micron", type: "QLC SSD", capacityTB: 30.72, formFactor: "U.3", perfGBs: 6.8, iops: "1M random read" },
  { id: "kioxia-cd8p", name: "Kioxia CD8P-V (30.72TB)", vendor: "kioxia", vendorName: "Kioxia", type: "QLC SSD", capacityTB: 30.72, formFactor: "U.2 / U.3", perfGBs: 7.2 },
  { id: "samsung-pm1743", name: "Samsung PM1743 (15.36TB)", vendor: "samsung", vendorName: "Samsung", type: "TLC SSD", capacityTB: 15.36, formFactor: "U.2", perfGBs: 14, iops: "2.5M random read", note: "PCIe Gen5 enterprise." },

  // ── HDDs (nearline AI / training data lake)
  { id: "wdc-30tb", name: "WDC Ultrastar DC HC690 (30TB)", vendor: "wdc", vendorName: "Western Digital", type: "HDD", capacityTB: 30, formFactor: "3.5\"", perfGBs: 0.3, note: "Latest CMR/SMR; 11 disks." },
  { id: "seagate-mozaic", name: "Seagate Mozaic 3+ (32TB HAMR)", vendor: "seagate", vendorName: "Seagate", type: "HDD", capacityTB: 32, formFactor: "3.5\"", perfGBs: 0.27, note: "First volume HAMR; 60TB roadmap." },
  { id: "seagate-exos-x24", name: "Seagate Exos X24 (24TB CMR)", vendor: "seagate", vendorName: "Seagate", type: "HDD", capacityTB: 24, formFactor: "3.5\"", perfGBs: 0.28 },

  // ── Object / nearline / tape
  { id: "ms-datazrs", name: "MinIO Enterprise (object)", vendor: "minio", vendorName: "MinIO", type: "Object", note: "S3-compatible on-prem object." },
  { id: "ibm-storage-deep", name: "IBM Storage Tape TS1170", vendor: "ibm", vendorName: "IBM", type: "Object", capacityTB: 50, formFactor: "Tape", note: "50TB native tape; archive tier." },
];
