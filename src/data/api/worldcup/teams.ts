/** Mock fallback — mirrors GET https://worldcup26.ir/get/teams */

export interface WorldCupApiTeam {
  id: string;
  name_en: string;
  name_fa?: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

export const mockTeamsApiResponse = {
  teams: [
    {
      id: "1",
      name_en: "USA",
      flag: "https://flagcdn.com/w80/us.png",
      fifa_code: "USA",
      iso2: "us",
      groups: "D",
    },
    {
      id: "2",
      name_en: "England",
      flag: "https://flagcdn.com/w80/gb.png",
      fifa_code: "ENG",
      iso2: "gb",
      groups: "B",
    },
    {
      id: "3",
      name_en: "Brazil",
      flag: "https://flagcdn.com/w80/br.png",
      fifa_code: "BRA",
      iso2: "br",
      groups: "C",
    },
    {
      id: "4",
      name_en: "Argentina",
      flag: "https://flagcdn.com/w80/ar.png",
      fifa_code: "ARG",
      iso2: "ar",
      groups: "J",
    },
    {
      id: "5",
      name_en: "France",
      flag: "https://flagcdn.com/w80/fr.png",
      fifa_code: "FRA",
      iso2: "fr",
      groups: "I",
    },
    {
      id: "6",
      name_en: "Germany",
      flag: "https://flagcdn.com/w80/de.png",
      fifa_code: "GER",
      iso2: "de",
      groups: "E",
    },
    {
      id: "7",
      name_en: "Spain",
      flag: "https://flagcdn.com/w80/es.png",
      fifa_code: "ESP",
      iso2: "es",
      groups: "H",
    },
    {
      id: "8",
      name_en: "Mexico",
      flag: "https://flagcdn.com/w80/mx.png",
      fifa_code: "MEX",
      iso2: "mx",
      groups: "A",
    },
    {
      id: "9",
      name_en: "South Africa",
      flag: "https://flagcdn.com/w80/za.png",
      fifa_code: "RSA",
      iso2: "za",
      groups: "A",
    },
    {
      id: "10",
      name_en: "South Korea",
      flag: "https://flagcdn.com/w80/kr.png",
      fifa_code: "KOR",
      iso2: "kr",
      groups: "A",
    },
    {
      id: "11",
      name_en: "UEFA Playoff D",
      fifa_code: "PO4",
      iso2: "eu",
      groups: "A",
      flag: "",
    },
    {
      id: "12",
      name_en: "Morocco",
      flag: "https://flagcdn.com/w80/ma.png",
      fifa_code: "MAR",
      iso2: "ma",
      groups: "C",
    },
    {
      id: "13",
      name_en: "Haiti",
      fifa_code: "HAI",
      iso2: "ht",
      groups: "C",
      flag: "",
    },
    {
      id: "14",
      name_en: "Scotland",
      flag: "https://flagcdn.com/w80/gb-sct.png",
      fifa_code: "SCO",
      iso2: "gb-sct",
      groups: "C",
    },
  ] satisfies WorldCupApiTeam[],
};
