import type { Game, HeroSlide } from "@/types/game";

export const GAMES: Game[] = [
  // Trending Mobile Games
  {
    id: "1",
    name: "Mobile Legends",
    slug: "mobile-legends",
    category: "mobile",
    image: "/games/mobile-legends.webp",
    publisher: "Moonton",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
    trending: true,
  },
  {
    id: "2",
    name: "Genshin Impact",
    slug: "genshin-impact",
    category: "mobile",
    image: "/games/genshin-impact.webp",
    publisher: "miHoYo",
    price: { USD: 9.99, IDR: 159_000, EUR: 8.99 },
    trending: true,
    newRelease: false,
  },
  {
    id: "3",
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    category: "mobile",
    image: "/games/pubg-mobile.webp",
    publisher: "Krafton",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
    trending: true,
  },
  {
    id: "4",
    name: "Free Fire",
    slug: "free-fire",
    category: "mobile",
    image: "/games/free-fire.webp",
    publisher: "Garena",
    price: { USD: 2.99, IDR: 49_000, EUR: 2.79 },
    trending: true,
    hotDeal: true,
    discount: 20,
  },
  {
    id: "5",
    name: "Honor of Kings",
    slug: "honor-of-kings",
    category: "mobile",
    image: "/games/honor-of-kings.webp",
    publisher: "Tencent",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
    trending: true,
  },
  // PC Games
  {
    id: "6",
    name: "Valorant",
    slug: "valorant",
    category: "pc",
    image: "/games/valorant.webp",
    publisher: "Riot Games",
    price: { USD: 9.99, IDR: 159_000, EUR: 8.99 },
    newRelease: false,
  },
  {
    id: "7",
    name: "Steam Wallet",
    slug: "steam-wallet",
    category: "pc",
    image: "/games/steam.webp",
    publisher: "Valve",
    price: { USD: 10.0, IDR: 160_000, EUR: 9.0 },
    hotDeal: true,
  },
  {
    id: "8",
    name: "League of Legends",
    slug: "league-of-legends",
    category: "pc",
    image: "/games/lol.webp",
    publisher: "Riot Games",
    price: { USD: 9.99, IDR: 159_000, EUR: 8.99 },
  },
  {
    id: "9",
    name: "Fortnite",
    slug: "fortnite",
    category: "pc",
    image: "/games/fortnite.webp",
    publisher: "Epic Games",
    price: { USD: 7.99, IDR: 129_000, EUR: 7.49 },
    newRelease: true,
  },
  {
    id: "10",
    name: "Apex Legends",
    slug: "apex-legends",
    category: "pc",
    image: "/games/apex.webp",
    publisher: "EA",
    price: { USD: 9.99, IDR: 159_000, EUR: 8.99 },
  },
  // Console Games
  {
    id: "11",
    name: "PlayStation Store",
    slug: "playstation-store",
    category: "console",
    image: "/games/psn.webp",
    publisher: "Sony",
    price: { USD: 25.0, IDR: 400_000, EUR: 22.0 },
  },
  {
    id: "12",
    name: "Xbox Game Pass",
    slug: "xbox-game-pass",
    category: "console",
    image: "/games/xbox.webp",
    publisher: "Microsoft",
    price: { USD: 14.99, IDR: 239_000, EUR: 12.99 },
    newRelease: true,
  },
  {
    id: "13",
    name: "Nintendo eShop",
    slug: "nintendo-eshop",
    category: "console",
    image: "/games/nintendo.webp",
    publisher: "Nintendo",
    price: { USD: 20.0, IDR: 320_000, EUR: 18.0 },
  },
  // More Mobile Games
  {
    id: "14",
    name: "Clash of Clans",
    slug: "clash-of-clans",
    category: "mobile",
    image: "/games/coc.webp",
    publisher: "Supercell",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
  },
  {
    id: "15",
    name: "Clash Royale",
    slug: "clash-royale",
    category: "mobile",
    image: "/games/clash-royale.webp",
    publisher: "Supercell",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
  },
  {
    id: "16",
    name: "Call of Duty Mobile",
    slug: "cod-mobile",
    category: "mobile",
    image: "/games/cod-mobile.webp",
    publisher: "Activision",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
    newRelease: true,
  },
  {
    id: "17",
    name: "Roblox",
    slug: "roblox",
    category: "pc",
    image: "/games/roblox.webp",
    publisher: "Roblox Corp",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
  },
  {
    id: "18",
    name: "Minecraft",
    slug: "minecraft",
    category: "pc",
    image: "/games/minecraft.webp",
    publisher: "Mojang",
    price: { USD: 6.99, IDR: 109_000, EUR: 6.49 },
  },
  {
    id: "19",
    name: "Arena of Valor",
    slug: "arena-of-valor",
    category: "mobile",
    image: "/games/aov.webp",
    publisher: "Tencent",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
  },
  {
    id: "20",
    name: "Ragnarok X",
    slug: "ragnarok-x",
    category: "mobile",
    image: "/games/rox.webp",
    publisher: "Gravity",
    price: { USD: 4.99, IDR: 79_000, EUR: 4.49 },
    hotDeal: true,
    discount: 15,
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "1",
    title: "Flash Sale Weekend",
    subtitle: "Up to 50% off on selected game top-ups",
    image: "/hero/flash-sale.webp",
    ctaText: "Shop Now",
    ctaLink: "#trending",
    badge: "Limited Time",
  },
  {
    id: "2",
    title: "New Season Pass",
    subtitle: "Mobile Legends Season 32 is here",
    image: "/hero/mlbb-season.webp",
    ctaText: "Get Diamonds",
    ctaLink: "/game/mobile-legends",
  },
  {
    id: "3",
    title: "Genshin Impact 5.0",
    subtitle: "Unlock new characters with Genesis Crystals",
    image: "/hero/genshin-5.webp",
    ctaText: "Top Up Now",
    ctaLink: "/game/genshin-impact",
    badge: "New Update",
  },
];

export const getTrendingGames = (): Game[] => {
  return GAMES.filter((game) => game.trending).slice(0, 5);
};

export const getGamesByCategory = (
  category: "all" | "mobile" | "pc" | "console"
): Game[] => {
  if (category === "all") return GAMES;
  return GAMES.filter((game) => game.category === category);
};

export const getHotDeals = (): Game[] => {
  return GAMES.filter((game) => game.hotDeal);
};

export const getNewReleases = (): Game[] => {
  return GAMES.filter((game) => game.newRelease);
};

export const searchGames = (query: string): Game[] => {
  const lowerQuery = query.toLowerCase();
  return GAMES.filter(
    (game) =>
      game.name.toLowerCase().includes(lowerQuery) ||
      game.publisher.toLowerCase().includes(lowerQuery)
  );
};

export const getGameBySlug = (slug: string): Game | undefined => {
  return GAMES.find((game) => game.slug === slug);
};
