import type { Project } from "@/types/project";

/**
 * PROJECT DATA — sourced entirely from the spec document (§24, §29–36).
 * No metric, link, date, or status below is invented — see spec §60
 * ("Content Truth Policy") and §74 ("do not invent project metrics /
 * achievements / employers"). Every gap is a `// TODO(owner)` comment,
 * never a placeholder string, so nothing fabricated can accidentally
 * render on the live site.
 *
 * `problem`, `engineeringDecisions`, and `media` are left undefined
 * across every project: the spec gives positioning, architecture, and
 * "what to emphasize" guidance, but no problem-statement prose,
 * specific trade-off writeups, or actual screenshots/diagrams to draw
 * from. Per spec §28, not every subsection needs equal (or any) length
 * — the case-study template already expects some sections to be thin
 * or absent depending on real project depth.
 *
 * Sentinel AI (added as the eighth project) is sourced from its own
 * repository rather than from the spec: its technologies, feature states,
 * test result, coverage figure and limitations are read from its source and
 * from the handoff documents it ships, whose artifacts are all dated
 * 2026-10-07. Nothing about it is inferred from what a GRC platform usually
 * contains. Its test result is attributed rather than re-run — see the
 * `testing` and `validationClaims` entries on that project for exactly which
 * figure came from where.
 *
 * F1 Voice Engineer (added as the ninth project) is sourced from that
 * project's own specification and recorded status, not from a repository:
 * it has not been published, so nothing on its page is read from source and
 * no URL is offered for it. It is catalogued immediately after RaceMind-AI
 * for the narrative order and because it is the project most likely to be
 * mistaken for a module of one of the two systems already here — which its
 * `limitations`, `constraints` and trade-offs all state it is not. Its
 * reported figures (3,313 passed / 20 skipped / 0 failed, five of five
 * quality gates) belong to that project's own suite and are attributed
 * rather than re-executed here; live-game telemetry decoding is recorded as
 * unproven, because neither supported title was available in the test
 * environment. It carries no `metrics` on purpose: a metric in this file is a
 * value measured for this portfolio, and promoting a reported count into one
 * would both overstate it and silently change which projects the homepage
 * previews.
 *
 * Resolved in this pass (GitHub source reconnaissance, 2026-10-12):
 *   1. Repository URLs verified for 6 of 8 projects against
 *      github.com/T-Bone47. Live F1 Intelligence, RaceMind-AI, F1 Race
 *      Manager, EA FC Player Intelligence, Football Intelligence OS, and
 *      VyaparPulse all have public repositories under the T-Bone47 account
 *      that match the portfolio project.
 *   2. F1 Lap-Time Simulator: the public repository github.com/T-Bone47/
 *      f1-pro-simulator- is a DIFFERENT project ("Historical F1 Race-
 *      Engineering Laboratory", a Python platform). The portfolio's F1
 *      Lap-Time Simulator is a completed MATLAB implementation whose
 *      repository has not been published. It is recorded with
 *      `links.visibility: "unpublished"` and technologies reflecting the
 *      actual MATLAB implementation plus the Python/NumPy reference.
 *   3. Sentinel AI has no public repository under the T-Bone47 account;
 *      it is recorded with `links.visibility: "unpublished"`.
 *   4. `year` resolved for VyaparPulse to "2026" — the year of the first
 *      commit to github.com/T-Bone47/vyaparpulse-ai (2026-08-31). The
 *      project originated at Smart India Hackathon; the original SIH event
 *      year is not recorded in the repository, so 2026 is the documented
 *      year, not an estimate.
 *   5. F1 Lap-Time Simulator status corrected to "completed" per owner
 *      confirmation. Publication status ({"unpublished"}) is independent
 *      of completion status ("completed").
 *
 * Outstanding before this file is launch-ready:
 *   - Real media (screenshots, diagrams, charts). Sentinel AI is the one
 *     project where real captures DO exist outside this repository (21
 *     screenshots plus alt text, in its own project folder). They have not
 *     been imported here: this project has no asset directory by design,
 *     and importing media for one project is a media-pipeline decision
 *     rather than a data-entry one. Recorded as an owner decision.
 *   - Sentinel AI repository — if the canonical public repository is
 *     identified, update `links.visibility` to "public" and add the
 *     repository URL.
 *
 * Completion status is independent of publication status. A project with
 * `links.visibility: "unpublished"` may be fully completed; the validation
 * gate (data/projects-validation.test.ts) enforces only that the data is
 * internally consistent and that any supplied URL is valid, never that every
 * project must have a public repository.
 *
 * Resolved in Phase C (source reconnaissance, not assumption): the two
 * football projects were previously thin placeholders built only from the
 * portfolio brief. EA FC Player Intelligence and Football Intelligence OS
 * are now populated from their actual repositories — architecture docs,
 * ADRs, schema migrations, test suites and, where they could be run, their
 * own test results. Every figure on those pages is either measured during
 * this work or attributed to a dated artifact in the source repo.
 */

