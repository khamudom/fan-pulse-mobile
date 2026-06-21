<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## World Cup API data

Never add mock or snapshot fallbacks for live tournament data (teams, matches, groups, stadiums) in `worldCupApi.ts` or related UI. When the API is unavailable, return empty results with a clear error message — never substitute fake data that could mislead users.
