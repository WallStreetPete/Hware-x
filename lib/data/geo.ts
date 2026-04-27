// Geographic positions of every relevant asset in the AI infra universe.
// All coords WGS84 lat/lng. Add or correct entries — this is the seed and
// the gap-finder will append more over time.

export type AssetKind =
  | "fab"            // Semiconductor fabrication plant
  | "datacenter"     // Operating or under-construction DC campus
  | "nuclear"        // Nuclear power plant (commercial reactor or planned SMR)
  | "renewable"      // Major solar / wind / hydro plant tied to AI PPA
  | "gas-power"      // Major gas turbine / gas peaker for AI buildout
  | "mine"           // Mine for critical AI inputs (copper, lithium, uranium, rare earth, neon precursor)
  | "gas-extraction" // Natural gas field that feeds DC peaker plants
  | "oil-field"      // Major oil field (helium / neon co-product)
  | "rare-gas-plant" // Industrial gas / neon purification plant
  | "submarine-cable" // Landing station
  | "litho-plant";   // ASML or peer assembly

export type Asset = {
  id: string;
  name: string;
  kind: AssetKind;
  lat: number;
  lng: number;
  operator?: string;     // company name
  operatorId?: string;   // reference to a curated company id where applicable
  capacity?: string;     // e.g. "300 MW", "30,000 wpm", "1.2 GW"
  status?: "operating" | "under-construction" | "announced" | "shutdown";
  country?: string;
  city?: string;
  note?: string;
  url?: string;
};

