import React from "react";

interface JournalProps {
  logMessages: string[];
  logRef: React.RefObject<HTMLDivElement>;
}

const Journal: React.FC<JournalProps> = ({ logMessages, logRef }) => (
  <section className="game-area" aria-labelledby="titre-journal">
    <h2 id="titre-journal">Journal :</h2>
    <div
      className="log"
      id="log"
      ref={logRef}
      role="log"
      aria-live="polite"
    >
      {logMessages.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  </section>
);

export default Journal;