export const projects: Project[] = [
  {
    id: "live-f1-intelligence",
    slug: "live-f1-intelligence",
    title: "Live F1 Intelligence",
    shortTitle: "Live F1 Intelligence",
    category: "motorsport",
    // Sourced from §39 "Currently Building": "Extending analysis and AI capabilities."
    status: "active",
    year: "2026", // from §38 engineering-journey timeline
    featured: true, // Tier 1 — spec §66

    tagline: "Real-time F1 telemetry & race intelligence",
    description:
      "A provider-independent pipeline that ingests F1 telemetry from OpenF1, FastF1, Jolpica and F1 SignalR, validates and normalises it into a canonical event model, then derives timing, pace, tyre degradation, battle detection and strategy intelligence in real time.",

    // ---- RECRUITER VIEW (spec §05/§06/§08) ----
    // The memorable line. Short enough to be the whole card.
    hook: "Four providers, one canonical event stream",

    // The single evidence item shown on a card and in the hero.
    evidence: "1,067,193 canonical events \u00b7 0 malformed records",

    // The 30-second read. Written short on purpose — see ProjectBrief.
    brief: {
      problem:
        "Every F1 data provider models the same race differently: field names, session identifiers, update semantics and coverage all disagree. Anything written directly against a provider breaks the moment that provider changes.",
      built:
        "A telemetry pipeline that ingests OpenF1, FastF1, Jolpica and F1 SignalR, validates every record, and normalises them into one canonical event model with per-event provenance.",
      approach:
        "Adapters translate each provider into a single event contract, so timing, pace, tyre degradation and battle detection are each written once. Deterministic replay of captured sessions is the validation substrate.",
      result:
        "1,067,193 canonical events with 0 malformed records, replayable end to end. Live ingestion averages ~2,650 events per second at ~0.10 ms per event.",
    },

    // One-sentence engineering claim — readable in five seconds.
    thesis:
      "Four providers expose incompatible schemas; every downstream analysis is written once against a single canonical event contract instead of once per source.",

    visualizationType: "telemetry",

    architectureShape: "converge",

    problem:
      "Every telemetry provider models the same race differently — different field names, different session identifiers, different update semantics, different coverage. Any analysis written directly against a provider API breaks the moment that provider changes shape or drops out.",

    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "TimescaleDB",
      "WebSockets",
      "Docker",
      "Pandas",
      "NumPy",
      "FastF1",
      "OpenF1",
      "Jolpica",
      "F1 SignalR",
    ],

    // The six that belong on a card. The array above stays the honest
    // inventory — these are only the ones that mean something to a reader
    // who has thirty seconds.
    keyTechnologies: ["Python", "FastAPI", "PostgreSQL", "WebSockets", "FastF1", "OpenF1"],

    metrics: [
      { value: "1,067,193", label: "Canonical events" },
      { value: "0", label: "Malformed records" },
      { value: "~2,650", label: "Events / sec" },
      { value: "~0.10 ms", label: "P50 / event" },
      { value: "99 MB", label: "Peak memory" },
    ],

    architecture: {
      summary:
        "Four providers feed ingestion and normalisation into one canonical event model. Every event carries provenance and the run is deterministically replayable, which is what the analysis modules and the API/WebSocket layer downstream are validated against.",
      // Expanded per the master build prompt's §2G-E — the earlier
      // version stopped at the canonical model and folded provenance/
      // replay into prose instead of the diagram. Validation is still
      // real (see the `validation` field below) but isn't its own box
      // here anymore, to match the given 9-stage sequence exactly.
      pipeline: [
        { label: "Data Providers", children: ["OpenF1", "FastF1", "Jolpica", "F1 SignalR"] },
        { label: "Ingestion" },
        { label: "Normalisation" },
        { label: "Canonical Events" },
        { label: "Provenance" },
        { label: "Replay" },
        {
          label: "Analysis",
          children: [
            "Timing",
            "Sector Analysis",
            "Pace",
            "Tyre Degradation",
            "Battle Detection",
            "Race Control",
            "Strategy",
            "Qualifying Intelligence",
            "Practice Intelligence",
          ],
        },
        { label: "API / WebSocket" },
        { label: "Decision Support" },
      ],
      stack: ["Python", "FastAPI", "PostgreSQL", "TimescaleDB", "WebSockets", "Docker"],
      // The four providers, surfaced separately so the fan-in diagram can
      // show a real many-to-one convergence rather than a generic list.
      sources: ["OpenF1", "FastF1", "Jolpica", "F1 SignalR"],
    },

    // Given directly (master build prompt §2/§4): validation
    // methodology, not just the mechanism (architecture summary above
    // covers what provenance/replay are; this covers how they're used).
    validation:
      "The 1,067,193-event / 0-malformed-records figures above come from deterministic replay against real captured session data, not a one-off measurement — the same replay can be re-run and checked again.",

    currentState: "Active — extending analysis and AI capabilities.",

    tradeoffs: [
      {
        problem:
          "Four providers with four different schemas, identifiers and update semantics — every analysis written per-provider multiplies the maintenance surface by four.",
        decision:
          "A single canonical event model with provider adapters normalising into it, and provenance retained per event.",
        result:
          "Analysis modules are written once and run provider-independent; the same replay can be re-run against any source.",
      },
      {
        problem:
          "Live ingestion is fast but not re-runnable — a race that has already happened cannot be re-processed once discovered to contain a bug.",
        decision:
          "Deterministic replay of captured sessions as the validation substrate rather than live state alone.",
        result:
          "The reported figures come from replay against real captured session data, so they can be reproduced and re-checked.",
      },
    ],

    limitations:
      "Coverage and freshness are bounded by what the upstream providers choose to expose; when one is unavailable or changes its schema, the affected fields degrade rather than the system failing loudly. Analysis modules are derived from the canonical model, so anything a provider never publishes cannot be reconstructed.",

    nextIteration:
      "Extending the analysis and AI layer on top of the canonical model — additional derived intelligence over the existing event stream.",

    links: {
      repository: "https://github.com/T-Bone47/live-f1-intelligence",
      visibility: "public",
    },
  },

  {
    id: "f1-lap-time-simulator",
    slug: "f1-lap-time-simulator",
    title: "F1 Lap-Time Simulator",
    shortTitle: "Lap-Time Simulator",
    category: "motorsport",
    // Completed MATLAB implementation. The repository is not yet
    // published; completion status is independent of publication.
    status: "completed",
    year: "2025", // from §38 engineering-journey timeline ("Lap Simulation")
    featured: true, // Tier 1 — spec §66

    tagline: "Vehicle performance & numerical modelling",
    description:
      "A numerical vehicle-performance model — tyre grip, aerodynamics, power and the friction circle solved lap by lap to produce corner speeds and a sector-by-sector performance decomposition.",

    hook: "Numerical vehicle-performance modelling",

    evidence: "Solver validated against an independent NumPy implementation",

    brief: {
      problem:
        "Corner speed depends on tyre grip, aerodynamic load and available power at the same instant, so it cannot be written as a single forward pass.",
      built:
        "A quasi-steady-state point-mass vehicle model over a discretised track, producing corner speeds and a sector-by-sector performance decomposition.",
      approach:
        "A friction circle couples lateral and longitudinal capability so neither can be exceeded independently. Corner speeds are solved closed-form where that is correct, and iterated only where convergence is genuine.",
      result:
        "The analytical corner-speed solution agrees with an independent Python/NumPy reference implementation. No lap times are published, because none have been verified as measured output.",
    },

    thesis:
      "Corner speed is solved as a friction-circle balance of tyre, aero, drag and power, iterated to convergence rather than assumed.",

    visualizationType: "vehicle",
    architectureShape: "sequential",

    problem:
      "Predicting corner speed requires simultaneously satisfying the tyre friction circle, the aerodynamic load available at that corner, and the power available to get there. Each depends on the others, so the solution cannot be written as a single forward pass.",

    // IMPORTANT (spec §32): this is NOT a machine-learning project.
    // Its primary identity is numerical vehicle/lap-performance
    // engineering — keep any future copy consistent with that.

    // Primary implementation: MATLAB numerical lap-performance simulator.
    // The Python/NumPy reference implementation exists for independent
    // numerical verification of the analytical corner-speed solution.
    // These are not the same thing — the MATLAB implementation is the
    // delivered system; the Python reference is the cross-check.
    technologies: ["MATLAB", "Python", "NumPy"],
    keyTechnologies: ["MATLAB", "Python", "NumPy"],

    architecture: {
      summary:
        "A sequential numerical pipeline: track and vehicle models feed tyre grip and aerodynamic effects into a power-limited friction-circle solver, producing corner speeds and a full lap-performance decomposition.",
      pipeline: [
        { label: "Track" },
        { label: "Vehicle Model" },
        { label: "Tyre Grip" },
        { label: "Aerodynamics" },
        { label: "Power" },
        { label: "Friction Circle" },
        { label: "Corner Speed" },
        { label: "Lap Solver" },
        { label: "Performance Decomposition" },
      ],
    },

    currentState: "Completed V1 — MATLAB numerical lap-performance simulator with Python/NumPy reference verification.",

    implementation:
      "The lap is solved as a quasi-steady-state point-mass model over a discretised track. Each point carries a curvature, from which the solver derives corner speed; vertical load comes from static weight plus aerodynamic downforce, longitudinal capability from power limited by available traction, and the two are coupled through a friction circle so neither can be exceeded independently. A three-pass solver iterates corner speeds toward consistency, and the run is treated as valid only when it closes the loop — the third pass agrees with the second. Sector analysis and performance decomposition are read off the converged solution rather than computed separately.",

    algorithms:
      "Track discretisation · quasi-steady-state point-mass vehicle model · tyre grip limit · aerodynamic downforce and drag · power-limited traction · friction-circle coupling · three-pass corner-speed solver with closed-loop convergence · sector analysis · performance decomposition.",

    tradeoffs: [
      {
        problem:
          "The iterative corner-speed solver diverged under certain boundary conditions instead of converging, so corner speeds could not be trusted.",
        decision:
          "Replace the iteration with the closed-form constant-radius corner-speed solution, and retain the multi-pass process only where it genuinely converges.",
        result:
          "Stable solver behaviour across the swept parameter range, with the divergence now a detected condition rather than a silent wrong answer.",
      },
      {
        problem:
          "A solver is only as trustworthy as the cases it can be checked against, and there is no ground truth for a lap that has not been run.",
        decision:
          "Validate the analytical constant-radius corner-speed solution against an independent Python/NumPy reference implementation, plus boundary-condition correction on the discretised model.",
        result:
          "Numerical agreement against an independent implementation rather than against hand-tuned constants.",
      },
    ],

    limitations:
      "The MATLAB implementation is the delivered system. The Python/NumPy reference implementation was used to independently verify the analytical corner-speed solution rather than to serve as the production engine. Quasi-steady-state modelling assumes a settled vehicle state and does not represent transient weight transfer, suspension, or combined-slip tyre behaviour. No lap-time figures are published here because none have been verified as measured output.",

    nextIteration:
      "Extending the validated solver to aero sweeps across the parameter range, and completing the MATLAB implementation's end-to-end execution and validation against the existing Python/NumPy reference.",

    // Repository publication pending — the MATLAB implementation is
    // completed but the repository has not been published yet.
    links: {
      visibility: "unpublished",
    },
  },

  {
    id: "racemind-ai",
    slug: "racemind-ai",
    title: "RaceMind-AI",
    shortTitle: "RaceMind-AI",
    category: "motorsport",
    // Sourced from §39 "Currently Building": "Expanding AI-assisted race engineering."
    status: "active",
    year: "2026", // from §38 engineering-journey timeline
    featured: true, // Tier 1 — spec §66

    tagline: "AI race engineer for sim racing",
    description:
      "A game-agnostic telemetry abstraction turns raw UDP telemetry into session state — strategy, tyre, fuel, weather, traffic and coaching models — that a contextual AI race engineer can be queried against during a session.",

    hook: "An AI race engineer over decoded telemetry",

    evidence: "Backend implemented and tested \u00b7 desktop app in progress",

    brief: {
      problem:
        "Every simulator emits UDP telemetry in its own frame layout and units, and the state that actually matters \u2014 tyre, fuel, weather, pit windows \u2014 has to be rebuilt from raw frames on every query.",
      built:
        "A decoder that turns UDP packets into a game-agnostic session state, feeding strategy, tyre, fuel, weather, traffic and coaching models, with a contextual race engineer on top.",
      approach:
        "One packet decoder feeding one session model, so each analysis is written against state rather than against a specific simulator title.",
      result:
        "The backend is implemented and tested. The desktop application is still in progress, and only Codemasters F1 frames are decoded today.",
    },

    thesis:
      "Raw UDP frames are decoded into a game-agnostic session state, so strategy, tyre, fuel and coaching models are written once instead of per simulator title.",

    visualizationType: "strategy",
    architectureShape: "branched",

    // Now given directly (Phase 2 master build prompt §4) — previously
    // left empty since no explicit list existed yet.
    technologies: ["FastAPI", "SQLAlchemy", "PostgreSQL", "WebSockets", "JWT", "Pytest", "Docker", "Claude API"],
    keyTechnologies: ["FastAPI", "PostgreSQL", "WebSockets", "Claude API"],

    architecture: {
      summary:
        "UDP telemetry is abstracted into a game-agnostic session state, which several models (strategy, tyre, fuel, weather, traffic, coaching) feed into an AI engineer capable of contextual race Q&A.",
      pipeline: [
        { label: "UDP Telemetry" },
        { label: "Game-Agnostic Telemetry Abstraction" },
        {
          label: "Session State",
          children: ["Strategy Engine", "Tyre Model", "Fuel Model", "Weather", "Traffic", "Driver Coaching"],
        },
        { label: "AI Engineer" },
        { label: "Contextual Race Q&A" },
      ],
    },

    // Spec §33 status note, transcribed precisely — do not upgrade
    // "backend implemented/tested" into "product complete."
    currentState:
      "Backend implemented and tested. The frontend/desktop application is in progress and should not be represented as complete until it actually is. Codemasters F1 telemetry is implemented; support for other simulation titles should be confirmed against actual current status before publishing.",

    problem:
      "Simulators each emit telemetry over UDP in their own frame layout and units. A strategy engine written against one title's frames is unusable against another, and race state (tyre, fuel, weather, traffic, pit windows) has to be reconstructed from raw frames on every query.",

    tradeoffs: [
      {
        problem:
          "Per-title decoders would multiply with every simulator supported, and each would need its own tests.",
        decision:
          "One packet decoder feeding a game-agnostic session state that the models read.",
        result:
          "Strategy, tyre, fuel, weather and coaching models are written once against session state, not once per game.",
      },
    ],

    limitations:
      "The backend is implemented and tested; the frontend/desktop application is not complete and is not represented as such here. Only Codemasters F1 telemetry decoding is implemented — additional simulator decoders are planned/stubbed and must not be assumed working. The AI engineer's answers are only as good as the session state it is given; it reasons over decoded state, not over raw video or undecoded frames.",

    nextIteration:
      "Completing the frontend/desktop application and extending decoder coverage beyond Codemasters F1.",    links: {
      repository: "https://github.com/T-Bone47/RaceMind-AI",
      visibility: "public",
    },
  },

  {
    id: "f1-voice-engineer",
    slug: "f1-voice-engineer",
    title: "F1 Voice Engineer",
    shortTitle: "F1 Voice Engineer",

    category: "voice",
    status: "experimental",
    year: "2026",
    featured: false,

    tagline: "Your race engineer. In the cockpit.",
    description:
      "A standalone, voice-driven race-engineering assistant for F1 25 and the F1 2026 Season Pack: Vosk speech recognition, a FastAPI backend, a React/TypeScript driver interface and a Codemasters F1 UDP telemetry layer whose packet structures are implemented and validated while live-game decoding remains unproven.",

    hook: "A spoken race engineer over voice and session context",
    // No digit appears here: the reported test counts live in `results` and
    // `validationClaims` with their provenance attached, not in the hero's
    // one-line evidence band where a bare figure would read as measured here.
    evidence: "Vosk speech recognition \u00b7 FastAPI backend \u00b7 standalone voice assistant",

    brief: {
      problem:
        "Sim-racing presents race information through menus, dashboards and overlays, which is workable in the garage and wrong on a flying lap \u2014 answering a question should not cost the driver their focus.",
      built:
        "A voice-driven race engineer: spoken requests are recognised with Vosk, interpreted as engineering requests, answered against whatever race and session context exists, and replied to verbally.",
      approach:
        "Voice interaction, motorsport intelligence and the driver-facing interface are three separate responsibilities, so each layer can be improved \u2014 or left explicitly unproven \u2014 without coupling the others to it.",
      result:
        "The voice path, backend and driver interface are implemented. The telemetry layer implements and validates Codemasters F1 packet structures and their published sizes; decoding a running game was never proven, because the supported titles were unavailable.",
    },

    thesis:
      "A race engineer the driver talks to rather than a dashboard they read \u2014 speech in, an engineering answer out, with the telemetry layer optional and its verification boundary stated instead of assumed.",

    tags: ["Voice interaction", "Telemetry-aware assistance", "Standalone architecture"],

    // Sourced from the project's own specification and recorded status, not
    // from a repository: it has not been published, so nothing here is read
    // from source, and the live-game boundary is carried as a boundary rather
    // than resolved by a test that cannot run.
    visualizationType: "voice",
    architectureShape: "branched",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vosk",
      "UDP telemetry processing",
    ],
    keyTechnologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vosk",
      "UDP telemetry processing",
    ],

    architecture: {
      summary:
        "A speech-recognition front end feeding a FastAPI orchestration layer, with the race and session context the assistant answers against arriving on a separate path: Codemasters F1 UDP telemetry is ingested and decoded into session state when a supported title is running. The response is generated from whatever context exists and spoken back, alongside a compact driver-facing interface for engineer identity and communication state.",
      pipeline: [
        { label: "Driver voice input" },
        { label: "Speech recognition" },
        { label: "Request interpretation" },
        { label: "Voice Engineer orchestration" },
        {
          label: "Telemetry / session context",
          children: [
            "UDP telemetry ingestion",
            "Packet handling & decoding (Codemasters F1)",
            "Session context",
          ],
        },
        { label: "Engineering response generation" },
        { label: "Speech output" },
        { label: "Driver-facing interface" },
      ],
      stack: ["Python", "FastAPI", "React", "TypeScript", "Vosk", "UDP telemetry processing"],
    },

    dataFlow: [
      {
        label: "Driver speaks",
        detail: "A spoken request during a session \u2014 no menu, panel or keyboard involved.",
      },
      {
        label: "Speech recognition",
        detail:
          "Vosk transcribes the utterance to text. Recognition is one responsibility; generating the assistant's voice is a different one.",
      },
      {
        label: "Request interpretation",
        detail: "The transcript becomes an engineering request the assistant can act on.",
      },
      {
        label: "Engineering response",
        detail:
          "An answer is generated against whatever race and session context is available at that moment.",
      },
      {
        label: "Spoken reply",
        detail:
          "The driver hears the answer while still on the line, and the interface reflects the communication state.",
      },
    ],
    dataFlowTitle: "Voice interaction loop",
    dataFlowCaption:
      "The intended loop: the driver speaks, the request is understood, and the answer comes back as speech. The telemetry path is optional \u2014 the loop runs without it \u2014 and every stage between the utterance and the reply is named, so the seam between recognition, handling and reply stays visible.",

    problem:
      "Race information in F1 25 and the F1 2026 Season Pack arrives through menus, dashboards and telemetry overlays. That is a reasonable way to configure a car in the garage and a poor way to ask a question mid-stint: reading a panel costs attention that belongs to the track. Voice is the interface a real driver already uses for exactly this, and the design goal here is the same one \u2014 an engineer who answers out loud, so the driver keeps their eyes and their hands where they belong.",

    currentState:
      "Standalone prototype \u2014 the voice interaction (Vosk speech recognition and spoken replies), the FastAPI backend and the React/TypeScript driver-facing interface are implemented. The telemetry layer implements and validates Codemasters F1 packet structures and published packet sizes; live-game decoding has not been proven. Independent of RaceMind-AI and Live F1 Intelligence.",

    implementation:
      "The voice path is deliberately linear: the driver speaks, Vosk transcribes the utterance, the transcript is interpreted as an engineering request, and the assistant produces a response that is spoken back while the interface shows the communication state. The orchestration and backend live behind a FastAPI service, with the driver-facing interface built in React and TypeScript. Race and session context enters on its own path \u2014 Codemasters F1 UDP telemetry is received and decoded into session state when a supported title is running \u2014 and is treated as optional input: the assistant answers from what it has rather than requiring the telemetry path to be live. Two facts about that path matter more than any feature list. The packet structures and their published packet sizes were implemented and validated, which is a statement about the software. No telemetry from a running F1 25 or F1 2026 Season Pack session was ever decoded, which is a statement about the integration, and the test environment could not change it.",

    algorithms:
      "Speech recognition (Vosk) \u00b7 request interpretation into an engineering request \u00b7 response generation against available race and session context \u00b7 speech output \u00b7 UDP packet parsing against published Codemasters F1 packet structures and sizes.",

    validation:
      "The reported figures come from this project's own suite and are recorded here as historical evidence, attributed rather than re-executed against this repository. Packet structures and published packet sizes were implemented and validated independently of a running game, and successful decoding of real telemetry requires the game itself: that has not been observed, so it is not claimed.",

    results:
      "The project's recorded run reports 3,313 tests passed, 20 skipped and 0 failed, with five of five quality gates passing. That is evidence about the software \u2014 the voice path, the backend, the interface and the packet handling \u2014 and it is not evidence about a running game, which no automated suite in this project could exercise while the supported titles were unavailable.",

    validationClaims: [
      {
        label: "Automated software tests",
        status: "implemented",
        detail:
          "3,313 passed \u00b7 20 skipped \u00b7 0 failed in the project's own suite, as recorded in its report. Attributed, not re-executed against this repository.",
      },
      {
        label: "Quality gates",
        status: "implemented",
        detail: "Five of five gates passed in the same recorded run.",
      },
      {
        label: "Packet format & structural validation",
        status: "implemented",
        detail:
          "Codemasters F1 UDP packet structures and their published packet sizes are implemented and validated without a running game.",
      },
      {
        label: "Mocked / simulated integration",
        status: "partial",
        detail:
          "Packet handling is exercised with synthetic and captured frames. This is honest test coverage and it is not a live decode.",
      },
      {
        label: "Live-game decode (F1 25 / F1 2026 Season Pack)",
        status: "not-run",
        detail:
          "Neither supported title was available in the test environment, so no telemetry from a running game has been received, decoded or observed.",
      },
    ],

    stateItems: [
      {
        label: "Voice interaction",
        status: "implemented",
        detail:
          "Vosk speech recognition, request handling and spoken replies, as a standalone loop.",
      },
      {
        label: "FastAPI backend / orchestration",
        status: "implemented",
        detail: "The service layer the request handling and response generation sit behind.",
      },
      {
        label: "Driver-facing interface",
        status: "implemented",
        detail:
          "React and TypeScript interface carrying engineer identity and communication state.",
      },
      {
        label: "Codemasters F1 packet structures",
        status: "implemented",
        detail:
          "Packet structures and their published sizes are implemented and validated on their own, without the game.",
      },
      {
        label: "Live-game telemetry decode",
        status: "not-run",
        detail:
          "Requires F1 25 or the F1 2026 Season Pack. Unavailable in the test environment, so unproven rather than working.",
      },
      {
        label: "Engineer identities and themes",
        status: "partial",
        detail:
          "Engineer personas and team-inspired visual treatments are explored in the interface design. Presentation only \u2014 no affiliation, endorsement or licensed access, and not an official reproduction of anyone's voice.",
      },
      {
        label: "Avatar animation & game-window overlay",
        status: "planned",
        detail:
          "Explored as design direction for a compact cockpit companion. Not implemented and not verified.",
      },
    ],

    separatelyScoped: [
      {
        title: "Live-game telemetry validation",
        status: "not-run",
        body:
          "Deliberately kept apart from the software's test evidence: no unit test, mock or synthetic packet can stand in for a running title, and merging the two would let a green suite imply a verified game session. This stays open until a supported title is actually available.",
      },
    ],

    constraints: [
      {
        label: "Recognised titles only",
        detail:
          "F1 25 and the F1 2026 Season Pack are the intended targets, with Codemasters F1-game UDP telemetry as the data source. No other simulator or telemetry format is claimed.",
      },
      {
        label: "No affiliation",
        detail:
          "Engineer identities are personas and team-inspired themes are visual treatments. Nothing here implies official team affiliation, endorsement or licensed access.",
      },
      {
        label: "Recognition is not generation",
        detail:
          "Vosk performs speech recognition. Speech generation is a separate responsibility, and the project's recorded material names no speech-generation provider, so none is claimed.",
      },
      {
        label: "Standalone by construction",
        detail:
          "Its own voice and telemetry responsibilities. Not an extension, module or dependency of RaceMind-AI or Live F1 Intelligence.",
      },
    ],

    tradeoffs: [
      {
        problem:
          "Talking to a car during a session is only useful if the answer arrives as speech. A voice front end that returns a panel to read has moved the distraction rather than removed it.",
        decision:
          "Design the interaction as a loop \u2014 assistant speaks, driver speaks, assistant answers out loud \u2014 and keep recognition, request handling, response generation and speech output as separate stages.",
        result:
          "The interaction stays a conversation rather than a chat window with a racing skin, and each stage can be improved or replaced on its own.",
      },
      {
        problem:
          "F1-game telemetry is the intended context source, but implementing a packet decoder and proving it against a running game are two different pieces of work, and only the first can be done without the game.",
        decision:
          "Implement and validate packet structures and their published sizes independently, and record live-game decoding as a stated verification boundary instead of a completed capability.",
        result:
          "Protocol handling is tested on its own terms, and no test result is presented as evidence of a game session that never ran.",
      },
      {
        problem:
          "A race engineer interface competes with the thing the driver is actually doing. Identity, status and context can each become clutter at exactly the wrong moment.",
        decision:
          "Keep the presentation compact and cockpit-oriented \u2014 engineer identity, communication state and the information that matters, with team-inspired themes as presentation rather than decoration.",
        result:
          "The interface is designed to be glanced at, not read, and the engineer's identity carries the sense of a person on the radio rather than a settings screen.",
      },
      {
        problem:
          "Voice and telemetry overlap two existing motorsport projects, and the cheap version of this project is a voice layer bolted onto one of them.",
        decision:
          "Keep F1 Voice Engineer a separate product with its own voice and telemetry responsibilities, rather than an extension or submodule of RaceMind-AI or Live F1 Intelligence.",
        result:
          "Its interface, its voice path and its telemetry boundary are its own, so none of the three systems inherits another's assumptions.",
      },
      {
        problem:
          "A reported test count is a strong claim and an easy one to overstate: 3,313 passing tests says nothing about a game that was never launched.",
        decision:
          "Report the figures with their provenance attached, state what the suite can and cannot cover, and keep mocked packet handling visibly separate from live-game validation.",
        result:
          "The evidence supports the software and stops exactly where the software ends, which is the only version of those numbers worth publishing.",
      },
    ],

    engineeringDecisions: [
      {
        title: "An engineer on the radio, not a chatbot in a car",
        rationale:
          "The assistant is scoped to race-engineering questions and answers, because a general conversational agent inside a cockpit is a distraction with a personality. Voice is the channel; engineering context is the subject.",
      },
      {
        title: "Team-inspired looks, no implied affiliation",
        rationale:
          "Mercedes-inspired, Red Bull-inspired and McLaren-inspired visual treatments exist to give each engineer persona a recognisable identity on screen. They are themes, not sponsorships, licences or endorsements, and no working avatar animation or game-window integration is presented as finished.",
      },
      {
        title: "Boundaries written down rather than discovered later",
        rationale:
          "Recognition is Vosk; generation is unnamed in the project's own record; packet handling is validated; live decoding is not. Stating that split is what keeps a strong test count from quietly becoming a claim about a game session.",
      },
    ],

    limitations:
      "The honesty boundary is the telemetry layer. Codemasters F1 packet structures and their published packet sizes were implemented and validated, but no telemetry from a running F1 25 or F1 2026 Season Pack session has been decoded, because neither title was available in the test environment \u2014 unit tests, mocks and synthetic packets are not a live-game result and are not presented as one. The reported test figures come from this project's own suite and were not re-executed against this repository. Engineer identities are personas with team-inspired themes rather than affiliations, no speech-generation provider is named, and no avatar animation, game-window overlay or in-game integration is claimed as working.",

    nextIteration:
      "Complete the standalone race-intelligence layer for session-aware questions and telemetry-informed replies, and validate the telemetry path against a running supported title as soon as F1 25 or the F1 2026 Season Pack is available in the test environment.",

    // No repository URL and none invented: the project has not been
    // published, and `visibility: "unpublished"` is the honest state that
    // the validation gate is designed to allow.
    links: {
      visibility: "unpublished",
    },
  },

  {
    id: "f1-race-manager",
    slug: "f1-race-manager",
    title: "F1 Race Manager",
    shortTitle: "F1 Race Manager",
    category: "simulation-game",
    status: "in-development", // stated explicitly — spec §34
    year: "2026", // from §38 engineering-journey timeline
    featured: false, // Tier 2 — spec §66

    tagline: "F1 team management & strategy simulation game",
    description:
      "An F1 team-management and strategy simulation game built in Unity — car development, staff and finance sit alongside race-weekend strategy calls across tyres, weather, safety cars and reliability.",

    hook: "Team management as a strategy game",

    evidence: "Unity team-management simulation \u00b7 in development",

    brief: {
      problem:
        "If every strategy option is always available, a tyre or fuel call costs nothing and the race weekend has no tension at all.",
      built:
        "A Unity team-management game where drivers, staff, finance, facilities and car development determine what a race weekend can actually offer.",
      approach:
        "Persistent team state is the input to race-weekend systems \u2014 strategy, tyres, weather, safety cars and reliability \u2014 rather than a fixed menu of options.",
      result:
        "In active development. The strategy model is a game rule set, not a validated model of real race strategy, and no build is published.",
    },

    // Explicitly a GAME. It is not the vehicle-performance simulator —
    // that is the separate F1 Lap-Time Simulator project above.
    thesis:
      "A race weekend is a resource-allocation problem: staff, budget and car development decide what strategy is available on race day.",

    visualizationType: "team",
    architectureShape: "branched",

    // IMPORTANT (spec §25, §34, §74): this is a GAME. Never classify
    // it as the vehicle-performance simulator — that is the separate
    // F1 Lap-Time Simulator project above.

    technologies: ["Unity", "C#", "Python"],
    keyTechnologies: ["Unity", "C#", "Python"],

    architecture: {
      summary:
        "A team-management layer (drivers, staff, finance, facilities, car development) drives into race-weekend systems covering strategy, tyres, weather, safety cars and reliability.",
      pipeline: [
        {
          label: "Team Management",
          children: ["Drivers", "Staff", "Finance", "Facilities", "Car Development"],
        },
        {
          label: "Race Weekend",
          children: ["Strategy", "Tyres", "Weather", "Safety Car / VSC", "Reliability", "Traffic"],
        },
      ],
      stack: ["Unity", "C#", "Python"],
    },

    currentState: "In development — Unity team-management simulation.",

    limitations:
      "In development, and not a vehicle-performance simulator — the physics counterpart is the separate F1 Lap-Time Simulator project. Gameplay is not yet at a finished state, and no build is published here. The strategy model is a game rule set, not a validated model of real race strategy.",

    tradeoffs: [
      {
        problem:
          "Race-weekend decisions are trivial in isolation — if every strategy option is always available, tyre and fuel calls have no cost and the weekend simulation has no tension.",
        decision:
          "Model persistent team state (drivers, staff, finance, facilities, car development) as the input that determines which race-weekend options exist.",
        result:
          "Strategy is constrained by what the team actually built and can afford, rather than chosen freely from a fixed menu.",
      },
    ],

    links: {
      repository: "https://github.com/T-Bone47/race-manager",
      visibility: "public",
    },
  },

  {
    id: "ea-fc-intelligence",
    // Slug deliberately unchanged — /work/ea-fc-intelligence is a live URL
    // and renaming the presentation name is not a reason to break it.
    slug: "ea-fc-intelligence",
    title: "EA FC Player Intelligence",
    shortTitle: "EA FC Player Intelligence",
    category: "ai-ml",
    status: "active",
    // Dates below are read from the project's own commit and artifact
    // timestamps, not estimated.
    year: "2026",
    featured: false, // Tier 2 — spec §66

    tagline: "FC26 → FC27 · player data, ML & recommendation",
    description:
      "A version-aware player recommendation engine. FC26 is a completed 16,228-player baseline with a permitted public data source; FC27 is active acquisition and preparation work with zero records imported. The engine is already FC27-capable and deliberately returns an honest 404 rather than substituting FC26 data.",

    hook: "A 16,228-player FC26 baseline",
    evidence: "16,228 FC26 players \u00b7 FC27 blocked, not substituted",

    brief: {
      problem:
        "A published rating is not a recommendation. It ignores position, formation, tactical system, squad context and budget \u2014 and for some of those there is no permitted data source at all.",
      built:
        "A version-aware recommendation engine over a complete 16,228-player FC26 baseline, scoring candidates across seven weighted components with an evidence trail and an explanation behind every result.",
      approach:
        "Absent evidence redistributes a component's weight instead of lowering the score, and a version with no data returns an explicit 404 rather than quietly serving FC26 values as FC27.",
      result:
        "FC26 serves deterministic, explainable recommendations over the full pool. FC27 is 0 of 20,689 records imported and blocked on a permitted data source; the last backend run collected 441 tests.",
    },

    thesis:
      "A version-aware player intelligence system: raw attributes are turned once into a stable player representation, then scored, compared and explained — and a missing game version produces an honest refusal rather than a plausible answer.",

    tags: ["Player intelligence", "Recommendation", "Data engineering", "Version safety"],

    // Strongest evidence first — this order is what the index card and the
    // case-study hero promote as the headline figure.
    metrics: [
      { value: "16,228", label: "FC26 players", note: "canonical rows, complete" },
      { value: "0", label: "FC27 records", note: "target was 20,689" },
      { value: "441", label: "Backend tests collected", note: "278 pass, 138 skip, 25 fail" },
      { value: "748.8", label: "ms full-pool warm p50", note: "documented benchmark, 2026-09-14" },
    ],

    visualizationType: "dataset",
    architectureShape: "sequential",

    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "Alembic",
      "Pydantic",
      "Pytest",
      "React",
      "TypeScript",
      "Vite",
    ],

    keyTechnologies: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "React"],

    problem:
      "A rating is not a recommendation. The question that matters is not \"who has the highest OVR\" but \"which player fits this exact position, formation, tactical system, gameplay style, squad context, budget and stated intent\". Answering that from a raw attribute table means handling nine different kinds of evidence — some certain, some absent, some unverifiable — and refusing to invent the ones that are not there.",

    constraints: [
      {
        label: "Versions never mix",
        detail:
          "FC26 and FC27 records share no table and no configuration. An FC27 request returns HTTP 404 with an explanation rather than falling back to FC26 values.",
      },
      {
        label: "Unavailable data is never fabricated",
        detail:
          "Market prices, chemistry rules and role assignments have no permitted source. They stay UNKNOWN, and budget checks report BUDGET_UNVERIFIED instead of assuming affordability.",
      },
      {
        label: "Synthetic records are firewalled",
        detail:
          "Test-only candidates abort the production engine outright, so a fixture card can never surface in a real ranking.",
      },
      {
        label: "Scoring must stay deterministic",
        detail:
          "Same request, same output, independent of pool ordering. No randomness anywhere in the engine.",
      },
    ],

    // ---- THE VERSION WALL -------------------------------------------
    versionHistory: [
      {
        version: "FC26",
        role: "baseline",
        headline: "Data foundation · complete",
        summary:
          "A complete player universe built from a CC0 public dataset, with per-file SHA-256 recorded at retrieval. This baseline is what the engine actually serves today.",
        status: "verified",
        stats: [
          { value: "16,228", label: "Players" },
          { value: "60", label: "Columns" },
          { value: "14,412", label: "Outfield" },
          { value: "1,816", label: "Goalkeepers" },
        ],
        completed: [
          "Canonical player table loaded and content-hashed",
          "Position, attribute and play-style vocabulary verified against the dataset (36 PlayStyles, 12 secondary positions, 11 formations)",
          "Engine serving live recommendations over the full pool",
          "Golden-regression contract recorded so no upgrade may change a score without evidence it is better",
        ],
      },
      {
        version: "FC27",
        role: "active",
        headline: "Acquisition & preparation",
        summary:
          "The engine was made FC27-capable before any FC27 data existed, so the remaining work is entirely acquisition-side. A target of 20,689 records is specified; zero have been imported.",
        status: "blocked",
        stats: [
          { value: "0", label: "Records imported" },
          { value: "20,689", label: "Target" },
          { value: "14", label: "Quality gates defined" },
          { value: "404", label: "No-data wall" },
        ],
        active: [
          "Engine is FC27-ready with zero data: version config present, request path live, refusal path tested",
          "Field mapping from EA columns to canonical columns defined for all 13 tracked fields",
          "14 data-quality gates specified as executable queries, including FC26-contamination and FC27-isolation checks",
          "Migration script and identity-review queue written and waiting on data",
        ],
        planned: [
          "Ratings snapshot → play-style assignment → roles → cards → verified prices → chemistry rules, in that order",
        ],
        blocked: [
          "No authorised machine-accessible FC27 source exists. EA publishes no bulk card/ratings feed with a redistribution licence, and community databases prohibit scraping, so nothing was taken from them.",
        ],
      },
    ],

    // ---- THE INTELLIGENCE PIPELINE ----------------------------------
    dataFlow: [
      {
        label: "Raw player attributes",
        detail: "60 columns per player across six headline and 34 detailed attributes.",
      },
      {
        label: "Candidate retrieval",
        detail:
          "Position pre-filter before any scoring runs; results cached per version and position, invalidated by a database watermark.",
      },
      {
        label: "Component fits",
        detail:
          "Seven independent fits — quality, position, attribute, tactical, play-style, role, team — each independently marked known, unknown or insufficient-evidence.",
      },
      {
        label: "Weighted score",
        detail:
          "Fixed baseline weights. Weight held by an unknown component is redistributed across the known ones, so missing data never quietly lowers a score.",
      },
      {
        label: "Confidence",
        detail:
          "Component coverage blended with per-entity data confidence, then decayed by source freshness.",
      },
      {
        label: "Recommendation",
        detail:
          "Ranked output with a fit band, an evidence trail, and an explicit list of which dimensions were unavailable.",
      },
      {
        label: "Explanation",
        detail:
          "Why this player, why not the alternatives, plus counterfactual and sensitivity analysis on the scoring assumptions.",
      },
    ],

    architecture: {
      summary:
        "A layered decision pipeline where every stage is inspectable. Natural-language intent becomes a validated requirements object; retrieval narrows the pool before scoring; a single engine evaluates each candidate across seven weighted components; a service layer adds explanations, confidence and provenance before the API responds.",
      pipeline: [
        {
          label: "Intent parsing",
          detail: "Natural language → structured intent, each field carrying its own source and confidence.",
        },
        {
          label: "Requirements",
          detail: "Validated domain object separating hard constraints from soft preferences.",
        },
        { label: "Retrieval", detail: "Position pre-filter and cached candidate pool." },
        {
          label: "Engine evaluation",
          detail: "Seven component fits, weight redistribution, deterministic ranking.",
        },
        {
          label: "Pareto & sensitivity",
          detail: "Best per dimension, plus what-if re-scores under changed assumptions.",
        },
        {
          label: "Explanation & provenance",
          detail: "Evidence strings, confidence composition, data freshness.",
        },
        { label: "API", detail: "Version-guarded response consumed by the frontend." },
      ],
    },

    engineeringDecisions: [
      {
        title: "Absent evidence reduces confidence, it does not reduce the score",
        rationale:
          "A component with no data has its weight redistributed rather than scored as zero. Otherwise a sparse record would look like a bad player, which is a different and much worse claim than \"we do not know\".",
      },
      {
        title: "A missing game version is an error, not a fallback",
        rationale:
          "Serving FC26 attributes under an FC27 request would look correct and be wrong in a way nobody downstream could detect. The 404 wall is the only honest response, and it is pinned by a golden regression test.",
      },
      {
        title: "No component silently outranks the others",
        rationale:
          "Overall rating is one component among seven with the lowest weight. Archetype fit only enters the calculation when a caller actually asks for an archetype, at 0.10 of the total.",
      },
      {
        title: "Scores are suitability scores, never probabilities",
        rationale:
          "The engine has no fitted model and does not pretend to. It ranks candidates against a stated context; it does not estimate the probability that a player will perform.",
      },
    ],

    tradeoffs: [
      {
        problem:
          "A published OVR is the easiest number to compute and the least useful one to recommend from — it ignores position, formation, tactical system and squad context entirely.",
        decision:
          "Make OVR one component of seven, weight it lowest, and let user requirements redistribute the remaining weight.",
        result:
          "A 90-rated generic candidate loses to a lower-rated specialist whenever the stated context favours the specialist — and that inversion is what the open adversarial suite is still chasing.",
      },
      {
        problem:
          "Attributes are published per version, so any representation built once silently becomes wrong when the game updates.",
        decision:
          "Key every cached pool by game version and guard every request with a version check before evaluation.",
        result:
          "FC26 and FC27 can never contaminate each other, and the failure mode for an unpopulated version is a refusal rather than a plausible number.",
      },
      {
        problem:
          "Market prices, chemistry rules and role data have no lawful source available.",
        decision:
          "Ship the schema, leave the tables empty, and make the engine report those dimensions as unavailable.",
        result:
          "Budget constraints report BUDGET_UNVERIFIED rather than assuming affordability, and no price is ever manufactured.",
      },
    ],

    algorithms:
      "Component scoring is deterministic and config-driven: an absolute normalisation curve for overall quality, an exact/alternate/adjacency ladder for position, a weight-profile minimum-ramp for attributes, an eleven-profile tactical weight table, and a play-style term where the \"+\" variant is weighted higher but never wins automatically. Attribute interactions only fire when every contributing input is known. Per-attribute saturation knees flatten the benefit of pushing an already-high rating further, so a 95 does not behave like twice a 48. Composite similarity and archetype derivation are computed rather than hand-listed.",

    validationClaims: [
      {
        label: "Determinism",
        status: "verified",
        detail:
          "Identical requests produce byte-identical responses; candidate pool ordering does not affect results. Pinned by golden regression against recorded scenario output.",
      },
      {
        label: "Version isolation",
        status: "verified",
        detail:
          "FC27 requests return the documented 404 no-data wall and never substitute FC26 values. Asserted in the unknown-data suite.",
      },
      {
        label: "Golden regression contract",
        status: "verified",
        detail:
          "Eight recorded scenarios — including specific winners and scores across CM, GK, ST, CB, RW and the full pool — are frozen so no upgrade may change output without evidence of improvement.",
      },
      {
        label: "Knowledge boundaries",
        status: "verified",
        detail:
          "Community-sourced play-style tables are unit-tested to contain only real published play-style names, preventing invented vocabulary from entering the engine.",
      },
      {
        label: "Adversarial OVR-trap cases",
        status: "not-run",
        detail:
          "Nine hand-built cases where the higher-rated generic candidate must lose to the context-appropriate specialist. The engine currently returns the generic in several of them, so the suite fails. This is the known open work, not a hidden defect.",
      },
      {
        label: "Database-backed API surface",
        status: "not-run",
        detail:
          "Security and recommendation API tests require a live PostgreSQL instance and were skipped in the recorded run. They are implemented but were not exercised here.",
      },
    ],

    testing: [
      {
        suite: "Backend suite (pytest)",
        command: "python -m pytest backend/tests -q",
        total: 441,
        passed: 278,
        failed: 25,
        skipped: 138,
        skippedBecause:
          "138 tests require a live PostgreSQL instance, which was not reachable in the environment this run was executed in.",
        verifiedOn: "2026-10-03",
      },
    ],

    stateItems: [
      {
        label: "FC26 data baseline",
        status: "verified",
        detail: "16,228 canonical player rows, content-hashed at retrieval.",
      },
      {
        label: "Recommendation engine",
        status: "verified",
        detail: "Single v2.1 engine, seven weighted components, deterministic.",
      },
      {
        label: "Explanations & provenance",
        status: "verified",
        detail: "Per-component evidence, source registry, freshness decay.",
      },
      {
        label: "FC27 version path",
        status: "implemented",
        detail: "Config, guard and refusal path complete; no data to exercise it against.",
      },
      {
        label: "FC27 dataset",
        status: "blocked",
        detail: "Acquisition blocked on a source with redistribution permission.",
      },
      {
        label: "Ultimate Team cards",
        status: "research",
        detail: "Pipeline complete and data-ready; no permitted source found.",
      },
    ],

    separatelyScoped: [
      {
        title: "Ultimate Team card scope",
        status: "blocked",
        body:
          "The card pipeline — adapters, provenance, identity resolution, validation and activation tooling — is fully built and runs against 63 fictional test cards only. Documented research found no legally permitted source of structured card data: EA discontinued its public card database, and every community card source prohibits scraping or uses a private API. Card prices are permanently UNKNOWN, budget checks stay BUDGET_UNVERIFIED, and chemistry stays UNVERIFIED. None of this is part of the live player intelligence engine.",
      },
    ],

    limitations:
      "No model accuracy figures are published here because none have been verified — the engine is a deterministic scoring system, not a trained model, and publishing a fabricated F1 or precision score would be worse than publishing none. FC27 has zero imported records, so no FC27 recommendation can be produced. Nine adversarial OVR-trap cases currently fail, which means the engine can still prefer a higher-rated generic candidate over a lower-rated specialist in some contexts; that gap is documented rather than hidden. 138 backend tests require a live database and were skipped in the recorded run, so the database-backed API surface is implemented but not demonstrated here. Market prices and squad chemistry have no permitted source and stay permanently unavailable. This is an independent system built on a CC0 public dataset: it is separate from the Ultimate Team card and licensing research tracked below, and claims no ownership of, access to, or partnership with any proprietary EA dataset or API.",

    nextIteration:
      "Close the adversarial OVR-trap cases, then activate FC27 the moment a permitted dataset exists — the ordering is already fixed: ratings snapshot, play-style assignment, roles, cards, verified prices, verified chemistry rules. Each step is gated by its own validation query before the next begins.",

    currentState:
      "FC26 baseline complete and serving live recommendations. FC27 active on the acquisition side: engine ready, 0 of 20,689 target records imported, blocked on a permitted data source.",

    links: {
      repository: "https://github.com/T-Bone47/EA_FC_INTELLIGENCE",
      visibility: "public",
    },
  },

  {
    id: "football-intelligence-os",
    slug: "football-intelligence-os",
    title: "Football Intelligence OS",
    shortTitle: "Football Intelligence OS",
    category: "data-platform",
    status: "active",
    year: "2026",
    featured: false,

    tagline: "Football data infrastructure & intelligence platform",
    description:
      "A modular football data platform built around provider abstraction, immutable provenance, a canonical domain model and a governed capability registry — so downstream analytics never needs to know which provider a number came from.",

    hook: "Multi-provider football data infrastructure",
    evidence: "3 provider adapters \u00b7 609 tests passing, 0 failing",

    brief: {
      problem:
        "Football data is not one dataset. Providers disagree on schema, season coverage, pagination and auth, and once a number has been derived there is usually no way back to the bytes that produced it.",
      built:
        "A modular platform where provider adapters feed a content-addressed raw snapshot store and a canonical football domain model, with analytics that only ever read canonical entities.",
      approach:
        "One provider contract, immutable provenance at every step, and a capability registry that keeps what a provider documents separate from what has actually been called.",
      result:
        "670 tests collected, 609 passing, 0 failing; 61 skipped because no live PostgreSQL was reachable. Two providers were confirmed against real API calls rather than mocks.",
    },

    thesis:
      "Football data is fragmented across providers with different schemas, different coverage and different failure modes; a single provider contract plus content-addressed provenance is what makes the rest of the system trustworthy.",

    tags: ["Data engineering", "Provider systems", "API architecture", "Sports analytics"],

    // Ordered strongest-evidence-first. The index card and the case-study
    // hero both promote metrics[0], so this order IS the headline claim:
    // an executed test run outranks a component count.
    metrics: [
      { value: "609", label: "Tests passed", note: "0 failed, 61 skipped (no live PostgreSQL)" },
      { value: "3", label: "Provider adapters", note: "one shared contract" },
      { value: "24", label: "Canonical models", note: "PostgreSQL-backed" },
      { value: "13", label: "Schema migrations", note: "0001 → 0013" },
    ],

    visualizationType: "platform",
    architectureShape: "converge",

    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "Alembic",
      "Pydantic",
      "Pandera",
      "Tenacity",
      "httpx",
      "Pytest",
      "React",
    ],

    keyTechnologies: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic"],

    problem:
      "Football data is not one dataset. It is several providers with different schemas, different season coverage, different pagination, different auth models and different definitions of \"a fixture\". Every consumer that touches them directly re-implements that fragmentation. Worse, once numbers are derived, there is usually no way to get back to the exact bytes that produced them — so a wrong figure cannot be diagnosed, only guessed at.",

    constraints: [
      {
        label: "Raw data is immutable",
        detail:
          "Every provider response is stored content-addressed before anything is derived from it. Normalised records are always rebuildable from the snapshot they came from.",
      },
      {
        label: "Documented ≠ verified",
        detail:
          "The capability registry keeps \"the provider publishes this\" and \"a real call returned successfully\" in two separate fields, so a capability can be honestly listed and honestly unconfirmed.",
      },
      {
        label: "Modular monolith, not microservices",
        detail:
          "One deployable with explicit module boundaries. The system has a single transactional store, so a distributed deployment would buy failure modes rather than remove them.",
      },
      {
        label: "Deterministic normalisation",
        detail:
          "Transformers are pure functions. Re-running normalisation over the same snapshot must produce the same rows with the same primary keys.",
      },
    ],

    providers: [
      {
        name: "StatsBomb",
        role: "Keyless competition data — the one provider that works with zero configuration",
        status: "live-verified",
        detail:
          "Open-data competitions endpoint exercised over a real network call, with the response shape validated against the live payload rather than a guessed schema.",
        resources: ["competitions", "matches", "events", "lineups"],
      },
      {
        name: "API-Football",
        role: "Fixtures, squads and leagues — the active commercial provider",
        status: "live-verified",
        detail:
          "Leagues, teams, players and fixtures all confirmed against the live API, including the free-tier limits that constrain what can actually be requested.",
        resources: ["leagues", "teams", "players", "fixtures", "standings", "injuries", "predictions"],
      },
      {
        name: "football-data.org",
        role: "Second fixtures-shaped source, implemented and tested but not active by default",
        status: "implemented",
        detail:
          "Adapter, config and registry rows are complete. Deliberately excluded from the default registry so setup does not demand a second credential nobody uses yet; one function call re-enables it.",
        resources: ["competitions", "teams", "matches", "standings", "persons"],
      },
    ],

    capabilities: [
      { provider: "StatsBomb", resource: "competitions", supported: true, verified: true, evidence: "live payload" },
      { provider: "StatsBomb", resource: "matches", supported: true, verified: false },
      { provider: "StatsBomb", resource: "events", supported: true, verified: false },
      { provider: "StatsBomb", resource: "lineups", supported: true, verified: false },
      { provider: "StatsBomb", resource: "360", supported: false, verified: false },
      { provider: "API-Football", resource: "leagues", supported: true, verified: true, evidence: "1,238 results" },
      { provider: "API-Football", resource: "teams", supported: true, verified: true, evidence: "20 results" },
      { provider: "API-Football", resource: "players", supported: true, verified: true, evidence: "20 results" },
      { provider: "API-Football", resource: "fixtures", supported: true, verified: true, evidence: "1,154 results" },
      { provider: "API-Football", resource: "standings", supported: true, verified: false },
      { provider: "API-Football", resource: "injuries", supported: true, verified: false },
      { provider: "API-Football", resource: "predictions", supported: true, verified: false },
      { provider: "football-data.org", resource: "competitions", supported: true, verified: false },
      { provider: "football-data.org", resource: "teams", supported: true, verified: false },
      { provider: "football-data.org", resource: "matches", supported: true, verified: false },
      { provider: "football-data.org", resource: "standings", supported: true, verified: false },
      { provider: "football-data.org", resource: "persons", supported: true, verified: false },
    ],

    lineage: [
      {
        label: "Data source",
        detail: "A registered provider with its own credentials, base URL and licence record.",
        fields: ["name", "auth", "base_url"],
      },
      {
        label: "Ingestion run",
        detail:
          "One attempt against one resource. Carries the full lifecycle, so a failed fetch is recorded as a failed run rather than disappearing.",
        fields: ["status", "resource", "params", "error"],
      },
      {
        label: "Data snapshot",
        detail:
          "The raw provider response, stored before parsing, addressed by the SHA-256 of its own bytes. Re-deriving a canonical record means re-reading this file, not re-calling the provider.",
        fields: ["sha256", "validation_status", "content_hash"],
      },
      {
        label: "Canonical record",
        detail:
          "Normalised entity in the football domain model, pointing back at the snapshot it came from.",
        fields: ["snapshot_id", "entity_type", "entity_id"],
      },
      {
        label: "Consumer",
        detail: "Features, role profiles, tactical fit or the API — each one traceable to a canonical record, and through it to a specific snapshot.",
        fields: ["entity_id", "as_of", "calculation_version"],
      },
    ],

    dataFlow: [
      { label: "Provider adapters", detail: "Each provider's HTTP, auth, pagination and envelope shape translated into one common response type." },
      { label: "Capability gate", detail: "Unsupported resource requests are rejected with a clear error before any fetch is attempted." },
      { label: "Fetch with retry", detail: "Exponential backoff on rate limits and server errors; never retried on auth or client errors." },
      { label: "Validate", detail: "Schema validation marks a snapshot valid or invalid — or pending, when no schema exists yet. Pending is never upgraded to valid by assumption." },
      { label: "Store raw, content-addressed", detail: "The untouched payload is persisted under a SHA-256 key before any transformation touches it." },
      { label: "Normalise", detail: "Pure transformers turn provider payloads into canonical entities, idempotently." },
      { label: "Resolve identity", detail: "Explicit identity records bind provider-local IDs to canonical club and player entities." },
      { label: "Derive", detail: "Features, role profiles, tactical fit and market models read canonical data — never provider payloads." },
    ],

    architecture: {
      summary:
        "A modular monolith. Providers are adapters behind a single protocol; ingestion is a governed lifecycle with provenance at every step; a canonical domain model is the only thing downstream systems see; and a capability registry records what each provider can actually do.",
      sources: ["StatsBomb", "API-Football", "football-data.org"],
      pipeline: [
        { label: "Provider adapters", detail: "One protocol, one response shape, three implementations." },
        { label: "Ingestion lifecycle", detail: "Queued → running → success, partial or failed, recorded either way." },
        { label: "Provenance", detail: "Source, run and snapshot chained so any record is traceable to its bytes." },
        { label: "Canonical model", detail: "Competition, club, player, match, events, statistics — provider-agnostic." },
        { label: "Capability registry", detail: "What each provider exposes, separated from what has been confirmed live." },
        { label: "Analytics & intelligence", detail: "Features, role discovery, tactical fit and market models." },
        { label: "API", detail: "Canonical and decision endpoints over the same models." },
      ],
    },

    engineeringDecisions: [
      {
        title: "Modular monolith over microservices",
        rationale:
          "Ingestion, normalisation and reads share one transactional store. Splitting the system across services would convert every consistency guarantee into a distributed-systems problem without removing any coupling.",
      },
      {
        title: "One provider protocol, three adapters",
        rationale:
          "Nothing above the provider layer is allowed to know which provider produced a payload. That single rule is what lets a fourth provider be added without touching canonical code.",
      },
      {
        title: "\"Available\" and \"verified\" are different columns",
        rationale:
          "A capability table with one boolean forces a false choice between \"the provider supports this\" and \"we have called it successfully\". Keeping them separate means a capability can be listed honestly while remaining unconfirmed.",
      },
      {
        title: "Retry only what is transient",
        rationale:
          "Rate limits and 5xx responses are retried with exponential backoff, honouring Retry-After. 401 and other 4xx responses are never retried, because retrying a bad credential just burns quota.",
      },
      {
        title: "Raw is preserved; canonical is derived",
        rationale:
          "Storing the untouched payload first means normalisation logic can be rewritten and re-run later without re-fetching from a provider whose historical data may have changed.",
      },
    ],

    tradeoffs: [
      {
        problem: "One provider cannot serve the whole domain — coverage, licensing and cost differ per source.",
        decision: "Model providers as interchangeable adapters behind one contract, and let a second provider be registered without touching canonical code.",
        result: "A new source onboards as adapter plus registry rows; no canonical or analytics code changes.",
      },
      {
        problem: "Provider failures are heterogeneous: rate limits, auth expiry, schema drift and network errors need different responses.",
        decision: "Classify into eight distinct exception types, and retry only the transient ones.",
        result: "A missing capability, an expired key and a rate limit produce three different, correct behaviours instead of one generic failure.",
      },
      {
        problem: "Object storage could not be exercised in the development environment.",
        decision: "Define a snapshot-store protocol and ship a local-filesystem implementation using the production key layout, rather than a second untested implementation.",
        result: "Swapping in an S3-backed store is additive — new class, same protocol — and everything above it already avoids touching the filesystem directly.",
      },
    ],

    algorithms:
      "Feature engineering is a pure calculator with safe per-90 rate handling, strict division-by-zero avoidance, explicit preservation of a real zero versus a missing value, multi-window rolling aggregates, opponent-strength baselines and rest-day computation. Role discovery scores nine functional dimensions with standardised features, applies an outlier clip, and gates qualification behind a 450-minute minimum so an under-sampled player is honestly labelled insufficient rather than assigned a fabricated archetype. Clustering is evaluated across a range of k with silhouette diagnostics and seed-stability checks. Similarity is a weighted composite of statistical, role and contextual components. Every derived feature is filtered strictly by as-of timestamp so future data cannot leak into a past calculation.",

    validationClaims: [
      {
        label: "Temporal leakage invariance",
        status: "verified",
        detail:
          "Features computed before a match remain bit-for-bit identical after deliberately injecting a later fixture with extreme statistics. This is the check that separates a real leakage guard from a comment claiming there is one.",
      },
      {
        label: "Normalisation idempotency",
        status: "live-verified",
        detail:
          "Re-normalising a real 1,154-fixture snapshot produced exactly 1,154 matches and 2,308 match-team rows with zero duplicates and stable primary keys.",
      },
      {
        label: "Provider contract tests",
        status: "verified",
        detail:
          "Each adapter is exercised through a mocked transport, including 401, 429, 500 and timeout paths. StatsBomb is additionally validated against a real response rather than an assumed schema.",
      },
      {
        label: "Retry and backoff",
        status: "verified",
        detail:
          "Unit tests assert retry on 429 and 5xx, and no retry on 401 — the distinction that stops a bad key from consuming quota.",
      },
      {
        label: "Ingestion lifecycle",
        status: "live-verified",
        detail:
          "A real HTTP run against the keyless provider reached SUCCESS, with the joined run and snapshot row persisted and a real content hash recorded.",
      },
      {
        label: "Database integration suite",
        status: "not-run",
        detail:
          "61 integration tests require a live PostgreSQL instance and were skipped in the recorded run. They are implemented but were not exercised in that environment.",
      },
      {
        label: "Live provider verification",
        status: "not-run",
        detail:
          "Four API-Football capabilities were confirmed live in an earlier run on a networked machine with real credentials. That result is reported here as a prior observation; it was not reproduced in the run recorded below, whose 61 skips include the opt-in live-provider tests.",
      },
      {
        label: "Container deployment",
        status: "not-run",
          detail:
          "Compose configuration and health checks are defined but the stack has not been brought up end to end.",
      },
    ],

    testing: [
      {
        suite: "Backend suite (pytest)",
        command: "PYTHONPATH=apps/api python -m pytest -q",
        total: 670,
        passed: 609,
        failed: 0,
        skipped: 61,
        skippedBecause:
          "61 integration and opt-in live-provider tests require a live PostgreSQL instance that was not reachable in the environment this run was executed in. No test failed.",
        verifiedOn: "2026-10-03",
      },
    ],

    stateItems: [
      { label: "Provider abstraction", status: "verified", detail: "One protocol, three adapters, contract tests per adapter." },
      { label: "Ingestion lifecycle", status: "live-verified", detail: "Queued → running → success/partial/failed, recorded end to end." },
      { label: "Provenance & snapshots", status: "verified", detail: "Content-addressed raw storage with full lineage back to source." },
      { label: "Capability registry", status: "verified", detail: "17 rows seeded; verified flags set only by real successful calls." },
      { label: "Canonical domain model", status: "verified", detail: "24 entities across 13 migrations, idempotent normalisation." },
      { label: "Retry and backoff", status: "verified", detail: "Transient-only retry with Retry-After support." },
      { label: "API surface", status: "verified", detail: "64 canonical endpoints plus ingestion, health and phase routers." },
      { label: "Live provider verification", status: "partial", detail: "Four API-Football capabilities confirmed in a prior networked run; not reproduced in the recorded run." },
      { label: "Container deployment", status: "not-run", detail: "Compose and health checks defined; stack never brought up end to end." },
    ],

    apiSurface: [
      { method: "POST", path: "/api/v1/ingestion/runs", purpose: "Start an ingestion run against a provider resource.", verified: "live-verified" },
      { method: "GET", path: "/api/v1/ingestion/runs/{run_id}", purpose: "Fetch run status and the snapshot it produced.", verified: "verified" },
      { method: "GET", path: "/api/v1/competitions", purpose: "Canonical competitions.", verified: "verified" },
      { method: "GET", path: "/api/v1/clubs", purpose: "Canonical clubs.", verified: "verified" },
      { method: "GET", path: "/api/v1/players", purpose: "Canonical players.", verified: "verified" },
      { method: "GET", path: "/api/v1/matches", purpose: "Canonical matches, filterable by competition, club, status and date.", verified: "verified" },
      { method: "GET", path: "/api/v1/matches/{id}/events", purpose: "Chronological event timeline for a match.", verified: "verified" },
      { method: "GET", path: "/api/v1/matches/{id}/statistics", purpose: "Comparative match statistics.", verified: "verified" },
      { method: "GET", path: "/api/v1/players/{id}/features", purpose: "Point-in-time player features.", verified: "verified" },
      { method: "GET", path: "/api/v1/players/{id}/similar", purpose: "Similar players by composite similarity.", verified: "verified" },
      { method: "GET", path: "/api/v1/data/providers", purpose: "Provider capability and readiness profile.", verified: "implemented" },
      { method: "GET", path: "/health/ready", purpose: "Readiness — checks the database, not just that the process is up.", verified: "verified" },
    ],

    limitations:
      "Sixty-one integration and opt-in live-provider tests require a live PostgreSQL instance and were skipped in the recorded run, so the database-backed surface is implemented but not demonstrated there. Provider capability differs by source: a capability one provider exposes may be absent or shaped differently in another, and the matrix shows which. Container deployment is defined but has never been run end to end. Two adapters are verified only through mocked transports. Downstream intelligence — valuation, recruitment, forecasting — is built on the foundation but is not covered by the same verification bar as ingestion, normalisation and provenance, and should not be read as claiming it.",

    nextIteration:
      "Extend live provider verification to the capabilities currently marked documented-but-uncalled, and close the environment gap that leaves the integration suite skipped. The foundation deliberately stopped short of speculative expansion until ingestion, normalisation and provenance were genuinely verified.",

    currentState:
      "Foundation verified: provider abstraction, provenance, canonical model, capability registry and API all implemented and tested. Container deployment and full integration-suite execution remain environment-dependent.",

    links: {
      repository: "https://github.com/T-Bone47/Football_OS",
      visibility: "public",
    },
  },

  {
    id: "sentinel-ai",
    slug: "sentinel-ai",
    title: "Sentinel AI",
    shortTitle: "Sentinel AI",
    category: "enterprise-grc",
    // Read from the repository snapshot this entry was written against
    // (source and handoff artifacts all dated 2026-10-07), not estimated.
    status: "active",
    year: "2026",
    // Tier 2, and deliberately NOT featured. `getFlagshipProject()` returns
    // the first project that is both featured and carries metrics, and
    // app/work/[slug]/page.test.ts asserts that set is exactly
    // ["live-f1-intelligence"]. Sentinel AI has real measured figures, so
    // marking it featured would silently move the flagship block on /work.
    featured: false,

    tagline: "Enterprise GRC & risk intelligence platform",

    description:
      "An enterprise governance, risk and compliance platform that connects organisational records — policies, controls, risks, findings, evidence, privacy data and audit logs — into one PostgreSQL-backed model, with a Copilot whose answers are composed only from those records and cite the endpoints they came from.",

    hook: "Answers grounded in a verified GRC record chain",

    // A figure is stated here, so `metrics` below must back it — the suite
    // enforces that pairing.
    evidence: "245 backend tests passing · 14,400 records in one model",

    brief: {
      problem:
        "Enterprise governance evidence is scattered across policy documents, control registers, risks, findings and audit logs. Answering something as ordinary as \"are we audit ready?\" means reconciling all of them by hand, under scrutiny.",
      built:
        "A PostgreSQL-backed platform that ingests 15 organisational datasets into one canonical model and answers governance questions through a Copilot built on deterministic intelligence services rather than free-text generation.",
      approach:
        "A model proposes a query plan, never SQL. The compiler validates that plan against a hand-written schema graph and runs it inside a read-only transaction, so a fabricated table or column is rejected rather than approximated.",
      result:
        "245 backend tests pass, 1 skipped, 0 failed; evidence coverage reports 66.0% of 300 controls with a formula the API publishes. No LLM key was configured, so the grounded-LLM path is mocked-tested only.",
    },

    thesis:
      "An answer about governance is only worth something if it can be traced to the records it came from, so provenance is designed first and natural-language convenience second.",

    tags: ["Governance", "Risk intelligence", "Grounded AI", "Provenance"],

    visualizationType: "governance",
    architectureShape: "sequential",

    // Strongest evidence first — this order is what the index row and the
    // case-study hero promote as the headline. Every note attributes its
    // number, because an unsourced figure is an invented one.
    metrics: [
      { value: "245", label: "Backend tests passing", note: "1 skipped, 0 failed — the project's own recorded pytest run" },
      { value: "14,400", label: "Records in one model", note: "15 datasets ingested with 0 errors and 0 rows skipped" },
      { value: "66.0%", label: "Controls with verified evidence", note: "198 of 300 controls, from the formula the API returns" },
      { value: "0", label: "Orphaned relationships", note: "14 verified foreign keys re-checked against the live database" },
    ],

    problem:
      "Enterprise governance evidence is spread across policy documents, control registers, risk registers, compliance findings, evidence artefacts, privacy inventories and audit logs. Each lives in its own file, its own vocabulary and often its own system, so a question as ordinary as \"are we audit ready?\" requires reconciling many sources by hand — and then holding that reconciliation in your head while someone asks why. The intended users are the people who have to answer that question under scrutiny: compliance and audit staff, security teams, and whoever owns the evidence for a control on the day an auditor asks for it.",

    // Boundary conditions, not choices. Each one is enforced in code and
    // named here so a reader can check it.
    constraints: [
      {
        label: "A relationship that does not exist is never approximated",
        detail:
          "Vendors and reports have no foreign key to anything, and identity records have no application link. The schema graph records what is absent as deliberately as what is present, and a question that assumes a missing join is reported as unanswerable instead of being approximated with a nearby one.",
      },
      {
        label: "Read-only by construction",
        detail:
          "The query compiler emits parameterised SQL with no string interpolation anywhere, and executes it inside a read-only transaction with a five-second statement timeout. A test runs a real query and then attempts a real delete inside that same transaction, asserting PostgreSQL itself rejects it.",
      },
      {
        label: "Evidence counts only when it is verified",
        detail:
          "A control is covered when it has at least one verified evidence item. Severity ranks gaps; it never weights the percentage, because the weights would be arbitrary. \"Unverified evidence only\" is its own bucket rather than being folded into \"uncovered\".",
      },
      {
        label: "The core needs no language model",
        detail:
          "Evidence, policy, copilot and remediation intelligence are deterministic rule-based engines. Every response carries whether an LLM was used, and the interface renders a verified-fallback badge rather than claiming AI when the model did not run.",
      },
    ],

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "Pydantic",
      "PostgreSQL",
      "Pytest",
    ],

    keyTechnologies: [
      "React",
      "TypeScript",
      "Vite",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
    ],

    architecture: {
      summary:
        "A layered FastAPI service over one PostgreSQL canonical model. Fifteen organisational datasets are ingested idempotently into a single schema with real foreign keys; repositories and services sit above that model and the intelligence layer reads only from it. Nothing above the repository layer touches a data source directly, and business logic never lives in a router.",
      pipeline: [
        {
          label: "Organisational datasets",
          children: [
            "Employees",
            "Identity & access",
            "Devices",
            "Applications",
            "Cloud assets",
            "Third-party vendors",
            "Policies",
            "Controls",
            "Risks",
            "Audit logs",
            "Evidence",
            "Findings",
            "Reports",
            "Privacy inventory",
            "Consent records",
          ],
        },
        {
          label: "Idempotent ingestion",
          detail:
            "One generic ingestor driven by declarative per-dataset configs; upsert on primary key, with inserted-versus-updated measured from PostgreSQL rather than guessed.",
        },
        {
          label: "Canonical model",
          detail: "One schema, 14 verified foreign keys, zero orphans.",
        },
        {
          label: "Repositories & services",
          detail: "Business logic lives here, never in a router.",
        },
        {
          label: "Intelligence services",
          children: [
            "Dashboard",
            "Trust",
            "Risk",
            "Evidence",
            "Policy",
            "Remediation",
            "Monitoring",
            "Orchestrator",
          ],
        },
        {
          label: "REST API",
          detail:
            "Route handlers for resource lists and details, auth, health, dashboard, organisation graph and the intelligence endpoints.",
        },
        {
          label: "React front end",
          detail:
            "21 of its 23 page components read the API; no screen falls back to sample data.",
        },
      ],
      stack: [
        "Python 3.12",
        "FastAPI",
        "SQLAlchemy 2 (async)",
        "Alembic",
        "Pydantic v2",
        "PostgreSQL 16",
        "React 18",
        "TypeScript",
        "Vite",
      ],
    },

    // The request path, which is the part of this system worth drawing: a
    // question travels through validation before it reaches any record.
    dataFlow: [
      {
        label: "Question",
        detail: "Natural language, from the Copilot screen or a direct API call.",
      },
      {
        label: "Question understanding",
        detail:
          "A model proposes a structured reasoning plan — which metrics, which tables, which filters — never SQL text.",
      },
      {
        label: "Plan validation",
        detail:
          "The plan is checked against the hand-written schema graph independently of the shape validation it already passed, so a fabricated table or column is rejected even if a future caller builds a plan by hand.",
      },
      {
        label: "Compiled query",
        detail:
          "Parameterised SQLAlchemy construction, executed inside a read-only transaction with a five-second timeout.",
      },
      {
        label: "Records",
        detail:
          "Answers are composed from the canonical model, never from a language model's memory of what governance systems usually look like.",
      },
      {
        label: "Deterministic fallback",
        detail:
          "If no plan can be built — no key configured, timeout, malformed output — the request falls through to the fixed-intent Copilot with its original response contract intact.",
      },
      {
        label: "Response",
        detail:
          "Answer, intent, supporting data, related entities, recommendations, sources and confidence. The sources list the endpoints the answer was composed from.",
      },
    ],

    validationClaims: [
      {
        label: "Backend test suite",
        status: "verified",
        detail:
          "245 passed, 1 skipped, 0 failed, as recorded in the project's own handoff for the 2026-10-07 snapshot. Not re-executed during this portfolio pass: it requires a live PostgreSQL 16 instance and the project's own Python environment.",
      },
      {
        label: "Read-only enforcement is proven, not asserted",
        status: "verified",
        detail:
          "A test executes a real query, then attempts a real delete in the same transaction, and asserts PostgreSQL rejects it.",
      },
      {
        label: "Idempotent ingestion",
        status: "verified",
        detail:
          "Re-running ingestion across all 15 datasets produced zero inserts and 14,400 updates with row counts unchanged.",
      },
      {
        label: "Relationship integrity",
        status: "verified",
        detail:
          "Zero orphans across all 14 verified foreign keys, confirmed against the live database by a test rather than by a profiling script alone.",
      },
      {
        label: "Coverage recomputed from its own published formula",
        status: "verified",
        detail:
          "A test recomputes evidence coverage from the formula the response itself carries, and cross-checks that it never exceeds the dashboard's looser \"any evidence\" count.",
      },
      {
        label: "Refusal paths",
        status: "verified",
        detail:
          "An out-of-scope question returns an unknown intent with empty supporting data and the list of answerable questions. Policy text that cannot be mapped returns the literal string \"No verified control mapping found.\" Neither improvises.",
      },
      {
        label: "Browser end-to-end run",
        status: "verified",
        detail:
          "Headless Chrome drove the real interface against the real backend and a real dev server. It surfaced a genuine pre-existing bug: once any question had succeeded, a later failure rendered nothing at all — no error, no retry — because the failure branch sat behind a value that stayed truthy. Fixed at the source of the derived state; the error now appears within a second.",
      },
      {
        label: "Real-model output quality",
        status: "not-run",
        detail:
          "No provider key was configured in the environment this was built in and it had no network path to one, so a live grounded response was never observed. The success, timeout, empty-response and unconfigured paths are covered by 37 mocked tests.",
      },
    ],

    testing: [
      {
        suite: "Backend suite (pytest) — the project's own recorded run",
        command: "python -m pytest",
        total: 246,
        passed: 245,
        failed: 0,
        skipped: 1,
        skippedBecause:
          "The one skip documents a graceful-degradation case that the current dataset does not happen to contain, so it skips by design rather than being disabled. The suite also needs a live PostgreSQL 16 instance; this portfolio reads the project's recorded result instead of re-running it.",
        verifiedOn: "2026-10-07",
      },
    ],

    // Feature by feature, because the honest boundary between shipped and
    // half-built is the most useful thing on this page. The three `planned`
    // entries at the end are not padding: the project's own status file
    // records them as TODOs, and leaving them out would let "implemented"
    // read as "complete".
    stateItems: [
      {
        label: "Command Center",
        status: "verified",
        detail:
          "Trust score, audit readiness, critical risks, evidence coverage and framework rollup. Every figure is a live aggregate query, and the score returns its own weights, components and formula so it can be recomputed by hand.",
      },
      {
        label: "GRC Copilot",
        status: "implemented",
        detail:
          "Twelve intents plus a general natural-language-to-query engine. Each answer carries its supporting data and the endpoints it was composed from. Deterministic by default; the language-model rewrite path is implemented but was never exercised against a live provider.",
      },
      {
        label: "Investigations",
        status: "implemented",
        detail:
          "An investigation workspace over open cases, plus a drawer that opens from a critical risk and follows policy → control → finding → evidence → risk through real foreign keys.",
      },
      {
        label: "Organization graph",
        status: "verified",
        detail:
          "One API call returns the whole topology. A test asserts every edge references a real node, and that vendors appear unconnected because they genuinely have no foreign key to anything.",
      },
      {
        label: "Risk & findings",
        status: "implemented",
        detail:
          "Risk register and findings views with deterministic, step-by-step remediation plans and a prioritised remediation panel derived from the findings themselves rather than from a model.",
      },
      {
        label: "Governance & controls",
        status: "implemented",
        detail:
          "Policy library, control register and framework rollup. Evidence and findings attach to controls through real foreign keys; a stored policy's controls are read from its key rather than re-derived by text matching.",
      },
      {
        label: "Asset management",
        status: "implemented",
        detail:
          "Employees, identity and access, devices, applications, cloud assets and third-party vendors, all read from ingested records.",
      },
      {
        label: "Privacy & consent",
        status: "implemented",
        detail:
          "Data-protection inventory and consent records, with the application links that exist shown and the ones that do not stated rather than implied.",
      },
      {
        label: "Evidence repository",
        status: "implemented",
        detail:
          "Coverage, per-framework breakdown and ranked gaps, each gap carrying the backend's own written explanation of why it is a gap.",
      },
      {
        label: "Audit logs & reporting",
        status: "implemented",
        detail:
          "Audit log with date-range and minimum-risk filters, plus compliance reports. Reports have no foreign key to individual findings, and nothing joins them to one.",
      },
      {
        label: "Record write endpoints",
        status: "planned",
        detail:
          "Every data endpoint is a GET; there is no create, update or delete route anywhere in the API. The platform can be inspected through its API but not operated through it, which was sufficient for a read-only demo and is recorded as unfinished rather than as done.",
      },
      {
        label: "Role-based access applied to endpoints",
        status: "planned",
        detail:
          "The role guard exists and is unit-tested against five seeded roles, but it is applied to no data endpoint: neither the Copilot nor the general query path requires a token. Recorded by the project as deliberate for a reviewer-friendly demo, not as finished work.",
      },
      {
        label: "Policy document upload",
        status: "planned",
        detail:
          "Policy analysis accepts text in the request body only. There is no upload endpoint and no PDF text extraction, so a policy cannot yet be supplied as a document — only pasted in.",
      },
    ],

    apiSurface: [
      { method: "GET", path: "/api/v1/health", purpose: "Liveness check.", verified: "verified" },
      {
        method: "GET",
        path: "/api/v1/dashboard",
        purpose:
          "Every Command Center figure as a live aggregate, including the trust score's components and formula.",
        verified: "verified",
      },
      {
        method: "POST",
        path: "/api/v1/auth/login",
        purpose: "bcrypt-verified login returning a token, with refresh and a current-user endpoint alongside it.",
        verified: "verified",
      },
      {
        method: "GET",
        path: "/api/v1/organization/graph",
        purpose: "The whole organisation topology in one call.",
        verified: "verified",
      },
      {
        method: "GET",
        path: "/api/v1/intelligence/evidence/coverage",
        purpose:
          "Coverage percentage, every gap and a per-framework breakdown, with the formula included in the response.",
        verified: "verified",
      },
      {
        method: "POST",
        path: "/api/v1/intelligence/policy/analyze",
        purpose:
          "Extract obligations from policy text and map them to controls, or say that no verified mapping was found.",
        verified: "verified",
      },
      {
        method: "POST",
        path: "/api/v1/copilot/query",
        purpose: "A structured answer composed from live records, with its sources listed.",
        verified: "verified",
      },
      {
        method: "POST",
        path: "/api/v1/ai/query",
        purpose:
          "General natural-language-to-query path over the schema graph, with a deterministic fallback to the fixed intents.",
        verified: "implemented",
      },
    ],

    // The three ideas this system is actually built on.
    engineeringDecisions: [
      {
        title: "Connected organisational data lives in one model with real foreign keys",
        rationale:
          "Fifteen flat datasets become one schema, and the relationships between them were chosen empirically — by checking the actual value overlap between candidate columns — rather than inferred from column names. Policy → control → finding → evidence → risk is a chain of real foreign keys, so an investigation can follow it and any figure derived from it can be recomputed by someone with database access. Fourteen relationships carry zero orphans, and the relationships that do not exist are recorded as absent so nothing downstream invents them.",
      },
      {
        title: "The model proposes a query; it never writes one",
        rationale:
          "The general engine's model output is a validated plan of tables, columns, filters and joins, with no field anywhere able to hold a SQL string. The compiler then checks that plan against a schema graph hand-written from PostgreSQL's own catalog — independently of the validation the plan already passed — and builds parameterised SQL from it. A language model's mistake becomes a rejected plan rather than an executed statement, and the read-only guarantee is proven by a test that attempts a delete inside the transaction. When no plan can be built at all, the request falls through to the fixed-intent engine rather than failing.",
      },
      {
        title: "Governance claims carry their own provenance",
        rationale:
          "Coverage ships with the formula that produced it. The trust score ships with its weights and components and is labelled as deterministic rather than presented as a model output. Every Copilot answer lists the endpoints it was composed from. Every response states whether a language model was used. And where a judgement cannot be derived from the data — whether evidence is stale, whether a vendor presents a risk to a control — the response says the judgement is unavailable instead of producing a number for it.",
      },
    ],

    tradeoffs: [
      {
        problem:
          "Fifteen datasets arrived with no declared relationships, and the obvious shortcut — inferring joins from column-name similarity — would have manufactured relationships that are not real and buried the ones that are.",
        decision:
          "Profile the data first: check actual value overlap between candidate columns, then write a ground-truth schema graph by hand from PostgreSQL's catalog and cross-check it against that independent profile.",
        result:
          "The two agree exactly, and the same graph doubles as the validator for model-proposed queries. Four relationships that the requirements' own example questions assume — vendor to risk, employee to application, and two others — turn out not to exist, and the engine reports those questions as unanswerable instead of approximating a join.",
      },
      {
        problem:
          "A policy library needs its text mapped to controls, but no model was configured and standing up provider infrastructure was explicitly out of scope.",
        decision:
          "Make extraction and matching deterministic and local, and put the model behind a swappable extractor interface so adding one later is a substitution rather than a rewrite.",
        result:
          "Policy analysis runs with no network and declares in every response that no model was used. Below a published match threshold it returns \"No verified control mapping found.\" rather than a nearest guess. A stored policy takes a different path entirely — its controls come from the real foreign key at verified confidence, because re-deriving a stated link by fuzzy matching would be weaker, not stronger.",
      },
      {
        problem:
          "Evidence freshness is the kind of thing a compliance dashboard is expected to judge, and the dataset carries collection dates but no validity period, review cadence or refresh requirement.",
        decision:
          "Report the real age of each artefact and refuse to label anything stale or expired.",
        result:
          "An explicit freshness-unavailable flag ships in every coverage response, and the misleading expiry tiles that had been on the Evidence screen were replaced with counts that are actually derivable.",
      },
    ],

    algorithms:
      "The intelligence layer is a set of deterministic engines rather than one model. Evidence coverage is covered controls divided by total controls, where a control counts only if it holds at least one verified evidence item; gap severity is a four-level rule over whether evidence is required, whether any exists and whether findings are open. Policy extraction is obligation-verb detection followed by lexical control matching with published scores and a threshold; stored policies bypass matching for their real foreign keys. The Copilot routes a question to one of twelve intents by keyword group, and the order of those groups is load-bearing: a broad risk fallback was swallowing \"which vendor is highest risk\" until vendor, privacy and policy intents were declared above it — found by testing, fixed, and now covered by its own test. Above that sits a general engine: a model proposes a reasoning plan, a compiler validates it against the schema graph and executes it read-only, and any failure falls back to the twelve intents with the original response contract intact.",

    implementation:
      "A FastAPI application over async SQLAlchemy 2 with Alembic migrations, structured as routers → services → domain → repositories so that business logic never lives in a router. Ingestion is declarative: one generic ingestor driven by per-dataset configuration, upserting on primary key, with inserted-versus-updated distinguished through PostgreSQL's own row metadata rather than inferred. Loading is foreign-key aware — a missing parent nulls a nullable key, skips a non-nullable one, and warns but keeps for advisory links — and duplicate primary keys inside one file are resolved last-row-wins with the earlier rows counted as skipped rather than discarded silently. Read paths are paginated, searchable, filterable and sortable, with audit logs additionally taking date-range and minimum-risk filters. Exception handlers wrap both HTTP and validation failures in the same response envelope as successful calls, so a client never has to parse two shapes.",

    limitations:
      "Built for a hackathon, and it should be read that way. No provider key was available in the environment it was developed in and there was no network path to one, so the grounded-model path is covered by mocked tests only — a live grounded response has never been observed. Authentication exists (bcrypt hashing, token issue and refresh, and a role guard) but the guard is applied to no data endpoint, and neither the Copilot nor the general query endpoint requires a token; the demo needed unauthenticated endpoints and that decision has not been revisited. The API is read-only — there are no create, update or delete endpoints for records. Rule-based policy extraction is lexical, so it misses obligations phrased without an obligation verb, and its matching is quadratic against the control count with no measurement at document scale. The query language has no subquery or anti-join support, so \"controls with no evidence\" is answerable as a count but not as a list. Indexes are first-pass choices that have never been load-tested, and there are no unit tests for services in isolation — the suite is deliberately integration-first. A type check reports a set of pre-existing errors in unrelated screens that the build does not gate on. Nothing is deployed, no security certification exists, and none of the compliance frameworks the data references is claimed as certified. The 245/1 result is the project's own recorded run, read from its handoff for the 2026-10-07 snapshot; it was not re-executed for this portfolio.",

    nextIteration:
      "Closing the environment gaps first, because they are the ones that leave a claim unverified: configure a real provider key to exercise the grounded path end to end, apply the existing role guard to the data endpoints, and add the write endpoints the platform needs before it can be used rather than only read. Then the project's own deferred backlog — policy document upload with text extraction, subquery support in the query language, and load-testing the indexes against real query patterns.",

    currentState:
      "Active. Backend foundation complete against 15 real datasets with 245 tests passing; trust, risk, evidence, policy, remediation and monitoring intelligence implemented and verified against live data; the front end wired to the API across 21 of its 23 page components. Authentication is unapplied to data endpoints, the language-model path is unverified against a live provider, and nothing is deployed.",

    // Sentinel AI is a genuine engineering effort, but its canonical
    // repository is not public under the T-Bone47 GitHub account. The
    // portfolio data was sourced from a separate working copy whose git
    // remote pointed at a third-party account; that remote is unconfirmed
    // as the canonical public repository, so no repository link is
    // published here. The project is retained because its claims are
    // otherwise supportable from its own source and handoff documents.
    links: {
      visibility: "unpublished",
    },
  },

  {
    id: "vyaparpulse",
    slug: "vyaparpulse",
    title: "VyaparPulse",
    shortTitle: "VyaparPulse",
    category: "ai-ml",
    // No status was stated for this project in the spec (and it is absent
    // from the §39 "Currently Building" list). "active" is used as the most
    // conservative non-claim — please confirm the real status.
    status: "active",
    // The GitHub repository github.com/T-Bone47/vyaparpulse-ai was first
    // committed on 2026-08-31. The project is a Smart India Hackathon team
    // project, so the repository creation date is the best documented year
    // available; the original SIH event year is not recorded in the
    // repository. "2026" is the documented year, not an estimate.
    year: "2026",
    featured: false, // Tier 2 — spec §66

    tagline: "AI-powered financial intelligence platform",
    description:
      "Spoken transaction entries are transcribed with Vosk and structured by an LLM into canonical transaction data, reconciled through a FastAPI ledger, then forecast with an XGBoost model into business insights. Originated at Smart India Hackathon — positioned here as an AI/ML systems showcase rather than a hackathon artifact.",

    hook: "Voice entry, ledger-grade integrity",
    evidence: "Voice capture \u2192 reconciled ledger \u2192 revenue forecast",

    brief: {
      problem:
        "Merchant entries are manual and slow, and speech transcription plus LLM extraction is unreliable enough that a single misheard or double-submitted entry silently corrupts the forecast trained on it.",
      built:
        "A voice-to-ledger pipeline \u2014 Vosk transcription, LLM extraction, a FastAPI ledger with reconciliation and duplicate protection \u2014 feeding an XGBoost seven-day revenue forecast.",
      approach:
        "Every extraction is routed through the ledger before the model sees it, so the forecast is trained on reconciled data rather than on raw speech output.",
      result:
        "Confidence is reported alongside the prediction when a merchant has too little history to fit, rather than presenting a number the data cannot support. Team project originating at Smart India Hackathon.",
    },

    thesis:
      "Voice is the input surface, but the integrity guarantee lives in the ledger — reconciliation and duplicate protection make an unreliable transcription path safe.",

    visualizationType: "forecast",
    architectureShape: "sequential",

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "Framer Motion",
      "Capacitor",
      "Python",
      "FastAPI",
      "SQLite",
      "SQLAlchemy",
      "Vosk",
      "XGBoost",
      "Pandas",
    ],

    keyTechnologies: ["React", "TypeScript", "Python", "FastAPI", "Vosk", "XGBoost"],

    architecture: {
      summary:
        "Voice input is transcribed and LLM-extracted into canonical transaction data, served by a FastAPI backend that handles ledger and reconciliation, then forecast by an XGBoost model into business insights.",
      pipeline: [
        { label: "Voice Input" },
        { label: "Vosk Speech-to-Text" },
        { label: "LLM Extraction" },
        { label: "Canonical Transaction Data" },
        { label: "FastAPI Backend", children: ["Ledger", "Reconciliation"] },
        { label: "XGBoost ML Engine" },
        { label: "Revenue Forecast" },
        { label: "Business Insights" },
      ],
      stack: ["React", "TypeScript", "Vite", "TailwindCSS", "Python", "FastAPI", "SQLite", "Vosk", "XGBoost"],
    },

    currentState:
      "Active — team project originating at Smart India Hackathon; voice-to-ledger pipeline with XGBoost 7-day revenue forecasting.",

    problem:
      "Merchant transaction entry is manual and slow, and speech transcription plus LLM extraction is inherently unreliable. Without a ledger that reconciles and rejects duplicates, a single misheard or double-submitted entry silently corrupts the forecast the model is trained on.",

    tradeoffs: [
      {
        problem:
          "LLM extraction of spoken transactions cannot be trusted to be correct or unique — the same entry can be captured twice, or parsed differently.",
        decision:
          "Route every extraction through a FastAPI ledger with reconciliation and duplicate protection, and let the model consume reconciled data only.",
        result:
          "The forecast is trained on a ledger that has already rejected duplicates and reconciled mismatches.",
      },
      {
        problem:
          "A revenue model has nothing to learn from when a merchant has insufficient history.",
        decision:
          "Handle insufficient-history explicitly rather than fitting a model to noise.",
        result:
          "Confidence is reported alongside a prediction instead of presenting a number the data cannot support.",
      },
    ],

    limitations:
      "A team project originating at Smart India Hackathon — presented as an AI/ML systems showcase, not as a hackathon artifact, and not as solo work. Accuracy of transcription and extraction is bounded by ambient noise and speech-model quality; confidence is surfaced rather than hidden. Forecast quality depends on the merchant having enough reconciled history to fit. Capacitor mobile packaging is part of the project; no store release is claimed.",

    links: {
      repository: "https://github.com/T-Bone47/vyaparpulse-ai",
      visibility: "public",
    },
  },
];

