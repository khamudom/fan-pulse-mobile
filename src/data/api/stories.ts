import type { StoriesApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const storiesApiResponse: StoriesApiResponse = {
  meta: fanPulseMeta("/v1/stories/daily"),
  stories: [
    {
      id: "underdog-awakens",
      chapter: "I",
      headline_en: "The Underdog Awakens",
      teaser_en:
        "Canada enters the tournament with its highest expectations in decades.",
      hook_en: "Can they make history?",
      nation_en: "Canada",
      publish_date: "2026-06-05",
      body_paragraphs_en: [
        "For years, the world spoke of Canada as a host nation — gracious, proud, ready to welcome the planet. Few spoke of them as contenders.",
        "That whisper has grown into a roar. A generation raised on ice and ambition now steps onto the biggest stage on home soil, carrying something heavier than hope: belief.",
        "Every great tournament needs a story that refuses to stay quiet. Canada is writing theirs in real time — not with predictions, but with nerve.",
        "The opening chapter is unwritten. The final pages are still far away. But tonight, one nation dares the world to underestimate them again.",
      ],
    },
    {
      id: "three-kingdoms",
      chapter: "II",
      headline_en: "Three Kingdoms, One Crown",
      teaser_en:
        "Mexico, the United States, and Canada share a stage no continent has ever held alone.",
      hook_en: "Who will write the first line of history?",
      publish_date: "2026-06-06",
      body_paragraphs_en: [
        "Three neighbors. Three cultures. One tournament stretched across a continent like never before.",
        "The hosts do not merely open doors — they open narratives. Rivalries that lived in qualifiers now bloom under global lights. Pride travels in every direction.",
        "Fans will chant in three languages and one shared rhythm: this is ours. The world is watching not just the matches, but the meaning behind them.",
        "When the whistle blows, geography becomes destiny. And destiny, as every fairy tale reminds us, favors those who show up ready.",
      ],
    },
    {
      id: "last-whistle-legends",
      chapter: "III",
      headline_en: "The Last Dance of Legends",
      teaser_en:
        "Some names have defined an era. This World Cup may be their final bow under the brightest lights.",
      hook_en: "Will glory find them one more time?",
      publish_date: "2026-06-07",
      body_paragraphs_en: [
        "There are players whose footprints are already carved into history — moments we replay, goals we still feel.",
        "Time is undefeated, but courage is stubborn. The tournament does not care about résumés; it only asks what you have left on the day that matters.",
        "Every legend faces the same quiet question in the tunnel: is this the night the story ends, or the night it becomes unforgettable?",
        "We do not know the answer yet. That is why we watch. That is why we care.",
      ],
    },
    {
      id: "giant-slayer",
      chapter: "IV",
      headline_en: "Giants, Meet Your Match",
      teaser_en:
        "The bracket is drawn in ink, but the World Cup is written in upsets.",
      hook_en: "Which favorite will feel the earth move?",
      publish_date: "2026-06-08",
      body_paragraphs_en: [
        "On paper, the path looks orderly — favorites march, underdogs nod, the script stays polite.",
        "The pitch has never read that script. A single goal can flip a continent's mood. A single save can turn a name into a legend overnight.",
        "This is the chapter where Davids sharpen their stones. Where belief travels faster than reputation. Where the roar of the unexpected becomes the soundtrack of the Cup.",
        "Keep your eyes on the scoreboard, if you must. But keep your heart on the moments no one predicted.",
      ],
    },
    {
      id: "midnight-magic",
      chapter: "V",
      headline_en: "Midnight Magic",
      teaser_en:
        "When the sun sets on one time zone, another city's night ignites with anthems and fireworks.",
      hook_en: "Which match will keep the world awake?",
      publish_date: "2026-06-09",
      body_paragraphs_en: [
        "The World Cup does not sleep — it circles the globe like a comet, leaving streaks of color in its wake.",
        "Late kickoffs turn kitchens into stadiums. Office mornings become recap rituals. Strangers become family for ninety minutes.",
        "There is a special alchemy in night games: the lights feel closer, the stakes feel taller, the silence before kickoff feels like held breath.",
        "Somewhere tonight, a child will see a goal and remember it forever. That is the magic no statistic can measure.",
      ],
    },
    {
      id: "silent-captain",
      chapter: "VI",
      headline_en: "The Silent Captain",
      teaser_en:
        "Not every hero scores. Some lead with a glance, a tackle, a word at half-time.",
      hook_en: "Who will lift the team when the lights are harshest?",
      publish_date: "2026-06-10",
      body_paragraphs_en: [
        "The cameras follow the scorers. The story often belongs to the one who steadies the storm.",
        "A captain's armband is cloth; what it carries is weight — doubt, fear, hope, all of it shared across eleven hearts.",
        "When legs tire and noise rises, leadership is not shouted. It is chosen. One gesture. One run back. One refusal to quit.",
        "Watch for the player who does not ask for the spotlight. The tournament has a way of handing it to them anyway.",
      ],
    },
    {
      id: "penalty-faith",
      chapter: "VII",
      headline_en: "Twelve Yards of Faith",
      teaser_en:
        "Somewhere in this tournament, destiny will shrink to a patch of grass and a heartbeat.",
      hook_en: "Who will hold their nerve when the world holds its breath?",
      publish_date: "2026-06-11",
      body_paragraphs_en: [
        "Penalties are cruel poetry — mathematics dressed as drama, skill married to chance.",
        "Entire journeys collapse or ascend on a single strike. Careers are remembered or rewritten in seconds.",
        "The keeper guesses. The taker breathes. Stadiums become churches. Millions pray to different gods with the same plea: let it be us.",
        "When that moment comes, forget the tables and the trends. There is only the story — raw, honest, unforgettable.",
      ],
    },
  ],
};
