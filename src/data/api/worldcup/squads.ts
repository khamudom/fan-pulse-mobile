import { fanPulseMeta } from "../meta";

export type WorldCupSquadPosition =
  | "Goalkeeper"
  | "Defender"
  | "Midfielder"
  | "Forward";

interface SquadSeed {
  group: string;
  team: string;
  captain: string;
  coach: string;
  status?: string;
  roster: Record<WorldCupSquadPosition, string>;
}

export interface WorldCupSquadPlayer {
  id: string;
  name_en: string;
  club_en?: string;
  position: WorldCupSquadPosition;
  team_id: string;
  team_name_en: string;
  group: string;
  is_captain: boolean;
}

export interface WorldCupSquad {
  id: string;
  team_name_en: string;
  group: string;
  captain_en: string;
  coach_en: string;
  status_en?: string;
  player_count: number;
  players: WorldCupSquadPlayer[];
}

const squadSeeds: SquadSeed[] = [
  {
    group: "A",
    team: "Mexico",
    captain: "Edson Alvarez",
    coach: "Javier Aguirre",
    status: "Preliminary squad revealed May 12; final roster set for June 1.",
    roster: {
      Goalkeeper: "Raul Rangel (Chivas), Guillermo Ochoa (AEL Limassol), Carlos Acevedo (Santos Laguna)",
      Defender: "Johan Vasquez (Genoa), Cesar Montes (Lokomotiv Moscow), Jesus Gallardo (Toluca), Jorge Sanchez (PAOK), Mateo Chavez (AZ Alkmaar), Israel Reyes (Club America)",
      Midfielder: "Edson Alvarez (Fenerbahce), Orbelin Pineda (AEK Athens), Alvaro Fidalgo (Real Betis), Obed Vargas (Atletico Madrid), Gilberto Mora (Tijuana), Luis Chavez (Dynamo Moscow), Erik Lira (Cruz Azul), Luis Romo (Chivas), Brian Gutierrez (Chivas), Cesar Huerta (Anderlecht)",
      Forward: "Raul Jimenez (Fulham), Santiago Gimenez (AC Milan), Cesar Huerta, Armando Gonzalez (Chivas), Guillermo Martinez (Pumas), Alexis Vega (Toluca)",
    },
  },
  {
    group: "A",
    team: "South Korea",
    captain: "Son Heung-min",
    coach: "Hong Myung-bo",
    status: "Final World Cup squad revealed May 16.",
    roster: {
      Goalkeeper: "Kim Seung-gyu (FC Tokyo), Jo Hyeon-woo (Ulsan HD), Song Bum-keun (Jeonbuk Hyundai Motors)",
      Defender: "Kim Min-jae (Bayern Munich), Kim Moon-hwan (Daejeon Hana Citizen), Seol Young-woo (Red Star Belgrade), Cho Yu-min (Sharjah), Lee Tae-seok (Austria Wien), Park Jin-seob (Zhejiang FC), Kim Tae-hyeon (Kashima Antlers), Lee Han-beom (Midtjylland), Jens Castrop (Borussia Monchengladbach), Lee Ki-hyuk (Gangwon FC)",
      Midfielder: "Lee Jae-sung (Mainz 05), Hwang Hee-chan (Wolverhampton Wanderers), Hwang In-beom (Feyenoord), Lee Kang-in (Paris Saint-Germain), Paik Seung-ho (Birmingham City), Kim Jin-gyu (Jeonbuk Hyundai Motors), Lee Dong-gyeong (Ulsan HD), Bae Jun-ho (Stoke City), Eom Ji-sung (Swansea City), Yang Hyun-jun (Celtic)",
      Forward: "Son Heung-min (Los Angeles FC, captain), Cho Gue-sung (Midtjylland), Oh Hyeon-gyu (Besiktas)",
    },
  },
  {
    group: "A",
    team: "South Africa",
    captain: "Ronwen Williams",
    coach: "Hugo Broos",
    status: "32-man preliminary squad announced May 21; final squad set for May 27.",
    roster: {
      Goalkeeper: "Sipho Chaine (Orlando Pirates), Ricardo Goss (Siwelele), Ronwen Williams (Mamelodi Sundowns)",
      Defender: "Aubrey Modiba, Khuliso Mudau, Khulumani Ndamane (all Sundowns), Kamogelo Sebelebele, Nkosinathi Sibisi (both Pirates), Bradley Cross (Kaizer Chiefs), Samukele Kabini (Molde/Norway), Olwethu Makhanya (Philadelphia Union/USA), Thabang Matuludi (Polokwane City), Mbekezeli Mbokazi (Chicago Fire/USA), Ime Okon (Hannover/Germany)",
      Midfielder: "Oswin Appollis, Thalente Mbatha, Relebohile Mofokeng (all Pirates), Jayden Adams, Teboho Mokoena, Themba Zwane (all Sundowns), Sphephelo Sithole (Tondela/Portugal)",
      Forward: "Evidence Makgopa, Tshepang Moremi (both Pirates), Lyle Foster (Burnley/England), Thapelo Maseko (AEL Limassol/Cyprus), Iqraam Rayners (Sundowns)",
    },
  },
  {
    group: "A",
    team: "Czechia",
    captain: "Ladislav Krejci",
    coach: "Miroslav Koubek",
    roster: {
      Goalkeeper: "Lukas Hornicek (Braga), Matej Kovar (PSV Eindhoven), Jindrich Stanek (Slavia Prague)",
      Defender: "Vladimir Coufal (Hoffenheim), David Doudera (Slavia Prague), Tomas Holes (Slavia Prague), Robin Hranac (Hoffenheim), Stepan Chaloupek (Slavia Prague), David Jurasek (Slavia Prague), Ladislav Krejci (Wolverhampton), Jaroslav Zeleny (Sparta Prague), David Zima (Slavia Prague)",
      Midfielder: "Lukas Cerv (Viktoria Plzen), Vladimir Darida (Hradec Kralove), Lukas Provod (Slavia Prague), Michal Sadilek (Slavia Prague), Hugo Sochurek (Sparta Prague), Alexandr Sojka (Viktoria Plzen), Tomas Soucek (West Ham), Pavel Sulc (Lyon), Denis Visinsky (Viktoria Plzen)",
      Forward: "Tomas Chory (Slavia Prague), Adam Hlozek (Hoffenheim), Mojmir Chytil (Slavia Prague), Jan Kuchta (Sparta Prague), Patrik Schick (Bayer Leverkusen)",
    },
  },
  {
    group: "B",
    team: "Canada",
    captain: "Alphonso Davies",
    coach: "Jesse Marsch",
    status: "32-player preliminary squad announced May 25; final squad set for May 29.",
    roster: {
      Goalkeeper: "Maxime Crepeau (Orlando City SC), Dayne St. Clair (Inter Miami CF), Owen Goodman (Barnsley)",
      Defender: "Richie Laryea (Toronto FC), Alphonso Davies (Bayern Munich, captain), Alistair Johnston (Celtic), Derek Cornelius (Rangers), Moise Bombito (Nice), Niko Sigur (Hajduk Split), Joel Waterman (Chicago Fire), Luc de Fougerolles (Dender), Zorhan Bassong (Sporting Kansas City), Jamie Knight-Lebel (Swindon Town), Ralph Priso (Vancouver Whitecaps FC), Alfie Jones (Middlesbrough)",
      Midfielder: "Jonathan Osorio (Toronto FC), Tajon Buchanan (Villarreal), Stephen Eustaquio (Los Angeles FC), Liam Millar (Hull City), Ismael Kone (Sassuolo), Jacob Shaffelburg (Los Angeles FC), Ali Ahmed (Norwich City), Mathieu Choiniere (Los Angeles FC), Nathan Saliba (Anderlecht), Jayden Nelson (Austin FC), Marcelo Flores (UANL)",
      Forward: "Cyle Larin (Southampton), Jonathan David (Juventus), Tani Oluwaseyi (Villarreal), Promise David (Union Saint-Gilloise), Jacen Russell-Rowe (Toulouse), Daniel Jebbison (Preston North End)",
    },
  },
  {
    group: "B",
    team: "Switzerland",
    captain: "Granit Xhaka",
    coach: "Murat Yakin",
    status: "Final squad revealed May 18 and 19.",
    roster: {
      Goalkeeper: "Gregor Kobel (Borussia Dortmund), Yvon Mvogo (Lorient), Marvin Keller (Young Boys)",
      Defender: "Ricardo Rodriguez (Real Betis), Manuel Akanji (Inter Milan), Nico Elvedi (Borussia Monchengladbach), Silvan Widmer (Mainz 05), Eray Comert (Valencia), Miro Muheim (Hamburger SV), Aurele Amenda (Eintracht Frankfurt), Luca Jaquez (VfB Stuttgart)",
      Midfielder: "Granit Xhaka (Sunderland, captain), Remo Freuler (Bologna), Denis Zakaria (Monaco), Djibril Sow (Sevilla), Michel Aebischer (Pisa), Fabian Rieder (FC Augsburg), Christian Fassnacht (Young Boys), Johan Manzambi (SC Freiburg), Ardon Jashari (Milan)",
      Forward: "Breel Embolo (Rennes), Ruben Vargas (Sevilla), Dan Ndoye (Nottingham Forest), Zeki Amdouni (Burnley), Noah Okafor (Leeds United), Cedric Itten (Fortuna Dusseldorf)",
    },
  },
  {
    group: "B",
    team: "Qatar",
    captain: "Hassan Al-Haydos",
    coach: "Julen Lopetegui",
    status: "Preliminary squad announced May 12, expanded May 18, reduced May 25.",
    roster: {
      Goalkeeper: "Meshaal Barsham (Al-Sadd), Salah Zakaria (Al-Duhail), Mahmud Abunada (Al-Rayyan), Shehab Ellethy (Al-Shahaniya)",
      Defender: "Boualem Khoukhi (Al-Sadd), Pedro Miguel (Al-Sadd), Homam Ahmed (Cultural Leonesa), Lucas Mendes (Al-Wakrah), Sultan Al-Brake (Al-Duhail), Al-Hashmi Al-Hussain (Al-Arabi), Ayoub Al-Oui (Al-Gharafa), Issa Laye (Al-Arabi), Rayyan Al-Ali (Al-Gharafa)",
      Midfielder: "Abdulaziz Hatem (Al-Rayyan), Karim Boudiaf (Al-Duhail), Assim Madibo (Al-Wakrah), Ahmed Fathy (Al-Arabi), Jassem Gaber (Al-Rayyan), Mohamed Al-Mannai (Al-Shamal), Tahsin Jamshid (Al-Duhail)",
      Forward: "Hassan Al-Haydos (Al-Sadd, captain), Akram Afif (Al-Sadd), Almoez Ali (Al-Duhail), Mohammed Muntari (Al-Gharafa), Ahmed Alaaeldin (Al-Rayyan), Yusuf Abdurisag (Al-Wakrah), Edmilson Junior (Al-Duhail), Ahmed Al-Ganehi (Al-Gharafa)",
    },
  },
  {
    group: "B",
    team: "Bosnia and Herzegovina",
    captain: "Edin Dzeko",
    coach: "Sergej Barbarez",
    roster: {
      Goalkeeper: "Nikola Vasilj (St. Pauli), Martin Zlomislic (Rijeka), Osman Hadzikic (Slaven Belupo)",
      Defender: "Sead Kolasinac (Atalanta), Dennis Hadzikadunic (Sampdoria), Amar Dedic (Benfica), Nikola Katic (Schalke 04), Tarik Muharemovic (Sassuolo), Nihad Mujakic (Gaziantep), Stjepan Radeljic (Rijeka), Nidal Celik (Lens)",
      Midfielder: "Amir Hadziahmetovic (Hull City), Benjamin Tahirovic (Brondby), Armin Gigovic (Young Boys), Dzenis Burnic (Karlsruher SC), Ivan Basic (Astana), Esmir Bajraktarevic (PSV), Amar Memic (Viktoria Plzen), Ivan Sunjic (Pafos), Kerim Alajbegovic (Red Bull Salzburg), Ermin Mahmic (Slovan Liberec)",
      Forward: "Edin Dzeko (Schalke 04), Ermedin Demirovic (VfB Stuttgart), Samed Bazdar (Jagiellonia Bialystok), Haris Tabakovic (Borussia Monchengladbach), Jovo Lukic (Universitatea Cluj)",
    },
  },
  {
    group: "C",
    team: "Brazil",
    captain: "Marquinhos",
    coach: "Carlo Ancelotti",
    status: "55-man preliminary squad revealed May 12; final squad revealed May 18.",
    roster: {
      Goalkeeper: "Alisson (Liverpool), Ederson (Fenerbahce), Weverton (Gremio)",
      Defender: "Alex Sandro, Danilo, Leo Pereira (Flamengo), Bremer (Juventus), Ibanez (Al-Ahli), Wesley (Roma), Marquinhos (Paris St-Germain), Gabriel (Arsenal), Douglas Santos (Zenit St. Petersburg)",
      Midfielder: "Bruno Guimaraes (Newcastle), Casemiro (Manchester United), Danilo Santos (Botafogo), Fabinho (Al-Ittihad), Lucas Paqueta (Flamengo)",
      Forward: "Endrick (Lyon), Gabriel Martinelli (Arsenal), Igor Thiago (Brentford), Matheus Cunha (Manchester United), Raphinha (Barcelona), Vinicius Junior (Real Madrid), Luiz Henrique (Zenit St. Petersburg), Neymar (Santos), Rayan (Bournemouth)",
    },
  },
  {
    group: "C",
    team: "Morocco",
    captain: "Achraf Hakimi",
    coach: "Mohamed Ouahbi",
    status: "Final squad revealed May 26.",
    roster: {
      Goalkeeper: "Yassine Bounou (Al-Hilal), Munir Mohamedi (RS Berkane), Ahmed Reda Tagnaouti (AS FAR)",
      Defender: "Achraf Hakimi (Paris Saint-Germain, captain), Nayef Aguerd (Marseille), Noussair Mazraoui (Manchester United), Youssef Belammari (Al Ahly), Anass Salah-Eddine (PSV Eindhoven), Chadi Riad (Crystal Palace), Issa Diop (Fulham), Zakaria El Ouahdi (Genk), Redouane Halhal (Mechelen)",
      Midfielder: "Sofyan Amrabat (Real Betis), Azzedine Ounahi (Girona), Bilal El Khannouss (VfB Stuttgart), Ismael Saibari (PSV Eindhoven), Neil El Aynaoui (Roma), Samir El Mourabet (Strasbourg), Ayyoub Bouaddi (Lille)",
      Forward: "Ayoub El Kaabi (Olympiacos), Abde Ezzalzouli (Real Betis), Soufiane Rahimi (Al Ain), Brahim Diaz (Real Madrid), Chemsdine Talbi (Sunderland), Gessime Yassine (Strasbourg), Ayoube Amaimouni (Eintracht Frankfurt)",
    },
  },
  {
    group: "C",
    team: "Scotland",
    captain: "Andy Robertson",
    coach: "Steve Clarke",
    status: "Final squad revealed May 19.",
    roster: {
      Goalkeeper: "Craig Gordon (Heart of Midlothian), Angus Gunn (Nottingham Forest), Liam Kelly (Rangers)",
      Defender: "Andy Robertson (Liverpool, captain), Grant Hanley (Hibernian), Kieran Tierney (Celtic), Scott McKenna (Dinamo Zagreb), Jack Hendry (Al-Ettifaq), Nathan Patterson (Everton), Anthony Ralston (Celtic), John Souttar (Rangers), Aaron Hickey (Brentford), Dominic Hyam (Wrexham)",
      Midfielder: "John McGinn (Aston Villa), Scott McTominay (Napoli), Ryan Christie (Bournemouth), Kenny McLean (Norwich City), Billy Gilmour (Napoli), Lewis Ferguson (Bologna), Ben Gannon-Doak (Bournemouth), Findlay Curtis (Kilmarnock)",
      Forward: "Lyndon Dykes (Charlton Athletic), Che Adams (Torino), Lawrence Shankland (Heart of Midlothian), George Hirst (Ipswich Town), Ross Stewart (Southampton)",
    },
  },
  {
    group: "C",
    team: "Haiti",
    captain: "Johny Placide",
    coach: "Sebastien Migne",
    status: "Final squad revealed May 15.",
    roster: {
      Goalkeeper: "Johny Placide (Bastia, captain), Alexandre Pierre (Sochaux), Josue Duverger (Cosmos Koblenz)",
      Defender: "Ricardo Ade (LDU Quito), Carlens Arcus (Angers), Martin Experience (Nancy), Jean-Kevin Duverne (Gent), Duke Lacroix (Colorado Springs Switchbacks FC), Wilguens Paugain (Zulte Waregem), Hannes Delcroix (Lugano), Keeto Thermoncy (Young Boys)",
      Midfielder: "Leverton Pierre (Vizela), Danley Jean Jacques (Philadelphia Union), Carl Sainte (El Paso Locomotive FC), Jean-Ricner Bellegarde (Wolverhampton Wanderers), Woodensky Pierre (Violette), Dominique Simon (Tatran Presov)",
      Forward: "Duckens Nazon (Esteghlal), Frantzdy Pierrot (Caykur Rizespor), Derrick Etienne Jr. (Toronto FC), Louicius Deedson (FC Dallas), Ruben Providence (Almere City), Josue Casimir (Auxerre), Yassin Fortune (Vizela), Wilson Isidor (Sunderland), Lenny Joseph (Ferencvaros)",
    },
  },
  {
    group: "D",
    team: "United States",
    captain: "Christian Pulisic",
    coach: "Mauricio Pochettino",
    status: "Final USMNT squad set for May 26.",
    roster: {
      Goalkeeper: "Matt Turner (New England Revolution), Matt Freese (New York City FC), Chris Brady (Chicago Fire)",
      Defender: "Sergino Dest (PSV Eindhoven), Chris Richards (Crystal Palace), Antonee Robinson (Fulham), Auston Trusty (Celtic), Miles Robinson (FC Cincinnati), Tim Ream (Charlotte FC), Alex Freeman (Villarreal), Maximilian Arfsten (Columbus Crew), Mark McKenzie (Toulouse), Joe Scally (Borussia Monchengladbach)",
      Midfielder: "Tyler Adams (Bournemouth), Giovanni Reyna (Borussia Monchengladbach), Weston McKennie (Juventus), Brenden Aaronson (Leeds United), Sebastian Berhalter (Vancouver Whitecaps FC), Cristian Roldan (Seattle Sounders FC), Malik Tillman (Bayer Leverkusen)",
      Forward: "Ricardo Pepi (PSV Eindhoven), Christian Pulisic (Milan, captain), Haji Wright (Coventry City), Folarin Balogun (Monaco), Timothy Weah (Marseille), Alejandro Zendejas (America)",
    },
  },
  {
    group: "D",
    team: "Australia",
    captain: "Mathew Ryan",
    coach: "Tony Popovic",
    status: "Final squad announced June 1.",
    roster: {
      Goalkeeper: "Mat Ryan (Levante), Patrick Beach (Melbourne City), Paul Izzo (Randers FC)",
      Defender: "Aziz Behich (Melbourne City), Jordan Bos (Feyenoord), Cameron Burgess (Swansea City), Alessandro Circati (Parma Calcio 1913), Milos Degenek (Apoel FC), Jason Geria (Albirex Niigata), Lucas Herrington (Colorado Rapids), Jacob Italiano (Grazer AK), Harry Souttar (Leicester City), Kai Trewin (NYCFC)",
      Midfielder: "Cameron Devlin (Hearts), Jackson Irvine (St. Pauli), Connor Metcalfe (St. Pauli), Mathew Leckie (Melbourne City), Paul Okon-Engstler (Sydney FC), Aiden O'Neill (NYCFC)",
      Forward: "Ajdin Hrustic (Heracles Almelo), Nestory Irankunda (Watford), Awer Mabil (CD Castellon), Mohamed Toure (Norwich City), Nishan Velupillay (Melbourne Victory), Cristian Volpato (Sassuolo), Tete Yengi (Machida Zelvia)",
    },
  },
  {
    group: "D",
    team: "Paraguay",
    captain: "Gustavo Gomez",
    coach: "Gustavo Alfaro",
    status: "55-player preliminary squad revealed May 12; final squad announced June 1.",
    roster: {
      Goalkeeper: "Gatito Fernandez (Cerro Porteno), Orlando Gill (San Lorenzo), Gaston Olveira (Olimpia)",
      Defender: "Gustavo Gomez (captain, Palmeiras), Junior Alonso (Atletico Mineiro), Fabian Balbuena (Gremio), Omar Alderete (Sunderland), Juan Jose Caceres (Dynamo Moscow), Gustavo Velazquez (Cerro Porteno), Jose Canale (Lanus), Alexandro Maidana (Talleres)",
      Midfielder: "Miguel Almiron (Atlanta United), Diego Gomez (Brighton & Hove Albion), Andres Cubas (Vancouver Whitecaps FC), Damian Bobadilla (Sao Paulo), Ramon Sosa (Palmeiras), Braian Ojeda (Orlando City SC), Matias Galarza (Atlanta United), Mauricio (Palmeiras), Gustavo Caballero (Portsmouth)",
      Forward: "Antonio Sanabria (Cremonese), Julio Enciso (Strasbourg), Kaku (Al Ain), Alex Arce (Independiente Rivadavia), Gabriel Avalos (Independiente), Isidro Pitta (Red Bull Bragantino)",
    },
  },
  {
    group: "D",
    team: "Turkiye",
    captain: "Hakan Calhanoglu",
    coach: "Vincenzo Montella",
    status: "35-player preliminary squad revealed May 18; final squad announced June 2.",
    roster: {
      Goalkeeper: "Mert Gunok (Fenerbahce), Altay Bayindir (Manchester United), Ugurcan Cakir (Galatasaray)",
      Defender: "Zeki Celik (Roma), Merih Demiral (Al-Ahli), Caglar Soyuncu (Fenerbahce), Eren Elmali (Galatasaray), Abdulkerim Bardakci (Galatasaray), Ozan Kabak (TSG Hoffenheim), Mert Muldur (Fenerbahce), Ferdi Kadioglu (Brighton & Hove Albion), Samet Akaydin (Caykur Rizespor)",
      Midfielder: "Hakan Calhanoglu (captain, Inter Milan), Orkun Kokcu (Besiktas), Salih Ozcan (Borussia Dortmund), Ismail Yuksek (Fenerbahce), Kaan Ayhan (Galatasaray)",
      Forward: "Kerem Akturkoglu (Fenerbahce), Arda Guler (Real Madrid), Kenan Yildiz (Juventus), Deniz Gul (Porto), Irfan Can Kahveci (Kasimpasa), Yunus Akgun (Galatasaray), Baris Alper Yilmaz (Galatasaray), Oguz Aydin (Fenerbahce), Can Uzun (Eintracht Frankfurt)",
    },
  },
  {
    group: "E",
    team: "Germany",
    captain: "Joshua Kimmich",
    coach: "Julian Nagelsmann",
    status: "Final squad revealed May 21.",
    roster: {
      Goalkeeper: "Manuel Neuer (Bayern Munich), Oliver Baumann (TSG Hoffenheim), Alexander Nubel (VfB Stuttgart)",
      Defender: "Waldemar Anton (Borussia Dortmund), Nathaniel Brown (Eintracht Frankfurt), Joshua Kimmich (Bayern Munich), David Raum (RB Leipzig), Antonio Rudiger (Real Madrid), Nico Schlotterbeck (Borussia Dortmund), Jonathan Tah (Bayern Munich), Malick Thiaw (Newcastle United)",
      Midfielder: "Pascal Gross (Brighton & Hove Albion), Felix Nmecha (Borussia Dortmund), Aleksandar Pavlovic (Bayern Munich), Angelo Stiller (VfB Stuttgart), Leon Goretzka (Bayern Munich), Nadiem Amiri (Mainz 05)",
      Forward: "Maximilian Beier (Borussia Dortmund), Kai Havertz (Arsenal), Lennart Karl (Bayern Munich), Jamie Leweling (VfB Stuttgart), Jamal Musiala (Bayern Munich), Leroy Sane (Galatasaray Istanbul), Deniz Undav (VfB Stuttgart), Florian Wirtz (Liverpool), Nick Woltemade (Newcastle United)",
    },
  },
  {
    group: "E",
    team: "Ecuador",
    captain: "Enner Valencia",
    coach: "Sebastian Beccacece",
    status: "Final squad announced May 31.",
    roster: {
      Goalkeeper: "Hernan Galindez (Huraca), Moises Ramirez (Kifisia), Gonzalo Valle (Liga de Quito)",
      Defender: "Pervis Estupinan (AC Milan), Piero Hincapie (Arsenal), Willian Pacho (Paris Saint-Germain), Joel Ordonez (Club Brugge), Felix Torres (Internacional), Jackson Porozo (Tijuana), Angelo Preciado (Atletico Mineiro)",
      Midfielder: "Moises Caicedo (Chelsea), Alan Franco (Atletico Mineiro), Alan Minda (Atletico Mineiro), Pedro Vite (Pumas), Jeremy Arevalo (Stuttgart), Kendry Paez (River Plate), Jordy Alcivar (Independiente del Valle), John Yeboah (Venezia), Denil Castillo (Midtjylland), Yaimar Medina (Genk), Gonzalo Plata (Flamengo)",
      Forward: "Enner Valencia (Pachuca), Kevin Rodriguez (Union Saint-Gilloise), Jordy Caice",
    },
  },
  {
    group: "E",
    team: "Ivory Coast",
    captain: "Franck Kessie",
    coach: "Emerse Fae",
    status: "Final squad revealed May 15.",
    roster: {
      Goalkeeper: "Yahia Fofana (Caykur Rizespor), Alban Lafont (Panathinaikos), Mohamed Kone (Charleroi)",
      Defender: "Ghislain Konan (Gil Vicente), Odilon Kossounou (Atalanta), Wilfried Singo (Galatasaray), Evan Ndicka (Roma), Emmanuel Agbadou (Besiktas), Guela Doue (Strasbourg), Ousmane Diomande (Sporting CP), Clement Akpa (Auxerre)",
      Midfielder: "Franck Kessie (Al-Ahli, captain), Jean Michael Seri (Maribor), Ibrahim Sangare (Nottingham Forest), Seko Fofana (Porto), Christ Inao Oulai (Trabzonspor), Parfait Guiagon (Charleroi)",
      Forward: "Nicolas Pepe (Villarreal), Oumar Diakite (Cercle Brugge), Simon Adingra (Monaco), Evann Guessand (Crystal Palace), Amad Diallo (Manchester United), Yan Diomande (RB Leipzig), Bazoumana Toure (TSG Hoffenheim), Elye Wahi (Nice), Ange-Yoan Bonny (Inter Milan)",
    },
  },
  {
    group: "E",
    team: "Curacao",
    captain: "Leandro Bacuna",
    coach: "Dick Advocaat",
    status: "Final squad revealed May 18.",
    roster: {
      Goalkeeper: "Eloy Room (Miami FC), Trevor Doornbusch (VVV-Venlo), Tyrick Bodak (Telstar)",
      Defender: "Jurien Gaari (Abha), Roshon van Eijma (RKC Waalwijk), Sherel Floranus (PEC Zwolle), Joshua Brenet (Kayserispor), Shurandy Sambo (Sparta Rotterdam), Armando Obispo (PSV Eindhoven), Riechedly Bazoer (Konyaspor), Deveron Fonville (NEC)",
      Midfielder: "Leandro Bacuna (Igdir, captain), Juninho Bacuna (Volendam), Godfried Roemeratoe (RKC Waalwijk), Kevin Felida (Den Bosch), Livano Comenencia (Zurich), Ar'jany Martha (Rotherham United), Tyrese Noslin (Telstar)",
      Forward: "Kenji Gorre (Maccabi Haifa), Brandley Kuwas (Volendam), Gervane Kastaneer (Terengganu), Jeremy Antonisse (Kifisia), Jearl Margaritha (Beveren), Jurgen Locadia (Miami FC), Sontje Hansen (Middlesbrough), Tahith Chong (Sheffield United)",
    },
  },
  {
    group: "F",
    team: "Netherlands",
    captain: "Virgil van Dijk",
    coach: "Ronald Koeman",
    status: "Final squad set for May 27.",
    roster: {
      Goalkeeper: "Bart Verbruggen (Brighton & Hove Albion), Mark Flekken (Bayer Leverkusen), Robin Roefs (Sunderland)",
      Defender: "Virgil van Dijk (Liverpool, captain), Denzel Dumfries (Inter Milan), Nathan Ake (Manchester City), Jurrien Timber (Arsenal), Micky van de Ven (Tottenham Hotspur), Jan Paul van Hecke (Brighton & Hove Albion), Jorrel Hato (Chelsea)",
      Midfielder: "Frenkie de Jong (Barcelona), Marten de Roon (Atalanta), Tijjani Reijnders (Manchester City), Teun Koopmeiners (Juventus), Ryan Gravenberch (Liverpool), Mats Wieffer (Brighton & Hove Albion), Quinten Timber (Marseille), Guus Til (PSV Eindhoven), Crysencio Summerville (West Ham United)",
      Forward: "Memphis Depay (Corinthians), Wout Weghorst (Ajax), Donyell Malen (Roma), Cody Gakpo (Liverpool), Noa Lang (Galatasaray), Justin Kluivert (Bournemouth), Brian Brobbey (Sunderland)",
    },
  },
  {
    group: "F",
    team: "Japan",
    captain: "Wataru Endo",
    coach: "Hajime Moriyasu",
    status: "Final squad revealed May 15.",
    roster: {
      Goalkeeper: "Zion Suzuki (Parma), Keisuke Osako (Sanfrecce Hiroshima), Tomoki Hayakawa (Kashima Antlers)",
      Defender: "Yuto Nagatomo (FC Tokyo), Takehiro Tomiyasu (Ajax), Ko Itakura (Ajax), Shogo Taniguchi (Sint-Truiden), Hiroki Ito (Bayern Munich), Yukinari Sugawara (Werder Bremen), Ayumu Seko (Le Havre), Tsuyoshi Watanabe (Feyenoord), Junnosuke Suzuki (Copenhagen)",
      Midfielder: "Wataru Endo (Liverpool, captain), Junya Ito (Genk), Ritsu Doan (Eintracht Frankfurt), Daichi Kamada (Crystal Palace), Takefusa Kubo (Real Sociedad), Ao Tanaka (Leeds United), Keito Nakamura (Reims), Kaishu Sano (Mainz 05)",
      Forward: "Ayase Ueda (Feyenoord), Daizen Maeda (Celtic), Koki Ogawa (NEC), Yuito Suzuki (SC Freiburg), Keisuke Goto (Sint-Truiden), Kento Shiogai (VfL Wolfsburg)",
    },
  },
  {
    group: "F",
    team: "Tunisia",
    captain: "Ellyes Skhiri",
    coach: "Sabri Lamouchi",
    status: "Final squad revealed May 15.",
    roster: {
      Goalkeeper: "Aymen Dahmen (CS Sfaxien), Sabri Ben Hessen (Etoile du Sahel), Mouhib Chamakh (Club Africain)",
      Defender: "Montassar Talbi (Lorient), Dylan Bronn (Servette), Ali Abdi (Nice), Yan Valery (Young Boys), Mohamed Amine Ben Hamida (Esperance de Tunis), Moutaz Neffati (IFK Norrkoping), Omar Rekik (Maribor), Adem Arous (Kasimpasa), Raed Chikhaoui (US Monastir)",
      Midfielder: "Ellyes Skhiri (Eintracht Frankfurt, captain), Hannibal Mejbri (Burnley), Anis Ben Slimane (Norwich City), Mortadha Ben Ouanes (Kasimpasa), Ismael Gharbi (FC Augsburg), Hadj Mahmoud (Lugano), Rani Khedira (Union Berlin)",
      Forward: "Elias Achouri (Copenhagen), Firas Chaouat (Club Africain), Hazem Mastouri (Dynamo Makhachkala), Elias Saad (Hannover 96), Sebastian Tounekti (Celtic), Khalil Ayari (Paris Saint-Germain), Rayan Elloumi (Vancouver Whitecaps FC)",
    },
  },
  {
    group: "F",
    team: "Sweden",
    captain: "Victor Lindelof",
    coach: "Graham Potter",
    status: "Final lineup revealed May 12. Provided roster data mirrors Qatar player names.",
    roster: {
      Goalkeeper: "Meshaal Barsham (Al-Sadd), Salah Zakaria (Al-Duhail), Mahmud Abunada (Al-Rayyan), Shehab Ellethy (Al-Shahaniya)",
      Defender: "Boualem Khoukhi (Al-Sadd), Pedro Miguel (Al-Sadd), Tarek Salman (Al-Sadd), Bassam Al-Rawi (Al-Duhail), Homam Ahmed (Cultural Leonesa), Lucas Mendes (Al-Wakrah), Sultan Al-Brake (Al-Duhail), Al-Hashmi Al-Hussain (Al-Arabi), Ayoub Al-Oui (Al-Gharafa), Issa Laye (Al-Arabi), Niall Mason (Qatar SC), Rayyan Al-Ali (Al-Gharafa)",
      Midfielder: "Abdulaziz Hatem (Al-Rayyan), Karim Boudiaf (Al-Duhail), Assim Madibo (Al-Wakrah), Mohammed Waad (Al-Shamal), Ahmed Fathy (Al-Arabi), Jassem Gaber (Al-Rayyan), Mohamed Al-Mannai (Al-Shamal), Tahsin Jamshid (Al-Duhail)",
      Forward: "Hassan Al-Haydos (Al-Sadd, captain), Sebastian Soria (Qatar SC), Akram Afif (Al-Sadd), Almoez Ali (Al-Duhail), Mohammed Muntari (Al-Gharafa), Ahmed Alaaeldin (Al-Rayyan), Yusuf Abdurisag (Al-Wakrah), Edmilson Junior (Al-Duhail), Ahmed Al-Ganehi (Al-Gharafa), Mubarak Shanan (Al-Duhail)",
    },
  },
  {
    group: "G",
    team: "Belgium",
    captain: "Youri Tielemans",
    coach: "Rudi Garcia",
    status: "Final squad revealed May 15.",
    roster: {
      Goalkeeper: "Thibaut Courtois (Real Madrid), Senne Lammens (Manchester United), Mike Penders (Strasbourg)",
      Defender: "Thomas Meunier (Lille), Timothy Castagne (Fulham), Arthur Theate (Eintracht Frankfurt), Zeno Debast (Sporting CP), Maxim De Cuyper (Brighton & Hove Albion), Brandon Mechele (Club Brugge), Koni De Winter (Milan), Joaquin Seys (Club Brugge), Nathan Ngoy (Lille)",
      Midfielder: "Axel Witsel (Girona), Kevin De Bruyne (Napoli), Youri Tielemans (Aston Villa, captain), Hans Vanaken (Club Brugge), Amadou Onana (Aston Villa), Nicolas Raskin (Rangers)",
      Forward: "Romelu Lukaku (Napoli), Leandro Trossard (Arsenal), Jeremy Doku (Manchester City), Dodi Lukebakio (Benfica), Charles De Ketelaere (Atalanta), Alexis Saelemaekers (Milan), Diego Moreira (Strasbourg), Matias Fernandez-Pardo (Lille)",
    },
  },
  {
    group: "G",
    team: "Iran",
    captain: "Alireza Jahanbakhsh",
    coach: "Amir Ghalenoei",
    status: "30-man preliminary squad unveiled May 17; final roster set for June 1.",
    roster: {
      Goalkeeper: "Alireza Beiranvand (Tractor), Payam Niazmand (Persepolis), Hossein Hosseini (Sepahan), Mohammad Khalife (Aluminium Arak)",
      Defender: "Ehsan Hajsafi (Sepahan), Milad Mohammadi (Persepolis), Ramin Rezaeian (Foolad), Hossein Kanaanizadegan (Persepolis), Shojae Khalilzadeh (Tractor), Saleh Hardani (Esteghlal), Ali Nemati (Foolad), Aria Yousefi (Sepahan), Danial Eiri (Malavan)",
      Midfielder: "Alireza Jahanbakhsh (Dender), Saeid Ezatolahi (Shabab Al-Ahli), Saman Ghoddos (Kalba), Mehdi Torabi (Tractor), Rouzbeh Cheshmi (Esteghlal), Omid Noorafkan (Sepahan), Mohammad Mohebi (Rostov), Mohammad Ghorbani (Al-Wahda), Amirmohammad Razzaghinia (Esteghlal), Hadi Habibinejad (Chadormalou)",
      Forward: "Mehdi Taremi (Olympiacos), Mehdi Ghayedi (Al-Nasr), Amirhossein Hosseinzadeh (Tractor), Ali Alipour (Persepolis), Kasra Taheri (Paykan), Amirhossein Mahmoudi (Persepolis), Dennis Eckert (Standard Liege)",
    },
  },
  {
    group: "G",
    team: "Egypt",
    captain: "Mohamed Salah",
    coach: "Hossam Hassan",
    status: "27-player preliminary squad announced May 20; final squad set for May 29.",
    roster: {
      Goalkeeper: "Mohamed El Shenawy (Al Ahly), Mostafa Shobeir (Al Ahly), Mohamed Alaa (El Gouna), El Mahdy Soliman (Zamalek)",
      Defender: "Hamdy Fathy (Al-Wakrah), Ramy Rabia (Al Ain), Mohamed Hany (Al Ahly), Ahmed Abou El Fotouh (Zamalek), Mohamed Abdelmonem (Nice), Yasser Ibrahim (Al Ahly), Hossam Abdelmaguid (Zamalek), Karim Hafez (Pyramids), Tarek Alaa (ZED)",
      Midfielder: "Marwan Attia (Al Ahly), Emam Ashour (Al Ahly), Mohanad Lasheen (Pyramids), Mahmoud Saber (ZED), Nabil Emad (Al-Najma), Mostafa Ziko (Pyramids)",
      Forward: "Mohamed Salah (Liverpool, captain), Trezeguet (Al Ahly), Zizo (Al Ahly), Omar Marmoush (Manchester City), Ibrahim Adel (Nordsjaelland), Haissem Hassan (Oviedo), Aqtay Abdallah (ENPPI), Hamza Abdelkarim (Barcelona B)",
    },
  },
  {
    group: "G",
    team: "New Zealand",
    captain: "Chris Wood",
    coach: "Darren Bazeley",
    status: "Final squad revealed May 14.",
    roster: {
      Goalkeeper: "Max Crocombe (Millwall), Alex Paulsen (Lechia Gdansk), Michael Woud (Auckland FC)",
      Defender: "Tim Payne (Wellington Phoenix), Francis de Vries (Auckland FC), Tyler Bindon (Sheffield United), Michael Boxall (Minnesota United FC), Liberato Cacace (Wrexham), Nando Pijnaker (Auckland FC), Finn Surman (Portland Timbers), Callan Elliot (Auckland FC), Tommy Smith (Braintree Town)",
      Midfielder: "Joe Bell (Viking), Matthew Garbett (Peterborough United), Marko Stamenic (Swansea City), Sarpreet Singh (Wellington Phoenix), Elijah Just (Motherwell), Alex Rufer (Wellington Phoenix), Ben Old (Saint-Etienne), Callum McCowatt (Silkeborg), Ryan Thomas (PEC Zwolle), Lachlan Bayliss (Newcastle Jets)",
      Forward: "Chris Wood (Nottingham Forest, captain), Kosta Barbarouses (Western Sydney Wanderers), Ben Waine (Port Vale), Jesse Randall (Auckland FC)",
    },
  },
  {
    group: "H",
    team: "Spain",
    captain: "Rodri",
    coach: "Luis de la Fuente",
    status: "Final squad announced May 25.",
    roster: {
      Goalkeeper: "Unai Simon (Athletic Bilbao), David Raya (Arsenal), Joan Garcia (Barcelona)",
      Defender: "Aymeric Laporte (Athletic Bilbao), Marc Cucurella (Chelsea), Marcos Llorente (Atletico Madrid), Eric Garcia (Barcelona), Pedro Porro (Tottenham Hotspur), Alex Grimaldo (Bayer Leverkusen), Pau Cubarsi (Barcelona), Marc Pubill (Atletico Madrid)",
      Midfielder: "Rodri (Manchester City, captain), Mikel Merino (Arsenal), Fabian Ruiz (Paris Saint-Germain), Pedri (Barcelona), Gavi (Barcelona), Martin Zubimendi (Arsenal), Alex Baena (Atletico Madrid)",
      Forward: "Ferran Torres (Barcelona), Mikel Oyarzabal (Real Sociedad), Dani Olmo (Barcelona), Nico Williams (Athletic Bilbao), Lamine Yamal (Barcelona), Yeremy Pino (Crystal Palace), Borja Iglesias (Celta Vigo), Victor Munoz (Osasuna)",
    },
  },
  {
    group: "H",
    team: "Uruguay",
    captain: "Jose Gimenez",
    coach: "Marcelo Bielsa",
    roster: {
      Goalkeeper: "Sergio Rochet (Internacional), Fernando Muslera (Estudiantes), Santiago Mele (Monterrey)",
      Defender: "Guillermo Varela (Flamengo), Ronald Araujo (Barcelona), Jose Maria Gimenez (Atletico Madrid), Santiago Bueno (Wolves), Sebastian Caceres (Club America), Mathias Olivera (Napoli), Joaquin Piquerez (Palmeiras), Matias Vina (River Plate, on loan from Flamengo)",
      Midfielder: "Manuel Ugarte (Manchester United), Emiliano Martinez (Palmeiras), Rodrigo Bentancur (Tottenham Hotspur), Federico Valverde (Real Madrid), Agustin Canobbio (Fluminese), Juan Manuel Sanabria (Real Salt Lake), Giorgian de Arrascaeta (Fluminese), Nicolas de la Cruz (Flamengo), Rodrigo Zalazar (Braga), Facundo Pellistri (Panathinaikos), Maximiliano Araujo (Sporting CP), Brian Rodriguez (Club America)",
      Forward: "Rodrigo Aguirre (Tigres), Federico Vinas (Real Oviedo), Darwin Nunez (Al Hilal)",
    },
  },
  {
    group: "H",
    team: "Saudi Arabia",
    captain: "Salem Al-Dawsari",
    coach: "Georgios Donis",
    status: "30-man preliminary squad set for May 23.",
    roster: {
      Goalkeeper: "Nawaf Al-Aqidi (Al-Nassr), Mohammed Al-Owais (Al-Ula), Ahmed Al-Kassar (Al-Qadsiah)",
      Defender: "Saud Abdulhamid (Lens), Ali Majrashi (Al-Ahli), Ali Lajami (Al-Hilal), Abdulelah Al-Amri (Al-Nassr), Hassan Al-Tambakti (Al-Hilal), Nawaf Boushal (Al-Nassr), Hassan Kadesh (Al-Ittihad), Moteb Al-Harbi (Al-Hilal), Jehad Thakri (Al-Qadsiah), Mohammed Abu Al-Shamat (Al-Qadsiah)",
      Midfielder: "Mohamed Kanno (Al-Hilal), Nasser Al-Dawsari (Al-Hilal), Musab Al-Juwayr (Al-Qadsiah), Abdullah Al-Khaibari (Al-Nassr), Ziyad Al-Johani (Al-Ahli), Alaa Al-Hejji (Neom)",
      Forward: "Salem Al-Dawsari (captain, Al-Hilal), Firas Al-Buraikan (Al-Ahli), Saleh Al-Shehri (Al-Ittihad), Ayman Yahya (Al-Nassr), Khalid Al-Ghannam (Al-Ettifaq), Abdullah Al-Hamdan (Al-Nassr), Sultan Mandash (Al-Hilal)",
    },
  },
  {
    group: "H",
    team: "Cape Verde",
    captain: "Ryan Mendes",
    coach: "Bubista",
    status: "Final squad revealed May 18.",
    roster: {
      Goalkeeper: "Vozinha (Chaves), Marcio Rosa (Montana), CJ dos Santos (San Diego)",
      Defender: "Stopira (Torreense), Roberto Lopes (Shamrock Rovers), Joao Paulo (FCSB), Diney (Al Bataeh), Logan Costa (Villarreal), Steven Moreira (Columbus Crew), Wagner Pina (Trabzonspor), Sidny Lopes Cabral (Benfica), Kelvin Pires (SJK)",
      Midfielder: "Jamiro Monteiro (PEC Zwolle), Kevin Pina (Krasnodar), Deroy Duarte (Ludogorets Razgrad), Telmo Arcanjo (Vitoria de Guimaraes), Laros Duarte (Puskas Akademia), Yannick Semedo (Farense)",
      Forward: "Ryan Mendes (Igdir, captain), Garry Rodrigues (Apollon Limassol), Willy Semedo (Omonia), Jovane Cabral (Estrela Amadora), Gilson Benchimol (Akron Tolyatti), Dailon Livramento (Casa Pia), Helio Varela (Maccabi Tel Aviv), Nuno da Costa (Istanbul Basaksehir)",
    },
  },
  {
    group: "I",
    team: "France",
    captain: "Kylian Mbappe",
    coach: "Didier Deschamps",
    status: "Final squad revealed May 14.",
    roster: {
      Goalkeeper: "Mike Maignan (Milan), Brice Samba (Rennes), Robin Risser (Lens)",
      Defender: "Lucas Digne (Aston Villa), Jules Kounde (Barcelona), Theo Hernandez (Al-Hilal), Lucas Hernandez (Paris Saint-Germain), Dayot Upamecano (Bayern Munich), William Saliba (Arsenal), Ibrahima Konate (Liverpool), Malo Gusto (Chelsea), Maxence Lacroix (Crystal Palace)",
      Midfielder: "N'Golo Kante (Fenerbahce), Adrien Rabiot (Milan), Aurelien Tchouameni (Real Madrid), Manu Kone (Roma), Warren Zaire-Emery (Paris Saint-Germain)",
      Forward: "Kylian Mbappe (Real Madrid, captain), Ousmane Dembele (Paris Saint-Germain), Marcus Thuram (Inter Milan), Bradley Barcola (Paris Saint-Germain), Michael Olise (Bayern Munich), Maghnes Akliouche (Monaco), Desire Doue (Paris Saint-Germain), Rayan Cherki (Manchester City), Jean-Philippe Mateta (Crystal Palace)",
    },
  },
  {
    group: "I",
    team: "Senegal",
    captain: "Kalidou Koulibaly",
    coach: "Pape Thiaw",
    status: "28-man preliminary squad set for May 21.",
    roster: {
      Goalkeeper: "Edouard Mendy (Al-Ahli), Mory Diaw (Le Havre), Yehvann Diouf (Nice)",
      Defender: "Kalidou Koulibaly (Al-Hilal, captain), Krepin Diatta (Monaco), Moussa Niakhate (Lyon), Ismail Jakobs (Galatasaray), Abdoulaye Seck (Maccabi Haifa), El Hadji Malick Diouf (West Ham United), Antoine Mendy (Nice), Mamadou Sarr (Chelsea), Ilay Camara (Anderlecht), Moustapha Mbow (Paris FC)",
      Midfielder: "Idrissa Gueye (Everton), Pape Gueye (Villarreal), Pape Matar Sarr (Tottenham Hotspur), Pathe Ciss (Rayo Vallecano), Lamine Camara (Monaco), Habib Diarra (Sunderland), Bara Sapoko Ndiaye (Bayern Munich)",
      Forward: "Sadio Mane (Al-Nassr), Ismaila Sarr (Crystal Palace), Iliman Ndiaye (Everton), Nicolas Jackson (Bayern Munich), Bamba Dieng (Lorient), Cherif Ndiaye (Samsunspor), Ibrahim Mbaye (Paris Saint-Germain), Assane Diao (Como)",
    },
  },
  {
    group: "I",
    team: "Norway",
    captain: "Martin Odegaard",
    coach: "Stale Solbakken",
    status: "Final squad set for May 21.",
    roster: {
      Goalkeeper: "Orjan Nyland (Sevilla), Sander Tangvik (Hamburger SV), Egil Selvik (Watford)",
      Defender: "Kristoffer Ajer (Brentford), Leo Ostigard (Genoa), David Moller Wolfe (Wolverhampton Wanderers), Fredrik Andre Bjorkan (Bodo/Glimt), Marcus Holmgren Pedersen (Torino), Torbjorn Heggem (Bologna), Sondre Langas (Derby County), Henrik Falchener (Viking), Julian Ryerson (Borussia Dortmund)",
      Midfielder: "Morten Thorsby (Cremonese), Patrick Berg (Bodo/Glimt), Sander Berge (Fulham), Martin Odegaard (Arsenal, captain), Fredrik Aursnes (Benfica), Kristian Thorstvedt (Sassuolo), Thelo Aasgaard (Rangers), Antonio Nusa (RB Leipzig), Andreas Schjelderup (Benfica), Oscar Bobb (Fulham), Jens Petter Hauge (Bodo/Glimt)",
      Forward: "Alexander Sorloth (Atletico Madrid), Erling Haaland (Manchester City), Jorgen Strand Larsen (Crystal Palace)",
    },
  },
  {
    group: "I",
    team: "Iraq",
    captain: "Jalal Hassan",
    coach: "Graham Arnold",
    status: "34-man preliminary squad revealed May 19; final lineup announced June 1.",
    roster: {
      Goalkeeper: "Jalal Hassan (captain, Al-Zawraa), Fahad Talib (Al-Talaba), Ahmed Basil (Al-Shorta)",
      Defender: "Rebin Sulaka (Port), Hussein Ali (Pogon Szczecin), Zaid Tahseen (Pakhtakor), Akam Hashim (Al-Zawraa), Manaf Younis (Al-Shorta), Ahmed Yahya (Al-Shorta), Merchas Doski (Viktoria Plzen), Mustafa Saadoon (Al-Shorta), Frans Putros (Persib)",
      Midfielder: "Ibrahim Bayesh (Al Dhafra), Youssef Amyn (AEK Larnaca), Zidane Iqbal (Utrecht), Amir Al-Ammari (Cracovia), Kevin Yakob (AGF), Aimar Sher (Sarpsborg 08), Zaid Ismail (Al-Talaba)",
      Forward: "Aymen Hussein (Al-Karma), Mohanad Ali (Dibba), Ali Al-Hamadi (Luton Town), Ali Jasim (Al-Najma), Ahmed Qasem (Nashville SC), Ali Yousif (Al-Talaba), Marko Farji (Venezia)",
    },
  },
  {
    group: "J",
    team: "Argentina",
    captain: "Lionel Messi",
    coach: "Lionel Scaloni",
    status: "55-man preliminary squad announced May 11; final 26-man squad revealed May 28.",
    roster: {
      Goalkeeper: "Emiliano Martinez (Aston Villa), Geronimo Rulli (Marseille), Juan Musso (Atletico Madrid)",
      Defender: "Gonzalo Montiel (River Plate), Nahuel Molina (Atletico Madrid), Lisandro Martinez (Manchester United), Nicolas Otamendi (Benfica), Leonardo Balerdi (Marseille), Cristian Romero (Tottenham Hotspur), Facundo Medina (Marseille), Nicolas Tagliafico (Lyon)",
      Midfielder: "Leandro Paredes (Boca Juniors), Rodrigo de Paul (Inter Miami), Exequiel Palacios (Bayer Leverkusen), Enzo Fernandez (Chelsea), Alex Mac Allister (Liverpool), Giovani Lo Celso (Real Betis), Valentin Barco (Strasbourg)",
      Forward: "Lionel Messi (Inter Miami), Nicolas Paz (Como), Thiago Almada (Atletico Madrid), Giuliano Simeone (Atletico Madrid), Lautaro Martinez (Inter), Jose Manuel Lopez (Palmeiras), Julian Alvarez (Atletico Madrid), Nico Gonzalez (Atletico Madrid)",
    },
  },
  {
    group: "J",
    team: "Austria",
    captain: "David Alaba",
    coach: "Ralf Rangnick",
    status: "Final squad revealed May 18.",
    roster: {
      Goalkeeper: "Alexander Schlager (Red Bull Salzburg), Florian Wiegele (Viktoria Plzen), Patrick Pentz (Brondby)",
      Defender: "David Affengruber (Elche), Kevin Danso (Tottenham Hotspur), Stefan Posch (Mainz 05), David Alaba (Real Madrid, captain), Philipp Lienhart (SC Freiburg), Phillipp Mwene (Mainz 05), Alexander Prass (TSG Hoffenheim), Marco Friedl (Werder Bremen), Michael Svoboda (Venezia)",
      Midfielder: "Xaver Schlager (RB Leipzig), Nicolas Seiwald (RB Leipzig), Marcel Sabitzer (Borussia Dortmund), Florian Grillitsch (Braga), Carney Chukwuemeka (Borussia Dortmund), Romano Schmid (Werder Bremen), Christoph Baumgartner (RB Leipzig), Konrad Laimer (Bayern Munich), Patrick Wimmer (VfL Wolfsburg), Paul Wanner (PSV Eindhoven), Alessandro Schopf (Wolfsberger AC)",
      Forward: "Marko Arnautovic (Red Star Belgrade), Michael Gregoritsch (FC Augsburg), Sasa Kalajdzic (LASK)",
    },
  },
  {
    group: "J",
    team: "Algeria",
    captain: "Riyad Mahrez",
    coach: "Vladimir Petkovic",
    status: "Final squad set for May 31. Provided text listed David Alaba as captain; roster marks Riyad Mahrez as captain.",
    roster: {
      Goalkeeper: "Melvin Mastil (Stade Nyonnais), Oussama Benbot (USM Alger), Luca Zidane (Granada)",
      Defender: "Aissa Mandi (Lille), Achref Abada (USM Alger), Mohamed Amine Tougai (Esperance de Tunis), Zineddine Belaid (JS Kabylie), Jaouen Hadjam (Young Boys), Rayan Ait-Nouri (Manchester City), Rafik Belghali (Hellas Verona), Ramy Bensebaini (Borussia Dortmund), Samir Chergui (Paris FC)",
      Midfielder: "Ramiz Zerrouki (Twente), Houssem Aouar (Al-Ittihad), Fares Chaibi (Eintracht Frankfurt), Hicham Boudaoui (Nice), Nabil Bentaleb (Lille), Ibrahim Maza (Bayer Leverkusen), Yacine Titraoui (Charleroi)",
      Forward: "Riyad Mahrez (captain, Al-Ahli), Amine Gouiri (Marseille), Anis Hadj Moussa (Feyenoord), Mohamed Amoura (VfL Wolfsburg), Adil Boulbina (Al-Duhail), Nadhir Benbouali (Gyori ETO), Fares Ghedjemis (Frosinone)",
    },
  },
  {
    group: "J",
    team: "Jordan",
    captain: "Ihsan Haddad",
    coach: "Jamal Sellami",
    status: "30-man preliminary squad revealed May 17; final squad announced June 2.",
    roster: {
      Goalkeeper: "Yazeed Abulaila (Al-Hussein), Nour Bani Attiah (Al-Faisaly), Abdallah Al-Fakhouri (Al-Wehdat)",
      Defender: "Ihsan Haddad (captain, Al-Hussein), Yazan Al-Arab (FC Seoul), Abdallah Nasib (Al-Zawraa), Mohammad Abu Hashish (Al-Karma), Husam Abu Dahab (Al-Faisaly), Mo Abualnadi (Selangor), Salim Obaid (Al-Hussein), Saed Al-Rosan (Al-Hussein), Anas Badawi (Al-Faisaly)",
      Midfielder: "Noor Al-Rawabdeh (Selangor), Rajaei Ayed (Al-Hussein), Ibrahim Sadeh (Al-Karma), Mohannad Abu Taha (Al-Quwa Al-Jawiya), Nizar Al-Rashdan (Qatar SC), Amer Jamous (Al-Zawraa), Mohammad Al-Dawoud (Al-Wehdat)",
      Forward: "Musa Al-Taamari (Rennes), Ali Olwan (Al-Sailiya), Mahmoud Al-Mardi (Al-Hussein), Mohammad Abu Zrayq (Raja Casablanca), Odeh Al-Fakhouri (Pyramids), Ali Azaizeh (Al-Shabab)",
    },
  },
  {
    group: "K",
    team: "Portugal",
    captain: "Cristiano Ronaldo",
    coach: "Roberto Martinez",
    status: "Final squad revealed May 19.",
    roster: {
      Goalkeeper: "Diogo Costa (Porto), Jose Sa (Wolverhampton Wanderers), Rui Silva (Sporting CP)",
      Defender: "Ruben Dias (Manchester City), Joao Cancelo (Barcelona), Nelson Semedo (Fenerbahce), Nuno Mendes (Paris Saint-Germain), Diogo Dalot (Manchester United), Goncalo Inacio (Sporting CP), Matheus Nunes (Manchester City), Renato Veiga (Villarreal), Tomas Araujo (Benfica)",
      Midfielder: "Bernardo Silva (Manchester City), Bruno Fernandes (Manchester United), Ruben Neves (Al-Hilal), Vitinha (Paris Saint-Germain), Joao Neves (Paris Saint-Germain), Samu Costa (Mallorca)",
      Forward: "Cristiano Ronaldo (Al-Nassr, captain), Joao Felix (Al-Nassr), Rafael Leao (Milan), Goncalo Guedes (Real Sociedad), Goncalo Ramos (Paris Saint-Germain), Pedro Neto (Chelsea), Francisco Trincao (Sporting CP), Francisco Conceicao (Juventus)",
    },
  },
  {
    group: "K",
    team: "Colombia",
    captain: "James Rodriguez",
    coach: "Nestor Lorenzo",
    status: "55-player preliminary squad announced May 14; final squad set for May 25.",
    roster: {
      Goalkeeper: "Camilo Vargas (Atlas), David Ospina (Atletico Nacional), Alvaro Montero (Velez Sarsfield)",
      Defender: "Daniel Munoz (Crystal Palace), Santiago Arias (Independiente), Davinson Sanchez (Galatasaray), Jhon Lucumi (Bologna), Yerry Mina (Cagliari), Willer Ditta (Cruz Azul), Johan Mojica (Mallorca), Deiver Machado (Nantes)",
      Midfielder: "Jefferson Lerma (Crystal Palace), Richard Rios (Benfica), Jhon Arias (Palmeiras), Kevin Castano, Juan Fernando Quintero (River Plate), Juan Camilo Portilla (Athletico Paranaense), Gustavo Puerta (Racing Santander), James Rodriguez (Minnesota United), Jorge Carrascal (Flamengo), Jaminton Campaz (Rosario Central)",
      Forward: "Luis Diaz (Bayern Munich), Luis Suarez (Sporting), Jhon Cordoba (Krasnodar), Juan Camilo Hernandez (Betis), Carlos Andres Gomez (Vasco da Gama)",
    },
  },
  {
    group: "K",
    team: "Uzbekistan",
    captain: "Eldor Shomurodov",
    coach: "Fabio Cannavaro",
    status: "40-player preliminary squad revealed May 5; final squad revealed June 2.",
    roster: {
      Goalkeeper: "Utkir Yusupov (Navbahor Namangan), Abduvohid Nematov (Nasaf), Botirali Ergashev (Neftchi Fergana)",
      Defender: "Abdukodir Khusanov (Manchester City), Khojiakbar Alijonov (Pakhtakor), Farrukh Sayfiev (Neftchi Fergana), Rustam Ashurmatov (Esteghlal), Sherzod Nasrullaev (Nasaf), Umar Eshmurodov (Nasaf), Abdulla Abdullaev (Dibba), Bekhruz Karimov (Surkhon Termiz), Avazbek Ulmasaliev (AGMK), Jakhongir Urozov (Dinamo Samarqand)",
      Midfielder: "Otabek Shukurov (Baniyas), Jaloliddin Masharipov (Esteghlal), Odiljon Hamrobekov (Tractor), Oston Urunov (Persepolis), Akmal Mozgovoy (Pakhtakor), Jamshid Iskanderov (Neftchi Fergana), Dostonbek Khamdamov (Pakhtakor), Azizjon Ganiev (Al Bataeh), Abbosbek Fayzullaev (Istanbul Basaksehir), Sherzod Esanov (Bukhara)",
      Forward: "Eldor Shomurodov (captain, Istanbul Basaksehir), Igor Sergeev (Persepolis), Azizbek Amonov (Dinamo Samarqand)",
    },
  },
  {
    group: "K",
    team: "DR Congo",
    captain: "Chancel Mbemba",
    coach: "Sebastien Desabre",
    status: "Final squad revealed May 18.",
    roster: {
      Goalkeeper: "Lionel Mpasi (Le Havre), Timothy Fayulu (Noah), Matthieu Epolo (Standard Liege)",
      Defender: "Chancel Mbemba (Lille, captain), Arthur Masuaku (Lens), Gedeon Kalulu (Aris Limassol), Joris Kayembe (Genk), Dylan Batubinsika (AEL), Axel Tuanzebe (Burnley), Aaron Wan-Bissaka (West Ham United), Rocky Bushiri (Hibernian), Steve Kapuadi (Widzew Lodz)",
      Midfielder: "Meschak Elia (Alanyaspor), Samuel Moutoussamy (Atromitos), Edo Kayembe (Watford), Charles Pickel (Espanyol), Gael Kakuta (AEL), Noah Sadiki (Sunderland), Nathanael Mbuku (Montpellier), Ngal'ayel Mukau (Lille), Brian Cipenga (Castellon)",
      Forward: "Cedric Bakambu (Real Betis), Theo Bongonda (Spartak Moscow), Fiston Mayele (Pyramids), Yoane Wissa (Newcastle United), Simon Banza (Al Jazira)",
    },
  },
  {
    group: "L",
    team: "England",
    captain: "Harry Kane",
    coach: "Thomas Tuchel",
    status: "Final squad set for May 22.",
    roster: {
      Goalkeeper: "Jordan Pickford (Everton), Dean Henderson (Crystal Palace), James Trafford (Manchester City)",
      Defender: "John Stones (Manchester City), Marc Guehi (Manchester City), Reece James (Chelsea), Ezri Konsa (Aston Villa), Dan Burn (Newcastle United), Tino Livramento (Newcastle United), Djed Spence (Tottenham Hotspur), Nico O'Reilly (Manchester City), Jarell Quansah (Bayer Leverkusen)",
      Midfielder: "Jordan Henderson (Brentford), Declan Rice (Arsenal), Jude Bellingham (Real Madrid), Morgan Rogers (Aston Villa), Kobbie Mainoo (Manchester United), Elliot Anderson (Nottingham Forest)",
      Forward: "Harry Kane (Bayern Munich, captain), Marcus Rashford (Barcelona), Bukayo Saka (Arsenal), Ollie Watkins (Aston Villa), Anthony Gordon (Newcastle United), Eberechi Eze (Arsenal), Noni Madueke (Arsenal), Ivan Toney (Al-Ahli)",
    },
  },
  {
    group: "L",
    team: "Croatia",
    captain: "Luka Modric",
    coach: "Zlatko Dalic",
    status: "Final squad revealed May 18.",
    roster: {
      Goalkeeper: "Dominik Livakovic (Dinamo Zagreb), Dominik Kotarski (Copenhagen), Ivor Pandur (Hull City)",
      Defender: "Josko Gvardiol (Manchester City), Duje Caleta-Car (Real Sociedad), Josip Sutalo (Ajax), Josip Stanisic (Bayern Munich), Marin Pongracic (Fiorentina), Martin Erlic (Midtjylland), Luka Vuskovic (Hamburger SV)",
      Midfielder: "Luka Modric (Milan, captain), Mateo Kovacic (Manchester City), Mario Pasalic (Atalanta), Nikola Vlasic (Torino), Luka Sucic (Real Sociedad), Martin Baturina (Como), Kristijan Jakic (FC Augsburg), Petar Sucic (Inter Milan), Nikola Moro (Bologna), Toni Fruk (Rijeka)",
      Forward: "Ivan Perisic (PSV Eindhoven), Andrej Kramaric (TSG Hoffenheim), Ante Budimir (Osasuna), Marco Pasalic (Orlando City), Petar Musa (FC Dallas), Igor Matanovic (SC Freiburg)",
    },
  },
  {
    group: "L",
    team: "Panama",
    captain: "Anibal Godoy",
    coach: "Thomas Christiansen",
    status: "Final squad set for May 26.",
    roster: {
      Goalkeeper: "Luis Mejia (Nacional), Orlando Mosquera (Al-Fayha), Cesar Samudio (Marathon)",
      Defender: "Eric Davis (Plaza Amador), Fidel Escobar (Saprissa), Michael Amir Murillo (Besiktas), Roderick Miller (Turan Tovuz), Andres Andrade (LASK), Cesar Blackman (Slovan Bratislava), Jose Cordoba (Norwich City), Jiovany Ramos (Puerto Cabello), Jorge Gutierrez (Deportivo La Guaira), Edgardo Farina (Pari Nizhny Novgorod)",
      Midfielder: "Anibal Godoy (San Diego, captain), Alberto Quintero (Plaza Amador), Yoel Barcenas (Mazatlan), Adalberto Carrasquilla (UNAM), Jose Luis Rodriguez (Juarez), Cristian Martinez (Ironi Kiryat Shmona), Cesar Yanis (Cobresal), Carlos Harvey (Minnesota United FC), Azarias Londono (Universidad Catolica)",
      Forward: "Jose Fajardo (Universidad Catolica), Ismael Diaz (Leon), Cecilio Waterman (Universidad de Concepcion), Tomas Rodriguez (Saprissa)",
    },
  },
  {
    group: "L",
    team: "Ghana",
    captain: "Jordan Ayew",
    coach: "Carlos Queiroz",
    status: "28-player preliminary squad announced May 25; final squad revealed June 1.",
    roster: {
      Goalkeeper: "Benjamin Asare (Accra Hearts of Oak), Lawrence Ati-Zigi (St. Gallen), Joseph Anang (St. Patrick's Athletic)",
      Defender: "Baba Abdul Rahman (PAOK), Derrick Luckassen (Pafos), Gideon Mensah (Auxerre), Marvin Senaya (Auxerre), Alidu Seidu (Rennes), Abdul Mumin (Rayo Vallecano), Jerome Opoku (Istanbul Basaksehir), Jonas Adjetey (VfL Wolfsburg), Kojo Oppong Peprah (OGC Nice)",
      Midfielder: "Thomas Partey (Villarreal), Kamaldeen Sulemana (Atalanta BC), Kwasi Sibo (Real Oviedo), Augustine Boakye (Saint-Etienne), Caleb Yirenkyi (FC Nordsjaelland), Abdul Fatawu Issahaku (Leicester City), Elisha Owusu (Auxerre)",
      Forward: "Christopher Bonsu Baah (Al Qadsiah), Ernest Nuamah (Lyon), Antoine Semenyo (Manchester City), Brandon Thomas-Asante (Coventry City), Prince Kwabena Adu (Viktoria Plzen), Inaki Williams (Athletic Club), Jordan Ayew (Leicester City)",
    },
  },
];

