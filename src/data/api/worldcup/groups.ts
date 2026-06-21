/** Mock fallback — mirrors GET https://worldcup26.ir/get/groups */

export interface WorldCupApiGroupTeam {
  team_id: string;
  mp: string;
  w: string;
  d: string;
  l: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

export interface WorldCupApiGroup {
  name: string;
  teams: WorldCupApiGroupTeam[];
}

export const mockGroupsApiResponse = {
  groups: [
    {
      name: "A",
      teams: [
        {
          team_id: "8",
          mp: "2",
          w: "2",
          d: "0",
          l: "0",
          pts: "6",
          gf: "4",
          ga: "1",
          gd: "3",
        },
        {
          team_id: "9",
          mp: "2",
          w: "1",
          d: "0",
          l: "1",
          pts: "3",
          gf: "2",
          ga: "2",
          gd: "0",
        },
        {
          team_id: "10",
          mp: "2",
          w: "0",
          d: "1",
          l: "1",
          pts: "1",
          gf: "1",
          ga: "2",
          gd: "-1",
        },
        {
          team_id: "11",
          mp: "2",
          w: "0",
          d: "1",
          l: "1",
          pts: "1",
          gf: "1",
          ga: "3",
          gd: "-2",
        },
      ],
    },
    {
      name: "C",
      teams: [
        {
          team_id: "3",
          mp: "2",
          w: "2",
          d: "0",
          l: "0",
          pts: "6",
          gf: "5",
          ga: "1",
          gd: "4",
        },
        {
          team_id: "12",
          mp: "2",
          w: "1",
          d: "0",
          l: "1",
          pts: "3",
          gf: "3",
          ga: "3",
          gd: "0",
        },
        {
          team_id: "13",
          mp: "2",
          w: "0",
          d: "1",
          l: "1",
          pts: "1",
          gf: "2",
          ga: "4",
          gd: "-2",
        },
        {
          team_id: "14",
          mp: "2",
          w: "0",
          d: "1",
          l: "1",
          pts: "1",
          gf: "1",
          ga: "3",
          gd: "-2",
        },
      ],
    },
  ] satisfies WorldCupApiGroup[],
};
