import type { VisualizationType } from "@/types/project";
import { cn } from "@/lib/utils";

/**
 * Project instrument geometry — each system's own visual language, drawn
 * once and coloured at the call site.
 *
 * THE PROBLEM THIS SOLVES. Six projects rendered with six identical
 * components: a number, a title, a status dot, a hairline. A telemetry
 * pipeline, a numerical vehicle solver, a team-management game and a
 * voice-to-ledger forecast pipeline were visually indistinguishable. The
 * brief's own test — "can someone distinguish telemetry / simulation / AI /
 * game / data within seconds?" — failed, because the interface was not
 * carrying the information and the data already was.
 *
 * Same design system, different expression. Each type gets a genuinely
 * different geometry, drawn from what that system actually is:
 *
 *   telemetry  a burst of discrete events resolved into a continuous trace
 *   vehicle    a corner arc with an apex marker and a friction-circle balance
 *   strategy   stint timeline with a pit-window gap
 *   team       a management board — hubs with spokes
 *   dataset    a feature space: two separated clusters
 *   platform   provider streams converging into one canonical core
 *   forecast   a time series inside a widening confidence band
 *   governance nested scope containing controls, evidence and one gap
 *   voice      driver speech recognised, answered against session context
 *              and spoken back through a cockpit radio console
 *
 * DETERMINISTIC. Every path is a fixed constant. No `Math.random()`, no
 * `Date`, no `useId`, no measurement. No hooks, no state, no client JS.
 *
 * WHY THE PALETTE IS A PARAMETER (Phase E). This geometry is now drawn in
 * two places: the site's own `ProjectInstrument`, which colours it with
 * `var(--color-*)` so it follows the theme, and the generated social card
 * (`lib/og/project-card.tsx`), which runs in satori and cannot resolve a
 * CSS variable — it needs literal hex. Copying the paths into a second
 * module would have let the site and its preview cards drift apart the
 * first time anyone adjusted a stroke. Instead the geometry takes the
 * colours as an argument and `components/work/instrument-geometry.test.ts`
 * asserts the two call sites produce structurally identical shapes.
 *
 * The keys are named for their *role* (accent, data, faint), not for the
 * token they happen to come from, so neither caller is privileged.
 *
 * WHY THESE RETURN ARRAYS AND NOT `<Glyphs />` (Phase E). Satori serialises
 * an `<svg>` subtree with its own walker, which accepts intrinsic elements
 * only — an element whose `type` is a function or a fragment throws "Only
 * intrinsic elements are supported inside <svg>", and it does so at build
 * time, on every prerendered card. It *does* recurse into arrays. So each
 * instrument is a factory returning an array of intrinsic elements rather
 * than a component, which react-dom renders identically and satori accepts.
 * The functions are therefore deliberately lowercase and named `…Glyphs`:
 * they are called, not mounted.
 *
 * TRUTHFULNESS. These are abstract schematics of a system's *shape*, not
 * renderings of its output. They are `aria-hidden` by default and always
 * accompanied by the project's real title and status in text, so nothing
 * depends on interpreting them.
 */

export interface InstrumentPalette {
  /** Primary series / hierarchy. `--color-accent` on the site. */
  accent: string;
  /** Secondary data channel — a second series or edge type. */
  data: string;
  /** Reserved "running right now" state. */
  live: string;
  /** Structural hairlines. */
  borderStrong: string;
  /** Technical metadata marks. */
  foregroundFaint: string;
}

export const TYPE_LABEL: Record<VisualizationType, string> = {
  telemetry: "Event stream and resolved telemetry trace",
  vehicle: "Corner geometry with apex and friction-circle balance",
  strategy: "Stint timeline with pit window",
  team: "Team management board",
  dataset: "Player feature space",
  platform: "Provider streams converging into a canonical core with snapshot storage",
  forecast: "Revenue forecast with confidence band",
  governance:
    "Nested governance scope: policies containing controls, evidence attached per control with one control gap, and a traceable answer",
  voice:
    "Driver speech recognised, answered against session context and spoken back through a cockpit radio console",
};

/** Keys are required by React for array children; they never reach the markup. */
type Glyphs = (p: InstrumentPalette) => React.ReactElement[];

