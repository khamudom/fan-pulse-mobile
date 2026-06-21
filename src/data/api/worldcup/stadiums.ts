/** Mock fallback — mirrors GET https://worldcup26.ir/get/stadiums */

export interface WorldCupApiStadium {
  id: string;
  name_en: string;
  fifa_name: string;
  city_en: string;
  country_en: string;
  capacity: number;
  region: string;
}

export const mockStadiumsApiResponse = {
  stadiums: [
    {
      id: "1",
      name_en: "Estadio Azteca",
      fifa_name: "Mexico City Stadium",
      city_en: "Mexico City",
      country_en: "Mexico",
      capacity: 83000,
      region: "North America",
    },
    {
      id: "2",
      name_en: "MetLife Stadium",
      fifa_name: "New York New Jersey Stadium",
      city_en: "East Rutherford",
      country_en: "United States",
      capacity: 82500,
      region: "North America",
    },
    {
      id: "3",
      name_en: "SoFi Stadium",
      fifa_name: "Los Angeles Stadium",
      city_en: "Inglewood",
      country_en: "United States",
      capacity: 70000,
      region: "North America",
    },
    {
      id: "4",
      name_en: "AT&T Stadium",
      fifa_name: "Dallas Stadium",
      city_en: "Dallas",
      country_en: "United States",
      capacity: 80000,
      region: "North America",
    },
  ] satisfies WorldCupApiStadium[],
};