/** Convenience lookups mirroring the route structure in spec §11. */
export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

/** Explicit narrative position, falling back to catalogue index. An index,
 *  never a rank — no project is ever labelled best, first or winner. */
export const getProjectNumber = (slug: string): string =>
  String(projects.findIndex((project) => project.slug === slug) + 1).padStart(2, "0");

export const featuredProjects = (): Project[] => projects.filter((project) => project.featured);

/**
 * The single project that gets the strongest visual treatment on /work.
 *
 * Derived from evidence, not from a hand-set rank. The spec calls for the
 * flagship to be weighted by "demonstrated technical depth" — and the only
 * honest proxy for that in the data is: is this project backed by measured,
 * verified numbers? Today that is Live F1 Intelligence alone.
 *
 * So the rule is: featured AND has metrics. It degrades safely — if
 * measured figures are ever added to another project, it becomes the
 * flagship automatically rather than requiring someone to remember to
 * re-rank a list. If no project qualifies, this returns undefined and the
 * index renders without a flagship block rather than inventing one.
 */
export function getFlagshipProject(): Project | undefined {
  return projects.find(
    (project) => project.featured && (project.metrics?.length ?? 0) > 0
  );
}

/** Everything that is not the flagship, in catalogue order. */
export function getIndexProjects(): Project[] {
  const flagship = getFlagshipProject();
  return flagship ? projects.filter((project) => project.id !== flagship.id) : projects;
}

