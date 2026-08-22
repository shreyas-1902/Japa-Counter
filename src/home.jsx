import { useState, useEffect, useRef } from "react";
import "./style.css";

const TOTAL = 108;
const RADIUS = 150;
const CENTER = 200;

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
];

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function localizeNumber(n, lang) {
  if (lang === "en") return String(n);
  return String(n)
    .split("")
    .map((ch) => (ch >= "0" && ch <= "9" ? DEVANAGARI_DIGITS[+ch] : ch))
    .join("");
}

// UI strings
const T = {
  en: {
    eyebrow: "Japa Counter",
    sessionHintEmpty: "One breath, one bead",
    sessionHintActive: (n) => `${n} beads counted so far`,
    chooseJapaLabel: "Choose your japa",
    customPlaceholder: "Type your own japa or mantra",
    tapHint: "Tap the mala to count",
    ofTotal: (total) => `of ${total}`,
    malaLabel: "Malas completed",
    resetCounter: "Reset counter",
    resetMalas: "Reset malas",
    confirmResetMalas: "Tap again to confirm",
    customLabel: "Custom",
    customDefaultText: "Your own japa",
    infoTitle1: "What is Japa?",
    infoPara1a:
      "Japa is the meditative repetition of a mantra, a sacred name, or a short phrase. It's practiced across Hindu, Buddhist, Sikh, and Jain traditions as a way to steady the mind, anchor attention on the breath or sound, and turn scattered thought into a single, quiet focus.",
    infoPara1b:
      "A mala (prayer bead string) is the traditional counting tool: each bead marks one repetition, so the hands can keep count while the mind stays with the mantra rather than the number.",
    infoTitle2: "Why 108 beads?",
    infoPara2a:
      "A standard mala has 108 counting beads plus one larger \"guru bead\" that isn't counted, it simply marks where a round begins and ends. If you continue past one full round, tradition says to reverse direction at the guru bead rather than cross over it.",
    infoPara2b:
      "Several explanations are traditionally given for the number 108: it's linked to the 27 lunar constellations (nakshatras) each divided into 4 quarters (27 × 4 = 108), it's considered a number of completion in Vedic mathematics, and it appears throughout Hindu and Buddhist scripture and iconography. Different lineages emphasize different reasons, none is treated as the single \"correct\" one.",
    infoTitle3: "Popular japas & mantras",
  },
  hi: {
    eyebrow: "जप काउंटर",
    sessionHintEmpty: "एक श्वास, एक मनका",
    sessionHintActive: (n) => `अब तक ${n} मनके गिने गए`,
    chooseJapaLabel: "अपना जप चुनें",
    customPlaceholder: "अपना जप या मंत्र लिखें",
    tapHint: "गिनने के लिए माला पर टैप करें",
    ofTotal: (total) => `कुल ${total} में से`,
    malaLabel: "पूर्ण मालाएं",
    resetCounter: "काउंटर रीसेट करें",
    resetMalas: "मालाएं रीसेट करें",
    confirmResetMalas: "पुष्टि के लिए फिर से टैप करें",
    customLabel: "अपना खुद का",
    customDefaultText: "अपना जप लिखें",
    infoTitle1: "जप क्या है?",
    infoPara1a:
      "जप एक मंत्र, पवित्र नाम या छोटे वाक्य की ध्यानपूर्ण पुनरावृत्ति है। यह हिंदू, बौद्ध, सिख और जैन परंपराओं में मन को स्थिर करने, श्वास या ध्वनि पर ध्यान केंद्रित करने, और बिखरे विचारों को एक शांत एकाग्रता में बदलने के तरीके के रूप में प्रचलित है।",
    infoPara1b:
      "माला (जप की माला) पारंपरिक गिनती का साधन है: हर मनका एक पुनरावृत्ति दर्शाता है, ताकि हाथ गिनती रखें और मन संख्या के बजाय मंत्र पर बना रहे।",
    infoTitle2: "108 मनके क्यों?",
    infoPara2a:
      "एक सामान्य माला में 108 गिनने वाले मनके और एक बड़ा 'गुरु मनका' होता है जिसे गिना नहीं जाता — यह केवल यह दर्शाता है कि एक चक्र कहाँ शुरू और समाप्त होता है। यदि आप एक पूर्ण चक्र के बाद जारी रखते हैं, तो परंपरा के अनुसार गुरु मनके को पार करने के बजाय वहीं से दिशा बदल देनी चाहिए।",
    infoPara2b:
      "108 की संख्या के लिए परंपरागत रूप से कई व्याख्याएं दी जाती हैं: इसे 27 नक्षत्रों से जोड़ा जाता है, जिनमें से प्रत्येक के 4 चरण होते हैं (27 × 4 = 108), वैदिक गणित में इसे पूर्णता की संख्या माना जाता है, और यह हिंदू व बौद्ध ग्रंथों तथा प्रतीकों में बार-बार आता है। अलग-अलग परंपराएं अलग-अलग कारणों पर बल देती हैं, इनमें से किसी एक को 'सही' उत्तर नहीं माना जाता।",
    infoTitle3: "लोकप्रिय जप और मंत्र",
  },
  mr: {
    eyebrow: "जप काउंटर",
    sessionHintEmpty: "एक श्वास, एक मणी",
    sessionHintActive: (n) => `आतापर्यंत ${n} मणी मोजले गेले`,
    chooseJapaLabel: "तुमचा जप निवडा",
    customPlaceholder: "तुमचा स्वतःचा जप किंवा मंत्र लिहा",
    tapHint: "मोजण्यासाठी माळेवर टॅप करा",
    ofTotal: (total) => `एकूण ${total} पैकी`,
    malaLabel: "पूर्ण झालेल्या माळा",
    resetCounter: "काउंटर रीसेट करा",
    resetMalas: "माळा रीसेट करा",
    confirmResetMalas: "पुष्टीसाठी पुन्हा टॅप करा",
    customLabel: "स्वतःचा",
    customDefaultText: "तुमचा स्वतःचा जप",
    infoTitle1: "जप म्हणजे काय?",
    infoPara1a:
      "जप म्हणजे मंत्र, पवित्र नाव किंवा लहान वाक्याची ध्यानपूर्वक पुनरावृत्ती. हिंदू, बौद्ध, शीख आणि जैन परंपरांमध्ये मन स्थिर करण्यासाठी, श्वासावर किंवा ध्वनीवर लक्ष केंद्रित करण्यासाठी आणि विखुरलेल्या विचारांना एका शांत एकाग्रतेत बदलण्यासाठी याचा सराव केला जातो.",
    infoPara1b:
      "माळ (जपमाळ) हे पारंपरिक मोजणीचे साधन आहे: प्रत्येक मणी एका पुनरावृत्तीला दर्शवतो, त्यामुळे हात मोजणी करतात आणि मन संख्येऐवजी मंत्रावर केंद्रित राहते.",
    infoTitle2: "१०८ मणी का?",
    infoPara2a:
      "सर्वसाधारण माळेत १०८ मोजण्याचे मणी आणि एक मोठा 'गुरु मणी' असतो जो मोजला जात नाही — तो फक्त एक फेरी कुठे सुरू होते आणि संपते हे दर्शवतो. जर तुम्ही एका पूर्ण फेरीनंतर पुढे चालू ठेवलात, तर परंपरेनुसार गुरु मण्यावरून पुढे न जाता तिथूनच दिशा उलटवावी.",
    infoPara2b:
      "१०८ या संख्येसाठी पारंपरिकपणे अनेक स्पष्टीकरणे दिली जातात: ती २७ नक्षत्रांशी जोडली जाते, प्रत्येकाचे ४ चरण असतात (२७ × ४ = १०८), वैदिक गणितात ती पूर्णतेची संख्या मानली जाते, आणि ती हिंदू व बौद्ध ग्रंथांत तसेच प्रतीकांमध्ये वारंवार आढळते. वेगवेगळ्या परंपरा वेगवेगळी कारणे अधोरेखित करतात, यातील कोणतेही एक 'योग्य' उत्तर मानले जात नाही.",
    infoTitle3: "लोकप्रिय जप आणि मंत्र",
  },
};

