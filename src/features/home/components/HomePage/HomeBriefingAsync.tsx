import { getCachedBriefing } from "@/actions/briefing";
import { HomeBriefingPanel } from "./HomeBriefingPanel";

export async function HomeBriefingAsync() {
  const briefing = await getCachedBriefing();

  return <HomeBriefingPanel briefing={briefing} />;
}
