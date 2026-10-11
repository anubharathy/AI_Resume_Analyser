import UploadCard from "./UploadCard.jsx";

export default function UploadSection({ analysis }) {
  return (
    <section className="intro" id="upload">
      <div className="container">
        <h1 className="intro-title">Know what your resume is missing.</h1>
        <p className="intro-sub">
          Drop in a PDF and get a score out of 100, every skill it shows, and the
          ones it never mentions. Takes about two seconds.
        </p>
        <UploadCard analysis={analysis} />
      </div>
    </section>
  );
}
