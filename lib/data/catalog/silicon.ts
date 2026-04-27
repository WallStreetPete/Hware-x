import type { SiliconProduct } from "../../catalog-types";

export const SILICON: SiliconProduct[] = [
  // ─────────── NVIDIA Datacenter GPUs
  { id: "h100-sxm", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "H100 SXM", released: "2022", process: "TSMC N4", transistors: "80B", memory: "80GB HBM3", bandwidth: "3.35 TB/s", tdpW: 700, perfFP16: "1979 TFLOPS", perfFP8: "3958 TFLOPS", msrpUSD: 30000, segment: "Datacenter", notes: "Hopper. The default 2022-24 AI training GPU." },
  { id: "h200", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "H200", released: "2024", process: "TSMC N4", transistors: "80B", memory: "141GB HBM3E", bandwidth: "4.8 TB/s", tdpW: 700, perfFP16: "1979 TFLOPS", perfFP8: "3958 TFLOPS", msrpUSD: 35000, segment: "Datacenter", notes: "Hopper refresh with HBM3E — bigger memory only." },
  { id: "b200", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "B200", released: "2024", process: "TSMC N4P", transistors: "208B (dual-die)", memory: "192GB HBM3E", bandwidth: "8 TB/s", tdpW: 1000, perfFP8: "9000 TFLOPS", perfFP4: "18000 TFLOPS", msrpUSD: 40000, segment: "Datacenter", notes: "Blackwell. 5× perf vs H100 at FP4." },
  { id: "gb200", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GB200 (Grace+B200)", released: "2024", process: "TSMC N4P", memory: "384GB HBM3E", bandwidth: "16 TB/s", tdpW: 2700, perfFP4: "40000 TFLOPS", msrpUSD: 70000, segment: "Datacenter", notes: "Superchip: 1 Grace CPU + 2 B200 GPUs over NVLink-C2C." },
  { id: "gb300", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GB300 NVL72 / Blackwell Ultra", released: "2025", process: "TSMC N4P", memory: "288GB HBM3E (per GPU)", bandwidth: "8 TB/s", tdpW: 1400, perfFP4: "30000 TFLOPS", segment: "Datacenter", notes: "Mid-cycle Blackwell refresh, larger HBM stacks." },
  { id: "gb300nvl72", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GB200 NVL72 (rack)", released: "2024", process: "TSMC N4P", memory: "13.5TB HBM3E", bandwidth: "576 TB/s rack", tdpW: 120000, perfFP4: "1.4 EFLOPS", msrpUSD: 3000000, segment: "Datacenter", notes: "72 B200 + 36 Grace, full liquid-cooled rack." },
  { id: "rubin-r100", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "Rubin R100 (preview)", released: "2026", process: "TSMC N3P", memory: "HBM4", bandwidth: ">10 TB/s", tdpW: 1800, segment: "Datacenter", notes: "Next-gen architecture; first HBM4 GPU." },
  { id: "h20", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "H20", released: "2024", process: "TSMC N4", memory: "96GB HBM3", bandwidth: "4 TB/s", tdpW: 400, perfFP8: "296 TFLOPS", segment: "Datacenter", notes: "China-only export-compliant Hopper variant." },
  { id: "l40s", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "L40S", released: "2023", process: "TSMC N5", memory: "48GB GDDR6", bandwidth: "864 GB/s", tdpW: 350, perfFP8: "733 TFLOPS", msrpUSD: 8000, segment: "Datacenter", notes: "Ada-gen for inference + visual compute." },

  // ─────────── NVIDIA Workstation / Consumer GPUs
  { id: "rtx6000-ada", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "RTX 6000 Ada", released: "2022", process: "TSMC N5", memory: "48GB GDDR6", bandwidth: "960 GB/s", tdpW: 300, msrpUSD: 6800, segment: "Workstation" },
  { id: "rtx5090", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GeForce RTX 5090", released: "2025-01", process: "TSMC 4N", memory: "32GB GDDR7", bandwidth: "1.79 TB/s", tdpW: 575, msrpUSD: 1999, segment: "Consumer", notes: "Blackwell consumer flagship." },
  { id: "rtx5080", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GeForce RTX 5080", released: "2025-01", process: "TSMC 4N", memory: "16GB GDDR7", bandwidth: "960 GB/s", tdpW: 360, msrpUSD: 999, segment: "Consumer" },
  { id: "rtx5070ti", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GeForce RTX 5070 Ti", released: "2025-02", process: "TSMC 4N", memory: "16GB GDDR7", bandwidth: "896 GB/s", tdpW: 300, msrpUSD: 749, segment: "Consumer" },
  { id: "rtx5070", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GeForce RTX 5070", released: "2025-03", process: "TSMC 4N", memory: "12GB GDDR7", bandwidth: "672 GB/s", tdpW: 250, msrpUSD: 549, segment: "Consumer" },
  { id: "rtx4090", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GeForce RTX 4090", released: "2022-10", process: "TSMC 4N", memory: "24GB GDDR6X", bandwidth: "1 TB/s", tdpW: 450, msrpUSD: 1599, segment: "Consumer", notes: "The grey-market AI workstation favorite." },
  { id: "rtx4080", vendor: "nvidia", vendorName: "NVIDIA", family: "GPU", name: "GeForce RTX 4080 Super", released: "2024-01", process: "TSMC 4N", memory: "16GB GDDR6X", bandwidth: "736 GB/s", tdpW: 320, msrpUSD: 999, segment: "Consumer" },

  // ─────────── AMD Datacenter GPUs
  { id: "mi300x", vendor: "amd", vendorName: "AMD", family: "GPU", name: "Instinct MI300X", released: "2023-12", process: "TSMC N5/N6 chiplet", transistors: "153B", memory: "192GB HBM3", bandwidth: "5.3 TB/s", tdpW: 750, perfFP16: "1307 TFLOPS", perfFP8: "2615 TFLOPS", msrpUSD: 15000, segment: "Datacenter", notes: "192GB HBM advantage over H100; key Microsoft / Meta inference win." },
  { id: "mi325x", vendor: "amd", vendorName: "AMD", family: "GPU", name: "Instinct MI325X", released: "2024-Q4", process: "TSMC N5/N6 chiplet", memory: "256GB HBM3E", bandwidth: "6 TB/s", tdpW: 1000, perfFP8: "2615 TFLOPS", segment: "Datacenter", notes: "MI300X refresh with HBM3E." },
  { id: "mi350x", vendor: "amd", vendorName: "AMD", family: "GPU", name: "Instinct MI350X", released: "2025", process: "TSMC N3", memory: "288GB HBM3E", bandwidth: "8 TB/s", tdpW: 1000, perfFP4: "9200 TFLOPS", segment: "Datacenter", notes: "CDNA4; first AMD GPU at FP4." },
  { id: "mi400", vendor: "amd", vendorName: "AMD", family: "GPU", name: "Instinct MI400 (preview)", released: "2026", process: "TSMC N3P", memory: "HBM4", segment: "Datacenter", notes: "Rack-scale with shared memory; AMD's Blackwell-class response." },
  { id: "rx9070xt", vendor: "amd", vendorName: "AMD", family: "GPU", name: "Radeon RX 9070 XT", released: "2025-03", process: "TSMC N4P", memory: "16GB GDDR6", bandwidth: "640 GB/s", tdpW: 304, msrpUSD: 599, segment: "Consumer", notes: "RDNA4." },

  // ─────────── Intel GPUs / accelerators
  { id: "gaudi3", vendor: "intel", vendorName: "Intel", family: "AI Accel", name: "Gaudi 3", released: "2024", process: "TSMC N5", memory: "128GB HBM2E", bandwidth: "3.7 TB/s", tdpW: 900, perfFP8: "1835 TFLOPS", msrpUSD: 15000, segment: "Datacenter", notes: "Habana-derived. Aggressive perf/$ vs H100." },
  { id: "gaudi4", vendor: "intel", vendorName: "Intel", family: "AI Accel", name: "Gaudi 4 (planned)", released: "2026", process: "TSMC N3", memory: "HBM3E", segment: "Datacenter", notes: "Convergence with Falcon Shores." },
  { id: "arc-b580", vendor: "intel", vendorName: "Intel", family: "GPU", name: "Arc B580", released: "2024-12", process: "TSMC N5", memory: "12GB GDDR6", bandwidth: "456 GB/s", tdpW: 190, msrpUSD: 249, segment: "Consumer" },

  // ─────────── Apple GPUs (in M-series)
  { id: "m4-max", vendor: "apple", vendorName: "Apple", family: "GPU", name: "M4 Max GPU (40-core)", released: "2024-10", process: "TSMC N3E", memory: "Up to 128GB unified", bandwidth: "546 GB/s", tdpW: 60, perfFP16: "34 TFLOPS", segment: "Workstation" },
  { id: "m4-ultra", vendor: "apple", vendorName: "Apple", family: "GPU", name: "M4 Ultra GPU (preview)", released: "2025", process: "TSMC N3E", memory: "Up to 256GB unified", bandwidth: "1090 GB/s", tdpW: 130, segment: "Workstation" },

  // ─────────── Custom hyperscaler ASICs
  { id: "tpu-v5p", vendor: "google", vendorName: "Google", family: "AI Accel", name: "TPU v5p", released: "2023-12", process: "TSMC N5", memory: "95GB HBM3", bandwidth: "2.8 TB/s", tdpW: 600, perfFP16: "459 TFLOPS", segment: "Datacenter", notes: "Internal-use only. 8,960-chip pods." },
  { id: "tpu-v6e", vendor: "google", vendorName: "Google", family: "AI Accel", name: "TPU v6e (Trillium)", released: "2024", process: "TSMC N5", memory: "32GB HBM3", bandwidth: "1.6 TB/s", tdpW: 200, perfFP8: "918 TFLOPS", segment: "Datacenter", notes: "Inference-leaning Trillium." },
  { id: "tpu-v7", vendor: "google", vendorName: "Google", family: "AI Accel", name: "TPU v7 (Ironwood)", released: "2025", process: "TSMC N3", memory: "192GB HBM3E", bandwidth: "7.4 TB/s", tdpW: 800, perfFP8: "4614 TFLOPS", segment: "Datacenter", notes: "First TPU positioned head-on at NVIDIA Blackwell." },
  { id: "trainium2", vendor: "amazon", vendorName: "AWS", family: "AI Accel", name: "Trainium2", released: "2024-12", process: "TSMC N5", memory: "96GB HBM3", bandwidth: "2.9 TB/s", tdpW: 500, perfFP8: "1300 TFLOPS", segment: "Datacenter", notes: "Designed with Marvell. 400k-chip Project Rainier for Anthropic." },
  { id: "trainium3", vendor: "amazon", vendorName: "AWS", family: "AI Accel", name: "Trainium3 (preview)", released: "2026", process: "TSMC N3", memory: "HBM3E", perfFP8: "~3000 TFLOPS", segment: "Datacenter", notes: "Codeveloped with Marvell + Alchip." },
  { id: "inferentia2", vendor: "amazon", vendorName: "AWS", family: "AI Accel", name: "Inferentia2", released: "2023", process: "TSMC N7", memory: "32GB HBM2E", bandwidth: "820 GB/s", tdpW: 200, segment: "Datacenter" },
  { id: "mtia-v2", vendor: "meta", vendorName: "Meta", family: "AI Accel", name: "MTIA v2 (Artemis)", released: "2024", process: "TSMC N5", memory: "128GB LPDDR5", bandwidth: "1.28 TB/s", tdpW: 90, perfINT8: "354 TOPS", segment: "Datacenter", notes: "Meta-internal recommendation/inference." },
  { id: "maia100", vendor: "microsoft", vendorName: "Microsoft", family: "AI Accel", name: "Maia 100", released: "2023-11", process: "TSMC N5", memory: "64GB HBM2E", bandwidth: "1.6 TB/s", tdpW: 700, segment: "Datacenter", notes: "First MS-designed AI accelerator." },
  { id: "maia200", vendor: "microsoft", vendorName: "Microsoft", family: "AI Accel", name: "Maia 200 (planned)", released: "2025", process: "TSMC N3", memory: "HBM3E", segment: "Datacenter" },

  // ─────────── Specialty AI silicon
  { id: "wse3", vendor: "cerebras", vendorName: "Cerebras", family: "AI Accel", name: "WSE-3", released: "2024-03", process: "TSMC N5", transistors: "4 trillion", memory: "44GB on-die SRAM", bandwidth: "21 PB/s", tdpW: 23000, perfFP16: "125 PFLOPS", segment: "Datacenter", notes: "Wafer-scale. One 'chip' = 46,225 mm²." },
  { id: "groq-lpu", vendor: "groq", vendorName: "Groq", family: "AI Accel", name: "LPU v1 (GroqChip)", released: "2023", process: "GF 14nm", memory: "230MB SRAM", tdpW: 215, segment: "Datacenter", notes: "Deterministic SRAM; fastest token output for serving." },
  { id: "sn40l", vendor: "sambanova", vendorName: "SambaNova", family: "AI Accel", name: "SN40L", released: "2023", process: "TSMC N5", memory: "1.5TB HBM+DDR per node", segment: "Datacenter" },
  { id: "tt-blackhole", vendor: "tenstorrent", vendorName: "Tenstorrent", family: "AI Accel", name: "Blackhole p150a", released: "2024", process: "Samsung 6nm", memory: "32GB GDDR6", tdpW: 300, msrpUSD: 1299, segment: "Workstation", notes: "Open-source software stack; RISC-V coupled." },
  { id: "ascend-910c", vendor: "huawei", vendorName: "Huawei", family: "AI Accel", name: "Ascend 910C", released: "2024", process: "SMIC 7nm", memory: "128GB HBM2E", bandwidth: "3.2 TB/s", tdpW: 350, perfFP16: "640 TFLOPS", segment: "Datacenter", notes: "China's domestic NVIDIA replacement." },

  // ─────────── Server CPUs
  { id: "epyc-turin", vendor: "amd", vendorName: "AMD", family: "CPU", name: "EPYC 9005 'Turin'", released: "2024-10", process: "TSMC N3 (cores) / N6 (IO)", segment: "Datacenter", notes: "Up to 192 cores/384 threads. Zen 5." },
  { id: "epyc-bergamo", vendor: "amd", vendorName: "AMD", family: "CPU", name: "EPYC 9754 'Bergamo'", released: "2023", process: "TSMC N5", segment: "Datacenter", notes: "128 Zen 4c cores; cloud-density optimized." },
  { id: "xeon-6", vendor: "intel", vendorName: "Intel", family: "CPU", name: "Xeon 6 'Granite Rapids'", released: "2024-09", process: "Intel 3", segment: "Datacenter", notes: "Up to 128 P-cores." },
  { id: "xeon-sierra", vendor: "intel", vendorName: "Intel", family: "CPU", name: "Xeon 6 'Sierra Forest'", released: "2024-06", process: "Intel 3", segment: "Datacenter", notes: "Up to 288 E-cores; cloud-native." },
  { id: "grace", vendor: "nvidia", vendorName: "NVIDIA", family: "CPU", name: "Grace CPU", released: "2024", process: "TSMC N4", segment: "Datacenter", notes: "72-core Arm Neoverse V2; LPDDR5X-coherent with B200." },
  { id: "graviton4", vendor: "amazon", vendorName: "AWS", family: "CPU", name: "Graviton4", released: "2024", process: "TSMC N4", segment: "Datacenter", notes: "96 Arm Neoverse V2 cores; AWS internal." },
  { id: "cobalt100", vendor: "microsoft", vendorName: "Microsoft", family: "CPU", name: "Cobalt 100", released: "2023-11", process: "TSMC N5", segment: "Datacenter", notes: "128-core Arm Neoverse N2; Azure VMs." },
  { id: "axion", vendor: "google", vendorName: "Google", family: "CPU", name: "Axion", released: "2024", process: "TSMC N5", segment: "Datacenter", notes: "Arm Neoverse V2; first Google-designed CPU." },
  { id: "ampere-altra", vendor: "ampere", vendorName: "Ampere", family: "CPU", name: "Ampere One A192", released: "2024", process: "TSMC N5", segment: "Datacenter", notes: "192 Arm cores; cloud-native." },
  { id: "kunpeng-920", vendor: "huawei", vendorName: "Huawei", family: "CPU", name: "Kunpeng 920", released: "2019", process: "TSMC N7", segment: "Datacenter", notes: "64-core Arm; China-leading." },

  // ─────────── Consumer / Workstation CPUs
  { id: "ryzen-9-9950x", vendor: "amd", vendorName: "AMD", family: "CPU", name: "Ryzen 9 9950X", released: "2024-08", process: "TSMC N4P", tdpW: 170, msrpUSD: 649, segment: "Consumer", notes: "Zen 5; 16C/32T." },
  { id: "ryzen-9-9950x3d", vendor: "amd", vendorName: "AMD", family: "CPU", name: "Ryzen 9 9950X3D", released: "2025-03", process: "TSMC N4P", tdpW: 170, msrpUSD: 699, segment: "Consumer" },
  { id: "core-ultra-9", vendor: "intel", vendorName: "Intel", family: "CPU", name: "Core Ultra 9 285K", released: "2024-10", process: "TSMC N3 + Intel 20A", tdpW: 250, msrpUSD: 589, segment: "Consumer", notes: "Arrow Lake; first Core Ultra desktop." },
  { id: "snapdragon-x-elite", vendor: "qualcomm", vendorName: "Qualcomm", family: "CPU", name: "Snapdragon X Elite (X1E-84-100)", released: "2024", process: "TSMC N4", tdpW: 23, segment: "Mobile", notes: "12-core Oryon; 45 TOPS NPU; Copilot+ PC." },
  { id: "snapdragon-x2", vendor: "qualcomm", vendorName: "Qualcomm", family: "CPU", name: "Snapdragon X2 Elite", released: "2025", process: "TSMC N3", tdpW: 25, segment: "Mobile", notes: "Next-gen Oryon; >50 TOPS." },
  { id: "apple-m4", vendor: "apple", vendorName: "Apple", family: "CPU", name: "Apple M4", released: "2024-05", process: "TSMC N3E", tdpW: 22, segment: "Mobile" },
  { id: "apple-m4-pro", vendor: "apple", vendorName: "Apple", family: "CPU", name: "Apple M4 Pro", released: "2024-10", process: "TSMC N3E", tdpW: 40, segment: "Workstation" },
  { id: "apple-m4-max", vendor: "apple", vendorName: "Apple", family: "CPU", name: "Apple M4 Max", released: "2024-10", process: "TSMC N3E", tdpW: 60, segment: "Workstation" },

  // ─────────── DPUs / SmartNICs
  { id: "bluefield-3", vendor: "nvidia", vendorName: "NVIDIA", family: "DPU", name: "BlueField-3 DPU", released: "2023", process: "TSMC N7", tdpW: 150, segment: "Datacenter", notes: "16 Arm cores + 400Gb network offload." },
  { id: "bluefield-4", vendor: "nvidia", vendorName: "NVIDIA", family: "DPU", name: "BlueField-4 (announced)", released: "2026", process: "TSMC N4", segment: "Datacenter" },
  { id: "pensando-elba", vendor: "amd", vendorName: "AMD", family: "DPU", name: "Pensando Elba (P4)", released: "2023", process: "TSMC N7", tdpW: 100, segment: "Datacenter", notes: "Originally Pensando; AWS deployment." },

  // ─────────── Switch ASICs
  { id: "tomahawk5", vendor: "broadcom", vendorName: "Broadcom", family: "Switch ASIC", name: "Tomahawk 5", released: "2022", process: "TSMC N5", segment: "Datacenter", notes: "51.2 Tbps; the AI cluster default." },
  { id: "tomahawk6", vendor: "broadcom", vendorName: "Broadcom", family: "Switch ASIC", name: "Tomahawk 6", released: "2025", process: "TSMC N3", segment: "Datacenter", notes: "102.4 Tbps. CPO option." },
  { id: "jericho3-ai", vendor: "broadcom", vendorName: "Broadcom", family: "Switch ASIC", name: "Jericho3-AI", released: "2023", process: "TSMC N5", segment: "Datacenter", notes: "Deep buffer for scheduled fabrics." },
  { id: "spectrum-x", vendor: "nvidia", vendorName: "NVIDIA", family: "Switch ASIC", name: "Spectrum-X (SN5600)", released: "2024", process: "TSMC N5", segment: "Datacenter", notes: "51.2 Tbps Ethernet for AI." },
  { id: "quantum-x800", vendor: "nvidia", vendorName: "NVIDIA", family: "Switch ASIC", name: "Quantum-X800 (Q3400)", released: "2024", process: "TSMC N5", segment: "Datacenter", notes: "InfiniBand XDR 800Gb/s per port." },
  { id: "silicon-one-g200", vendor: "cisco", vendorName: "Cisco", family: "Switch ASIC", name: "Silicon One G200", released: "2023", process: "TSMC N5", segment: "Datacenter", notes: "51.2 Tbps multi-purpose." },
  { id: "teralynx-10", vendor: "marvell", vendorName: "Marvell", family: "Switch ASIC", name: "Teralynx 10", released: "2024", process: "TSMC N5", segment: "Datacenter", notes: "51.2 Tbps; alternative to Broadcom." },
];
