export type SectorId =
  | "logic-semis"
  | "memory"
  | "foundry"
  | "litho-equip"
  | "wfe"
  | "eda-ip"
  | "packaging"
  | "wafer-materials"
  | "specialty-chems"
  | "networking-silicon"
  | "optical"
  | "fiber"
  | "cabling"
  | "servers-odm"
  | "storage"
  | "cooling"
  | "power-equip"
  | "energy-utilities"
  | "nuclear"
  | "renewables"
  | "data-centers"
  | "hyperscalers"
  | "neoclouds"
  | "ai-labs"
  | "construction"
  | "raw-materials"
  | "finance"
  | "robotics-automation"
  | "edge-iot"
  | "ai-software-stack"
  | "telecom-dci"
  | "real-estate-land"
  | "test-measurement"
  | "ai-security"
  | "data-platform"
  | "carbon-water"
  | "rare-gases"
  | "quantum"
  | "photonics-research"
  | "humanoid-supply";

export type Tier =
  | "core"      // foundational picks-and-shovels
  | "enabler"   // critical inputs
  | "platform"  // operators / hyperscalers
  | "demand";   // model labs, end users

export type Layer = "physical" | "compute" | "network" | "energy" | "platform" | "intelligence" | "capital";

export interface Video {
  title: string;
  url: string;       // full YouTube URL
  channel?: string;
  note?: string;
}

export interface Sector {
  id: SectorId;
  name: string;
  layer: Layer;
  short: string;
  desc: string;
  color: string; // hex for graph
}

export interface Company {
  id: string;
  name: string;
  ticker?: string;
  hq: string;
  founded?: number;
  sector: SectorId;
  tier: Tier;
  marketCapUSD?: number;     // billions
  revenueUSD?: number;       // billions, latest annual
  blurb: string;
  longDesc?: string;
  products: string[];
  upstream: string[];        // company ids they buy from
  downstream: string[];      // company ids they sell to
  competitors?: string[];
  moat?: string;
  risk?: string;
  url?: string;
}

export interface Technology {
  id: string;
  name: string;
  domain: SectorId | "cross";
  oneLiner: string;
  whatIsIt: string;
  howItsMade?: string[];     // ordered process steps
  keyMaterials?: string[];
  variants?: { name: string; note: string }[];
  topPlayers?: string[];     // company ids
  marketSnapshot?: string;
  metrics?: { label: string; value: string }[];
}

export interface Edge {
  from: string;     // company id or sector id
  to: string;
  kind: "supplies" | "funds" | "operates" | "buys-from" | "rivals" | "depends-on";
  weight?: number;  // 1-5
  note?: string;
}