// Mantra data: roman name, Devanagari name, and meaning per language
const JAPA_OPTIONS = [
  {
    id: "om-namah-shivaya",
    roman: "Om Namah Shivaya",
    devanagari: "ॐ नमः शिवाय",
    meaning: {
      en: "A salutation to Shiva, the inner Self. Chanted for inner transformation, letting go, and stillness.",
      hi: "शिव, आंतरिक आत्मा को नमस्कार। आंतरिक परिवर्तन, त्याग और शांति के लिए जपा जाता है।",
      mr: "शिव, आंतरिक आत्म्याला नमस्कार. आंतरिक परिवर्तन, सोडून देणे आणि शांततेसाठी जपला जातो.",
    },
  },
  {
    id: "hare-krishna",
    roman: "Hare Krishna Maha Mantra",
    devanagari: "हरे कृष्ण महामंत्र",
    meaning: {
      en: "Calls on Krishna and Rama. Central to Bhakti (devotional) practice and widely chanted in kirtan.",
      hi: "कृष्ण और राम का आह्वान करता है। भक्ति साधना का केंद्रीय मंत्र, कीर्तन में व्यापक रूप से गाया जाता है।",
      mr: "कृष्ण आणि रामाचा धावा करतो. भक्ती साधनेतील मध्यवर्ती मंत्र, कीर्तनात मोठ्या प्रमाणावर गायला जातो.",
    },
  },
  {
    id: "gayatri",
    roman: "Gayatri Mantra",
    devanagari: "गायत्री मंत्र",
    meaning: {
      en: "One of the oldest Vedic mantras, invoking the sun as a symbol of divine light, wisdom, and clarity of mind.",
      hi: "सबसे प्राचीन वैदिक मंत्रों में से एक, जो सूर्य का आह्वान दिव्य प्रकाश, ज्ञान और मानसिक स्पष्टता के प्रतीक रूप में करता है।",
      mr: "सर्वात प्राचीन वैदिक मंत्रांपैकी एक, जो सूर्याचा धावा दिव्य प्रकाश, ज्ञान आणि मनाच्या स्पष्टतेचे प्रतीक म्हणून करतो.",
    },
  },
  {
    id: "om-mani-padme-hum",
    roman: "Om Mani Padme Hum",
    devanagari: "ॐ मणि पद्मे हूं",
    meaning: {
      en: "A Tibetan Buddhist mantra invoking Avalokiteshvara, the embodiment of compassion.",
      hi: "एक तिब्बती बौद्ध मंत्र, जो करुणा के अवतार अवलोकितेश्वर का आह्वान करता है।",
      mr: "एक तिबेटी बौद्ध मंत्र, जो करुणेचे मूर्तिमंत रूप अवलोकितेश्वराचा धावा करतो.",
    },
  },
  {
    id: "maha-mrityunjaya",
    roman: "Maha Mrityunjaya Mantra",
    devanagari: "महामृत्युंजय मंत्र",
    meaning: {
      en: "A healing mantra to Shiva, traditionally chanted for protection, health, and ease around the fear of death.",
      hi: "शिव को समर्पित एक उपचारकारी मंत्र, जो परंपरागत रूप से सुरक्षा, स्वास्थ्य और मृत्यु के भय को शांत करने के लिए जपा जाता है।",
      mr: "शिवाला समर्पित एक उपचारक मंत्र, जो परंपरेने संरक्षण, आरोग्य आणि मृत्यूच्या भीतीपासून सुटका मिळण्यासाठी जपला जातो.",
    },
  },
  {
    id: "so-hum",
    roman: "So Hum",
    devanagari: "सो हम",
    meaning: {
      en: "Means 'I am That'. A breath-based mantra used in meditation to dissolve the sense of separateness.",
      hi: "अर्थ है 'मैं वही हूं'। श्वास पर आधारित यह मंत्र ध्यान में अलगाव की भावना को मिटाने के लिए प्रयोग किया जाता है।",
      mr: "अर्थ 'मी तेच आहे'. श्वासावर आधारित हा मंत्र ध्यानात वेगळेपणाची भावना विरघळवण्यासाठी वापरला जातो.",
    },
  },
  {
    id: "om-namo-narayanaya",
    roman: "Om Namo Narayanaya",
    devanagari: "ॐ नमो नारायणाय",
    meaning: {
      en: "A Vaishnav mantra of surrender to Vishnu/Narayana, chanted for peace and protection.",
      hi: "विष्णु/नारायण के प्रति समर्पण का वैष्णव मंत्र, शांति और सुरक्षा के लिए जपा जाता है।",
      mr: "विष्णू/नारायणाला समर्पणाचा वैष्णव मंत्र, शांती आणि संरक्षणासाठी जपला जातो.",
    },
  },
];

