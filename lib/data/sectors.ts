import type { Sector } from "../types";

export const SECTORS: Sector[] = [
  // ───────────────── Physical / Materials
  { id: "raw-materials", name: "Raw Materials", layer: "physical", short: "Mines & metals", desc: "Silicon, copper, gallium, germanium, neon, palladium, rare earths, uranium — the elemental inputs.", color: "#7a3030" },
  { id: "wafer-materials", name: "Wafer & Substrate Materials", layer: "physical", short: "Silicon wafers", desc: "300mm silicon, SiC/GaN substrates, photomasks, blank wafers feeding fabs.", color: "#8a3a3a" },
  { id: "specialty-chems", name: "Specialty Chemicals & Gases", layer: "physical", short: "Photoresist, gases", desc: "EUV photoresist, CMP slurries, deposition precursors, ultra-pure gases.", color: "#9a4444" },

  // ───────────────── Compute
  { id: "logic-semis", name: "Logic Semiconductors", layer: "compute", short: "GPUs, CPUs, ASICs", desc: "The compute brains — NVIDIA, AMD, Intel, Apple, Broadcom, plus ASIC merchants.", color: "#ff2a2a" },
  { id: "memory", name: "Memory & HBM", layer: "compute", short: "DRAM, HBM, NAND", desc: "HBM3E/HBM4 stacks, DDR5, GDDR7, and NAND that feed GPU bandwidth.", color: "#ff5050" },
  { id: "foundry", name: "Foundries", layer: "compute", short: "Fabs", desc: "TSMC, Samsung Foundry, Intel Foundry, GlobalFoundries, SMIC — where chips are physically printed.", color: "#ff3838" },
  { id: "litho-equip", name: "Lithography", layer: "compute", short: "EUV / DUV", desc: "ASML's EUV monopoly + Nikon/Canon DUV — the most strategic chokepoint on Earth.", color: "#ff6b35" },
  { id: "wfe", name: "Wafer Fab Equipment", layer: "compute", short: "Etch, deposition", desc: "Applied Materials, Lam, KLA, Tokyo Electron — the rest of the fab toolset.", color: "#ff5a4a" },
  { id: "eda-ip", name: "EDA & IP", layer: "compute", short: "Chip design SW + IP", desc: "Synopsys, Cadence, Siemens EDA, Arm, and the RISC-V ecosystem.", color: "#cc3030" },
  { id: "packaging", name: "Advanced Packaging", layer: "compute", short: "CoWoS, HBM stacks", desc: "TSMC CoWoS, Intel Foveros, ASE, Amkor — 2.5D/3D integration for AI accelerators.", color: "#e04040" },

  // ───────────────── Network
  { id: "networking-silicon", name: "Networking Silicon", layer: "network", short: "Switch / DPU chips", desc: "Broadcom Tomahawk/Jericho, NVIDIA Spectrum/BlueField, Marvell — cluster fabric.", color: "#ff7a4d" },
  { id: "optical", name: "Optical Modules", layer: "network", short: "800G / 1.6T", desc: "Coherent, Lumentum, Innolight, Eoptolink — pluggable transceivers and CPO.", color: "#ff8a5a" },
  { id: "fiber", name: "Fiber & Cable Plant", layer: "network", short: "Glass + connectors", desc: "Corning, Prysmian, CommScope, Sumitomo — the literal glass between racks and DCs.", color: "#ff9a6a" },
  { id: "cabling", name: "Interconnect & Connectors", layer: "network", short: "Copper, AEC, AOC", desc: "Amphenol, TE Connectivity, Molex, Astera Labs — backplanes, retimers, copper inside the rack.", color: "#ffaa7a" },

  // ───────────────── Servers / Storage / Cooling
  { id: "servers-odm", name: "Servers & ODMs", layer: "compute", short: "GPU systems", desc: "Supermicro, Dell, HPE, Lenovo + Quanta, Wiwynn, Foxconn building hyperscaler racks.", color: "#d04040" },
  { id: "storage", name: "Storage Systems", layer: "compute", short: "All-flash, scale-out", desc: "Vast Data, Pure Storage, NetApp, WDC, Seagate, Solidigm — training data lakes.", color: "#b54040" },
  { id: "cooling", name: "Cooling", layer: "physical", short: "Liquid + air", desc: "Vertiv, Asetek, CoolIT, JetCool, Submer — direct-to-chip and immersion for >100kW racks.", color: "#a35050" },
  { id: "power-equip", name: "Power Equipment", layer: "energy", short: "UPS, switchgear", desc: "Vertiv, Schneider, Eaton, ABB, Generac, Cummins, Caterpillar — DC electrical backbone.", color: "#ff6b6b" },

  // ───────────────── Energy
  { id: "energy-utilities", name: "Utilities & IPPs", layer: "energy", short: "Grid power", desc: "Constellation, Vistra, Talen, NextEra, Duke — the grid contracting with hyperscalers.", color: "#ff4040" },
  { id: "nuclear", name: "Nuclear", layer: "energy", short: "SMRs + fuel", desc: "Cameco, BWXT, NuScale, Oklo, X-Energy, Westinghouse — baseload for the AI buildout.", color: "#cc2020" },
  { id: "renewables", name: "Renewables & Storage", layer: "energy", short: "Solar, wind, BESS", desc: "First Solar, Nextracker, Fluence, Tesla Energy — PPAs and behind-the-meter for DCs.", color: "#e05a3a" },

  // ───────────────── Platform
  { id: "data-centers", name: "Data Center Operators", layer: "platform", short: "Colo + wholesale", desc: "Equinix, Digital Realty, CyrusOne, QTS, Iron Mountain, Stack — the physical buildings.", color: "#ff3030" },
  { id: "hyperscalers", name: "Hyperscalers", layer: "platform", short: "AWS, Azure, GCP", desc: "Microsoft, Google, AWS, Meta, Oracle — the largest capex in human history.", color: "#ff1a1a" },
  { id: "neoclouds", name: "Neoclouds", layer: "platform", short: "GPU-native clouds", desc: "CoreWeave, Lambda, Crusoe, Nebius, Together AI, Voltage Park — pure-play GPU rentals.", color: "#ff4d4d" },
  { id: "construction", name: "DC Construction & EPC", layer: "platform", short: "Build & MEP", desc: "Turner, AECOM, JLL, Skanska, Holder, Rosendin, Kiewit — they actually build the buildings.", color: "#a04040" },

  // ───────────────── Intelligence
  { id: "ai-labs", name: "AI Labs & Model Cos", layer: "intelligence", short: "Frontier models", desc: "OpenAI, Anthropic, Google DeepMind, xAI, Meta AI, Mistral — the demand engine.", color: "#ff0000" },
  { id: "robotics-automation", name: "Robotics & Automation", layer: "intelligence", short: "Embodied AI", desc: "Figure, Tesla Optimus, Boston Dynamics, Agility, 1X — downstream consumers of inference.", color: "#ff5f1a" },

  // ───────────────── Capital
  { id: "finance", name: "Capital & Financing", layer: "capital", short: "Funders & vehicles", desc: "Blackstone, Brookfield, KKR, sovereign wealth, MGX, Stargate — funding the buildout.", color: "#660000" },

  // ───────────────── New layers (expanded coverage)
  { id: "rare-gases", name: "Rare Gases & Chokepoint Inputs", layer: "physical", short: "Neon, helium, krypton", desc: "Ukraine ~50% global neon, US/Qatar helium, krypton/xenon — the fab gas chokepoints.", color: "#993333" },
  { id: "test-measurement", name: "Test, Burn-in & Probe", layer: "compute", short: "ATE + probe", desc: "Teradyne, Advantest, FormFactor — every chip is tested twice; AI test intensity exploding.", color: "#ff5050" },
  { id: "edge-iot", name: "Edge & On-Device AI", layer: "compute", short: "Phones, NPUs, glasses", desc: "Qualcomm, Apple, MediaTek, Hailo — inference moving to phones, PCs, cars, glasses.", color: "#ff8060" },
  { id: "telecom-dci", name: "Long-Haul & Submarine", layer: "network", short: "DCI + cables", desc: "Lumen, Zayo, SubCom, NEC — terrestrial dark fiber + 600+ Tbps submarine cables.", color: "#ffaa80" },
  { id: "ai-software-stack", name: "AI Software Stack", layer: "platform", short: "CUDA, frameworks, MLOps", desc: "PyTorch, JAX, vLLM, Ray, Hugging Face, Databricks — the layer between model and metal.", color: "#cc4444" },
  { id: "data-platform", name: "Data & Vector Platform", layer: "platform", short: "Lakes + vectors + RAG", desc: "Snowflake, Databricks, Pinecone, Weaviate, MongoDB — the data substrate of training & RAG.", color: "#bb4040" },
  { id: "ai-security", name: "AI Security & Trust", layer: "platform", short: "Model + infra security", desc: "Cloudflare, Wiz, CrowdStrike, Lakera, Robust Intelligence — defending the new attack surface.", color: "#993030" },
  { id: "real-estate-land", name: "Land, Permitting & Sites", layer: "platform", short: "Sites + interconnect rights", desc: "JLL, CBRE, Cushman, plus land bankers and permitting specialists.", color: "#883030" },
  { id: "carbon-water", name: "Water, Cooling Fluids & Carbon", layer: "energy", short: "PFAS-free, cold water", desc: "Chemours/Solvay (cooling fluids), Veolia (water), carbon offset and clean-firm matchers.", color: "#cc5040" },
  { id: "humanoid-supply", name: "Humanoid Robot Supply", layer: "intelligence", short: "Actuators, batteries, sensors", desc: "Harmonic Drive, Maxon, Sanyo Denki, Sony image sensors — supply chain behind embodied AI.", color: "#ff7733" },
  { id: "quantum", name: "Quantum Compute (Adjacent)", layer: "compute", short: "QPU + cryo", desc: "IBM, IonQ, Quantinuum, PsiQuantum, Rigetti, Atom Computing — long horizon, real spend now.", color: "#aa5050" },
  { id: "photonics-research", name: "Silicon Photonics R&D", layer: "network", short: "On-chip light", desc: "Ayar Labs, Lightmatter, Celestial AI, Coherent — co-packaged optics + optical compute frontier.", color: "#ffbb88" },
];

export const SECTOR_BY_ID = Object.fromEntries(SECTORS.map(s => [s.id, s])) as Record<string, Sector>;

export const LAYER_ORDER: Sector["layer"][] = [
  "physical", "compute", "network", "energy", "platform", "intelligence", "capital"
];

export const LAYER_LABEL: Record<Sector["layer"], string> = {
  physical: "Physical Layer",
  compute: "Compute Layer",
  network: "Network Layer",
  energy: "Energy Layer",
  platform: "Platform Layer",
  intelligence: "Intelligence Layer",
  capital: "Capital Layer",
};
