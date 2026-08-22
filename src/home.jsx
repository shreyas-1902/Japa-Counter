import { useState, useEffect, useRef } from "react";
import "./style.css";

const TOTAL = 108;
const RADIUS = 150;
const CENTER = 200;

const JAPA_OPTIONS = [
  {
    id: "om-namah-shivaya",
    name: "Om Namah Shivaya",
    meaning:
      "A salutation to Shiva, the inner Self. Chanted for inner transformation, letting go, and stillness.",
  },
  {
    id: "hare-krishna",
    name: "Hare Krishna Maha Mantra",
    meaning:
      "Calls on Krishna and Rama. Central to Bhakti (devotional) practice and widely chanted in kirtan.",
  },
  {
    id: "gayatri",
    name: "Gayatri Mantra",
    meaning:
      "One of the oldest Vedic mantras, invoking the sun as a symbol of divine light, wisdom, and clarity of mind.",
  },
  {
    id: "om-mani-padme-hum",
    name: "Om Mani Padme Hum",
    meaning:
      "A Tibetan Buddhist mantra invoking Avalokiteshvara, the embodiment of compassion.",
  },
  {
    id: "maha-mrityunjaya",
    name: "Maha Mrityunjaya Mantra",
    meaning:
      "A healing mantra to Shiva, traditionally chanted for protection, health, and ease around the fear of death.",
  },
  {
    id: "so-hum",
    name: "So Hum",
    meaning:
      "Means 'I am That'. A breath-based mantra used in meditation to dissolve the sense of separateness.",
  },
  {
    id: "om-namo-narayanaya",
    name: "Om Namo Narayanaya",
    meaning:
      "A Vaishnav mantra of surrender to Vishnu/Narayana, chanted for peace and protection.",
  },
  { id: "custom", name: "Custom", meaning: "Write your own japa or mantra." },
];