const positions: WorldCupSquadPosition[] = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
];

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitPlayerEntries(value: string): string[] {
  const entries: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth = Math.max(0, depth - 1);

    if (char === "," && depth === 0) {
      if (current.trim()) entries.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) entries.push(current.trim());
  return entries;
}

function parseClubMeta(meta?: string): {
  club?: string;
  isCaptain: boolean;
  sharedClub?: string;
} {
  if (!meta) return { isCaptain: false };

  const isCaptain = /\bcaptain\b/i.test(meta);
  const withoutCaptain = meta
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/\bcaptain\b/i.test(part))
    .join(", ");
  const sharedClub = withoutCaptain.match(/^(?:all|both)\s+(.+)$/i)?.[1]?.trim();

  return {
    club: sharedClub ?? (withoutCaptain || undefined),
    isCaptain,
    sharedClub,
  };
}

function normalizeForCompare(value: string): string {
  return slugify(value).replace(/-/g, "");
}

function parsePlayerEntry(
  entry: string,
  position: WorldCupSquadPosition,
  seed: SquadSeed,
  index: number,
): WorldCupSquadPlayer {
  const teamId = slugify(seed.team);
  const match = entry.match(/^(.*?)\s*\((.*)\)$/);
  const name = (match?.[1] ?? entry).trim();
  const meta = parseClubMeta(match?.[2]);

  return {
    id: `${teamId}-${slugify(position)}-${index + 1}`,
    name_en: name,
    club_en: meta.club,
    position,
    team_id: teamId,
    team_name_en: seed.team,
    group: seed.group,
    is_captain:
      meta.isCaptain ||
      normalizeForCompare(name) === normalizeForCompare(seed.captain),
  };
}

