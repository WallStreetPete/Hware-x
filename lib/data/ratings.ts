// ClusterMAX-inspired qualitative ratings for compute providers.
// These are subjective summaries built from public reporting and SemiAnalysis-style framing.
// Scale: 0-5 (relative to peer set). Updated 2026-Q1.

export type Rating = {
  companyId: string;
  gpuFleet?: string;     // approx GPU count headline
  capacity?: string;     // power capacity
  reliability: number;   // 0-5
  perfPerDollar: number; // 0-5
  software: number;      // 0-5  (orchestration, k8s, networking, data services)
  scale: number;         // 0-5
  note: string;
};

export const COMPUTE_RATINGS: Rating[] = [
  // ─── Hyperscalers
  { companyId: "microsoft",   gpuFleet: "1.5M+ GPU-equiv",  capacity: "~6 GW",  reliability: 5, perfPerDollar: 4, software: 5, scale: 5,
    note: "OpenAI anchor + Azure global footprint; Maia ASIC ramping but still Hopper/Blackwell heavy." },
  { companyId: "google",      gpuFleet: "1M+ TPU + GPU",    capacity: "~6 GW",  reliability: 5, perfPerDollar: 5, software: 5, scale: 5,
    note: "Most vertically integrated stack — TPU, in-house networking, JAX. Best perf/$ for steady internal workloads." },
  { companyId: "amazon",      gpuFleet: "800k+ GPU + Trn",  capacity: "~5 GW",  reliability: 5, perfPerDollar: 4, software: 5, scale: 5,
    note: "Project Rainier 400k Trainium2 chips for Anthropic; broadest service catalog." },
  { companyId: "meta",        gpuFleet: "2M+ H100-equiv",   capacity: "~5 GW",  reliability: 4, perfPerDollar: 4, software: 4, scale: 5,
    note: "Llama is the open-source halo; Hyperion 5GW campus and MTIA ramp under way." },
  { companyId: "oracle",      gpuFleet: "350k+ GPU",        capacity: "~3 GW",  reliability: 4, perfPerDollar: 5, software: 4, scale: 4,
    note: "Highest growth hyperscaler; OpenAI Stargate prime contractor; strong GPU per-host density." },

  // ─── Neoclouds
  { companyId: "coreweave",   gpuFleet: "~470k GPU",         capacity: "~2.2 GW", reliability: 5, perfPerDollar: 4, software: 4, scale: 5,
    note: "Reference neocloud; tight NVIDIA partnership, MS + OpenAI anchors, public since Mar-25." },
  { companyId: "lambda",      gpuFleet: "~120k GPU",         capacity: "~600 MW", reliability: 4, perfPerDollar: 5, software: 4, scale: 4,
    note: "Strong dev-loved on-demand pricing; 1-Click clusters; Hopper + Blackwell mix." },
  { companyId: "crusoe",      gpuFleet: "~250k GPU",         capacity: "~1.4 GW", reliability: 4, perfPerDollar: 4, software: 3, scale: 5,
    note: "Stargate Abilene 1.2GW prime; vertically integrated power story." },
  { companyId: "nebius",      gpuFleet: "~60k GPU",          capacity: "~500 MW", reliability: 4, perfPerDollar: 4, software: 4, scale: 3,
    note: "Yandex-spinout EU + US build; strong managed-K8s + storage stack." },
  { companyId: "together",    gpuFleet: "~35k GPU",          capacity: "~250 MW", reliability: 4, perfPerDollar: 5, software: 5, scale: 3,
    note: "Open-model inference + fine-tuning specialist; great per-token pricing." },
  { companyId: "voltage-park",gpuFleet: "~24k H100",         capacity: "~150 MW", reliability: 3, perfPerDollar: 4, software: 3, scale: 2,
    note: "Newer entrant; bare-metal H100 at attractive rates." },
  { companyId: "fluidstack",  gpuFleet: "~50k GPU",          capacity: "~300 MW", reliability: 3, perfPerDollar: 4, software: 3, scale: 3,
    note: "Aggregator model; Mistral and EU labs are key tenants." },
];

export const RATING_BY_ID = Object.fromEntries(COMPUTE_RATINGS.map(r => [r.companyId, r])) as Record<string, Rating>;
