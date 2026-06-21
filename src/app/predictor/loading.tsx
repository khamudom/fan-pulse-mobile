import { Hero } from "@/components/display/Hero";
import { LoadingState } from "@/components/feedback/LoadingState";

export default function Loading() {
  return (
    <div className="page">
      <Hero
        title="World Cup Predictor"
        subtitle="Build your World Cup picks and choose your champion."
        compact
      />
      <section className="section">
        <div className="container">
          <LoadingState label="Loading predictor…" rows={5} />
        </div>
      </section>
    </div>
  );
}
