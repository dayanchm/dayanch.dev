"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./one-object.module.css";

const OBJECTS = [
  {
    id: "TM",
    flag: "🇹🇲",
    country: "Turkmenistan",
    region: "Central Asia",
    name: "Turkmen Carpet",
    image: "/one-object/turkmen-carpet.png",
    text: "Every knot holds a memory; every göl motif is the signature of a tribe. More than a textile, it is a language of identity and craftsmanship passed through generations.",
    facts: [
      ["ORIGIN", "Nomadic tribes"],
      ["MATERIAL", "Hand-spun wool"],
      ["ICONIC COLOR", "Madder red"],
    ],
  },
  {
    id: "JP",
    flag: "🇯🇵",
    country: "Japan",
    region: "East Asia",
    name: "Sensu Fan",
    image: "/one-object/japanese-fan.png",
    text: "A folding fan turns air into ritual. Its precise bamboo ribs and painted washi paper carry centuries of performance, ceremony and quiet everyday elegance.",
    facts: [
      ["ORIGIN", "Heian period"],
      ["MATERIAL", "Washi & bamboo"],
      ["SYMBOL", "Grace in motion"],
    ],
  },
  {
    id: "MA",
    flag: "🇲🇦",
    country: "Morocco",
    region: "North Africa",
    name: "Silver Teapot",
    image: "/one-object/moroccan-teapot.png",
    text: "The Moroccan teapot is the centerpiece of hospitality. Raised high above small glasses, it turns mint tea into a generous ritual shared between host and guest.",
    facts: [
      ["TRADITION", "Atay ceremony"],
      ["MATERIAL", "Engraved silver"],
      ["SYMBOL", "Hospitality"],
    ],
  },
  {
    id: "MX",
    flag: "🇲🇽",
    country: "Mexico",
    region: "North America",
    name: "Calavera Skull",
    image: "/one-object/mexican-calavera.png",
    text: "Brightly decorated calaveras transform remembrance into color. During Día de Muertos, they honor life, ancestry and the joyful continuity between generations.",
    facts: [
      ["TRADITION", "Día de Muertos"],
      ["MATERIAL", "Sugar craft"],
      ["SYMBOL", "Remembrance"],
    ],
  },
  {
    id: "TR",
    flag: "🇹🇷",
    country: "Turkey",
    region: "West Asia",
    name: "Nazar Amulet",
    image: "/one-object/turkish-nazar.png",
    text: "The deep-blue nazar is carried as a protective symbol, reflecting unwanted attention back through its watchful concentric eye.",
    facts: [
      ["ORIGIN", "Anatolia"],
      ["MATERIAL", "Handmade glass"],
      ["SYMBOL", "Protection"],
    ],
  },
  {
    id: "IT",
    flag: "🇮🇹",
    country: "Italy",
    region: "Southern Europe",
    name: "Moka Pot",
    image: "/one-object/italian-moka.png",
    text: "The small octagonal moka pot turned espresso-style coffee into a daily domestic ritual in homes across Italy and far beyond.",
    facts: [
      ["ORIGIN", "1933"],
      ["MATERIAL", "Aluminum"],
      ["RITUAL", "Morning coffee"],
    ],
  },
  {
    id: "IN",
    flag: "🇮🇳",
    country: "India",
    region: "South Asia",
    name: "Diya Lamp",
    image: "/one-object/indian-diya.png",
    text: "Lit in homes and temples, the diya represents knowledge overcoming darkness and is an enduring symbol of welcome, hope and renewal.",
    facts: [
      ["TRADITION", "Diwali"],
      ["MATERIAL", "Brass"],
      ["SYMBOL", "Light"],
    ],
  },
  {
    id: "NL",
    flag: "🇳🇱",
    country: "Netherlands",
    region: "Western Europe",
    name: "Delft Clog",
    image: "/one-object/dutch-clog.png",
    text: "The practical wooden clog becomes a miniature canvas through Delft-blue decoration, joining rural history with celebrated Dutch craft.",
    facts: [
      ["ORIGIN", "Rural workshops"],
      ["MATERIAL", "Carved wood"],
      ["STYLE", "Delft blue"],
    ],
  },
  {
    id: "FR",
    flag: "🇫🇷",
    country: "France",
    region: "Western Europe",
    name: "Perfume Atomizer",
    image: "/one-object/french-perfume.png",
    text: "French perfume transformed scent into an art of memory, identity and meticulous composition.",
    facts: [
      ["ORIGIN", "Grasse"],
      ["MATERIAL", "Crystal & brass"],
      ["SYMBOL", "Elegance"],
    ],
  },
  {
    id: "EG",
    flag: "🇪🇬",
    country: "Egypt",
    region: "North Africa",
    name: "Scarab Amulet",
    image: "/one-object/egyptian-scarab.png",
    text: "The scarab represented renewal and the daily return of the sun in ancient Egyptian life.",
    facts: [
      ["ORIGIN", "Ancient Egypt"],
      ["MATERIAL", "Lapis & gold"],
      ["SYMBOL", "Rebirth"],
    ],
  },
  {
    id: "BR",
    flag: "🇧🇷",
    country: "Brazil",
    region: "South America",
    name: "Berimbau Bow",
    image: "/one-object/brazilian-berimbau.png",
    text: "The berimbau guides the rhythm and energy of capoeira through one resonant string.",
    facts: [
      ["TRADITION", "Capoeira"],
      ["MATERIAL", "Wood & gourd"],
      ["SYMBOL", "Rhythm"],
    ],
  },
  {
    id: "KR",
    flag: "🇰🇷",
    country: "South Korea",
    region: "East Asia",
    name: "Moon Jar",
    image: "/one-object/korean-moon-jar.png",
    text: "The softly imperfect moon jar expresses the quiet balance and restraint of Korean ceramic art.",
    facts: [
      ["ORIGIN", "Joseon era"],
      ["MATERIAL", "Celadon ceramic"],
      ["SYMBOL", "Harmony"],
    ],
  },
];

