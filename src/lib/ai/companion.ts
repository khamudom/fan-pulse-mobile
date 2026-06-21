import OpenAI from "openai";
import { formatSelectedDateLabel } from "@/lib/matchDate";
import type { Match } from "@/types";
import type { Profile } from "@/types/database";

export interface BriefingInput {
  userName: string;
  profile: Profile | null;
  briefingDate: string;
  yesterdayMatches: Match[];
  todayMatches: Match[];
  upcomingTeamMatch: Match | null;
  stats?: {
    points: number;
    level: number;
    predictionAccuracy: number;
    streak: number;
  };
}

export interface CompanionInput {
  message: string;
  profile: Profile | null;
  matches: Match[];
  userName?: string;
  focusMatch?: Match | null;
}

function formatMatch(m: Match): string {
  const score =
    m.status === "finished" || m.status === "live"
      ? `${m.homeScore}-${m.awayScore}`
      : "vs";
  return `${m.homeTeam.name} ${score} ${m.awayTeam.name} (${m.date} ${m.time})`;
}

function buildTemplateBriefing(input: BriefingInput): string {
  const {
    userName,
    profile,
    briefingDate,
    yesterdayMatches,
    todayMatches,
    upcomingTeamMatch,
    stats,
  } = input;
  const team = profile?.favorite_country ?? "your team";
  const lines: string[] = [];

  lines.push(`Briefing date: ${formatSelectedDateLabel(briefingDate)} (today).`);
  lines.push(`Good morning, ${userName}.`);
  lines.push("");

  if (upcomingTeamMatch) {
    lines.push(
      `${team} plays ${upcomingTeamMatch.homeTeam.name === team ? upcomingTeamMatch.awayTeam.name : upcomingTeamMatch.homeTeam.name} on ${upcomingTeamMatch.date} at ${upcomingTeamMatch.time}.`
    );
    lines.push("");
  }

  lines.push("**Yesterday**");
  if (yesterdayMatches.length === 0) {
    lines.push("- No finished matches yesterday.");
  } else {
    yesterdayMatches.slice(0, 5).forEach((m) => {
      lines.push(`- ${formatMatch(m)}`);
    });
  }
  lines.push("");

  lines.push("**Today**");
  if (todayMatches.length === 0) {
    lines.push("- No matches scheduled today.");
  } else {
    todayMatches.slice(0, 5).forEach((m) => {
      lines.push(`- ${formatMatch(m)}`);
    });
  }
  lines.push("");

  if (stats) {
    lines.push("**Your FanPulse**");
    lines.push(`- Level ${stats.level} · ${stats.points} points`);
    lines.push(`- Prediction accuracy: ${stats.predictionAccuracy}%`);
    if (stats.streak > 0) lines.push(`- ${stats.streak}-day check-in streak`);
  }

  return lines.join("\n");
}

function buildSystemPrompt(
  profile: Profile | null,
  matches: Match[],
  focusMatch?: Match | null
): string {
  const team = profile?.favorite_country ?? "unknown";
  const matchSummary = matches
    .slice(0, 20)
    .map((m) => formatMatch(m))
    .join("\n");

  const focusSection = focusMatch
    ? `\nThe user is currently viewing this match: ${formatMatch(focusMatch)}${focusMatch.stadiumName ? ` at ${focusMatch.stadiumName}` : ""}.
Treat ${focusMatch.homeTeam.name} vs ${focusMatch.awayTeam.name} as the subject of the conversation. Answer about THIS match and its two teams unless the user explicitly names a different team or match. Do not switch to other fixtures (including the user's favorite team) on your own.\n`
    : "";

  return `You are FanPulse, a proactive World Cup 2026 companion. Be concise, warm, and fan-focused.
The user's favorite team is ${team}.
${focusSection}Current match data:
${matchSummary || "No match data available."}
Ground answers in this data. Do not invent scores or fixtures.`;
}

export async function generateBriefing(input: BriefingInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const news = await generateTeamNews(input.profile);
    return appendNews(buildTemplateBriefing(input), news);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const context = buildTemplateBriefing(input);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(input.profile, [
            ...input.yesterdayMatches,
            ...input.todayMatches,
          ]),
        },
        {
          role: "user",
          content:
            `Write a personalized morning briefing (3-minute read, markdown) for ${formatSelectedDateLabel(input.briefingDate)}. ` +
            `Treat that date as "today". The **Yesterday** section is the previous calendar day; the **Today** section is ${formatSelectedDateLabel(input.briefingDate)}. ` +
            `Use this context:\n\n${context}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const briefing =
      response.choices[0]?.message?.content?.trim() ?? buildTemplateBriefing(input);
    const news = await generateTeamNews(input.profile);
    return appendNews(briefing, news);
  } catch {
    return buildTemplateBriefing(input);
  }
}

function appendNews(briefing: string, news: string | null): string {
  if (!news) return briefing;
  return `${briefing}\n\n${news}`;
}

/**
 * Uses OpenAI's Responses API with the built-in web_search tool to pull
 * real, current news about the user's followed nation plus a couple of broad
 * tournament storylines. Returns a markdown "Team News" section, or null if
 * web search is unavailable so the briefing degrades gracefully.
 */
export async function generateTeamNews(profile: Profile | null): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const team = profile?.favorite_country;

  if (!apiKey || !team) {
    return null;
  }

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-4o",
      tools: [{ type: "web_search" }],
      max_output_tokens: 700,
      instructions:
        "You are FanPulse, a World Cup 2026 news curator. Search the web for the " +
        "most recent, credible news and report only verified facts with brief, " +
        "concrete details. Never invent headlines, quotes, scores, or sources. " +
        "If you cannot find recent news for a topic, say so plainly.",
      input:
        `Write a markdown section titled "## Team News" for a fan following ${team} ` +
        `at the 2026 World Cup. Search the web for the latest developments and cover:\n` +
        `1. The most recent news about the ${team} national team (squad, form, ` +
        `injuries, manager, qualification, friendlies).\n` +
        `2. Two or three of the biggest current 2026 World Cup storylines across the ` +
        `tournament.\n\n` +
        `Use short bullet points (one or two sentences each), group them under bold ` +
        `subheadings "**${team}**" and "**Around the tournament**", and append a "Source: " ` +
        `note with the outlet name where helpful. Keep the whole section under 200 words.`,
    });

    const text = response.output_text?.trim();
    return text ? text : null;
  } catch {
    return null;
  }
}

export async function generateCompanionReply(input: CompanionInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const team = input.profile?.favorite_country ?? "your team";
    return `I'm your FanPulse companion. Ask me about ${team}, today's matches, or your predictions. (Connect OPENAI_API_KEY for full AI responses.)`;
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(input.profile, input.matches, input.focusMatch),
        },
        {
          role: "user",
          content: input.message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a response. Try again."
    );
  } catch {
    return "Sorry, the companion is temporarily unavailable. Please try again.";
  }
}

export async function streamCompanionReply(
  input: CompanionInput
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENAI_API_KEY;
  const encoder = new TextEncoder();

  if (!apiKey) {
    const fallback = await generateCompanionReply(input);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallback));
        controller.close();
      },
    });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(input.profile, input.matches, input.focusMatch),
        },
        { role: "user", content: input.message },
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode("Sorry, the companion is temporarily unavailable.")
          );
          controller.close();
        }
      },
    });
  } catch {
    const fallback = await generateCompanionReply(input);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallback));
        controller.close();
      },
    });
  }
}

export { buildTemplateBriefing };