function parsePlayers(
  seed: SquadSeed,
  position: WorldCupSquadPosition,
): WorldCupSquadPlayer[] {
  const entries = splitPlayerEntries(seed.roster[position]);
  const players = entries.map((entry, index) =>
    parsePlayerEntry(entry, position, seed, index),
  );
  const playersWithoutClubs: number[] = [];

  for (const [index, player] of players.entries()) {
    const entry = entries[index];
    const meta = parseClubMeta(entry.match(/^(.*?)\s*\((.*)\)$/)?.[2]);

    if (meta.sharedClub) {
      player.club_en = meta.sharedClub;
      for (const pendingIndex of playersWithoutClubs) {
        players[pendingIndex].club_en = meta.sharedClub;
      }
      playersWithoutClubs.length = 0;
      continue;
    }

    if (!player.club_en) {
      playersWithoutClubs.push(index);
    } else {
      playersWithoutClubs.length = 0;
    }
  }

  return players;
}

function buildSquad(seed: SquadSeed): WorldCupSquad {
  const players = positions.flatMap((position) => parsePlayers(seed, position));

  return {
    id: slugify(seed.team),
    team_name_en: seed.team,
    group: seed.group,
    captain_en: seed.captain,
    coach_en: seed.coach,
    status_en: seed.status,
    player_count: players.length,
    players,
  };
}

export const worldCupSquads = squadSeeds.map(buildSquad);

export const worldCupSquadPlayers = worldCupSquads.flatMap(
  (squad) => squad.players,
);

export const worldCupSquadsApiResponse = {
  meta: fanPulseMeta("/api/worldcup/squads", 86_400),
  groups: Array.from(new Set(worldCupSquads.map((squad) => squad.group))).sort(),
  squads: worldCupSquads,
  players: worldCupSquadPlayers,
};