export const ASSETS: Asset[] = [
  // ──────────────── Fabs (semiconductor fabrication)
  { id: "tsmc-fab18", name: "TSMC Fab 18 (N3/N2)", kind: "fab", lat: 22.9785, lng: 120.2738, operator: "TSMC", operatorId: "tsmc", capacity: "120k wpm N3", status: "operating", city: "Tainan", country: "Taiwan", note: "Leading-edge logic for NVIDIA, AMD, Apple." },
  { id: "tsmc-fab14", name: "TSMC Fab 14 (28-65nm)", kind: "fab", lat: 22.9712, lng: 120.2714, operator: "TSMC", operatorId: "tsmc", status: "operating", city: "Tainan", country: "Taiwan" },
  { id: "tsmc-fab12", name: "TSMC Fab 12 (Hsinchu)", kind: "fab", lat: 24.7833, lng: 120.9967, operator: "TSMC", operatorId: "tsmc", capacity: "N5/N4", status: "operating", city: "Hsinchu", country: "Taiwan" },
  { id: "tsmc-az", name: "TSMC Arizona Fab 21 (N4/N3)", kind: "fab", lat: 33.7689, lng: -112.1352, operator: "TSMC", operatorId: "tsmc", capacity: "20k wpm N4 (Phase 1)", status: "operating", city: "Phoenix, AZ", country: "USA", note: "Apple A16 production ramped 2024." },
  { id: "tsmc-jasm", name: "TSMC JASM (Kumamoto)", kind: "fab", lat: 32.8810, lng: 130.7415, operator: "TSMC / Sony", operatorId: "tsmc", capacity: "55k wpm 22-28nm", status: "operating", city: "Kumamoto", country: "Japan" },

  { id: "samsung-pyeongtaek", name: "Samsung Pyeongtaek Campus", kind: "fab", lat: 37.0381, lng: 127.0530, operator: "Samsung Foundry", operatorId: "samsung-foundry", capacity: "P1-P3 + P4 ramp", status: "operating", city: "Pyeongtaek", country: "South Korea" },
  { id: "samsung-hwaseong", name: "Samsung Hwaseong (V1 EUV)", kind: "fab", lat: 37.2103, lng: 127.0286, operator: "Samsung Foundry", operatorId: "samsung-foundry", capacity: "EUV logic", status: "operating", city: "Hwaseong", country: "South Korea" },
  { id: "samsung-taylor-tx", name: "Samsung Taylor (Tex 2nm)", kind: "fab", lat: 30.5705, lng: -97.4093, operator: "Samsung Foundry", operatorId: "samsung-foundry", status: "under-construction", city: "Taylor, TX", country: "USA" },

  { id: "intel-d1x", name: "Intel D1X (R&D + 18A)", kind: "fab", lat: 45.5482, lng: -122.9560, operator: "Intel Foundry", operatorId: "intel-foundry", capacity: "18A leading edge", status: "operating", city: "Hillsboro, OR", country: "USA" },
  { id: "intel-fab42", name: "Intel Fab 42 (Ocotillo)", kind: "fab", lat: 33.3221, lng: -111.7878, operator: "Intel Foundry", operatorId: "intel-foundry", capacity: "Intel 4 / Intel 3", status: "operating", city: "Chandler, AZ", country: "USA" },
  { id: "intel-ohio", name: "Intel Ohio One (Mt Pleasant)", kind: "fab", lat: 39.9612, lng: -82.7549, operator: "Intel Foundry", operatorId: "intel-foundry", capacity: "Future 18A/14A", status: "under-construction", city: "New Albany, OH", country: "USA" },
  { id: "intel-ireland", name: "Intel Fab 34 Leixlip", kind: "fab", lat: 53.3658, lng: -6.5067, operator: "Intel Foundry", operatorId: "intel-foundry", capacity: "Intel 4 EUV", status: "operating", city: "Leixlip", country: "Ireland" },

  { id: "skhynix-icheon", name: "SK Hynix Icheon M16", kind: "fab", lat: 37.2408, lng: 127.4775, operator: "SK Hynix", operatorId: "skhynix", capacity: "DRAM + HBM", status: "operating", city: "Icheon", country: "South Korea", note: "World's #1 HBM fab." },
  { id: "skhynix-cheongju", name: "SK Hynix Cheongju M15", kind: "fab", lat: 36.6349, lng: 127.4897, operator: "SK Hynix", operatorId: "skhynix", capacity: "NAND", status: "operating", city: "Cheongju", country: "South Korea" },
  { id: "skhynix-yongin", name: "SK Hynix Yongin M16+", kind: "fab", lat: 37.2410, lng: 127.1776, operator: "SK Hynix", operatorId: "skhynix", capacity: "Future DRAM cluster", status: "under-construction", city: "Yongin", country: "South Korea" },

  { id: "micron-boise", name: "Micron Boise R&D Fab", kind: "fab", lat: 43.5460, lng: -116.1147, operator: "Micron", operatorId: "micron", capacity: "DRAM R&D", status: "operating", city: "Boise, ID", country: "USA" },
  { id: "micron-clay", name: "Micron Clay NY Megafab", kind: "fab", lat: 43.1879, lng: -76.1748, operator: "Micron", operatorId: "micron", status: "under-construction", city: "Clay, NY", country: "USA", note: "Largest US semi-fab announced." },

  { id: "smic-shanghai", name: "SMIC Shanghai Fab", kind: "fab", lat: 31.0964, lng: 121.5832, operator: "SMIC", operatorId: "smic", capacity: "14nm + N+2", status: "operating", city: "Shanghai", country: "China" },
  { id: "smic-beijing", name: "SMIC Beijing", kind: "fab", lat: 39.7919, lng: 116.5070, operator: "SMIC", operatorId: "smic", capacity: "Mature nodes", status: "operating", city: "Beijing", country: "China" },

  { id: "asml-veldhoven", name: "ASML HQ + Final Assembly", kind: "litho-plant", lat: 51.4106, lng: 5.4566, operator: "ASML", operatorId: "asml", capacity: "EUV + High-NA", status: "operating", city: "Veldhoven", country: "Netherlands" },
  { id: "zeiss-oberkochen", name: "Zeiss SMT Optics Plant", kind: "litho-plant", lat: 48.7811, lng: 10.1003, operator: "Carl Zeiss SMT", operatorId: "zeiss", status: "operating", city: "Oberkochen", country: "Germany" },

  { id: "globalfoundries-ny", name: "GlobalFoundries Fab 8 (Malta)", kind: "fab", lat: 42.9573, lng: -73.7749, operator: "GlobalFoundries", operatorId: "globalfoundries", capacity: "12LP / 22FDX", status: "operating", city: "Malta, NY", country: "USA" },
  { id: "globalfoundries-dresden", name: "GlobalFoundries Dresden Fab 1", kind: "fab", lat: 51.1259, lng: 13.6749, operator: "GlobalFoundries", operatorId: "globalfoundries", capacity: "22FDX", status: "operating", city: "Dresden", country: "Germany" },

  // ──────────────── Data Centers (operating or under construction)
  { id: "dc-stargate-abilene", name: "Stargate Abilene (OpenAI)", kind: "datacenter", lat: 32.4487, lng: -99.7331, operator: "Crusoe + Oracle", operatorId: "crusoe", capacity: "1.2 GW", status: "under-construction", city: "Abilene, TX", country: "USA" },
  { id: "dc-xai-colossus", name: "xAI Colossus 1", kind: "datacenter", lat: 35.0775, lng: -89.9914, operator: "xAI", operatorId: "xai", capacity: "250 MW", status: "operating", city: "Memphis, TN", country: "USA" },
  { id: "dc-xai-colossus2", name: "xAI Colossus 2", kind: "datacenter", lat: 35.1450, lng: -90.0490, operator: "xAI", operatorId: "xai", capacity: "1.5 GW (target)", status: "under-construction", city: "Memphis, TN", country: "USA" },
  { id: "dc-meta-hyperion", name: "Meta Hyperion", kind: "datacenter", lat: 32.4193, lng: -91.7626, operator: "Meta", operatorId: "meta", capacity: "5 GW (ultimate)", status: "under-construction", city: "Richland Parish, LA", country: "USA" },
  { id: "dc-meta-prineville", name: "Meta Prineville", kind: "datacenter", lat: 44.3010, lng: -120.7960, operator: "Meta", operatorId: "meta", capacity: "850 MW", status: "operating", city: "Prineville, OR", country: "USA" },
  { id: "dc-ms-tmi", name: "Microsoft / TMI nuclear PPA", kind: "datacenter", lat: 40.1530, lng: -76.7250, operator: "Microsoft (Constellation PPA)", operatorId: "microsoft", capacity: "835 MW BTM nuclear", status: "announced", city: "Middletown, PA", country: "USA" },
  { id: "dc-ms-azure-east", name: "Microsoft Azure Boydton", kind: "datacenter", lat: 36.6671, lng: -78.3889, operator: "Microsoft", operatorId: "microsoft", capacity: "1.5 GW", status: "operating", city: "Boydton, VA", country: "USA" },
  { id: "dc-ms-mt-pleasant", name: "Microsoft Mt. Pleasant", kind: "datacenter", lat: 42.7269, lng: -87.8915, operator: "Microsoft", operatorId: "microsoft", capacity: "600 MW", status: "under-construction", city: "Mt. Pleasant, WI", country: "USA" },
  { id: "dc-aws-cumulus", name: "AWS Cumulus (Susquehanna BTM)", kind: "datacenter", lat: 41.0892, lng: -76.1450, operator: "AWS", operatorId: "amazon", capacity: "960 MW BTM nuclear", status: "operating", city: "Salem Twp, PA", country: "USA" },
  { id: "dc-google-council-bluffs", name: "Google Council Bluffs", kind: "datacenter", lat: 41.2619, lng: -95.8608, operator: "Google", operatorId: "google", capacity: "1.2 GW", status: "operating", city: "Council Bluffs, IA", country: "USA" },
  { id: "dc-google-the-dalles", name: "Google The Dalles", kind: "datacenter", lat: 45.6232, lng: -121.1934, operator: "Google", operatorId: "google", status: "operating", city: "The Dalles, OR", country: "USA" },
  { id: "dc-equinix-ashburn", name: "Equinix Ashburn IBX cluster", kind: "datacenter", lat: 39.0438, lng: -77.4874, operator: "Equinix", operatorId: "equinix", capacity: "60+ MW interconnect-dense", status: "operating", city: "Ashburn, VA", country: "USA", note: "World's most-interconnected DC complex." },
  { id: "dc-dlr-ashburn", name: "Digital Realty Ashburn campus", kind: "datacenter", lat: 39.0250, lng: -77.4480, operator: "Digital Realty", operatorId: "digital-realty", capacity: "350 MW", status: "operating", city: "Ashburn, VA", country: "USA" },
  { id: "dc-coreweave-plano", name: "CoreWeave Plano", kind: "datacenter", lat: 33.0198, lng: -96.6989, operator: "CoreWeave", operatorId: "coreweave", capacity: "200 MW", status: "operating", city: "Plano, TX", country: "USA" },
  { id: "dc-applied-digital-nd", name: "Applied Digital Ellendale", kind: "datacenter", lat: 46.0030, lng: -98.5239, operator: "Applied Digital", operatorId: "applied-digital", capacity: "1.1 GW (ultimate)", status: "under-construction", city: "Ellendale, ND", country: "USA", note: "CoreWeave anchor lease." },
  { id: "dc-airtrunk-syd", name: "AirTrunk SYD1+", kind: "datacenter", lat: -33.7681, lng: 150.9047, operator: "AirTrunk (Blackstone)", capacity: "320 MW", status: "operating", city: "Sydney West", country: "Australia" },
  { id: "dc-g42-uae", name: "G42 Khazna Tahnoun Park", kind: "datacenter", lat: 24.4539, lng: 54.3773, operator: "G42 / Khazna", capacity: "200 MW", status: "operating", city: "Abu Dhabi", country: "UAE" },
  { id: "dc-alibaba-zhangbei", name: "Alibaba Zhangbei", kind: "datacenter", lat: 41.1561, lng: 114.7137, operator: "Alibaba", operatorId: "alibaba", capacity: "600 MW", status: "operating", city: "Zhangbei", country: "China" },

  // ──────────────── Nuclear (relevant to AI PPAs)
  { id: "nuc-tmi", name: "Three Mile Island Unit 1 (restart)", kind: "nuclear", lat: 40.1530, lng: -76.7250, operator: "Constellation", operatorId: "constellation", capacity: "835 MW (planned restart 2028)", status: "announced", city: "Middletown, PA", country: "USA", note: "Microsoft 20-yr PPA." },
  { id: "nuc-susquehanna", name: "Susquehanna Steam Electric", kind: "nuclear", lat: 41.0922, lng: -76.1494, operator: "Talen Energy", operatorId: "talen", capacity: "2,494 MW", status: "operating", city: "Salem Twp, PA", country: "USA", note: "AWS Cumulus BTM customer." },
  { id: "nuc-clinton", name: "Clinton Power Station", kind: "nuclear", lat: 40.1722, lng: -88.8331, operator: "Constellation", operatorId: "constellation", capacity: "1,069 MW", status: "operating", city: "Clinton, IL", country: "USA", note: "Meta nuclear LOI." },
  { id: "nuc-vogtle", name: "Plant Vogtle 1-4", kind: "nuclear", lat: 33.1419, lng: -81.7611, operator: "Southern Company", capacity: "4,536 MW", status: "operating", city: "Waynesboro, GA", country: "USA", note: "Vogtle 3+4: first new US nuclear in 30y." },
  { id: "nuc-comanche", name: "Comanche Peak", kind: "nuclear", lat: 32.2986, lng: -97.7858, operator: "Vistra", operatorId: "vistra", capacity: "2,300 MW", status: "operating", city: "Glen Rose, TX", country: "USA" },
  { id: "nuc-diablo", name: "Diablo Canyon", kind: "nuclear", lat: 35.2118, lng: -120.8553, operator: "PG&E", capacity: "2,256 MW", status: "operating", city: "Avila Beach, CA", country: "USA" },
  { id: "nuc-x-energy-tx", name: "X-Energy / Dow Seadrift", kind: "nuclear", lat: 28.4083, lng: -96.7100, operator: "X-Energy", operatorId: "x-energy", capacity: "320 MW (4× Xe-100)", status: "announced", city: "Seadrift, TX", country: "USA" },
  { id: "nuc-edf-flamanville", name: "EDF Flamanville EPR", kind: "nuclear", lat: 49.5378, lng: -1.8814, operator: "EDF", capacity: "1,650 MW", status: "operating", city: "Flamanville", country: "France" },

  // ──────────────── Major renewable / gas
  { id: "ren-firstsolar-az", name: "First Solar Series 7 manufacturing AZ", kind: "renewable", lat: 33.4484, lng: -112.0740, operator: "First Solar", operatorId: "first-solar", status: "operating", city: "Phoenix, AZ", country: "USA" },
  { id: "ren-tesla-megafactory-shanghai", name: "Tesla Megapack Shanghai", kind: "renewable", lat: 31.0892, lng: 121.7872, operator: "Tesla Energy", operatorId: "tesla", status: "operating", city: "Shanghai", country: "China" },
  { id: "gas-permian-fields", name: "Permian Basin (gas + oil)", kind: "gas-extraction", lat: 31.7619, lng: -102.0779, operator: "Multiple (XOM, CVX, OXY)", capacity: "~6 mboe/d gas + oil", status: "operating", city: "Midland, TX", country: "USA" },
  { id: "gas-marcellus", name: "Marcellus Shale (gas)", kind: "gas-extraction", lat: 41.0500, lng: -77.5500, operator: "Multiple", capacity: "~36 Bcf/d", status: "operating", country: "USA", note: "Drives PJM gas peakers serving DCs." },

  // ──────────────── Mines for AI inputs
  { id: "mine-mp-mountainpass", name: "Mountain Pass Rare Earth Mine", kind: "mine", lat: 35.4789, lng: -115.5378, operator: "MP Materials", operatorId: "mp-materials", capacity: "NdPr concentrates", status: "operating", city: "Mountain Pass, CA", country: "USA" },
  { id: "mine-cigar-lake", name: "Cigar Lake Uranium Mine", kind: "mine", lat: 58.0455, lng: -104.4836, operator: "Cameco", operatorId: "cameco", capacity: "18 Mlb U3O8/yr", status: "operating", city: "Saskatchewan", country: "Canada" },
  { id: "mine-mcarthur-river", name: "McArthur River Uranium Mine", kind: "mine", lat: 57.7642, lng: -105.0414, operator: "Cameco", operatorId: "cameco", status: "operating", city: "Saskatchewan", country: "Canada" },
  { id: "mine-escondida", name: "Escondida (copper)", kind: "mine", lat: -24.2667, lng: -69.0667, operator: "BHP / Rio Tinto", operatorId: "rio-tinto", capacity: "~1.1 Mt Cu/yr", status: "operating", city: "Antofagasta", country: "Chile", note: "Largest copper mine on Earth." },
  { id: "mine-grasberg", name: "Grasberg (copper + gold)", kind: "mine", lat: -4.0586, lng: 137.1208, operator: "Freeport-McMoRan", operatorId: "freeport", capacity: "~700kt Cu/yr", status: "operating", city: "Papua", country: "Indonesia" },
  { id: "mine-greenbushes", name: "Greenbushes (lithium)", kind: "mine", lat: -33.8523, lng: 116.0577, operator: "Albemarle / Tianqi / IGO", operatorId: "albemarle", capacity: "World's largest hard-rock Li", status: "operating", city: "Greenbushes WA", country: "Australia" },
  { id: "mine-bayan-obo", name: "Bayan Obo (rare earth)", kind: "mine", lat: 41.7639, lng: 109.9889, operator: "China Northern Rare Earth", capacity: "World's largest REE deposit", status: "operating", city: "Inner Mongolia", country: "China" },

  // ──────────────── Helium / neon plants
  { id: "rg-iceblick-odesa", name: "Iceblick / Ingas Neon (Odesa)", kind: "rare-gas-plant", lat: 46.4825, lng: 30.7233, operator: "Iceblick / Ingas", capacity: "~50% global semi-grade neon", status: "operating", city: "Odesa", country: "Ukraine" },
  { id: "rg-qatar-helium", name: "Qatar Helium 1 + 2", kind: "rare-gas-plant", lat: 25.9120, lng: 51.5340, operator: "RasGas", capacity: "Largest helium plant globally", status: "operating", city: "Ras Laffan", country: "Qatar" },
  { id: "rg-cliffside-helium", name: "Cliffside Federal Helium Reserve", kind: "rare-gas-plant", lat: 35.4400, lng: -101.9310, operator: "BLM (US Federal)", capacity: "Strategic helium reserve", status: "operating", city: "Amarillo, TX", country: "USA" },

  // ──────────────── Additional fabs (added by gap-finder iteration)
  { id: "tsmc-fab15", name: "TSMC Fab 15 (Taichung)", kind: "fab", lat: 24.2647, lng: 120.6517, operator: "TSMC", operatorId: "tsmc", capacity: "16/12nm logic", status: "operating", city: "Taichung", country: "Taiwan" },
  { id: "tsmc-fab16", name: "TSMC Fab 16 (Nanjing)", kind: "fab", lat: 32.0584, lng: 118.7964, operator: "TSMC", operatorId: "tsmc", capacity: "16nm + 28nm", status: "operating", city: "Nanjing", country: "China" },
  { id: "tsmc-fab20", name: "TSMC Fab 20 (Hsinchu N2)", kind: "fab", lat: 24.7745, lng: 121.0438, operator: "TSMC", operatorId: "tsmc", capacity: "N2 leading edge (2025)", status: "under-construction", city: "Hsinchu", country: "Taiwan" },
  { id: "tsmc-dresden", name: "TSMC ESMC Dresden", kind: "fab", lat: 51.0904, lng: 13.7019, operator: "TSMC + Bosch + Infineon + NXP", operatorId: "tsmc", capacity: "12/16/28nm specialty", status: "under-construction", city: "Dresden", country: "Germany" },
  { id: "samsung-austin", name: "Samsung Austin Fab", kind: "fab", lat: 30.4007, lng: -97.7195, operator: "Samsung Foundry", operatorId: "samsung-foundry", capacity: "14nm + 28nm", status: "operating", city: "Austin, TX", country: "USA" },
  { id: "intel-magdeburg", name: "Intel Magdeburg Fabs (paused)", kind: "fab", lat: 52.1205, lng: 11.6276, operator: "Intel Foundry", operatorId: "intel-foundry", capacity: "Future leading-edge (paused 2024)", status: "announced", city: "Magdeburg", country: "Germany" },
  { id: "intel-rio-rancho", name: "Intel Rio Rancho NM", kind: "fab", lat: 35.2900, lng: -106.6730, operator: "Intel Foundry", operatorId: "intel-foundry", capacity: "Foveros packaging", status: "operating", city: "Rio Rancho, NM", country: "USA" },
  { id: "skhynix-wuxi", name: "SK Hynix Wuxi", kind: "fab", lat: 31.4912, lng: 120.3119, operator: "SK Hynix", operatorId: "skhynix", capacity: "DRAM (China)", status: "operating", city: "Wuxi", country: "China" },
  { id: "micron-hiroshima", name: "Micron Hiroshima Fab", kind: "fab", lat: 34.5350, lng: 132.7200, operator: "Micron", operatorId: "micron", capacity: "DRAM 1-gamma EUV", status: "operating", city: "Hiroshima", country: "Japan" },
  { id: "kioxia-yokkaichi", name: "Kioxia Yokkaichi NAND Fab", kind: "fab", lat: 34.9667, lng: 136.6167, operator: "Kioxia + WD", operatorId: "kioxia", capacity: "World's largest NAND fab", status: "operating", city: "Yokkaichi", country: "Japan" },
  { id: "samsung-xian", name: "Samsung Xi'an NAND", kind: "fab", lat: 34.3416, lng: 108.9398, operator: "Samsung", operatorId: "samsung", capacity: "China NAND", status: "operating", city: "Xi'an", country: "China" },

  // ──────────────── Additional data center campuses
  { id: "dc-meta-clonee", name: "Meta Clonee (Ireland)", kind: "datacenter", lat: 53.3953, lng: -6.4147, operator: "Meta", operatorId: "meta", capacity: "EU compute hub", status: "operating", city: "Clonee", country: "Ireland" },
  { id: "dc-google-belgium", name: "Google St. Ghislain", kind: "datacenter", lat: 50.4729, lng: 3.8147, operator: "Google", operatorId: "google", capacity: "EU compute hub", status: "operating", city: "St. Ghislain", country: "Belgium" },
  { id: "dc-aws-osaka", name: "AWS Osaka Region", kind: "datacenter", lat: 34.6937, lng: 135.5023, operator: "AWS", operatorId: "amazon", capacity: "AP-Northeast-3", status: "operating", city: "Osaka", country: "Japan" },
  { id: "dc-azure-johannesburg", name: "Azure South Africa North", kind: "datacenter", lat: -26.2041, lng: 28.0473, operator: "Microsoft", operatorId: "microsoft", capacity: "Africa region", status: "operating", city: "Johannesburg", country: "South Africa" },
  { id: "dc-meta-singapore", name: "Meta Singapore (Tanjong Kling)", kind: "datacenter", lat: 1.3521, lng: 103.6831, operator: "Meta", operatorId: "meta", capacity: "APAC hub", status: "operating", city: "Singapore", country: "Singapore" },
  { id: "dc-coreweave-vegas", name: "CoreWeave Las Vegas", kind: "datacenter", lat: 36.0840, lng: -115.1537, operator: "CoreWeave", operatorId: "coreweave", capacity: "200 MW", status: "under-construction", city: "Las Vegas, NV", country: "USA" },
  { id: "dc-equinix-frankfurt", name: "Equinix Frankfurt FR campus", kind: "datacenter", lat: 50.1109, lng: 8.6821, operator: "Equinix", operatorId: "equinix", capacity: "Largest EU peering", status: "operating", city: "Frankfurt", country: "Germany" },
  { id: "dc-equinix-sg", name: "Equinix Singapore SG cluster", kind: "datacenter", lat: 1.3521, lng: 103.8198, operator: "Equinix", operatorId: "equinix", capacity: "APAC interconnect", status: "operating", city: "Singapore", country: "Singapore" },
  { id: "dc-yondr-ams", name: "Yondr Amsterdam AMS1", kind: "datacenter", lat: 52.3702, lng: 4.8952, operator: "Yondr", capacity: "80 MW", status: "operating", city: "Amsterdam", country: "Netherlands" },

  // ──────────────── Additional nuclear plants
  { id: "nuc-byron", name: "Byron Generating Station", kind: "nuclear", lat: 42.0744, lng: -89.2811, operator: "Constellation", operatorId: "constellation", capacity: "2,347 MW", status: "operating", city: "Byron, IL", country: "USA" },
  { id: "nuc-braidwood", name: "Braidwood Generating Station", kind: "nuclear", lat: 41.2436, lng: -88.2289, operator: "Constellation", operatorId: "constellation", capacity: "2,389 MW", status: "operating", city: "Braidwood, IL", country: "USA" },
  { id: "nuc-limerick", name: "Limerick Generating Station", kind: "nuclear", lat: 40.2261, lng: -75.5878, operator: "Constellation", operatorId: "constellation", capacity: "2,317 MW", status: "operating", city: "Pottstown, PA", country: "USA" },
  { id: "nuc-millstone", name: "Millstone Power Station", kind: "nuclear", lat: 41.3094, lng: -72.1670, operator: "Dominion", capacity: "2,103 MW", status: "operating", city: "Waterford, CT", country: "USA" },
  { id: "nuc-palo-verde", name: "Palo Verde Generating Station", kind: "nuclear", lat: 33.3881, lng: -112.8617, operator: "APS / Multi", capacity: "3,937 MW (largest US)", status: "operating", city: "Tonopah, AZ", country: "USA", note: "Largest US nuclear plant by output." },
  { id: "nuc-kashiwazaki", name: "Kashiwazaki-Kariwa", kind: "nuclear", lat: 37.4286, lng: 138.6017, operator: "TEPCO", capacity: "8,212 MW (idle)", status: "shutdown", city: "Niigata", country: "Japan" },
  { id: "nuc-bruce", name: "Bruce Nuclear Generating Station", kind: "nuclear", lat: 44.3253, lng: -81.5994, operator: "Bruce Power", capacity: "6,234 MW (largest world)", status: "operating", city: "Kincardine ON", country: "Canada" },

  // ──────────────── Additional mines & material plants
  { id: "mine-collahuasi", name: "Collahuasi Copper Mine", kind: "mine", lat: -20.9764, lng: -68.6919, operator: "Glencore + Anglo American", capacity: "~600kt Cu/yr", status: "operating", city: "Tarapacá", country: "Chile" },
  { id: "mine-morenci", name: "Morenci Mine (copper)", kind: "mine", lat: 33.0872, lng: -109.3439, operator: "Freeport-McMoRan", operatorId: "freeport", capacity: "~440kt Cu/yr", status: "operating", city: "Morenci, AZ", country: "USA" },
  { id: "mine-thacker-pass", name: "Thacker Pass Lithium Mine", kind: "mine", lat: 41.7080, lng: -118.0540, operator: "Lithium Americas + GM", capacity: "Largest US Li project", status: "under-construction", city: "Humboldt County, NV", country: "USA" },
  { id: "mine-salar-atacama", name: "Salar de Atacama (lithium brine)", kind: "mine", lat: -23.5000, lng: -68.2500, operator: "Albemarle + SQM", operatorId: "albemarle", capacity: "World's lowest-cost Li", status: "operating", city: "Atacama", country: "Chile" },
  { id: "mine-mountain-pass-ree", name: "Mountain Pass REE expansion", kind: "mine", lat: 35.4789, lng: -115.5378, operator: "MP Materials", operatorId: "mp-materials", capacity: "Stage III separation 2025", status: "under-construction", city: "Mountain Pass, CA", country: "USA" },

  // ──────────────── Additional rare-gas / chemistry plants
  { id: "rg-shanghai-praxair", name: "Linde Shanghai Electronics Hub", kind: "rare-gas-plant", lat: 31.1707, lng: 121.6094, operator: "Linde", operatorId: "linde", capacity: "Specialty gases for Asian fabs", status: "operating", city: "Shanghai", country: "China" },
  { id: "rg-iwatani-tokyo", name: "Iwatani Tokyo Gas Hub", kind: "rare-gas-plant", lat: 35.6762, lng: 139.6503, operator: "Iwatani", capacity: "Helium import + LH2", status: "operating", city: "Tokyo", country: "Japan" },
];

export function assetsByKind() {
  const m: Record<AssetKind, Asset[]> = {} as any;
  for (const a of ASSETS) (m[a.kind] = m[a.kind] || []).push(a);
  return m;
}
