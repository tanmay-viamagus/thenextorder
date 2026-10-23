"use client";

import { ChapterLabel } from "./Story";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * How a GCC evolves — one editorial line illustration that changes across
 * four stages (the drawing has five states; the first, headquarters alone,
 * is folded into the arrival): a centre arriving in India, the centre
 * operating, the ownership shift, and the next order. Fine black lines on
 * ivory; purple only where ownership moves. Scroll (pinned, native) or the
 * stage timeline on the ground line drives it. A conceptual journey, not a
 * maturity model every centre must follow.
 */
export const STAGES = [
  {
    n: "01",
    scene: 2,
    title: "The arrival",
    line: "India becomes part of the plan.",
    note: "The business is run from headquarters. A centre opens in India, connected to it by a clear mandate.",
    role: "Getting set up",
    decides: "Headquarters",
  },
  {
    n: "02",
    scene: 3,
    title: "The operating centre",
    line: "Teams form. Capabilities take shape.",
    note: "Work comes in, delivery goes back. This is where many GCCs are today.",
    role: "Delivers the work",
    decides: "Headquarters",
  },
  {
    n: "03",
    scene: 4,
    title: "The ownership shift",
    line: "From executing work to owning outcomes.",
    note: "Products, platforms and engineering — and the decisions that go with them — start to sit in India.",
    role: "Owns products & platforms",
    decides: "India, for what it owns",
  },
  {
    n: "04",
    scene: 5,
    title: "The next order",
    line: "Building what the business becomes next.",
    note: "The centre helps decide what the global business builds, and where it goes next.",
    role: "Shapes what the business builds next",
    decides: "Together, as one organisation",
  },
] as const;

const G = 560; // ground

/* ---------------------------------------------------------------- drawing parts */
function Person({
  x,
  y = G,
  s = 1,
  tone = "ink",
}: {
  x: number;
  y?: number;
  s?: number;
  tone?: "ink" | "purple";
}) {
  return (
    <g
      className={`ev-p ev-p--${tone}`}
      transform={`translate(${x} ${y}) scale(${s})`}
    >
      <circle cx="0" cy="-27" r="5.5" />
      <path d="M-8 0 V-12 C-8 -19 -4 -20 0 -20 C4 -20 8 -19 8 -12 V0 Z" />
    </g>
  );
}

/** a person at a desk, seen through glass */
function Desk({ x, y }: { x: number; y: number }) {
  return (
    <g className="ev-desk" transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="-30" r="5" className="ev-fill" />
      <path
        d="M-9 -8 C-9 -17 -5 -19 0 -19 C5 -19 9 -17 9 -8 Z"
        className="ev-fill"
      />
      <rect x="10" y="-26" width="18" height="13" className="ev-line" />
      <line x1="19" y1="-13" x2="19" y2="-8" className="ev-line" />
      <line x1="-16" y1="-8" x2="36" y2="-8" className="ev-line" />
    </g>
  );
}

function Tree({ x }: { x: number }) {
  return (
    <g className="ev-tree">
      <line x1={x} y1={G} x2={x} y2={G - 34} />
      <circle cx={x} cy={G - 50} r="20" />
    </g>
  );
}

function Windows({
  x,
  y,
  cols,
  rows,
  w,
  h,
  gx,
  gy,
  lit = [],
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  w: number;
  h: number;
  gx: number;
  gy: number;
  lit?: number[];
}) {
  const out: ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c;
      out.push(
        <rect
          key={k}
          className={`ev-win${lit.includes(k) ? " is-lit" : ""}`}
          x={x + c * gx}
          y={y + r * gy}
          width={w}
          height={h}
        />,
      );
    }
  return <>{out}</>;
}