const MAP_POINTS = {
  TM: [62.1, 25.7],
  JP: [87.2, 31.5],
  MA: [46.3, 33.7],
  MX: [20.2, 40.8],
  TR: [55.1, 28.6],
  IT: [49.5, 25.5],
  IN: [69.1, 38.2],
  NL: [48.5, 20.5],
  FR: [47.6, 25.2],
  EG: [53.8, 35.2],
  BR: [30.9, 58.3],
  KR: [84.3, 31.2],
};

export default function OneObjectExperience() {
  const [activeId, setActiveId] = useState("TM");
  const [selected, setSelected] = useState(false);
  const [discovered, setDiscovered] = useState([]);
  const active = OBJECTS.find((item) => item.id === activeId) || OBJECTS[0];

  useEffect(
    () =>
      setDiscovered(
        JSON.parse(localStorage.getItem("one-object:seen") || "[]"),
      ),
    [],
  );

  function explore(id = activeId) {
    setActiveId(id);
    window.setTimeout(() => setSelected(true), 280);
    setDiscovered((current) => {
      const next = current.includes(id) ? current : [...current, id];
      localStorage.setItem("one-object:seen", JSON.stringify(next));
      return next;
    });
  }

  const objectNumber = String(
    OBJECTS.findIndex((item) => item.id === active.id) + 1,
  ).padStart(3, "0");
  const [firstWord, ...rest] = active.name.split(" ");

  return (
    <div className={styles.experience}>
      <nav className={styles.topbar}>
        <a className={styles.brand} href="#">
          <span className={styles.brandMark}>✦</span>
          <span>ONE OBJECT</span>
          <small>FROM EVERY COUNTRY</small>
        </a>
        <div className={styles.progressWrap}>
          <span className={styles.progressLabel}>DISCOVERY PROGRESS</span>
          <strong>
            {discovered.length}
            <i>/195</i>
          </strong>
          <div className={styles.progress}>
            <span style={{ width: `${(discovered.length / 195) * 100}%` }} />
          </div>
        </div>
      </nav>
      <main className={styles.collection}>
        <section className={styles.collectionHero}>
          <div>
            <p className={styles.eyebrow}>
              <span /> THE WORLD COLLECTION · 012
            </p>
            <h1>
              Know the world
              <br />
              by its <em>objects.</em>
            </h1>
            <p className={styles.intro}>
              A fast-growing collection of iconic objects. Choose a country and
              reveal the story its object carries.
            </p>
          </div>
        </section>
        <section
          className={styles.collectionMap}
          aria-label="World map with available countries"
        >
          <div className={styles.mapHeader}>
            <span>AVAILABLE COUNTRIES</span>
            <small>SELECT A MARKER TO DISCOVER ITS OBJECT</small>
          </div>
          <div className={styles.mapSurface}>
            <Image
              src="/one-object/world-map.svg"
              alt="World map with country borders"
              width={2754}
              height={1398}
              priority
            />
            {OBJECTS.map((item) => {
              const [left, top] = MAP_POINTS[item.id];
              return (
                <button
                  key={item.id}
                  className={`${styles.mapPoint} ${discovered.includes(item.id) ? styles.mapPointSeen : ""}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onClick={() => explore(item.id)}
                  aria-label={`Explore ${item.country}`}
                >
                  <i />
                  <span>
                    {item.flag}
                    <b>{item.country}</b>
                  </span>
                </button>
              );
            })}
          </div>
          <div className={styles.mapFooter}>
            <span>
              <i className={styles.legendAvailable} /> AVAILABLE
            </span>
            <span>
              <i className={styles.legendSeen} /> DISCOVERED
            </span>
            <b>12 / 195 COUNTRIES ONLINE</b>
          </div>
        </section>
      </main>
      <div
        className={`${styles.reveal} ${selected ? styles.revealOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!selected}
      >
        <button
          className={styles.close}
          onClick={() => setSelected(false)}
          aria-label="Close"
        >
          ×
        </button>
        <div className={styles.objectVisual}>
          <div className={styles.halo} />
          <Image
            key={active.id}
            src={active.image}
            alt={active.name}
            width={1536}
            height={1536}
            priority
          />
          <span className={styles.objectNo}>
            OBJECT
            <br />
            <b>{objectNumber}</b>
          </span>
        </div>
        <div className={styles.objectCopy}>
          <p className={styles.eyebrow}>
            <span /> {active.country.toUpperCase()} ·{" "}
            {active.region.toUpperCase()}
          </p>
          <h2>
            {firstWord}
            <br />
            <em>{rest.join(" ")}</em>
          </h2>
          <p>{active.text}</p>
          <dl>
            {active.facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.stamp}>
            ✓ ADDED TO COLLECTION <strong>{discovered.length} / 195</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
