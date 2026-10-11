const STEPS = [
  {
    title: "Read",
    text: "Your PDF is parsed in the browser. The file never touches a server.",
  },
  {
    title: "Match",
    text: "The text is checked against a fixed list of 18 skills recruiters look for.",
  },
  {
    title: "Mark",
    text: "Found skills get a tick. Missing ones are underlined in red so you know what to add.",
  },
];

export default function HowItWorks() {
  return (
    <section className="method-wrap" id="how-it-works">
      <div className="container">
        <h2>How the reading works</h2>
        <ol className="method">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="method-num">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