const telemetryGlyphs: Glyphs = (p) => [
  // discrete events on a baseline — the ingestion side
  <g key="events" stroke={p.borderStrong} strokeWidth="1.5">
    {Array.from({ length: 15 }, (_, i) => (
      <line key={i} x1={12 + i * 13} y1="46" x2={12 + i * 13} y2={i % 5 === 0 ? 34 : 39} />
    ))}
  </g>,
  // the resolved, continuous trace — the canonical model
  <path
    key="trace"
    d="M12,40 L25,38 L38,26 L51,30 L64,18 L77,24 L90,14 L103,20 L116,12 L129,22 L142,16 L155,28 L168,22 L181,34 L194,30"
    fill="none"
    stroke={p.accent}
    strokeWidth="1.8"
    strokeLinejoin="round"
  />,
  <circle key="marker" cx="155" cy="28" r="3.5" fill={p.accent} />,
];

const vehicleGlyphs: Glyphs = (p) => [
  // corner arc
  <path
    key="corner"
    d="M14,44 L52,44 C86,44 96,16 130,16 L192,16"
    fill="none"
    stroke={p.accent}
    strokeWidth="2.2"
    strokeLinecap="round"
  />,
  // apex
  <circle key="apex" cx="96" cy="16" r="4" fill="none" stroke={p.accent} strokeWidth="1.6" />,
  // friction-circle balance: lateral vs longitudinal demand
  <g key="friction" stroke={p.data} strokeWidth="1.3" fill="none">
    <circle cx="162" cy="16" r="11" />
    <line x1="151" y1="16" x2="173" y2="16" />
    <line x1="162" y1="5" x2="162" y2="27" />
  </g>,
  <circle key="demand" cx="169" cy="9" r="2.5" fill={p.data} />,
  // entry/exit speed ticks
  <g key="ticks" stroke={p.borderStrong} strokeWidth="1.5">
    <line x1="14" y1="44" x2="14" y2="52" />
    <line x1="52" y1="44" x2="52" y2="52" />
  </g>,
];

const strategyGlyphs: Glyphs = (p) => [
  // stint 1
  <line key="stint-1" x1="14" y1="30" x2="96" y2="30" stroke={p.accent} strokeWidth="2.2" strokeLinecap="round" />,
  // pit window — the gap is the decision
  <rect key="pit-window" x="96" y="16" width="40" height="28" fill="none" stroke={p.data} strokeWidth="1.4" strokeDasharray="3 3" />,
  <line key="pit-call" x1="116" y1="16" x2="116" y2="44" stroke={p.data} strokeWidth="1.4" strokeDasharray="2 2" />,
  // stint 2
  <line key="stint-2" x1="136" y1="30" x2="192" y2="30" stroke={p.accent} strokeWidth="2.2" strokeLinecap="round" />,
  // tyre degradation: each stint ends lower than it started
  <path key="deg-1" d="M14,26 L96,34" fill="none" stroke={p.foregroundFaint} strokeWidth="1.1" strokeDasharray="2 3" />,
  <path key="deg-2" d="M136,26 L192,34" fill="none" stroke={p.foregroundFaint} strokeWidth="1.1" strokeDasharray="2 3" />,
  <circle key="pit-in" cx="96" cy="30" r="3" fill={p.accent} />,
  <circle key="pit-out" cx="136" cy="30" r="3" fill={p.accent} />,
];

const teamGlyphs: Glyphs = (p) => {
  const hubs = [
    { x: 40, y: 16, label: false },
    { x: 40, y: 44, label: false },
    { x: 110, y: 30, label: true },
  ];
  const spokes = [
    { x: 168, y: 14 },
    { x: 168, y: 30 },
    { x: 168, y: 46 },
  ];
  return [
    // team state feeding the weekend
    <g key="links" stroke={p.borderStrong} strokeWidth="1.3">
      <line x1="40" y1="16" x2="110" y2="30" />
      <line x1="40" y1="44" x2="110" y2="30" />
      {hubs[2] && spokes.map((s) => <line key={s.y} x1="110" y1="30" x2={s.x} y2={s.y} />)}
    </g>,
    <circle key="state-1" cx="40" cy="16" r="4.5" fill={p.foregroundFaint} />,
    <circle key="state-2" cx="40" cy="44" r="4.5" fill={p.foregroundFaint} />,
    <circle key="weekend" cx="110" cy="30" r="6" fill={p.accent} />,
    ...spokes.map((s) => (
      <rect key={`board-${s.y}`} x={s.x - 7} y={s.y - 5} width="14" height="10" fill="none" stroke={p.data} strokeWidth="1.3" />
    )),
  ];
};

