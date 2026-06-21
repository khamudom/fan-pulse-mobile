import { Suspense } from "react";
import {
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
} from "@/actions/social";
import { FriendsExperience } from "../FriendsExperience";
import { FriendsActivityAsync } from "./FriendsActivityAsync";
import { FriendsActivitySkeleton } from "./FriendsPageSkeletons";

export async function FriendsRosterAsync() {
  const [friends, incoming, outgoing] = await Promise.all([
    listFriends(),
    listIncomingRequests(),
    listOutgoingRequests(),
  ]);

  return (
    <FriendsExperience
      friends={friends}
      incoming={incoming}
      outgoing={outgoing}
      activityPanel={
        <Suspense fallback={<FriendsActivitySkeleton />}>
          <FriendsActivityAsync />
        </Suspense>
      }
    />
  );
}
