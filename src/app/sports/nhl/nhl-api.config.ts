/**
 * NHL API
 *
 * Keywords:
 * - TEAM_ABBV: Team Abbreviation (e.g. "BOS")
 * - SEASON_ID: Season ID (e.g. "20242025") - This is the current season
 * - DATE: Date (e.g. "2024-12-29") - This is the date of the standings
 *
 * @see https://github.com/Zmalski/NHL-API-Reference?tab=readme-ov-file#schedule-1
 */
export const NHL_API = {
  STANDINGS: `nhlapi/v1/standings/DATE`,
  SEASON_SCHEDULE: `nhlapi/v1/club-schedule-season/TEAM_ABBV/SEASON_ID`,
};

export const NHL_LOGO_URL =
  'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg';