/** a small item travelling a path: a brief (envelope), finished work (box) or a product (purple cube) */
function Traveller({
  path,
  kind,
  dur,
  reverse = false,
  delay = 0,
  className = "",
}: {
  path: string;
  kind: "brief" | "box" | "product";
  dur: number;
  reverse?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <g className={`ev-tr ev-tr--${kind} ${className}`}>
      {kind === "brief" ? (
        <g>
          <rect x="-11" y="-8" width="22" height="16" />
          <path d="M-11 -8 L0 1 L11 -8" />
        </g>
      ) : (
        <g>
          <path d="M0 -10 L10 -5 L10 6 L0 11 L-10 6 L-10 -5 Z" />
          <path d="M-10 -5 L0 0 L10 -5 M0 0 V11" />
        </g>
      )}
      <animateMotion
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
        {...(reverse
          ? { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" }
          : {})}
      />
    </g>
  );
}

// relationships: HQ roof → India; India → the organisation's other markets
const ARC_A = "M428 190 C 650 50, 960 70, 1236 410";
const ARC_B = "M428 190 C 650 40, 900 50, 1100 232";
const ARC_C = "M1076 410 Q 1000 392 928 460";
const ARC_D = "M1076 440 Q 900 420 738 496";

function Scene() {
  return (
    <svg className="ev" viewBox="-40 -50 1680 700" aria-hidden="true">
      {/* the camera: moves in on each stage's action, pulls back at 02 and 05 */}
      <g className="cam">
        {/* the ground: home on the left, India on the right */}
        <line className="ev-ground" x1="40" x2="1560" y1={G} y2={G} />
        <text className="ev-place" x="300" y={G + 34} textAnchor="middle">
          HOME MARKET · HEADQUARTERS
        </text>
        <text
          className="ev-place ev-place--in"
          x="1250"
          y={G + 34}
          textAnchor="middle"
        >
          INDIA
        </text>

        {/* 01 · headquarters — always there */}
        <g className="f f-1">
          <Tree x={130} />
          <Tree x={555} />
          <rect className="ev-bld" x="180" y="200" width="240" height="360" />
          <rect className="ev-bld" x="170" y="186" width="260" height="14" />
          <text className="ev-sign" x="300" y="174" textAnchor="middle">
            HQ
          </text>
          <Windows
            x={196}
            y={216}
            cols={5}
            rows={7}
            w={30}
            h={24}
            gx={44}
            gy={38}
            lit={[1, 7, 12, 16, 23, 28, 31]}
          />
          {/* the boardroom floor: where decisions are made — at first, only here */}
          <rect className="ev-board" x="188" y="208" width="224" height="40" />
          <g className="ev-hqdec">
            <line className="ev-lead" x1="154" y1="228" x2="186" y2="228" />
            <text className="ev-callout" x="146" y="233" textAnchor="end">
              DECISIONS
            </text>
          </g>
          <rect className="ev-bld" x="420" y="380" width="96" height="180" />
          <Windows
            x={434}
            y={396}
            cols={2}
            rows={3}
            w={28}
            h={22}
            gx={42}
            gy={36}
            lit={[2]}
          />
          <rect className="ev-door" x="272" y="496" width="56" height="64" />
          <line className="ev-line" x1="300" y1="496" x2="300" y2="560" />
          <line
            className="ev-line ev-thick"
            x1="254"
            y1="492"
            x2="346"
            y2="492"
          />
          <Person x={238} />
          <Person x={362} s={0.95} />
          <Person x={384} s={1.05} />
          <Person x={470} s={0.9} />
        </g>

        {/* 01 · India, not yet: an empty plot */}
        <g className="vis vis--1">
          <rect className="ev-plot" x="1060" y="520" width="380" height="40" />
          <text className="ev-note" x="1250" y="506" textAnchor="middle">
            A SITE, NOT YET A CENTRE
          </text>
        </g>

        {/* 02 · the arrival: a modest centre, and the mandate that connects it */}
        <g className="vis vis--2">
          <g className="f f-2">
            <path className="ev-arc" d={ARC_A} />
            <text className="ev-arclab" x="720" y="74" textAnchor="middle">
              THE MANDATE
            </text>
            <Traveller path={ARC_A} kind="brief" dur={4} />
            <g className="rise">
              <rect
                className="ev-bld"
                x="1140"
                y="430"
                width="220"
                height="130"
              />
              <rect
                className="ev-bld"
                x="1132"
                y="418"
                width="236"
                height="12"
              />
              <Windows
                x={1156}
                y={446}
                cols={5}
                rows={2}
                w={28}
                h={22}
                gx={40}
                gy={36}
              />
              <rect
                className="ev-door"
                x="1230"
                y="510"
                width="40"
                height="50"
              />
              <text className="ev-sign" x="1250" y="404" textAnchor="middle">
                GCC · INDIA
              </text>
            </g>
            <Person x={1200} />
            <Person x={1300} s={0.95} />
          </g>
        </g>

        {/* 03+ · the operating centre: people, desks, work in and delivery out */}
        <g className="vis vis--3">
          <g className="f f-3">
            <path className="ev-arc ev-arc--work" d={ARC_B} />
            <text
              className="ev-arclab ev-arclab--3"
              x="720"
              y="66"
              textAnchor="middle"
            >
              WORK IN · DELIVERY OUT
            </text>
            <Traveller path={ARC_B} kind="brief" dur={4.2} />
            <Traveller
              path={ARC_B}
              kind="box"
              dur={4.6}
              reverse
              delay={1.2}
              className="ev-tr--work"
            />
            <g className="rise">
              <rect
                className="ev-bld"
                x="1080"
                y="250"
                width="290"
                height="310"
              />
              <rect
                className="ev-bld"
                x="1070"
                y="238"
                width="310"
                height="12"
              />
              <Windows
                x={1096}
                y={266}
                cols={6}
                rows={5}
                w={30}
                h={24}
                gx={44}
                gy={36}
                lit={[0, 3, 7, 8, 11, 14, 19, 22, 25, 28]}
              />
              {/* the glass front: teams at work */}
              <rect
                className="ev-glass"
                x="1094"
                y="452"
                width="262"
                height="108"
              />
              <Desk x={1118} y={548} />
              <Desk x={1186} y={548} />
              <Desk x={1254} y={548} />
              <Desk x={1318} y={548} />
            </g>
            <Person x={1058} s={0.95} />
          </g>
        </g>

        {/* 04+ · the ownership shift: a tower that owns things, a room where decisions are made, products going back */}
        <g className="vis vis--4">
          <g className="f f-4">
            <path className="ev-arc ev-arc--own" d={ARC_B} />
            <text
              className="ev-arclab ev-arclab--own"
              x="720"
              y="40"
              textAnchor="middle"
            >
              PRODUCTS AND DECISIONS FLOW BACK
            </text>
            <Traveller
              path={ARC_B}
              kind="product"
              dur={3.6}
              reverse
              delay={0.4}
            />
            <Traveller
              path={ARC_B}
              kind="product"
              dur={3.6}
              reverse
              delay={2.2}
            />
            {/* the new tower */}
            <g className="rise rise--tall">
              <rect
                className="ev-bld"
                x="1370"
                y="100"
                width="124"
                height="460"
              />
              <rect
                className="ev-bld"
                x="1362"
                y="88"
                width="140"
                height="12"
              />
              <rect
                className="ev-band ev-band--prod"
                x="1370"
                y="130"
                width="124"
                height="56"
              />
              <text
                className="ev-bandt ev-bandt--light"
                x="1432"
                y="163"
                textAnchor="middle"
              >
                PRODUCT
              </text>
              <rect
                className="ev-band ev-band--plat"
                x="1370"
                y="196"
                width="124"
                height="56"
              />
              <text
                className="ev-bandt ev-bandt--light"
                x="1432"
                y="229"
                textAnchor="middle"
              >
                PLATFORMS
              </text>
              <rect
                className="ev-band ev-band--eng"
                x="1370"
                y="262"
                width="124"
                height="56"
              />
              <text className="ev-bandt" x="1432" y="295" textAnchor="middle">
                ENGINEERING
              </text>
              <Windows
                x={1386}
                y={334}
                cols={3}
                rows={5}
                w={24}
                h={22}
                gx={34}
                gy={34}
                lit={[1, 4, 6, 10, 13]}
              />
            </g>
            {/* decisions are made here */}
            <g className="drop">
              <rect
                className="ev-glass ev-glass--room"
                x="1120"
                y="180"
                width="200"
                height="58"
              />
              <line className="ev-line" x1="1150" y1="226" x2="1290" y2="226" />
              <Person x={1162} y={226} s={0.8} tone="purple" />
              <Person x={1200} y={226} s={0.8} tone="purple" />
              <Person x={1240} y={226} s={0.8} tone="purple" />
              <Person x={1278} y={226} s={0.8} tone="purple" />
              <text className="ev-callout" x="1220" y="168" textAnchor="middle">
                DECISIONS MADE HERE
              </text>
            </g>
          </g>
        </g>

        {/* 05 · the next order: connected to the organisation's other markets, and building what's next */}
        <g className="vis vis--5">
          <g className="f f-5">
            <text
              className="ev-arclab ev-arclab--own"
              x="720"
              y="40"
              textAnchor="middle"
            >
              ONE ORGANISATION · DECIDED TOGETHER
            </text>
            <Person x={1030} s={0.95} />
            <Person x={1004} s={0.9} />
            <path
              className="ev-arc ev-arc--own ev-arc--draw"
              d={ARC_C}
              pathLength={1}
            />
            <path
              className="ev-arc ev-arc--own ev-arc--draw"
              d={ARC_D}
              pathLength={1}
            />
            <Traveller path={ARC_C} kind="product" dur={2.6} delay={0.8} />
            <Traveller path={ARC_D} kind="product" dur={3.2} delay={1.4} />
            <g className="rise">
              <rect
                className="ev-bld ev-far"
                x="890"
                y="462"
                width="76"
                height="98"
              />
              <Windows
                x={901}
                y={474}
                cols={2}
                rows={3}
                w={20}
                h={16}
                gx={32}
                gy={26}
              />
              <rect
                className="ev-bld ev-far"
                x="700"
                y="498"
                width="76"
                height="62"
              />
              <Windows
                x={711}
                y={510}
                cols={2}
                rows={2}
                w={20}
                h={16}
                gx={32}
                gy={24}
              />
            </g>
            <text
              className="ev-place ev-place--far"
              x="833"
              y={G + 34}
              textAnchor="middle"
            >
              OTHER MARKETS
            </text>
            {/* a crane beside the plot: building what's next */}
            <g className="ev-cr">
              <line className="ev-crane" x1="1584" y1={G} x2="1584" y2="300" />
              <line
                className="ev-crane"
                x1="1494"
                y1="306"
                x2="1598"
                y2="306"
              />
              <line className="ev-line" x1="1534" y1="306" x2="1534" y2="404" />
              <rect
                className="ev-line"
                x="1526"
                y="404"
                width="16"
                height="10"
              />
            </g>
            <rect
              className="ev-next"
              x="1508"
              y="424"
              width="52"
              height="136"
            />
            <text className="ev-nextt" x="1534" y="498" textAnchor="middle">
              NEXT
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- the section */
export function GccEvolution() {
  const root = useRef<HTMLElement | null>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)),
      );
      setI(Math.round(p * (STAGES.length - 1)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  // a stage on the timeline scrolls the page to that stage's snap point — native scroll, never hijacked
  const go = (k: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (k / (STAGES.length - 1)) * span,
      behavior: "instant",
    });
  };

  const s = STAGES[i];
  return (
    <section
      id="evolve"
      ref={root}
      className="evo"
      data-stage={s.scene}
      data-tone="light"
      data-act="evolve"
      aria-labelledby="evo-h"
    >
      <div className="evo__stage">
        <header className="evo__hd">
          <div className="evo__title">
            <p className="evo__k">
              <ChapterLabel id="evolve" />
            </p>
            <h2 id="evo-h" className="evo__h">
              From a presence in India <br />
              to a force <span className="evo__hl">in the business.</span>
            </h2>
          </div>
          <div key={i} className="evo__cap" aria-live="polite">
            <p className="evo__n">
              <span>{s.n}</span> {s.title}
            </p>
            <p className="evo__line">{s.line}</p>
            <dl className="evo__ledger">
              <div
                className={
                  i > 0 && STAGES[i - 1].role !== s.role ? "is-new" : undefined
                }
              >
                <dt>India’s role</dt>
                <dd>{s.role}</dd>
              </div>
              <div
                className={
                  i > 0 && STAGES[i - 1].decides !== s.decides
                    ? "is-new"
                    : undefined
                }
              >
                <dt>Who decides</dt>
                <dd>{s.decides}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="evo__art">
          {/* the city beyond: a faint skyline behind the drawing */}
          <svg className="evo__sky" viewBox="0 0 1600 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
            <path d="M0 240V160h40V240M54 240V200h72V240M126 240V180h60V240M194 240V200h60V240M258 240V180h26V240M298 240V180h52V240M354 240V50h26V240M380 240V180h60V240M444 240V200h72V240M530 240V140h26V240M556 240V160h60V240M624 240V160h52V240M676 240V110h60V240M740 240V140h26V240M774 240V180h26V240M800 240V140h60V240M874 240V50h72V240M954 240V20h52V240M1014 240V140h40V240M1058 240V140h72V240M1130 240V110h60V240M1204 240V20h40V240M1252 240V180h60V240M1312 240V50h60V240M1376 240V160h40V240M1430 240V200h52V240M1482 240V80h60V240M1550 240V80h72V240" />
          </svg>
          <Scene />
        </div>

        {/* the four stages, set on the ground line */}
        <ol className="evo__tl" aria-label="The four stages">
          {STAGES.map((x, k) => (
            <li key={x.n}>
              <button
                type="button"
                className={`evo__t${k === i ? " is-on" : k < i ? " is-done" : ""}${k >= 2 ? " is-own" : ""}`}
                aria-current={k === i ? "step" : undefined}
                onClick={() => go(k)}
              >
                <span className="evo__tdot" aria-hidden="true" />
                <b>{x.n}</b>
                <span className="evo__tlab">{x.title}</span>
                {k === 1 ? (
                  <span className="evo__here" aria-hidden="true">
                    Many GCCs are here
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ol>
      </div>
      {/* one snap point per stage: each swipe moves exactly one stage (scroll-snap-stop: always) */}
      {STAGES.map((x, k) => (
        <span
          key={x.n}
          className="evo__snap"
          style={{ top: `${k * 50}vh` }}
          aria-hidden="true"
        />
      ))}
      <ol className="sr-only">
        {STAGES.map((x) => (
          <li key={x.n}>
            {x.n}, {x.title}: {x.line} {x.note} India’s role: {x.role}. Who
            decides: {x.decides}.
            {x.n === "02" ? " Many GCCs are at this stage today." : ""}
          </li>
        ))}
      </ol>
    </section>
  );
}
