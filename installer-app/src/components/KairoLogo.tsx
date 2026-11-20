import { useId } from "react";
import { motion } from "framer-motion";

// Same geometry as public/kairo.svg (tile spans 4..124), framed by an orbit
// ring that doubles as a progress ring while installing.
const RING_R = 78;
const EASE_DRAW = [0.65, 0, 0.35, 1] as const;

function drawIn(delay: number) {
  return {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      pathLength: { delay, duration: 0.55, ease: EASE_DRAW },
      opacity: { delay, duration: 0.01 },
    },
  };
}

export function KairoLogo({
  size = 96,
  idle = false,
  progress,
}: {
  size?: number;
  idle?: boolean;
  progress?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = (name: string) => `${uid}-${name}`;
  const url = (name: string) => `url(#${ref(name)})`;
  const busy = progress !== undefined;

  return (
    <motion.div
      className={`kairo-logo ${idle ? "is-idle" : ""} ${busy ? "is-busy" : ""}`}
      style={{ width: size, height: size }}
      whileHover={idle ? { scale: 1.04 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <svg viewBox="-18 -18 164 164" width={size} height={size} role="img" aria-label="Kairo">
        <defs>
          <linearGradient id={ref("tile")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1c26" />
            <stop offset="1" stopColor="#09090d" />
          </linearGradient>
          <linearGradient id={ref("rim")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="1" stopColor="#8e5cff" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id={ref("aura")} cx="0.3" cy="0.25" r="0.8">
            <stop offset="0" stopColor="#0a84ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0a84ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ref("ink")} x1="30" y1="24" x2="100" y2="104" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#64d2ff" />
            <stop offset="0.5" stopColor="#0a84ff" />
            <stop offset="1" stopColor="#9b6bff" />
          </linearGradient>
          <linearGradient id={ref("ring")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#64d2ff" />
            <stop offset="0.5" stopColor="#0a84ff" />
            <stop offset="1" stopColor="#9b6bff" />
          </linearGradient>
          <radialGradient id={ref("spark")} cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#9fe4ff" />
            <stop offset="1" stopColor="#4fb8ff" />
          </radialGradient>
          <linearGradient id={ref("sheen")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={ref("clip")}>
            <rect x="4" y="4" width="120" height="120" rx="30" />
          </clipPath>
        </defs>

        <g className="kl-float">
          {busy ? (
            <>
              <circle cx="64" cy="64" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <g transform="rotate(-90 64 64)">
                <motion.circle
                  cx="64"
                  cy="64"
                  r={RING_R}
                  fill="none"
                  stroke={url("ring")}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress, opacity: progress > 0 ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 20 }}
                />
              </g>
            </>
          ) : (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <circle
                cx="64"
                cy="64"
                r={RING_R}
                fill="none"
                stroke={url("ring")}
                strokeOpacity="0.22"
                strokeWidth="1.25"
                strokeDasharray="1.5 5"
              />
              <g className="kl-orbit">
                {/* invisible circle keeps the group's bbox centred on the tile so it spins in place */}
                <circle cx="64" cy="64" r={RING_R + 3} fill="none" />
                <circle cx="64" cy={64 - RING_R} r="2.6" fill={url("spark")} />
              </g>
            </motion.g>
          )}

          <motion.g
            initial={{ opacity: 0, scale: 0.6, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 210, damping: 16 }}
          >
            <rect x="4" y="4" width="120" height="120" rx="30" fill={url("tile")} />
            <rect x="4" y="4" width="120" height="120" rx="30" fill={url("aura")} />
            <g clipPath={url("clip")}>
              <rect className="kl-sheen" x="-70" y="-20" width="44" height="170" fill={url("sheen")} />
            </g>
            <rect
              x="4.75"
              y="4.75"
              width="118.5"
              height="118.5"
              rx="29.25"
              fill="none"
              stroke={url("rim")}
              strokeWidth="1.5"
            />

            <g fill="none" stroke={url("ink")} strokeWidth="13" strokeLinecap="round">
              <motion.path d="M38 31V97" {...drawIn(0.2)} />
              <motion.path d="M38 78L74 42" {...drawIn(0.45)} />
              <motion.path d="M56 60L92 96" {...drawIn(0.62)} />
            </g>

            <g className="kl-spark">
              <circle className="kl-spark-ping" cx="88" cy="28" r="7.5" fill="none" stroke="#9fe4ff" strokeWidth="1.5" />
              <motion.circle
                cx="88"
                cy="28"
                r="7.5"
                fill={url("spark")}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.95, type: "spring", stiffness: 420, damping: 12 }}
              />
            </g>
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}
