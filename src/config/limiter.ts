//Rate limiter
import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: 5,
  message: {"error": "You have reached requests limit"}
})