/**
 * The systems previewed on the homepage.
 *
 * Derived, not hand-listed, and by the same evidence rule as the flagship:
 * a project qualifies by carrying measured `metrics`. Three of the seven
 * do today, and they are exactly the three a recruiter should meet first.
 *
 * The homepage deliberately does NOT render the full catalogue. It used to
 * list all seven rows identically to /work, which made the archive a
 * duplicate of the homepage rather than somewhere new to go. The remaining
 * projects are one click away and the section states the full count, so
 * nothing is quietly dropped.
 */
export function getHomepageProjects(): Project[] {
  return projects.filter((project) => (project.metrics?.length ?? 0) > 0).slice(0, 3);
}

/**
 * Circular "next system" lookup for the case-study footer.
 *
 * Written as a guarded helper rather than inline index arithmetic on the
 * call site because `noUncheckedIndexedAccess` makes every array index
 * `T | undefined` — inline `(i + 1) % length` arithmetic silently fails
 * the typecheck (it did, and it broke `next build` outright). Centralising
 * it here also means the "single project links to itself" edge case and
 * the unknown-slug case are handled in exactly one place, and can be
 * asserted against in tests/ rather than re-derived per page.
 *
 * Returns undefined when there is nothing to link to (empty catalogue),
 * so callers must narrow before rendering.
 */
export function getNextProject(slug: string): Project | undefined {
  if (projects.length < 2) return undefined;

  const currentIndex = projects.findIndex((project) => project.slug === slug);
  // Unknown slug: fall back to the first project rather than computing a
  // bogus index off -1 (which would silently skip an entry).
  const from = currentIndex === -1 ? -1 : currentIndex;

  return projects[(from + 1) % projects.length];
}

/**
 * The project before this one in narrative order, for the case-study
 * footer's PREVIOUS link. Returns undefined at the head of the catalogue
 * rather than wrapping around, so "previous" never silently points at the
 * last project — the footer shows a one-sided control and says so.
 */
export function getPreviousProject(slug: string): Project | undefined {
  const currentIndex = projects.findIndex((project) => project.slug === slug);
  if (currentIndex <= 0) return undefined;
  return projects[currentIndex - 1];
}
