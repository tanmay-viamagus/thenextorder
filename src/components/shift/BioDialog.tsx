"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";

const noop = () => () => {};

/**
 * A speaker's "Profile": the bio opens in a modal panel (portrait, name, designation, organisation, LinkedIn and
 * the bio at a comfortable measure), so the cards in the grid stay level.
 *
 * The server renders a plain <details> with the bio inside, so the text is in the HTML and works without
 * JavaScript. Once the page hydrates it becomes a button that opens a native <dialog>: the browser traps focus
 * and closes it on Esc; focus goes back to the button, and a click on the backdrop closes it too.
 */
export function BioDialog({ name, id, children }: { name: string; id: string; children: ReactNode }) {
  // false while the server renders and during hydration, true once the page runs in a browser
  const enhanced = useSyncExternalStore(noop, () => true, () => false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  if (!enhanced) {
    return (
      <details className="spk__bio">
        <summary>
          Profile<span className="sr-only">: {name}</span>
        </summary>
        {children}
      </details>
    );
  }

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  return (
    <div className="spk__bio">
      <button
        ref={trigger}
        type="button"
        className="spk__bio-open"
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={open}
      >
        Profile<span className="sr-only">: {name}</span>
      </button>
      <dialog
        ref={dialog}
        id={id}
        className="bio"
        aria-labelledby={`${id}-name`}
        onClose={() => trigger.current?.focus()}
        // a click on the backdrop lands on the <dialog> itself; a click inside lands on its content
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="bio__panel">
          <button type="button" className="bio__close" onClick={close} autoFocus>
            <span aria-hidden="true" />
            <span className="sr-only">Close {name}&rsquo;s profile</span>
          </button>
          {children}
        </div>
      </dialog>
    </div>
  );
}
