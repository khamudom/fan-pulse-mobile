import {
  getFriendFeed,
  getFriendLeaderboard,
} from "@/actions/social";
import { FriendsActivityPanel } from "./FriendsActivityPanel";

export async function FriendsActivityAsync() {
  const [feed, leaderboard] = await Promise.all([
    getFriendFeed(),
    getFriendLeaderboard(),
  ]);

  return <FriendsActivityPanel feed={feed} leaderboard={leaderboard} />;
}
