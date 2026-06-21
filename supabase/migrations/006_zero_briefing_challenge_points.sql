-- Briefing is read-only content; remove it from daily challenges.
UPDATE challenges
SET active = false, points = 0
WHERE slug = 'read-briefing';