const datasetGlyphs: Glyphs = (p) => {
  // Two deterministic clusters — raw records on the left, the learned
  // representation on the right. The gap is the cleaning/feature step.
  const left = [
    [20, 18], [28, 24], [22, 32], [34, 15], [30, 36], [18, 40], [38, 27], [25, 44],
  ];
  const right = [
    [118, 14], [132, 18], [124, 26], [140, 24], [116, 30], [136, 34], [126, 40], [146, 30],
  ];
  return [
    ...left.map(([x, y]) => (
      <circle key={`raw-${x}-${y}`} cx={x} cy={y} r="2.6" fill="none" stroke={p.foregroundFaint} strokeWidth="1.2" />
    )),
    <g key="gap" stroke={p.borderStrong} strokeWidth="1" strokeDasharray="2 3">
      <line x1="60" y1="10" x2="60" y2="48" />
    </g>,
    ...right.map(([x, y]) => (
      <circle key={`learned-${x}-${y}`} cx={x} cy={y} r="2.6" fill={p.accent} />
    )),
    // ranking / recommendation output
    <g key="output" stroke={p.data} strokeWidth="1.5" strokeLinecap="round">
      <line x1="166" y1="18" x2="192" y2="18" />
      <line x1="166" y1="28" x2="186" y2="28" />
      <line x1="166" y1="38" x2="180" y2="38" />
    </g>,
  ];
};

const forecastGlyphs: Glyphs = (p) => [
  // widening confidence band — uncertainty grows with horizon
  <path
    key="band"
    d="M14,30 L50,26 L86,24 L122,22 L158,21 L192,20 L192,38 L158,38 L122,37 L86,34 L50,32 L14,34 Z"
    fill={p.data}
    fillOpacity="0.18"
    stroke="none"
  />,
  <path
    key="series"
    d="M14,32 L50,29 L86,28.5 L122,29.5 L158,29.5 L192,29"
    fill="none"
    stroke={p.accent}
    strokeWidth="1.9"
    strokeLinecap="round"
  />,
  // reconciliation ledger ticks
  <g key="ledger-ticks" stroke={p.borderStrong} strokeWidth="1.3">
    {[26, 62, 98, 134].map((x) => (
      <line key={x} x1={x} y1="48" x2={x} y2="54" />
    ))}
  </g>,
  <line key="ledger" x1="14" y1="51" x2="192" y2="51" stroke={p.borderStrong} strokeWidth="1" />,
];

/**
 * Data-platform instrument — provider streams converging into one canonical
 * core with immutable snapshot storage beneath it.
 *
 * Deliberately a different shape from the player `dataset` instrument.
 * The dataset instrument shows a cloud splitting into ranked candidates;
 * this one shows many inputs collapsing into a single spine. EA FC is a
 * question about one entity; Football Intelligence OS is a question about
 * a pipeline, and the two must not be drawn with the same visual grammar.
 */
const platformGlyphs: Glyphs = (p) => [
  // upstream provider streams
  <g key="streams" stroke={p.data} strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
    <line x1="6" y1="12" x2="44" y2="27" />
    <line x1="6" y1="26" x2="44" y2="29" />
    <line x1="6" y1="40" x2="44" y2="31" />
  </g>,
  <g key="provider-dots" fill={p.data}>
    <circle cx="5" cy="11" r="1.8" />
    <circle cx="5" cy="25" r="1.8" />
    <circle cx="5" cy="39" r="1.8" />
  </g>,
  // the single contract spine
  <rect
    key="spine"
    x="44"
    y="20"
    width="12"
    height="18"
    fill="none"
    stroke={p.foregroundFaint}
    strokeWidth="1.2"
  />,
  <line key="spine-link" x1="56" y1="29" x2="80" y2="29" stroke={p.borderStrong} strokeWidth="1.2" />,
  // canonical core
  <rect key="core-fill" x="80" y="17" width="34" height="24" fill={p.accent} fillOpacity="0.14" />,
  <rect
    key="core-outline"
    x="80"
    y="17"
    width="34"
    height="24"
    fill="none"
    stroke={p.accent}
    strokeWidth="1.6"
  />,
  // content-addressed snapshots stacked below the core
  <g key="snapshots" fill="none" stroke={p.data} strokeWidth="1" opacity="0.75">
    <rect x="80" y="45" width="34" height="7" />
    <rect x="84" y="50" width="26" height="6" />
  </g>,
  // downstream consumers
  <line key="consumer-link" x1="114" y1="29" x2="140" y2="29" stroke={p.borderStrong} strokeWidth="1.2" />,
  <g key="consumers" stroke={p.live} strokeWidth="1.5" strokeLinecap="round">
    <line x1="140" y1="20" x2="172" y2="20" />
    <line x1="140" y1="29" x2="180" y2="29" />
    <line x1="140" y1="38" x2="166" y2="38" />
  </g>,
];

