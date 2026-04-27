// Map of company id → primary domain (used for logo lookup via Clearbit/favicon).
// Add new ids here as the company catalog grows.

export const DOMAINS: Record<string, string> = {
  // Raw materials / chemistry
  "rio-tinto": "riotinto.com",
  "freeport": "fcx.com",
  "albemarle": "albemarle.com",
  "cameco": "cameco.com",
  "mp-materials": "mpmaterials.com",
  "linde": "linde.com",
  "air-liquide": "airliquide.com",

  // Wafer + specialty chems
  "shin-etsu": "shinetsu.co.jp",
  "sumco": "sumcosi.com",
  "siltronic": "siltronic.com",
  "entegris": "entegris.com",
  "jsr": "jsr.co.jp",
  "tokyo-ohka": "tok.co.jp",
  "soitec": "soitec.com",

  // Litho + WFE
  "asml": "asml.com",
  "zeiss": "zeiss.com",
  "trumpf": "trumpf.com",
  "applied-materials": "appliedmaterials.com",
  "lam-research": "lamresearch.com",
  "kla": "kla.com",
  "tel": "tel.com",
  "asm-international": "asm.com",

  // EDA + IP
  "synopsys": "synopsys.com",
  "cadence": "cadence.com",
  "siemens-eda": "sw.siemens.com",
  "arm": "arm.com",
  "sifive": "sifive.com",

  // Foundries
  "tsmc": "tsmc.com",
  "samsung-foundry": "samsungfoundry.com",
  "intel-foundry": "intel.com",
  "globalfoundries": "gf.com",
  "smic": "smics.com",
  "umc": "umc.com",

  // Packaging
  "ase": "aseglobal.com",
  "amkor": "amkor.com",
  "powerchip-ppc": "ptli.com",

  // Logic
  "nvidia": "nvidia.com",
  "amd": "amd.com",
  "intel": "intel.com",
  "broadcom": "broadcom.com",
  "marvell": "marvell.com",
  "apple": "apple.com",
  "qualcomm": "qualcomm.com",
  "mediatek": "mediatek.com",
  "cerebras": "cerebras.net",
  "groq": "groq.com",
  "sambanova": "sambanova.ai",
  "tenstorrent": "tenstorrent.com",
  "huawei": "huawei.com",
  "biren": "birentech.com",

  // Memory
  "skhynix": "skhynix.com",
  "samsung": "samsung.com",
  "micron": "micron.com",
  "kioxia": "kioxia.com",
  "solidigm": "solidigm.com",

  // Networking + cabling
  "arista": "arista.com",
  "cisco": "cisco.com",
  "juniper": "juniper.net",
  "astera-labs": "asteralabs.com",
  "credo": "credosemi.com",

  // Optical + fiber
  "coherent": "coherent.com",
  "lumentum": "lumentum.com",
  "innolight": "innolight.com",
  "eoptolink": "eoptolink.com",
  "fabrinet": "fabrinet.com",
  "ciena": "ciena.com",
  "corning": "corning.com",
  "prysmian": "prysmiangroup.com",
  "commscope": "commscope.com",
  "sumitomo-electric": "sumitomoelectric.com",
  "amphenol": "amphenol.com",
  "te-connectivity": "te.com",

  // Servers / ODMs
  "supermicro": "supermicro.com",
  "dell": "dell.com",
  "hpe": "hpe.com",
  "lenovo": "lenovo.com",
  "foxconn": "foxconn.com",
  "quanta": "quantatw.com",
  "wiwynn": "wiwynn.com",
  "inventec": "inventec.com",

  // Storage
  "vast": "vastdata.com",
  "pure-storage": "purestorage.com",
  "wdc": "westerndigital.com",
  "seagate": "seagate.com",
  "netapp": "netapp.com",

  // Cooling
  "vertiv": "vertiv.com",
  "asetek": "asetek.com",
  "coolit": "coolitsystems.com",
  "submer": "submer.com",

  // Power
  "schneider": "se.com",
  "eaton": "eaton.com",
  "abb": "abb.com",
  "generac": "generac.com",
  "cummins": "cummins.com",
  "caterpillar": "caterpillar.com",
  "ge-vernova": "gevernova.com",
  "siemens-energy": "siemens-energy.com",

  // Energy / nuclear / renewables
  "constellation": "constellationenergy.com",
  "vistra": "vistracorp.com",
  "talen": "talenenergy.com",
  "nextera": "nexteraenergy.com",
  "duke": "duke-energy.com",
  "westinghouse": "westinghousenuclear.com",
  "bwxt": "bwxt.com",
  "nuscale": "nuscalepower.com",
  "oklo": "oklo.com",
  "x-energy": "x-energy.com",
  "first-solar": "firstsolar.com",
  "fluence": "fluenceenergy.com",
  "tesla": "tesla.com",
  "nextracker": "nextracker.com",

  // Data centers
  "equinix": "equinix.com",
  "digital-realty": "digitalrealty.com",
  "qts": "qtsdatacenters.com",
  "cyrusone": "cyrusone.com",
  "iron-mountain": "ironmountain.com",
  "stack": "stackinfra.com",
  "switch": "switch.com",
  "applied-digital": "applieddigital.com",

  // Hyperscalers
  "microsoft": "microsoft.com",
  "google": "google.com",
  "amazon": "aboutamazon.com",
  "meta": "meta.com",
  "oracle": "oracle.com",
  "alibaba": "alibabacloud.com",
  "tencent": "tencent.com",
  "bytedance": "bytedance.com",

  // Neoclouds
  "coreweave": "coreweave.com",
  "lambda": "lambda.ai",
  "crusoe": "crusoe.ai",
  "nebius": "nebius.com",
  "together": "together.ai",
  "voltage-park": "voltagepark.com",
  "fluidstack": "fluidstack.io",

  // AI labs
  "openai": "openai.com",
  "anthropic": "anthropic.com",
  "xai": "x.ai",
  "mistral": "mistral.ai",
  "cohere": "cohere.com",

  // Robotics
  "figure": "figure.ai",
  "boston-dynamics": "bostondynamics.com",
  "agility": "agilityrobotics.com",

  // Construction
  "turner": "turnerconstruction.com",
  "aecom": "aecom.com",
  "rosendin": "rosendin.com",
  "kiewit": "kiewit.com",

  // Capital
  "blackstone": "blackstone.com",
  "brookfield": "brookfield.com",
  "kkr": "kkr.com",
  "mgx": "mgx.ae",
  "softbank": "softbank.jp",

  // Expansion set
  "iceblick": "iceblick.com",
  "messer": "messergroup.com",
  "iwatani": "iwatani.co.jp",
  "teradyne": "teradyne.com",
  "advantest": "advantest.com",
  "formfactor": "formfactor.com",
  "hailo": "hailo.ai",
  "ambarella": "ambarella.com",
  "lumen": "lumen.com",
  "zayo": "zayo.com",
  "subcom": "subcom.com",
  "nec": "nec.com",
  "huggingface": "huggingface.co",
  "databricks": "databricks.com",
  "snowflake": "snowflake.com",
  "scale-ai": "scale.com",
  "anyscale": "anyscale.com",
  "vllm": "vllm.ai",
  "pinecone": "pinecone.io",
  "weaviate": "weaviate.io",
  "mongodb": "mongodb.com",
  "cloudflare": "cloudflare.com",
  "wiz": "wiz.io",
  "crowdstrike": "crowdstrike.com",
  "jll": "jll.com",
  "cbre": "cbre.com",
  "cushman": "cushmanwakefield.com",
  "chemours": "chemours.com",
  "solvay": "solvay.com",
  "veolia": "veolia.com",
  "harmonic-drive": "harmonicdrive.net",
  "maxon": "maxongroup.com",
  "sanyo-denki": "sanyodenki.com",
  "sony-imaging": "sony-semicon.com",
  "ibm-quantum": "ibm.com",
  "ionq": "ionq.com",
  "psiquantum": "psiquantum.com",
  "ayar-labs": "ayarlabs.com",
  "lightmatter": "lightmatter.co",
  "celestial": "celestial.ai",
};

export function logoFor(companyId: string): string | null {
  const d = DOMAINS[companyId];
  if (!d) return null;
  // Clearbit Logo API — free, no key, transparent PNGs.
  return `https://logo.clearbit.com/${d}`;
}

export function faviconFor(companyId: string): string | null {
  const d = DOMAINS[companyId];
  if (!d) return null;
  return `https://www.google.com/s2/favicons?domain=${d}&sz=64`;
}
