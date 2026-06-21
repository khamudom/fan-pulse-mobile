import { Suspense } from "react";
import { Hero } from "@/components/display/Hero";
import { LoadingState } from "@/components/feedback/LoadingState";
import { PredictorExperienceAsync } from "@/components/PredictorExperience/PredictorExperienceAsync";

export const metadata = {
  title: "World Cup Predictor",
};

export default function PredictorPage() {
  return (
    <div className="page">
      <Hero
        title="World Cup Predictor"
        subtitle="Build your World Cup picks and choose your champion."
        compact
      />
      <section className="section">
        <div className="container">
          <Suspense
            fallback={<LoadingState label="Loading predictor…" rows={5} />}
          >
            <PredictorExperienceAsync />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