/**
 * Governance instrument — nested scope, not a stream.
 *
 * Sentinel AI's defining structural fact is *containment*, and it is the only
 * project here whose architecture is a containment hierarchy rather than a
 * flow: controls belong to a policy (a real foreign key), and evidence,
 * findings and risks all attach to a control (four real foreign keys pointing
 * at the same table).
 *
 * So the outer frame is the governance scope, the inner frame is the control
 * layer, and the ticks inside are per-control evidence — four collected, one
 * drawn dashed and unfilled because an evidence gap is the thing the platform
 * exists to surface, and hiding it would draw a system with no missing
 * evidence. The node on the right is an answer, joined back to the record set
 * by a dashed link: every Copilot response carries the endpoints it was
 * composed from. Geometry only; no invented numbers appear here.
 */
const governanceGlyphs: Glyphs = (p) => [
  // the governance boundary — policy scope
  <rect
    key="scope"
    x="5"
    y="4"
    width="152"
    height="52"
    fill="none"
    stroke={p.borderStrong}
    strokeWidth="1.2"
  />,
  // the control layer inside it
  <rect key="control-fill" x="24" y="15" width="114" height="30" fill={p.accent} fillOpacity="0.07" />,
  <rect
    key="control-outline"
    x="24"
    y="15"
    width="114"
    height="30"
    fill="none"
    stroke={p.accent}
    strokeWidth="1.5"
  />,
  // per-control evidence: four attached, one missing
  <g key="evidence" stroke={p.data} strokeWidth="1.5" strokeLinecap="round">
    <line x1="42" y1="24" x2="42" y2="36" />
    <line x1="64" y1="24" x2="64" y2="36" />
    <line x1="86" y1="24" x2="86" y2="36" />
    <line x1="108" y1="24" x2="108" y2="36" />
  </g>,
  // the control with no verified evidence behind it
  <g key="evidence-gap" stroke={p.foregroundFaint} strokeWidth="1.1" strokeDasharray="2 2">
    <line x1="128" y1="24" x2="128" y2="36" />
  </g>,
  // an answer, traceable back into those records
  <line
    key="answer-link"
    x1="157"
    y1="30"
    x2="168"
    y2="30"
    stroke={p.borderStrong}
    strokeWidth="1.2"
    strokeDasharray="2 3"
  />,
  <circle key="answer" cx="178" cy="30" r="6.5" fill="none" stroke={p.accent} strokeWidth="1.5" />,
  <circle key="answer-dot" cx="178" cy="30" r="1.8" fill={p.accent} />,
];

/**
 * Voice engineer — a cockpit radio console.
 *
 * The reading is the interaction loop, not a decoration: five level bars at
 * the left are the driver speaking; a signal bus carries that through four
 * channel slots (recognition, interpretation, orchestration, response); three
 * arcs at the right are the spoken reply leaving the console; and a second,
 * dashed input rises into the bus from below, because session context arrives
 * on a path of its own rather than as part of the conversation.
 *
 * Deliberately no `<text>`, like every other instrument here: this geometry is
 * drawn inside a satori card, which is handed one font by the route that calls
 * it, and a 5px label inside a motif is not worth a font dependency. The names
 * of the stages belong to the page's architecture figure, where they are real
 * text at a readable size.
 *
 * No number, no transcript and no waveform is drawn from real data — the
 * figure is a schematic of a system's shape, and its caption says so. It is
 * also not a screenshot: nothing here reproduces a rendered game or an actual
 * engineer's console.
 */
