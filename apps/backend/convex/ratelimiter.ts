import { RateLimiter, SECOND } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  dm: { kind: "token bucket", rate: 1, period: SECOND, capacity: 3 },
});
