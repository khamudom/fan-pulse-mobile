import { getAuthContext } from "@/lib/auth";
import { CheckInCelebration } from "./CheckInCelebration";

export async function CheckInCelebrationContainer() {
  const { checkIn } = await getAuthContext();

  if (!checkIn?.justCheckedIn) return null;

  return (
    <CheckInCelebration
      streak={checkIn.streak}
      pointsEarned={checkIn.pointsEarned}
    />
  );
}
