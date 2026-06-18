/*
INPUT:
- user clicks tab buttons

PROCESS:
- stores the current tab in state
- shows one section at a time

OUTPUT:
- overview, ReactJS module, AngularJS module, or comparison section
*/
import { useState } from "react";

import { ReactBookingModule } from "./components/ReactBookingModule";

// These are the 4 tabs shown in the main project UI.
type ViewMode = "overview" | "react" | "angular" | "comparison";

export default function App() {
  // This decides which section of the project is currently visible.
  const [view, setView] = useState<ViewMode>("overview");

  return (
    <div className="page-shell">
      <main className="app-layout">
        {/* Top section: project title and tab buttons */}
        <section className="hero-card simple-card assignment-shell">
          <div className="eyebrow">Mini Project</div>
          <h1>Flight Booking SPA using ReactJS and AngularJS</h1>
          <p className="hero-copy">The same flight booking task is implemented in ReactJS and AngularJS for comparison.</p>

          <div className="stats-grid">
            <article>
              <strong>Domain</strong>
              <span>Flight booking system</span>
            </article>
            <article>
              <strong>Tech 1</strong>
              <span>ReactJS module</span>
            </article>
            <article>
              <strong>Tech 2</strong>
              <span>AngularJS module</span>
            </article>
          </div>

          <div className="tab-row">
            {/* Clicking a button changes the visible section */}
            <button className={`tab-button ${view === "overview" ? "is-active" : ""}`} onClick={() => setView("overview")} type="button">
              Overview
            </button>
            <button className={`tab-button ${view === "react" ? "is-active" : ""}`} onClick={() => setView("react")} type="button">
              ReactJS Module
            </button>
            <button className={`tab-button ${view === "angular" ? "is-active" : ""}`} onClick={() => setView("angular")} type="button">
              AngularJS Module
            </button>
            <button className={`tab-button ${view === "comparison" ? "is-active" : ""}`} onClick={() => setView("comparison")} type="button">
              Comparison
            </button>
          </div>
        </section>

        {/* Only one section is shown at a time based on the selected tab */}
        {view === "overview" ? <OverviewPanel /> : null}
        {view === "react" ? <ReactBookingModule /> : null}
        {view === "angular" ? <AngularPanel /> : null}
        {view === "comparison" ? <ComparisonPanel /> : null}
      </main>
    </div>
  );
}

function OverviewPanel() {
  return (
    // This section explains the project in simple language.
    <section className="overview-grid">
      <article className="simple-card info-card">
        <span className="eyebrow">Aim</span>
        <h2>Same task in two technologies</h2>
        <p>Both modules allow flight search and booking using the same backend API.</p>
      </article>

      <article className="simple-card info-card">
        <span className="eyebrow">Features</span>
        <ul className="simple-list">
          <li>Dynamic data loading from backend API</li>
          <li>Form validation and error handling</li>
          <li>Seat selection and booking confirmation</li>
          <li>Responsive single page interface</li>
        </ul>
      </article>

      <article className="simple-card info-card full-span">
        <span className="eyebrow">Demo Flow</span>
        <ol className="simple-list ordered">
          <li>Open the Overview tab and explain the project goal.</li>
          <li>Open the ReactJS module and book a flight.</li>
          <li>Open the AngularJS module and repeat the same flow.</li>
          <li>Open the Comparison tab and explain the differences.</li>
        </ol>
      </article>
    </section>
  );
}

function AngularPanel() {
  return (
    // The AngularJS module is loaded inside an iframe from the public folder.
    <section className="simple-card iframe-card">
      <div className="panel-header">
        <div>
          <span className="eyebrow">AngularJS Module</span>
          <h2>Flight booking in AngularJS</h2>
        </div>
      </div>

      <iframe className="module-frame" src="/angularjs/index.html" title="AngularJS flight booking module" />
    </section>
  );
}

function ComparisonPanel() {
  return (
    // Short comparison section for presentation and report use.
    <section className="simple-card comparison-card">
      <span className="eyebrow">Comparison</span>
      <h2>ReactJS vs AngularJS in this project</h2>

      <ul className="simple-list">
        <li>ReactJS uses components and state.</li>
        <li>AngularJS uses controller and scope.</li>
        <li>ReactJS felt more structured.</li>
        <li>AngularJS felt easier for a quick demo.</li>
      </ul>
    </section>
  );
}
