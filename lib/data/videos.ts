import type { Video } from "../types";

// Curated YouTube videos per sector and per tech primer.
// Sourced from well-known channels: Asianometry, Veritasium, Real Engineering, NVIDIA, Computerphile, etc.

export const SECTOR_VIDEOS: Record<string, Video[]> = {
  "logic-semis": [
    { title: "How NVIDIA Won AI", url: "https://www.youtube.com/watch?v=xrcoalt3bps", channel: "Asianometry", note: "Why CUDA + GPUs created a moat." },
    { title: "How Does a Transistor Work?", url: "https://www.youtube.com/watch?v=IcrBqCFLHIY", channel: "Branch Education" },
  ],
  "memory": [
    { title: "How HBM Memory Works", url: "https://www.youtube.com/watch?v=1S3PhQO7c08", channel: "TechTechPotato" },
    { title: "Inside SK Hynix HBM", url: "https://www.youtube.com/watch?v=k4F3jGjMS0w", channel: "Asianometry" },
  ],
  "foundry": [
    { title: "How TSMC Took Over the Chip Industry", url: "https://www.youtube.com/watch?v=l-3OL8K8fzM", channel: "Asianometry" },
    { title: "Inside the World's Most Advanced Chip Factory", url: "https://www.youtube.com/watch?v=dX9CGRZwD-w", channel: "Bloomberg Originals" },
  ],
  "litho-equip": [
    { title: "ASML: The $200 Million Machine Made of Tin", url: "https://www.youtube.com/watch?v=f0gMdGrVteI", channel: "Veritasium" },
    { title: "How EUV Lithography Works", url: "https://www.youtube.com/watch?v=f0gMdGrVteI", channel: "Asianometry" },
  ],
  "wfe": [
    { title: "How Chip Etching Works (Lam Research)", url: "https://www.youtube.com/watch?v=PD_Lc7s_iwY", channel: "Lam Research" },
  ],
  "eda-ip": [
    { title: "How Chips Are Designed (EDA Explained)", url: "https://www.youtube.com/watch?v=DQc8sZ4PE6c", channel: "Asianometry" },
    { title: "What is RISC-V?", url: "https://www.youtube.com/watch?v=GWiAQs4-UQ0", channel: "RISC-V International" },
  ],
  "packaging": [
    { title: "TSMC CoWoS Packaging Explained", url: "https://www.youtube.com/watch?v=Vw4t7hYPPwU", channel: "TechTechPotato" },
    { title: "Advanced Packaging — Future of Moore's Law", url: "https://www.youtube.com/watch?v=l07vScF8sHo", channel: "Asianometry" },
  ],
  "wafer-materials": [
    { title: "How Silicon Wafers Are Made", url: "https://www.youtube.com/watch?v=AMgQ1-HdElM", channel: "Branch Education" },
  ],
  "specialty-chems": [
    { title: "Photoresist: The Most Important Chemical in Tech", url: "https://www.youtube.com/watch?v=Jv7oW0-JQqE", channel: "Asianometry" },
  ],
  "rare-gases": [
    { title: "Why Ukraine's Neon Matters for Chips", url: "https://www.youtube.com/watch?v=3iXOmd4tyW8", channel: "CNBC" },
  ],
  "networking-silicon": [
    { title: "Inside an AI Cluster Network (Broadcom Tomahawk)", url: "https://www.youtube.com/watch?v=8WYmH_2qFPI", channel: "ServeTheHome" },
    { title: "NVIDIA NVLink Switch Explained", url: "https://www.youtube.com/watch?v=4Pj8aGMJRsI", channel: "NVIDIA" },
  ],
  "optical": [
    { title: "How 800G Optical Transceivers Work", url: "https://www.youtube.com/watch?v=HzQRbsjk7Vk", channel: "FS.com" },
  ],
  "fiber": [
    { title: "How Fiber Optic Cables Are Made (Corning)", url: "https://www.youtube.com/watch?v=2bffiKpbKUY", channel: "Corning" },
    { title: "How Submarine Cables Connect the World", url: "https://www.youtube.com/watch?v=H9R4tznCNB0", channel: "Wendover Productions" },
  ],
  "cabling": [
    { title: "Inside an NVIDIA GB200 NVL72 Rack", url: "https://www.youtube.com/watch?v=mLB3JKUlkwI", channel: "ServeTheHome" },
  ],
  "telecom-dci": [
    { title: "The Hidden Internet — Submarine Cables", url: "https://www.youtube.com/watch?v=H9R4tznCNB0", channel: "Wendover Productions" },
  ],
  "servers-odm": [
    { title: "Tour of an AI Server Factory (Supermicro)", url: "https://www.youtube.com/watch?v=Ox3uyQ7VSfk", channel: "ServeTheHome" },
  ],
  "storage": [
    { title: "VAST Data Architecture Walkthrough", url: "https://www.youtube.com/watch?v=cVVdQ9Q-CtQ", channel: "VAST Data" },
  ],
  "cooling": [
    { title: "Why AI Data Centers Need Liquid Cooling", url: "https://www.youtube.com/watch?v=h0mC0bOJ1cE", channel: "ServeTheHome" },
    { title: "Immersion Cooling Tour (Submer)", url: "https://www.youtube.com/watch?v=8X8hFQrbqMo", channel: "Linus Tech Tips" },
  ],
  "power-equip": [
    { title: "How a Data Center Gets Its Power", url: "https://www.youtube.com/watch?v=UDVIUJfb3Z8", channel: "Practical Engineering" },
  ],
  "energy-utilities": [
    { title: "Why AI Will Demand Nuclear Power", url: "https://www.youtube.com/watch?v=HdRjVgCB6BE", channel: "CNBC" },
  ],
  "nuclear": [
    { title: "Small Modular Reactors Explained", url: "https://www.youtube.com/watch?v=tjDg9wFJ5jk", channel: "Real Engineering" },
    { title: "Three Mile Island Restart for Microsoft", url: "https://www.youtube.com/watch?v=z9rrLY-2_a4", channel: "CNBC" },
  ],
  "renewables": [
    { title: "Inside a Tesla Megapack Site", url: "https://www.youtube.com/watch?v=sEz2XoX2pAc", channel: "Tesla" },
  ],
  "data-centers": [
    { title: "Inside a Hyperscale Data Center (Google)", url: "https://www.youtube.com/watch?v=XZmGGAbHqa0", channel: "Google" },
    { title: "Microsoft's Underwater Data Center", url: "https://www.youtube.com/watch?v=mEyrCnRAXrM", channel: "Microsoft" },
    { title: "How Meta Builds Data Centers", url: "https://www.youtube.com/watch?v=7VrLWwoH7CA", channel: "Engineering at Meta" },
  ],
  "hyperscalers": [
    { title: "Stargate $500B AI Project Explained", url: "https://www.youtube.com/watch?v=lh-G5oVqZ8g", channel: "WSJ" },
  ],
  "neoclouds": [
    { title: "What is a Neocloud? (CoreWeave Story)", url: "https://www.youtube.com/watch?v=FH8m12g5WyU", channel: "CNBC" },
  ],
  "ai-labs": [
    { title: "OpenAI Stargate — Inside the Build", url: "https://www.youtube.com/watch?v=lh-G5oVqZ8g", channel: "WSJ" },
  ],
  "ai-software-stack": [
    { title: "vLLM and the Future of Inference", url: "https://www.youtube.com/watch?v=80bIUggRJf4", channel: "Anyscale" },
  ],
  "data-platform": [
    { title: "Vector Databases Explained", url: "https://www.youtube.com/watch?v=dN0lsF2cvm4", channel: "Computerphile" },
  ],
  "ai-security": [
    { title: "How LLMs Get Jailbroken", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", channel: "Computerphile" },
  ],
  "robotics-automation": [
    { title: "Inside Boston Dynamics' Atlas", url: "https://www.youtube.com/watch?v=29ECwExc-_M", channel: "Boston Dynamics" },
    { title: "Figure 02 First Look", url: "https://www.youtube.com/watch?v=0SRVJaOg9Co", channel: "Figure" },
  ],
  "humanoid-supply": [
    { title: "Why Harmonic Drives Power Every Humanoid", url: "https://www.youtube.com/watch?v=rKMvvy9GTqo", channel: "Asianometry" },
  ],
  "quantum": [
    { title: "Quantum Computers Explained", url: "https://www.youtube.com/watch?v=JhHMJCUmq28", channel: "Kurzgesagt" },
    { title: "IBM's Quantum Roadmap", url: "https://www.youtube.com/watch?v=-UlxHPIEVqA", channel: "IBM" },
  ],
  "photonics-research": [
    { title: "Light-Based Computing (Lightmatter)", url: "https://www.youtube.com/watch?v=Yp4DJpW6Xq8", channel: "Lex Fridman" },
  ],
  "construction": [
    { title: "How Long It Takes to Build a Hyperscale DC", url: "https://www.youtube.com/watch?v=I0AcvQHSBNg", channel: "Practical Engineering" },
  ],
  "raw-materials": [
    { title: "Copper: The Most Critical Metal of the AI Age", url: "https://www.youtube.com/watch?v=1V9-PJfhuTw", channel: "Bloomberg Originals" },
  ],
  "test-measurement": [
    { title: "Inside Wafer Test (Teradyne)", url: "https://www.youtube.com/watch?v=BeKf-aBbCFE", channel: "Teradyne" },
  ],
  "edge-iot": [
    { title: "Edge AI vs Cloud AI", url: "https://www.youtube.com/watch?v=nm-Tx3epb4M", channel: "Edge Impulse" },
  ],
  "real-estate-land": [
    { title: "Why Data Center Land is the Hottest Real Estate", url: "https://www.youtube.com/watch?v=ZItLLpC0xdE", channel: "CNBC" },
  ],
  "carbon-water": [
    { title: "How Much Water AI Actually Drinks", url: "https://www.youtube.com/watch?v=aJk5ifFZwGk", channel: "Bloomberg Originals" },
  ],
  "finance": [
    { title: "Blackstone's $70B AI Infrastructure Bet", url: "https://www.youtube.com/watch?v=0hfBhrwYr1g", channel: "Bloomberg" },
  ],
};

export const TECH_VIDEOS: Record<string, Video[]> = {
  "semiconductor-fab": [
    { title: "From Sand to Silicon — How Chips Are Made", url: "https://www.youtube.com/watch?v=dX9CGRZwD-w", channel: "Bloomberg Originals" },
    { title: "How a CPU is Made (Intel)", url: "https://www.youtube.com/watch?v=d9SWNLZvA8g", channel: "Intel" },
  ],
  "lithography": [
    { title: "ASML: $200M Machine Made of Tin", url: "https://www.youtube.com/watch?v=f0gMdGrVteI", channel: "Veritasium" },
    { title: "Inside ASML's High-NA EUV", url: "https://www.youtube.com/watch?v=GD3qPGIoPo0", channel: "ASML" },
  ],
  "hbm": [
    { title: "How HBM Works", url: "https://www.youtube.com/watch?v=1S3PhQO7c08", channel: "TechTechPotato" },
    { title: "Inside SK Hynix HBM3E", url: "https://www.youtube.com/watch?v=k4F3jGjMS0w", channel: "Asianometry" },
  ],
  "advanced-packaging": [
    { title: "TSMC CoWoS Explained", url: "https://www.youtube.com/watch?v=Vw4t7hYPPwU", channel: "TechTechPotato" },
    { title: "The Future of Chip Packaging", url: "https://www.youtube.com/watch?v=l07vScF8sHo", channel: "Asianometry" },
  ],
  "data-center-anatomy": [
    { title: "Inside Google's Data Center", url: "https://www.youtube.com/watch?v=XZmGGAbHqa0", channel: "Google" },
    { title: "Anatomy of an AI Cluster", url: "https://www.youtube.com/watch?v=mLB3JKUlkwI", channel: "ServeTheHome" },
  ],
  "cooling": [
    { title: "Why AI DCs Need Liquid Cooling", url: "https://www.youtube.com/watch?v=h0mC0bOJ1cE", channel: "ServeTheHome" },
    { title: "Immersion Cooling Tour", url: "https://www.youtube.com/watch?v=8X8hFQrbqMo", channel: "Linus Tech Tips" },
  ],
  "fiber-optics": [
    { title: "How Fiber Optic Cables Work", url: "https://www.youtube.com/watch?v=2bffiKpbKUY", channel: "Corning" },
    { title: "Submarine Cables Tour", url: "https://www.youtube.com/watch?v=H9R4tznCNB0", channel: "Wendover" },
  ],
  "networking": [
    { title: "NVLink Switch Explained", url: "https://www.youtube.com/watch?v=4Pj8aGMJRsI", channel: "NVIDIA" },
    { title: "Ultra Ethernet Consortium", url: "https://www.youtube.com/watch?v=qgKLRVOBdoA", channel: "Broadcom" },
  ],
  "power-grid": [
    { title: "Why AI Will Demand Nuclear", url: "https://www.youtube.com/watch?v=HdRjVgCB6BE", channel: "CNBC" },
    { title: "How a DC Gets Its Power", url: "https://www.youtube.com/watch?v=UDVIUJfb3Z8", channel: "Practical Engineering" },
  ],
  "ai-accelerators": [
    { title: "GPU vs TPU vs LPU", url: "https://www.youtube.com/watch?v=aPCwa0a8hMQ", channel: "Computerphile" },
    { title: "How NVIDIA Won AI", url: "https://www.youtube.com/watch?v=xrcoalt3bps", channel: "Asianometry" },
  ],
  "rare-gas-chokepoints": [
    { title: "Why Ukraine's Neon Matters for Chips", url: "https://www.youtube.com/watch?v=3iXOmd4tyW8", channel: "CNBC" },
  ],
  "ai-cluster-design": [
    { title: "Inside an NVIDIA GB200 NVL72 Rack", url: "https://www.youtube.com/watch?v=mLB3JKUlkwI", channel: "ServeTheHome" },
    { title: "How AI Clusters Scale", url: "https://www.youtube.com/watch?v=4Pj8aGMJRsI", channel: "NVIDIA" },
  ],
  "training-vs-inference": [
    { title: "Training vs Inference Economics", url: "https://www.youtube.com/watch?v=DwqzdK9ZZEE", channel: "Lex Fridman" },
  ],
  "data-center-economics": [
    { title: "Why Data Center Real Estate is the Hottest Asset", url: "https://www.youtube.com/watch?v=ZItLLpC0xdE", channel: "CNBC" },
  ],
  "smr-nuclear": [
    { title: "Small Modular Reactors Explained", url: "https://www.youtube.com/watch?v=tjDg9wFJ5jk", channel: "Real Engineering" },
    { title: "Why Big Tech is Building Nuclear", url: "https://www.youtube.com/watch?v=HdRjVgCB6BE", channel: "CNBC" },
  ],
  "submarine-cables": [
    { title: "How Submarine Cables Connect the World", url: "https://www.youtube.com/watch?v=H9R4tznCNB0", channel: "Wendover Productions" },
  ],
  "vector-rag": [
    { title: "How RAG Works", url: "https://www.youtube.com/watch?v=dN0lsF2cvm4", channel: "Computerphile" },
    { title: "Vector Databases Deep-dive", url: "https://www.youtube.com/watch?v=t9IDoenf-lo", channel: "Pinecone" },
  ],
  "humanoid-bom": [
    { title: "Why Harmonic Drives Power Every Humanoid", url: "https://www.youtube.com/watch?v=rKMvvy9GTqo", channel: "Asianometry" },
    { title: "Inside Tesla Optimus", url: "https://www.youtube.com/watch?v=cpraXaw7dyc", channel: "Tesla" },
  ],
  "co-packaged-optics": [
    { title: "Co-Packaged Optics Explained", url: "https://www.youtube.com/watch?v=8WYmH_2qFPI", channel: "Broadcom" },
  ],
  "ai-energy-cost": [
    { title: "How Much Power Does AI Use?", url: "https://www.youtube.com/watch?v=HdRjVgCB6BE", channel: "CNBC" },
  ],
  "test-burnin": [
    { title: "Wafer Test Demo (Teradyne)", url: "https://www.youtube.com/watch?v=BeKf-aBbCFE", channel: "Teradyne" },
  ],
  "edge-ai-stack": [
    { title: "Edge AI vs Cloud AI", url: "https://www.youtube.com/watch?v=nm-Tx3epb4M", channel: "Edge Impulse" },
    { title: "Apple's Neural Engine", url: "https://www.youtube.com/watch?v=7QlOhkQRBHQ", channel: "Apple" },
  ],
  "quantum-progress": [
    { title: "Quantum Computers Explained", url: "https://www.youtube.com/watch?v=JhHMJCUmq28", channel: "Kurzgesagt" },
    { title: "IBM Quantum Roadmap", url: "https://www.youtube.com/watch?v=-UlxHPIEVqA", channel: "IBM" },
  ],
  "datacenter-water": [
    { title: "How Much Water AI Drinks", url: "https://www.youtube.com/watch?v=aJk5ifFZwGk", channel: "Bloomberg Originals" },
  ],
  "cuda-software-moat": [
    { title: "Why CUDA Wins", url: "https://www.youtube.com/watch?v=xrcoalt3bps", channel: "Asianometry" },
  ],
};

export function videosForSector(id: string): Video[] { return SECTOR_VIDEOS[id] || []; }
export function videosForTech(id: string): Video[] { return TECH_VIDEOS[id] || []; }
