/**
 * Per-iteration budget guard.
 * Caps from AGENT.md:
 *   Exa       ≤ 8 calls / iteration
 *   Firecrawl ≤ 4 calls / iteration
 *   Claude    ≤ 6 calls / iteration
 * Throws BudgetExceededError when a cap is reached so the caller can degrade gracefully.
 */

export class BudgetExceededError extends Error {
  constructor(public service: string, public limit: number) {
    super(`budget exceeded for ${service} (limit ${limit})`);
  }
}

const LIMITS = { exa: 8, firecrawl: 4, anthropic: 6 } as const;
type Service = keyof typeof LIMITS;

const counters: Record<Service, number> = { exa: 0, firecrawl: 0, anthropic: 0 };

export function reset() { counters.exa = 0; counters.firecrawl = 0; counters.anthropic = 0; }

export function tick(service: Service) {
  counters[service] += 1;
  if (counters[service] > LIMITS[service]) throw new BudgetExceededError(service, LIMITS[service]);
}

export function snapshot() { return { ...counters, limits: LIMITS }; }