export default function JapaCounter() {
  const [count, setCount] = useState(0);
  const [malas, setMalas] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [armMalaReset, setArmMalaReset] = useState(false);
  const [presetId, setPresetId] = useState(JAPA_OPTIONS[0].id);
  const [customText, setCustomText] = useState("");
  const [tapKey, setTapKey] = useState(0);
  const armTimer = useRef(null);

  const activeJapa =
    presetId === "custom"
      ? customText.trim() || "Your own japa"
      : JAPA_OPTIONS.find((j) => j.id === presetId).name;

  useEffect(() => {
    if (count === TOTAL) {
      setCompleting(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([180, 70, 180, 70, 320]);
      }
      const t = setTimeout(() => {
        setMalas((m) => m + 1);
        setCount(0);
        setCompleting(false);
      }, 650);
      return () => clearTimeout(t);
    }
  }, [count]);

  useEffect(() => () => clearTimeout(armTimer.current), []);

  function handleTap() {
    if (completing) return;
    setCount((c) => Math.min(c + 1, TOTAL));
    setTapKey((k) => k + 1);
  }

  function resetCounter(e) {
    e.stopPropagation();
    setCompleting(false);
    setCount(0);
  }

  function resetMalas(e) {
    e.stopPropagation();
    if (!armMalaReset) {
      setArmMalaReset(true);
      armTimer.current = setTimeout(() => setArmMalaReset(false), 2800);
      return;
    }
    clearTimeout(armTimer.current);
    setArmMalaReset(false);
    setMalas(0);
  }

  const beads = Array.from({ length: TOTAL }, (_, i) => {
    const angle = (-90 + ((i + 1) * 360) / TOTAL) * (Math.PI / 180);
    const x = CENTER + RADIUS * Math.cos(angle);
    const y = CENTER + RADIUS * Math.sin(angle);
    return { x, y, lit: i < count };
  });

  const rotation = -((count * 360) / TOTAL);
  const lifetimeBeads = malas * TOTAL + count;

  return (
    <div className="japa-page">
      <div className="eyebrow">Japa Counter</div>
      <span className="session-hint">
        {malas > 0 || count > 0
          ? `${lifetimeBeads} beads counted this session`
          : "One breath, one bead"}
      </span>

      <div className="japa-select-row">
        <select
          className="japa-select"
          value={presetId}
          onChange={(e) => setPresetId(e.target.value)}
        >
          {JAPA_OPTIONS.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name}
            </option>
          ))}
        </select>
        {presetId === "custom" && (
          <input
            className="japa-input"
            type="text"
            placeholder="Type your own japa or mantra"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            maxLength={60}
          />
        )}
      </div>

      <div className="japa-display">
        <span key={tapKey} className="japa-display-text">
          {activeJapa}
        </span>
      </div>

      <div
        className={`mala-wrap${completing ? " completing" : ""}`}
        onClick={handleTap}
        role="button"
        aria-label="Count a bead"
      >
        <svg viewBox="0 0 400 400" width="320" height="320">
          <polygon points="200,38 191,20 209,20" className="pointer-marker" />
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${CENTER}px ${CENTER}px`,
              transition: "transform 280ms ease-out",
            }}
          >
            <circle cx={CENTER} cy={CENTER} r={RADIUS} className="thread" />
            {beads.map((b, i) => (
              <circle
                key={i}
                cx={b.x}
                cy={b.y}
                r={9}
                className={`bead ${b.lit ? "bead-lit" : "bead-unlit"}`}
              />
            ))}
            <circle
              cx={CENTER}
              cy={CENTER - RADIUS}
              r={15}
              className="guru-bead"
            />
          </g>
        </svg>

        <div className="count-overlay">
          <span className="count-number">{count}</span>
          <span className="count-total">of {TOTAL}</span>
        </div>
      </div>

      <span className="tap-hint">Tap the mala to count</span>

      <div className="mala-stat">
        <span className="mala-number">{malas}</span>
        <span className="mala-label">Malas completed</span>
      </div>

      <div className="button-row">
        <button className="btn" onClick={resetCounter}>
          Reset counter
        </button>
        <button
          className={`btn${armMalaReset ? " btn-danger-armed" : ""}`}
          onClick={resetMalas}
        >
          {armMalaReset ? "Tap again to confirm" : "Reset malas"}
        </button>
      </div>

      <section className="info-section">
        <div className="info-block">
          <h3>What is Japa?</h3>
          <p>
            Japa is the meditative repetition of a mantra, a sacred name, or a
            short phrase. It's practiced across Hindu, Buddhist, Sikh, and Jain
            traditions as a way to steady the mind, anchor attention on the
            breath or sound, and turn scattered thought into a single, quiet
            focus.
          </p>
          <p>
            A mala (prayer bead string) is the traditional counting tool: each
            bead marks one repetition, so the hands can keep count while the
            mind stays with the mantra rather than the number.
          </p>
        </div>

        <div className="info-block">
          <h3>Why 108 beads?</h3>
          <p>
            A standard mala has 108 counting beads plus one larger "guru
            bead" that isn't counted, it simply marks where a round begins
            and ends. If you continue past one full round, tradition says to
            reverse direction at the guru bead rather than cross over it.
          </p>
          <p>
            Several explanations are traditionally given for the number 108:
            it's linked to the 27 lunar constellations (nakshatras) each
            divided into 4 quarters (27 × 4 = 108), it's considered a number
            of completion in Vedic mathematics, and it appears throughout
            Hindu and Buddhist scripture and iconography. Different lineages
            emphasize different reasons, none is treated as the single
            "correct" one.
          </p>
        </div>

        <div className="info-block">
          <h3>Popular japas &amp; mantras</h3>
          <div className="japa-list">
            {JAPA_OPTIONS.filter((j) => j.id !== "custom").map((j) => (
              <div className="japa-list-item" key={j.id}>
                <span className="name">{j.name}</span>
                <span className="meaning">{j.meaning}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
            <p>Developed By <a href="tel:+918805604252">Shreyas Phase</a></p>
        </div>
      </section>
    </div>
  );
}