const voiceGlyphs: Glyphs = (p) => [
  // the console chassis
  <rect
    key="chassis"
    x="4"
    y="8"
    width="198"
    height="44"
    fill="none"
    stroke={p.borderStrong}
    strokeWidth="1.2"
  />,
  // the driver speaking — a level meter, not a waveform of real audio
  <g key="voice-in" stroke={p.accent} strokeWidth="2" strokeLinecap="round">
    <line x1="14" y1="27" x2="14" y2="33" />
    <line x1="19" y1="23" x2="19" y2="37" />
    <line x1="24" y1="20" x2="24" y2="40" />
    <line x1="29" y1="23" x2="29" y2="37" />
    <line x1="34" y1="27" x2="34" y2="33" />
  </g>,
  // the signal bus the utterance travels along
  <path
    key="bus"
    d="M40,30 L146,30"
    fill="none"
    stroke={p.accent}
    strokeWidth="1.6"
    strokeLinecap="round"
  />,
  // channel slots the request passes through, each with its own indicator
  <g key="channels" fill="none" stroke={p.borderStrong} strokeWidth="1">
    <rect x="50" y="22" width="18" height="16" />
    <rect x="72" y="22" width="18" height="16" />
    <rect x="94" y="22" width="18" height="16" />
    <rect x="116" y="22" width="18" height="16" />
  </g>,
  <g key="channel-lamps" fill={p.foregroundFaint}>
    <circle cx="59" cy="34.5" r="1.6" />
    <circle cx="81" cy="34.5" r="1.6" />
    <circle cx="103" cy="34.5" r="1.6" />
    <circle cx="125" cy="34.5" r="1.6" />
  </g>,
  // the spoken reply, leaving the console
  <g key="voice-out" fill="none" stroke={p.data} strokeLinecap="round">
    <path d="M153,24.8 A6,6 0 0 1 153,35.2" strokeWidth="1.7" />
    <path d="M155.5,20.5 A11,11 0 0 1 155.5,39.5" strokeWidth="1.3" />
    <path d="M158,16.1 A16,16 0 0 1 158,43.9" strokeWidth="1" />
  </g>,
  // session context arrives on its own path, into the context channel
  <g key="session-context" stroke={p.data} strokeWidth="1.3" strokeLinecap="round">
    <path d="M103,30 L103,50" strokeDasharray="2 2.5" />
    <line x1="98" y1="50" x2="98" y2="46" />
    <line x1="103" y1="50" x2="103" y2="46" />
    <line x1="108" y1="50" x2="108" y2="46" />
  </g>,
  // one lamp, so the console reads as powered in both palettes
  <circle key="lamp" cx="196" cy="15" r="2.4" fill={p.accent} />,
];

const GLYPHS: Record<VisualizationType, Glyphs> = {
  telemetry: telemetryGlyphs,
  vehicle: vehicleGlyphs,
  strategy: strategyGlyphs,
  team: teamGlyphs,
  dataset: datasetGlyphs,
  platform: platformGlyphs,
  forecast: forecastGlyphs,
  governance: governanceGlyphs,
  voice: voiceGlyphs,
};

/**
 * The site's own colouring of the geometry: semantic tokens, so the figure
 * follows the theme and stays legible if the palette is ever retuned.
 */
export const INSTRUMENT_PALETTE_CSS_VARS: InstrumentPalette = {
  accent: "var(--color-accent)",
  data: "var(--color-data)",
  live: "var(--color-live)",
  borderStrong: "var(--color-border-strong)",
  foregroundFaint: "var(--color-foreground-faint)",
};

/**
 * The instrument as an `<svg>`, coloured by whatever palette it is handed.
 *
 * `width`/`height` are optional and only used off-DOM: the site sizes the
 * figure with `className` (fully responsive), whereas satori has no layout
 * cascade to inherit from and needs the intrinsic size stated.
 */
export function InstrumentSvg({
  type,
  palette,
  className,
  labelled = false,
  width,
  height,
}: {
  type: VisualizationType;
  palette: InstrumentPalette;
  className?: string;
  /** When true the figure is exposed to assistive tech with a description. */
  labelled?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      viewBox="0 0 206 60"
      width={width}
      height={height}
      // The `instrument` class is the hook for the motif entrance in
      // globals.css: each direct child rises into place in draw order, so
      // all nine project motifs animate from one rule instead of nine
      // bespoke animations. It is present in the social-card rendering too
      // — satori has no cascade and ignores it, and that keeps the two
      // renderings structurally identical for the parity test.
      className={cn("instrument h-full w-full", className)}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? `${TYPE_LABEL[type]} (illustrative schematic)` : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      {GLYPHS[type](palette)}
    </svg>
  );
}

/** Human-readable description, used for figcaptions and aria labels. */
export const instrumentLabel = (type: VisualizationType): string => TYPE_LABEL[type];
