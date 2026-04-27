import type { DcCampus } from "../../catalog-types";

export const DATACENTERS: DcCampus[] = [
  // ── OpenAI / Stargate
  { id: "stargate-abilene", name: "Stargate Abilene I", operator: "Crusoe + Oracle", operatorId: "crusoe",
    location: "Abilene, TX", region: "ERCOT", capacityMW: 1200, ultimateMW: 1200, liveMW: 200,
    primaryTenants: ["OpenAI"], cooling: "Liquid", powerSource: "Gas + grid", status: "Under Construction",
    note: "Phase 1 ~$50B; first Stargate site." },
  { id: "stargate-uae", name: "Stargate UAE", operator: "G42 + OpenAI + Oracle",
    location: "Abu Dhabi", region: "UAE", capacityMW: 5000, status: "Announced",
    primaryTenants: ["OpenAI", "G42"], cooling: "Liquid", powerSource: "Solar + nuclear",
    note: "5GW UAE node of Stargate." },

  // ── xAI Colossus
  { id: "colossus1", name: "xAI Colossus 1", operator: "xAI", operatorId: "xai",
    location: "Memphis, TN", region: "TVA", capacityMW: 250, ultimateMW: 350, liveMW: 250,
    primaryTenants: ["xAI"], cooling: "Liquid", powerSource: "Gas turbines + grid", status: "Operating",
    note: "100k H100 → 200k H100/H200; built in months." },
  { id: "colossus2", name: "xAI Colossus 2", operator: "xAI",
    location: "Memphis, TN", region: "TVA", capacityMW: 1500, status: "Under Construction",
    primaryTenants: ["xAI"], cooling: "Liquid", note: "Targeting 1M+ GPU." },

  // ── Meta
  { id: "meta-hyperion", name: "Meta Hyperion (Richland Parish)", operator: "Meta", operatorId: "meta",
    location: "Richland Parish, LA", region: "Entergy", capacityMW: 2000, ultimateMW: 5000,
    primaryTenants: ["Meta"], status: "Under Construction",
    note: "Up to 5GW campus; powered by Entergy with new gas + renewables." },
  { id: "meta-prineville", name: "Meta Prineville", operator: "Meta",
    location: "Prineville, OR", region: "PacifiCorp", capacityMW: 850, liveMW: 850,
    primaryTenants: ["Meta"], status: "Operating", note: "Original Meta DC; multi-phase." },

  // ── Microsoft
  { id: "ms-mt-pleasant", name: "Microsoft Mt. Pleasant", operator: "Microsoft", operatorId: "microsoft",
    location: "Mt. Pleasant, WI", region: "WE Energies", capacityMW: 600, status: "Under Construction",
    primaryTenants: ["Microsoft / OpenAI"], note: "Major Foxconn-site repurpose." },
  { id: "ms-azure-east", name: "Microsoft Azure East (Boydton)", operator: "Microsoft",
    location: "Boydton, VA", region: "Dominion", capacityMW: 1500, liveMW: 1500,
    primaryTenants: ["Microsoft"], status: "Operating", note: "One of largest US DC complexes." },
  { id: "ms-tmi", name: "Microsoft TMI nuclear PPA", operator: "Microsoft",
    location: "Middletown, PA", region: "PJM", capacityMW: 835, status: "Announced",
    primaryTenants: ["Microsoft"], powerSource: "Nuclear (TMI Unit 1 restart)", note: "20-yr PPA from Constellation." },

  // ── AWS
  { id: "aws-cumulus", name: "AWS Cumulus (Susquehanna BTM)", operator: "AWS", operatorId: "amazon",
    location: "Salem Twp, PA", region: "PJM", capacityMW: 960, status: "Operating",
    primaryTenants: ["AWS"], powerSource: "Nuclear (Susquehanna BTM)", note: "First major BTM nuclear DC; FERC dispute." },
  { id: "aws-rainier", name: "AWS Project Rainier", operator: "AWS",
    location: "St. Joseph County, IN", region: "AEP", capacityMW: 2200, status: "Under Construction",
    primaryTenants: ["Anthropic"], note: "400k Trainium2 chips for Anthropic." },

  // ── Google
  { id: "google-council-bluffs", name: "Google Council Bluffs", operator: "Google", operatorId: "google",
    location: "Council Bluffs, IA", region: "MidAmerican", capacityMW: 1200, liveMW: 1200,
    primaryTenants: ["Google"], status: "Operating", note: "Largest Google DC by MW." },
  { id: "google-quincy", name: "Google The Dalles + Quincy", operator: "Google",
    location: "The Dalles, OR / Quincy, WA", region: "BPA + PUD", capacityMW: 600, status: "Operating",
    primaryTenants: ["Google"] },

  // ── Oracle
  { id: "oracle-stargate", name: "Oracle Stargate (Abilene)", operator: "Oracle", operatorId: "oracle",
    location: "Abilene, TX", region: "ERCOT", capacityMW: 1200,
    primaryTenants: ["OpenAI"], status: "Under Construction", note: "Co-located with Crusoe build." },

  // ── CoreWeave
  { id: "cw-plano", name: "CoreWeave Plano", operator: "CoreWeave", operatorId: "coreweave",
    location: "Plano, TX", region: "ERCOT", capacityMW: 200, status: "Operating",
    primaryTenants: ["Microsoft", "OpenAI"] },
  { id: "cw-mn", name: "CoreWeave Mankato (Applied Digital)", operator: "Applied Digital",
    location: "Ellendale, ND", region: "MISO", capacityMW: 400, ultimateMW: 1100, status: "Under Construction",
    primaryTenants: ["CoreWeave"], note: "15-year CoreWeave anchor lease." },

  // ── Equinix flagships
  { id: "eqix-va8", name: "Equinix DC10 / DC15 (Ashburn)", operator: "Equinix", operatorId: "equinix",
    location: "Ashburn, VA", region: "Dominion", capacityMW: 60, status: "Operating",
    primaryTenants: ["AWS", "Microsoft", "Google peering"], note: "World's most-interconnected DC complex." },
  { id: "eqix-sg", name: "Equinix SG5 (Singapore)", operator: "Equinix",
    location: "Singapore", region: "SP Group", capacityMW: 30, status: "Operating", primaryTenants: ["Multi-cloud"] },

  // ── Digital Realty
  { id: "dlr-north-va", name: "Digital Realty PlatformDIGITAL Ashburn", operator: "Digital Realty", operatorId: "digital-realty",
    location: "Ashburn, VA", region: "Dominion", capacityMW: 350, status: "Operating",
    primaryTenants: ["Multi-hyperscaler"] },

  // ── European mega-builds
  { id: "yondr-ams", name: "Yondr Amsterdam", operator: "Yondr", location: "Amsterdam", region: "Tennet",
    capacityMW: 80, status: "Operating", primaryTenants: ["Hyperscaler (undisclosed)"] },
  { id: "vantage-frankfurt", name: "Vantage Frankfurt", operator: "Vantage", location: "Frankfurt", region: "TenneT",
    capacityMW: 240, ultimateMW: 240, status: "Under Construction", primaryTenants: ["Hyperscaler"] },

  // ── APAC
  { id: "airtrunk-syd", name: "AirTrunk Sydney West", operator: "AirTrunk (Blackstone)", location: "Sydney West", region: "AEMO",
    capacityMW: 320, status: "Operating", primaryTenants: ["Hyperscaler"] },
  { id: "g42-uae", name: "G42 Khazna Tahnoun Park", operator: "Khazna / G42", location: "Abu Dhabi", region: "EWEC",
    capacityMW: 200, status: "Operating", primaryTenants: ["G42 / Microsoft"] },

  // ── China hyperscalers (selected)
  { id: "alibaba-zhangbei", name: "Alibaba Zhangbei", operator: "Alibaba", operatorId: "alibaba",
    location: "Zhangbei, China", region: "State Grid", capacityMW: 600, status: "Operating",
    primaryTenants: ["Alibaba Cloud"] },
  { id: "tencent-tianjin", name: "Tencent Tianjin", operator: "Tencent", operatorId: "tencent",
    location: "Tianjin, China", region: "State Grid", capacityMW: 400, status: "Operating",
    primaryTenants: ["Tencent Cloud"] },
];
