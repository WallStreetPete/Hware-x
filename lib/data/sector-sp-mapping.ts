// Maps each curated SectorId to one or more S&P CapIQ MI_PRIMARY_INDUSTRY strings.
// Used to surface the "More from this sector (top 100 from S&P)" list on /sectors/[id].
//
// The S&P export only included these primary industries:
//   Semiconductors, Semiconductor Materials and Equipment, Communications Equipment,
//   Technology Hardware, Storage and Peripherals, Electronic Equipment and Instruments,
//   Electronic Components, Electronic Manufacturing Services, Commercial Electronics Distribution,
//   Communications Equipment Distribution, Semiconductor Equipment and Product Distribution,
//   Technology Distributors.
//
// Sectors without a clean S&P proxy (energy / nuclear / data centers / hyperscalers / labs)
// are intentionally absent — the curated list IS the sector for those.

import type { SectorId } from "../types";

export const SECTOR_TO_SP: Partial<Record<SectorId, string[]>> = {
  // ── Compute layer
  "logic-semis":         ["Semiconductors"],
  "memory":              ["Semiconductors"],
  "foundry":             ["Semiconductors"],
  "packaging":           ["Semiconductors", "Semiconductor Materials and Equipment"],
  "eda-ip":              ["Semiconductors"],
  "test-measurement":    ["Semiconductor Materials and Equipment", "Electronic Equipment and Instruments"],

  // ── Equipment / materials
  "litho-equip":         ["Semiconductor Materials and Equipment"],
  "wfe":                 ["Semiconductor Materials and Equipment"],
  "wafer-materials":     ["Semiconductor Materials and Equipment", "Electronic Components"],
  "specialty-chems":     ["Semiconductor Materials and Equipment"],
  "rare-gases":          ["Semiconductor Materials and Equipment"],

  // ── Network layer
  "networking-silicon":  ["Semiconductors", "Communications Equipment"],
  "optical":             ["Communications Equipment", "Electronic Components"],
  "fiber":               ["Communications Equipment", "Electronic Components"],
  "cabling":             ["Electronic Components", "Communications Equipment"],
  "telecom-dci":         ["Communications Equipment", "Communications Equipment Distribution"],

  // ── Servers / storage / cooling / power
  "servers-odm":         ["Technology Hardware, Storage and Peripherals", "Electronic Manufacturing Services"],
  "storage":             ["Technology Hardware, Storage and Peripherals"],
  "cooling":             ["Electronic Equipment and Instruments"],
  "power-equip":         ["Electronic Equipment and Instruments"],

  // ── Edge / IoT / robotics / humanoid
  "edge-iot":            ["Semiconductors", "Electronic Equipment and Instruments"],
  "robotics-automation": ["Electronic Equipment and Instruments"],
  "humanoid-supply":     ["Electronic Equipment and Instruments", "Electronic Components"],

  // ── Photonics / quantum
  "photonics-research":  ["Semiconductors", "Semiconductor Materials and Equipment"],
  "quantum":             ["Semiconductors", "Electronic Equipment and Instruments"],

  // ── Distributors (cross-cutting)
  // No direct sector — surfaced via Technology Distributors when relevant
};