function getStoredLang() {
  try {
    const saved = localStorage.getItem("japa-lang");
    if (saved && T[saved]) return saved;
  } catch (e) {
    /* localStorage unavailable, ignore */
  }
  return "en";
}

function getStoredTheme() {
  try {
    const saved = localStorage.getItem("japa-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {
    /* localStorage unavailable, ignore */
  }
  return "dark";
}

// --- cookie helpers for persisting mala progress across visits ---
const PROGRESS_COOKIE = "japa_progress";
const COOKIE_MAX_AGE_DAYS = 365;

function setCookie(name, value, days) {
  try {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; max-age=${maxAge}; path=/; SameSite=Lax`;
  } catch (e) {
    /* cookies unavailable, ignore */
  }
}

function getCookie(name) {
  try {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
}

function getStoredProgress() {
  const raw = getCookie(PROGRESS_COOKIE);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        malas: Number.isFinite(parsed.malas) ? parsed.malas : 0,
        count: Number.isFinite(parsed.count) ? parsed.count : 0,
      };
    } catch (e) {
      /* malformed cookie, ignore */
    }
  }
  return { malas: 0, count: 0 };
}

export default function JapaCounter() {
  const [lang, setLang] = useState(getStoredLang);
  const [theme, setTheme] = useState(getStoredTheme);
  const [progress] = useState(getStoredProgress); // read the saved cookie once, on mount
  const [count, setCount] = useState(progress.count);
  const [malas, setMalas] = useState(progress.malas);
  const [completing, setCompleting] = useState(false);
  const [armMalaReset, setArmMalaReset] = useState(false);
  const [presetId, setPresetId] = useState(JAPA_OPTIONS[0].id);
  const [customText, setCustomText] = useState("");
  const [tapKey, setTapKey] = useState(0);
  const armTimer = useRef(null);

  const t = T[lang];

  useEffect(() => {
    try {
      localStorage.setItem("japa-lang", lang);
    } catch (e) {
      /* localStorage unavailable, ignore */
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem("japa-theme", theme);
    } catch (e) {
      /* localStorage unavailable, ignore */
    }
  }, [theme]);

  // persist malas + in-progress count to a cookie so a returning visitor
  // sees their completed malas and continues counting from where they left off
  useEffect(() => {
    setCookie(
      PROGRESS_COOKIE,
      JSON.stringify({ malas, count }),
      COOKIE_MAX_AGE_DAYS
    );
  }, [malas, count]);

  const activePreset =
    presetId === "custom" ? null : JAPA_OPTIONS.find((j) => j.id === presetId);

  const activeJapaDisplay = activePreset
    ? lang === "en"
      ? activePreset.roman
      : activePreset.devanagari
    : customText.trim() || t.customDefaultText;

  useEffect(() => {
    if (count === TOTAL) {
      setCompleting(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([180, 70, 180, 70, 320]);
      }
      const timer = setTimeout(() => {
        setMalas((m) => m + 1);
        setCount(0);
        setCompleting(false);
      }, 650);
      return () => clearTimeout(timer);
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
    <div className={`japa-page lang-${lang} theme-${theme}`}>
      <div className="top-controls">
        <button
          className="theme-toggle"
          onClick={() => setTheme((cur) => (cur === "dark" ? "light" : "dark"))}
          aria-label="Toggle light and dark theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <div className="lang-switch">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`lang-btn${lang === l.code ? " active" : ""}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="eyebrow">{t.eyebrow}</div>
      <span className="session-hint">
        {malas > 0 || count > 0
          ? t.sessionHintActive(localizeNumber(lifetimeBeads, lang))
          : t.sessionHintEmpty}
      </span>

      <div className="japa-select-row">
        <span className="field-label">{t.chooseJapaLabel}</span>
        <select
          className="japa-select"
          value={presetId}
          onChange={(e) => setPresetId(e.target.value)}
        >
          {JAPA_OPTIONS.map((j) => (
            <option key={j.id} value={j.id}>
              {lang === "en" ? j.roman : j.devanagari}
            </option>
          ))}
          <option value="custom">{t.customLabel}</option>
        </select>
        {presetId === "custom" && (
          <input
            className="japa-input"
            type="text"
            placeholder={t.customPlaceholder}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            maxLength={60}
          />
        )}
      </div>

      <div className="japa-display">
        <span key={tapKey} className="japa-display-text">
          {activeJapaDisplay}
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
          <span className="count-number">{localizeNumber(count, lang)}</span>
          <span className="count-total">
            {t.ofTotal(localizeNumber(TOTAL, lang))}
          </span>
        </div>
      </div>

      <span className="tap-hint">{t.tapHint}</span>

      <div className="mala-stat">
        <span className="mala-number">{localizeNumber(malas, lang)}</span>
        <span className="mala-label">{t.malaLabel}</span>
      </div>

      <div className="button-row">
        <button className="btn" onClick={resetCounter}>
          {t.resetCounter}
        </button>
        <button
          className={`btn${armMalaReset ? " btn-danger-armed" : ""}`}
          onClick={resetMalas}
        >
          {armMalaReset ? t.confirmResetMalas : t.resetMalas}
        </button>
      </div>

      <section className="info-section">
        <div className="info-block">
          <h3>{t.infoTitle1}</h3>
          <p>{t.infoPara1a}</p>
          <p>{t.infoPara1b}</p>
        </div>

        <div className="info-block">
          <h3>{t.infoTitle2}</h3>
          <p>{t.infoPara2a}</p>
          <p>{t.infoPara2b}</p>
        </div>

        <div className="info-block">
          <h3>{t.infoTitle3}</h3>
          <div className="japa-list">
            {JAPA_OPTIONS.map((j) => (
              <div className="japa-list-item" key={j.id}>
                <span className="name">
                  {lang === "en" ? j.roman : j.devanagari}
                </span>
                <span className="meaning">{j.meaning[lang]}</span>
              </div>
            ))}
          </div>
        </div>
        <div>Developed By Shreyas Phase <a href="tel:+918805604252">8805604252</a></div>
      </section>
    </div>
  );
}