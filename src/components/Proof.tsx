import { forces } from "@/content/story";

/** One big, verified statement per force — used on the site and in the film. */
export function Proof({ f }: { f: (typeof forces)[number] }) {
  const p = f.proof;
  if (p.kind === "swap")
    return (
      <figure className="proof proof--swap">
        <p className="proof__from">
          <s>{p.from}</s>
        </p>
        <p className="proof__to">{p.to}</p>
        <figcaption>{p.caption}</figcaption>
      </figure>
    );
  if (p.kind === "ledger")
    return (
      <figure className="proof proof--ledger">
        <dl>
          {p.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <figcaption>“{p.caption}”</figcaption>
      </figure>
    );
  return (
    <figure className="proof proof--figure">
      <p className="proof__big">{p.value}</p>
      <figcaption>{p.caption}</figcaption>
    </figure>
  );
}
