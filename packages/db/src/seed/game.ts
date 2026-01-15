import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { SqliteRemoteDatabase } from 'drizzle-orm/sqlite-proxy';
import * as schema from '../schema';

export type DrizzleInstance = LibSQLDatabase<typeof schema> | SqliteRemoteDatabase<typeof schema>;

// ============================================================================
// GAMES SEED DATA
// ============================================================================
const GAME_SEED_DATA = [
  {
    id: 'ml',
    name: 'Mobile Legends: Bang Bang',
    category: 'MOBA',
    slug: 'mobile-legends',
    isActive: true,
    logo: 'https://example.com/ml-logo.png',
    banner: 'https://example.com/ml-banner.png',
  },
  {
    id: 'ff',
    name: 'Free Fire',
    category: 'Battle Royale',
    slug: 'free-fire',
    isActive: true,
    logo: 'https://example.com/ff-logo.png',
    banner: 'https://example.com/ff-banner.png',
  },
  {
    id: 'mcgg',
    name: 'Magic Chess: Go Go',
    category: 'Strategy',
    slug: 'magic-chess-gogo',
    isActive: true,
    logo: 'https://example.com/mcgg-logo.png',
    banner: 'https://example.com/mcgg-banner.png',
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    category: 'Battle Royale',
    slug: 'pubg-mobile',
    isActive: true,
    logo: 'https://example.com/pubgm-logo.png',
    banner: 'https://example.com/pubgm-banner.png',
  },
  {
    id: 'bloodstrike',
    name: 'Blood Strike',
    category: 'FPS',
    slug: 'blood-strike',
    isActive: true,
    logo: 'https://example.com/bloodstrike-logo.png',
    banner: 'https://example.com/bloodstrike-banner.png',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    category: 'RPG',
    slug: 'genshin-impact',
    isActive: true,
    logo: 'https://example.com/genshin-logo.png',
    banner: 'https://example.com/genshin-banner.png',
  },
] as const;

// ============================================================================
// ITEMS SEED DATA
// ============================================================================
const ITEM_SEED_DATA = [
  // Mobile Legends Items
  { id: 'ml-diamond-86', gameId: 'ml', name: '86 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-172', gameId: 'ml', name: '172 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-257', gameId: 'ml', name: '257 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-344', gameId: 'ml', name: '344 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-429', gameId: 'ml', name: '429 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-514', gameId: 'ml', name: '514 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-706', gameId: 'ml', name: '706 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-878', gameId: 'ml', name: '878 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-diamond-1050', gameId: 'ml', name: '1050 Diamonds', logo: 'https://example.com/ml-diamond.png', category: 'Diamond' },
  { id: 'ml-twilight-pass', gameId: 'ml', name: 'Twilight Pass', logo: 'https://example.com/ml-pass.png', category: 'Pass' },
  { id: 'ml-starlight', gameId: 'ml', name: 'Starlight Member', logo: 'https://example.com/ml-starlight.png', category: 'Subscription' },

  // Free Fire Items
  { id: 'ff-diamond-100', gameId: 'ff', name: '100 Diamonds', logo: 'https://example.com/ff-diamond.png', category: 'Diamond' },
  { id: 'ff-diamond-210', gameId: 'ff', name: '210 Diamonds', logo: 'https://example.com/ff-diamond.png', category: 'Diamond' },
  { id: 'ff-diamond-530', gameId: 'ff', name: '530 Diamonds', logo: 'https://example.com/ff-diamond.png', category: 'Diamond' },
  { id: 'ff-diamond-1080', gameId: 'ff', name: '1080 Diamonds', logo: 'https://example.com/ff-diamond.png', category: 'Diamond' },
  { id: 'ff-diamond-2200', gameId: 'ff', name: '2200 Diamonds', logo: 'https://example.com/ff-diamond.png', category: 'Diamond' },
  { id: 'ff-weekly-membership', gameId: 'ff', name: 'Weekly Membership', logo: 'https://example.com/ff-membership.png', category: 'Subscription' },
  { id: 'ff-monthly-membership', gameId: 'ff', name: 'Monthly Membership', logo: 'https://example.com/ff-membership.png', category: 'Subscription' },
  { id: 'ff-level-up-pass', gameId: 'ff', name: 'Level Up Pass', logo: 'https://example.com/ff-pass.png', category: 'Pass' },

  // Magic Chess: Go Go Items
  { id: 'mcgg-diamond-100', gameId: 'mcgg', name: '100 Diamonds', logo: 'https://example.com/mcgg-diamond.png', category: 'Diamond' },
  { id: 'mcgg-diamond-250', gameId: 'mcgg', name: '250 Diamonds', logo: 'https://example.com/mcgg-diamond.png', category: 'Diamond' },
  { id: 'mcgg-diamond-500', gameId: 'mcgg', name: '500 Diamonds', logo: 'https://example.com/mcgg-diamond.png', category: 'Diamond' },
  { id: 'mcgg-diamond-1000', gameId: 'mcgg', name: '1000 Diamonds', logo: 'https://example.com/mcgg-diamond.png', category: 'Diamond' },
  { id: 'mcgg-season-pass', gameId: 'mcgg', name: 'Season Pass', logo: 'https://example.com/mcgg-pass.png', category: 'Pass' },
  { id: 'mcgg-premium-pass', gameId: 'mcgg', name: 'Premium Pass', logo: 'https://example.com/mcgg-pass.png', category: 'Pass' },

  // PUBG Mobile Items
  { id: 'pubgm-uc-60', gameId: 'pubgm', name: '60 UC', logo: 'https://example.com/pubgm-uc.png', category: 'UC' },
  { id: 'pubgm-uc-325', gameId: 'pubgm', name: '325 UC', logo: 'https://example.com/pubgm-uc.png', category: 'UC' },
  { id: 'pubgm-uc-660', gameId: 'pubgm', name: '660 UC', logo: 'https://example.com/pubgm-uc.png', category: 'UC' },
  { id: 'pubgm-uc-1800', gameId: 'pubgm', name: '1800 UC', logo: 'https://example.com/pubgm-uc.png', category: 'UC' },
  { id: 'pubgm-uc-3850', gameId: 'pubgm', name: '3850 UC', logo: 'https://example.com/pubgm-uc.png', category: 'UC' },
  { id: 'pubgm-uc-8100', gameId: 'pubgm', name: '8100 UC', logo: 'https://example.com/pubgm-uc.png', category: 'UC' },
  { id: 'pubgm-royale-pass', gameId: 'pubgm', name: 'Royale Pass', logo: 'https://example.com/pubgm-pass.png', category: 'Pass' },
  { id: 'pubgm-royale-pass-plus', gameId: 'pubgm', name: 'Royale Pass Plus', logo: 'https://example.com/pubgm-pass.png', category: 'Pass' },

  // Blood Strike Items
  { id: 'bs-gold-100', gameId: 'bloodstrike', name: '100 Gold', logo: 'https://example.com/bs-gold.png', category: 'Gold' },
  { id: 'bs-gold-300', gameId: 'bloodstrike', name: '300 Gold', logo: 'https://example.com/bs-gold.png', category: 'Gold' },
  { id: 'bs-gold-500', gameId: 'bloodstrike', name: '500 Gold', logo: 'https://example.com/bs-gold.png', category: 'Gold' },
  { id: 'bs-gold-1000', gameId: 'bloodstrike', name: '1000 Gold', logo: 'https://example.com/bs-gold.png', category: 'Gold' },
  { id: 'bs-gold-2000', gameId: 'bloodstrike', name: '2000 Gold', logo: 'https://example.com/bs-gold.png', category: 'Gold' },
  { id: 'bs-battle-pass', gameId: 'bloodstrike', name: 'Battle Pass', logo: 'https://example.com/bs-pass.png', category: 'Pass' },
  { id: 'bs-elite-pass', gameId: 'bloodstrike', name: 'Elite Pass', logo: 'https://example.com/bs-pass.png', category: 'Pass' },

  // Genshin Impact Items
  { id: 'genshin-genesis-60', gameId: 'genshin', name: '60 Genesis Crystals', logo: 'https://example.com/genshin-genesis.png', category: 'Genesis Crystal' },
  { id: 'genshin-genesis-300', gameId: 'genshin', name: '300 Genesis Crystals', logo: 'https://example.com/genshin-genesis.png', category: 'Genesis Crystal' },
  { id: 'genshin-genesis-980', gameId: 'genshin', name: '980 Genesis Crystals', logo: 'https://example.com/genshin-genesis.png', category: 'Genesis Crystal' },
  { id: 'genshin-genesis-1980', gameId: 'genshin', name: '1980 Genesis Crystals', logo: 'https://example.com/genshin-genesis.png', category: 'Genesis Crystal' },
  { id: 'genshin-genesis-3280', gameId: 'genshin', name: '3280 Genesis Crystals', logo: 'https://example.com/genshin-genesis.png', category: 'Genesis Crystal' },
  { id: 'genshin-genesis-6480', gameId: 'genshin', name: '6480 Genesis Crystals', logo: 'https://example.com/genshin-genesis.png', category: 'Genesis Crystal' },
  { id: 'genshin-welkin', gameId: 'genshin', name: 'Blessing of the Welkin Moon', logo: 'https://example.com/genshin-welkin.png', category: 'Subscription' },
  { id: 'genshin-battle-pass', gameId: 'genshin', name: 'Gnostic Hymn', logo: 'https://example.com/genshin-bp.png', category: 'Pass' },
  { id: 'genshin-battle-pass-bundle', gameId: 'genshin', name: 'Gnostic Chorus', logo: 'https://example.com/genshin-bp.png', category: 'Pass' },
] as const;

// ============================================================================
// ITEM DETAILS SEED DATA (Multi-country pricing)
// ============================================================================
const ITEM_DETAIL_SEED_DATA = [
  // Mobile Legends - Indonesia Pricing
  { id: 'ml-diamond-86-id', itemId: 'ml-diamond-86', countryCode: 'ID', symbol: 'Rp', price: 22000 },
  { id: 'ml-diamond-172-id', itemId: 'ml-diamond-172', countryCode: 'ID', symbol: 'Rp', price: 44000 },
  { id: 'ml-diamond-257-id', itemId: 'ml-diamond-257', countryCode: 'ID', symbol: 'Rp', price: 66000 },
  { id: 'ml-diamond-344-id', itemId: 'ml-diamond-344', countryCode: 'ID', symbol: 'Rp', price: 88000 },
  { id: 'ml-diamond-429-id', itemId: 'ml-diamond-429', countryCode: 'ID', symbol: 'Rp', price: 110000 },
  { id: 'ml-diamond-514-id', itemId: 'ml-diamond-514', countryCode: 'ID', symbol: 'Rp', price: 132000 },
  { id: 'ml-diamond-706-id', itemId: 'ml-diamond-706', countryCode: 'ID', symbol: 'Rp', price: 181500 },
  { id: 'ml-diamond-878-id', itemId: 'ml-diamond-878', countryCode: 'ID', symbol: 'Rp', price: 225500 },
  { id: 'ml-diamond-1050-id', itemId: 'ml-diamond-1050', countryCode: 'ID', symbol: 'Rp', price: 269500 },
  { id: 'ml-twilight-pass-id', itemId: 'ml-twilight-pass', countryCode: 'ID', symbol: 'Rp', price: 99000 },
  { id: 'ml-starlight-id', itemId: 'ml-starlight', countryCode: 'ID', symbol: 'Rp', price: 149000 },

  // Mobile Legends - Malaysia Pricing
  { id: 'ml-diamond-86-my', itemId: 'ml-diamond-86', countryCode: 'MY', symbol: 'RM', price: 5.9 },
  { id: 'ml-diamond-172-my', itemId: 'ml-diamond-172', countryCode: 'MY', symbol: 'RM', price: 11.9 },
  { id: 'ml-diamond-257-my', itemId: 'ml-diamond-257', countryCode: 'MY', symbol: 'RM', price: 17.9 },
  { id: 'ml-diamond-344-my', itemId: 'ml-diamond-344', countryCode: 'MY', symbol: 'RM', price: 23.9 },
  { id: 'ml-diamond-429-my', itemId: 'ml-diamond-429', countryCode: 'MY', symbol: 'RM', price: 29.9 },
  { id: 'ml-diamond-514-my', itemId: 'ml-diamond-514', countryCode: 'MY', symbol: 'RM', price: 35.9 },
  { id: 'ml-diamond-706-my', itemId: 'ml-diamond-706', countryCode: 'MY', symbol: 'RM', price: 49.9 },
  { id: 'ml-diamond-878-my', itemId: 'ml-diamond-878', countryCode: 'MY', symbol: 'RM', price: 61.9 },
  { id: 'ml-diamond-1050-my', itemId: 'ml-diamond-1050', countryCode: 'MY', symbol: 'RM', price: 73.9 },
  { id: 'ml-twilight-pass-my', itemId: 'ml-twilight-pass', countryCode: 'MY', symbol: 'RM', price: 26.9 },
  { id: 'ml-starlight-my', itemId: 'ml-starlight', countryCode: 'MY', symbol: 'RM', price: 40.9 },

  // Free Fire - Indonesia Pricing
  { id: 'ff-diamond-100-id', itemId: 'ff-diamond-100', countryCode: 'ID', symbol: 'Rp', price: 15000 },
  { id: 'ff-diamond-210-id', itemId: 'ff-diamond-210', countryCode: 'ID', symbol: 'Rp', price: 30000 },
  { id: 'ff-diamond-530-id', itemId: 'ff-diamond-530', countryCode: 'ID', symbol: 'Rp', price: 75000 },
  { id: 'ff-diamond-1080-id', itemId: 'ff-diamond-1080', countryCode: 'ID', symbol: 'Rp', price: 150000 },
  { id: 'ff-diamond-2200-id', itemId: 'ff-diamond-2200', countryCode: 'ID', symbol: 'Rp', price: 300000 },
  { id: 'ff-weekly-membership-id', itemId: 'ff-weekly-membership', countryCode: 'ID', symbol: 'Rp', price: 29000 },
  { id: 'ff-monthly-membership-id', itemId: 'ff-monthly-membership', countryCode: 'ID', symbol: 'Rp', price: 99000 },
  { id: 'ff-level-up-pass-id', itemId: 'ff-level-up-pass', countryCode: 'ID', symbol: 'Rp', price: 75000 },

  // Free Fire - Malaysia Pricing
  { id: 'ff-diamond-100-my', itemId: 'ff-diamond-100', countryCode: 'MY', symbol: 'RM', price: 3.99 },
  { id: 'ff-diamond-210-my', itemId: 'ff-diamond-210', countryCode: 'MY', symbol: 'RM', price: 7.99 },
  { id: 'ff-diamond-530-my', itemId: 'ff-diamond-530', countryCode: 'MY', symbol: 'RM', price: 19.99 },
  { id: 'ff-diamond-1080-my', itemId: 'ff-diamond-1080', countryCode: 'MY', symbol: 'RM', price: 39.99 },
  { id: 'ff-diamond-2200-my', itemId: 'ff-diamond-2200', countryCode: 'MY', symbol: 'RM', price: 79.99 },
  { id: 'ff-weekly-membership-my', itemId: 'ff-weekly-membership', countryCode: 'MY', symbol: 'RM', price: 7.9 },
  { id: 'ff-monthly-membership-my', itemId: 'ff-monthly-membership', countryCode: 'MY', symbol: 'RM', price: 26.9 },
  { id: 'ff-level-up-pass-my', itemId: 'ff-level-up-pass', countryCode: 'MY', symbol: 'RM', price: 19.9 },

  // Magic Chess: Go Go - Indonesia Pricing
  { id: 'mcgg-diamond-100-id', itemId: 'mcgg-diamond-100', countryCode: 'ID', symbol: 'Rp', price: 22000 },
  { id: 'mcgg-diamond-250-id', itemId: 'mcgg-diamond-250', countryCode: 'ID', symbol: 'Rp', price: 55000 },
  { id: 'mcgg-diamond-500-id', itemId: 'mcgg-diamond-500', countryCode: 'ID', symbol: 'Rp', price: 110000 },
  { id: 'mcgg-diamond-1000-id', itemId: 'mcgg-diamond-1000', countryCode: 'ID', symbol: 'Rp', price: 220000 },
  { id: 'mcgg-season-pass-id', itemId: 'mcgg-season-pass', countryCode: 'ID', symbol: 'Rp', price: 79000 },
  { id: 'mcgg-premium-pass-id', itemId: 'mcgg-premium-pass', countryCode: 'ID', symbol: 'Rp', price: 149000 },

  // Magic Chess: Go Go - Malaysia Pricing
  { id: 'mcgg-diamond-100-my', itemId: 'mcgg-diamond-100', countryCode: 'MY', symbol: 'RM', price: 5.9 },
  { id: 'mcgg-diamond-250-my', itemId: 'mcgg-diamond-250', countryCode: 'MY', symbol: 'RM', price: 14.9 },
  { id: 'mcgg-diamond-500-my', itemId: 'mcgg-diamond-500', countryCode: 'MY', symbol: 'RM', price: 29.9 },
  { id: 'mcgg-diamond-1000-my', itemId: 'mcgg-diamond-1000', countryCode: 'MY', symbol: 'RM', price: 59.9 },
  { id: 'mcgg-season-pass-my', itemId: 'mcgg-season-pass', countryCode: 'MY', symbol: 'RM', price: 21.9 },
  { id: 'mcgg-premium-pass-my', itemId: 'mcgg-premium-pass', countryCode: 'MY', symbol: 'RM', price: 40.9 },

  // PUBG Mobile - Indonesia Pricing
  { id: 'pubgm-uc-60-id', itemId: 'pubgm-uc-60', countryCode: 'ID', symbol: 'Rp', price: 15000 },
  { id: 'pubgm-uc-325-id', itemId: 'pubgm-uc-325', countryCode: 'ID', symbol: 'Rp', price: 79000 },
  { id: 'pubgm-uc-660-id', itemId: 'pubgm-uc-660', countryCode: 'ID', symbol: 'Rp', price: 159000 },
  { id: 'pubgm-uc-1800-id', itemId: 'pubgm-uc-1800', countryCode: 'ID', symbol: 'Rp', price: 399000 },
  { id: 'pubgm-uc-3850-id', itemId: 'pubgm-uc-3850', countryCode: 'ID', symbol: 'Rp', price: 799000 },
  { id: 'pubgm-uc-8100-id', itemId: 'pubgm-uc-8100', countryCode: 'ID', symbol: 'Rp', price: 1599000 },
  { id: 'pubgm-royale-pass-id', itemId: 'pubgm-royale-pass', countryCode: 'ID', symbol: 'Rp', price: 179000 },
  { id: 'pubgm-royale-pass-plus-id', itemId: 'pubgm-royale-pass-plus', countryCode: 'ID', symbol: 'Rp', price: 399000 },

  // PUBG Mobile - Malaysia Pricing
  { id: 'pubgm-uc-60-my', itemId: 'pubgm-uc-60', countryCode: 'MY', symbol: 'RM', price: 3.99 },
  { id: 'pubgm-uc-325-my', itemId: 'pubgm-uc-325', countryCode: 'MY', symbol: 'RM', price: 20.9 },
  { id: 'pubgm-uc-660-my', itemId: 'pubgm-uc-660', countryCode: 'MY', symbol: 'RM', price: 41.9 },
  { id: 'pubgm-uc-1800-my', itemId: 'pubgm-uc-1800', countryCode: 'MY', symbol: 'RM', price: 104.9 },
  { id: 'pubgm-uc-3850-my', itemId: 'pubgm-uc-3850', countryCode: 'MY', symbol: 'RM', price: 209.9 },
  { id: 'pubgm-uc-8100-my', itemId: 'pubgm-uc-8100', countryCode: 'MY', symbol: 'RM', price: 419.9 },
  { id: 'pubgm-royale-pass-my', itemId: 'pubgm-royale-pass', countryCode: 'MY', symbol: 'RM', price: 46.9 },
  { id: 'pubgm-royale-pass-plus-my', itemId: 'pubgm-royale-pass-plus', countryCode: 'MY', symbol: 'RM', price: 104.9 },

  // Blood Strike - Indonesia Pricing
  { id: 'bs-gold-100-id', itemId: 'bs-gold-100', countryCode: 'ID', symbol: 'Rp', price: 15000 },
  { id: 'bs-gold-300-id', itemId: 'bs-gold-300', countryCode: 'ID', symbol: 'Rp', price: 45000 },
  { id: 'bs-gold-500-id', itemId: 'bs-gold-500', countryCode: 'ID', symbol: 'Rp', price: 75000 },
  { id: 'bs-gold-1000-id', itemId: 'bs-gold-1000', countryCode: 'ID', symbol: 'Rp', price: 150000 },
  { id: 'bs-gold-2000-id', itemId: 'bs-gold-2000', countryCode: 'ID', symbol: 'Rp', price: 300000 },
  { id: 'bs-battle-pass-id', itemId: 'bs-battle-pass', countryCode: 'ID', symbol: 'Rp', price: 99000 },
  { id: 'bs-elite-pass-id', itemId: 'bs-elite-pass', countryCode: 'ID', symbol: 'Rp', price: 199000 },

  // Blood Strike - Malaysia Pricing
  { id: 'bs-gold-100-my', itemId: 'bs-gold-100', countryCode: 'MY', symbol: 'RM', price: 3.99 },
  { id: 'bs-gold-300-my', itemId: 'bs-gold-300', countryCode: 'MY', symbol: 'RM', price: 11.9 },
  { id: 'bs-gold-500-my', itemId: 'bs-gold-500', countryCode: 'MY', symbol: 'RM', price: 19.9 },
  { id: 'bs-gold-1000-my', itemId: 'bs-gold-1000', countryCode: 'MY', symbol: 'RM', price: 39.9 },
  { id: 'bs-gold-2000-my', itemId: 'bs-gold-2000', countryCode: 'MY', symbol: 'RM', price: 79.9 },
  { id: 'bs-battle-pass-my', itemId: 'bs-battle-pass', countryCode: 'MY', symbol: 'RM', price: 26.9 },
  { id: 'bs-elite-pass-my', itemId: 'bs-elite-pass', countryCode: 'MY', symbol: 'RM', price: 52.9 },

  // Genshin Impact - Indonesia Pricing
  { id: 'genshin-genesis-60-id', itemId: 'genshin-genesis-60', countryCode: 'ID', symbol: 'Rp', price: 16000 },
  { id: 'genshin-genesis-300-id', itemId: 'genshin-genesis-300', countryCode: 'ID', symbol: 'Rp', price: 79000 },
  { id: 'genshin-genesis-980-id', itemId: 'genshin-genesis-980', countryCode: 'ID', symbol: 'Rp', price: 249000 },
  { id: 'genshin-genesis-1980-id', itemId: 'genshin-genesis-1980', countryCode: 'ID', symbol: 'Rp', price: 479000 },
  { id: 'genshin-genesis-3280-id', itemId: 'genshin-genesis-3280', countryCode: 'ID', symbol: 'Rp', price: 799000 },
  { id: 'genshin-genesis-6480-id', itemId: 'genshin-genesis-6480', countryCode: 'ID', symbol: 'Rp', price: 1599000 },
  { id: 'genshin-welkin-id', itemId: 'genshin-welkin', countryCode: 'ID', symbol: 'Rp', price: 79000 },
  { id: 'genshin-battle-pass-id', itemId: 'genshin-battle-pass', countryCode: 'ID', symbol: 'Rp', price: 159000 },
  { id: 'genshin-battle-pass-bundle-id', itemId: 'genshin-battle-pass-bundle', countryCode: 'ID', symbol: 'Rp', price: 329000 },

  // Genshin Impact - Malaysia Pricing
  { id: 'genshin-genesis-60-my', itemId: 'genshin-genesis-60', countryCode: 'MY', symbol: 'RM', price: 4.49 },
  { id: 'genshin-genesis-300-my', itemId: 'genshin-genesis-300', countryCode: 'MY', symbol: 'RM', price: 21.9 },
  { id: 'genshin-genesis-980-my', itemId: 'genshin-genesis-980', countryCode: 'MY', symbol: 'RM', price: 68.9 },
  { id: 'genshin-genesis-1980-my', itemId: 'genshin-genesis-1980', countryCode: 'MY', symbol: 'RM', price: 129.9 },
  { id: 'genshin-genesis-3280-my', itemId: 'genshin-genesis-3280', countryCode: 'MY', symbol: 'RM', price: 219.9 },
  { id: 'genshin-genesis-6480-my', itemId: 'genshin-genesis-6480', countryCode: 'MY', symbol: 'RM', price: 439.9 },
  { id: 'genshin-welkin-my', itemId: 'genshin-welkin', countryCode: 'MY', symbol: 'RM', price: 21.9 },
  { id: 'genshin-battle-pass-my', itemId: 'genshin-battle-pass', countryCode: 'MY', symbol: 'RM', price: 43.9 },
  { id: 'genshin-battle-pass-bundle-my', itemId: 'genshin-battle-pass-bundle', countryCode: 'MY', symbol: 'RM', price: 89.9 },

  // US Pricing (for all games)
  { id: 'ml-diamond-86-us', itemId: 'ml-diamond-86', countryCode: 'US', symbol: '$', price: 1.49 },
  { id: 'ml-diamond-172-us', itemId: 'ml-diamond-172', countryCode: 'US', symbol: '$', price: 2.99 },
  { id: 'ml-diamond-257-us', itemId: 'ml-diamond-257', countryCode: 'US', symbol: '$', price: 4.49 },
  { id: 'ml-diamond-344-us', itemId: 'ml-diamond-344', countryCode: 'US', symbol: '$', price: 5.99 },
  { id: 'ml-diamond-429-us', itemId: 'ml-diamond-429', countryCode: 'US', symbol: '$', price: 7.49 },
  { id: 'ml-diamond-514-us', itemId: 'ml-diamond-514', countryCode: 'US', symbol: '$', price: 8.99 },
  { id: 'ml-diamond-706-us', itemId: 'ml-diamond-706', countryCode: 'US', symbol: '$', price: 12.49 },
  { id: 'ml-diamond-878-us', itemId: 'ml-diamond-878', countryCode: 'US', symbol: '$', price: 15.49 },
  { id: 'ml-diamond-1050-us', itemId: 'ml-diamond-1050', countryCode: 'US', symbol: '$', price: 18.49 },
  { id: 'ml-twilight-pass-us', itemId: 'ml-twilight-pass', countryCode: 'US', symbol: '$', price: 6.99 },
  { id: 'ml-starlight-us', itemId: 'ml-starlight', countryCode: 'US', symbol: '$', price: 9.99 },
  { id: 'ff-diamond-100-us', itemId: 'ff-diamond-100', countryCode: 'US', symbol: '$', price: 0.99 },
  { id: 'ff-diamond-210-us', itemId: 'ff-diamond-210', countryCode: 'US', symbol: '$', price: 1.99 },
  { id: 'ff-diamond-530-us', itemId: 'ff-diamond-530', countryCode: 'US', symbol: '$', price: 4.99 },
  { id: 'ff-diamond-1080-us', itemId: 'ff-diamond-1080', countryCode: 'US', symbol: '$', price: 9.99 },
  { id: 'ff-diamond-2200-us', itemId: 'ff-diamond-2200', countryCode: 'US', symbol: '$', price: 19.99 },
  { id: 'ff-weekly-membership-us', itemId: 'ff-weekly-membership', countryCode: 'US', symbol: '$', price: 1.99 },
  { id: 'ff-monthly-membership-us', itemId: 'ff-monthly-membership', countryCode: 'US', symbol: '$', price: 6.99 },
  { id: 'ff-level-up-pass-us', itemId: 'ff-level-up-pass', countryCode: 'US', symbol: '$', price: 4.99 },
  { id: 'mcgg-diamond-100-us', itemId: 'mcgg-diamond-100', countryCode: 'US', symbol: '$', price: 1.49 },
  { id: 'mcgg-diamond-250-us', itemId: 'mcgg-diamond-250', countryCode: 'US', symbol: '$', price: 3.49 },
  { id: 'mcgg-diamond-500-us', itemId: 'mcgg-diamond-500', countryCode: 'US', symbol: '$', price: 6.99 },
  { id: 'mcgg-diamond-1000-us', itemId: 'mcgg-diamond-1000', countryCode: 'US', symbol: '$', price: 13.99 },
  { id: 'mcgg-season-pass-us', itemId: 'mcgg-season-pass', countryCode: 'US', symbol: '$', price: 4.99 },
  { id: 'mcgg-premium-pass-us', itemId: 'mcgg-premium-pass', countryCode: 'US', symbol: '$', price: 9.99 },
  { id: 'pubgm-uc-60-us', itemId: 'pubgm-uc-60', countryCode: 'US', symbol: '$', price: 0.99 },
  { id: 'pubgm-uc-325-us', itemId: 'pubgm-uc-325', countryCode: 'US', symbol: '$', price: 4.99 },
  { id: 'pubgm-uc-660-us', itemId: 'pubgm-uc-660', countryCode: 'US', symbol: '$', price: 9.99 },
  { id: 'pubgm-uc-1800-us', itemId: 'pubgm-uc-1800', countryCode: 'US', symbol: '$', price: 24.99 },
  { id: 'pubgm-uc-3850-us', itemId: 'pubgm-uc-3850', countryCode: 'US', symbol: '$', price: 49.99 },
  { id: 'pubgm-uc-8100-us', itemId: 'pubgm-uc-8100', countryCode: 'US', symbol: '$', price: 99.99 },
  { id: 'pubgm-royale-pass-us', itemId: 'pubgm-royale-pass', countryCode: 'US', symbol: '$', price: 11.99 },
  { id: 'pubgm-royale-pass-plus-us', itemId: 'pubgm-royale-pass-plus', countryCode: 'US', symbol: '$', price: 24.99 },
  { id: 'bs-gold-100-us', itemId: 'bs-gold-100', countryCode: 'US', symbol: '$', price: 0.99 },
  { id: 'bs-gold-300-us', itemId: 'bs-gold-300', countryCode: 'US', symbol: '$', price: 2.99 },
  { id: 'bs-gold-500-us', itemId: 'bs-gold-500', countryCode: 'US', symbol: '$', price: 4.99 },
  { id: 'bs-gold-1000-us', itemId: 'bs-gold-1000', countryCode: 'US', symbol: '$', price: 9.99 },
  { id: 'bs-gold-2000-us', itemId: 'bs-gold-2000', countryCode: 'US', symbol: '$', price: 19.99 },
  { id: 'bs-battle-pass-us', itemId: 'bs-battle-pass', countryCode: 'US', symbol: '$', price: 6.99 },
  { id: 'bs-elite-pass-us', itemId: 'bs-elite-pass', countryCode: 'US', symbol: '$', price: 12.99 },
  { id: 'genshin-genesis-60-us', itemId: 'genshin-genesis-60', countryCode: 'US', symbol: '$', price: 0.99 },
  { id: 'genshin-genesis-300-us', itemId: 'genshin-genesis-300', countryCode: 'US', symbol: '$', price: 4.99 },
  { id: 'genshin-genesis-980-us', itemId: 'genshin-genesis-980', countryCode: 'US', symbol: '$', price: 14.99 },
  { id: 'genshin-genesis-1980-us', itemId: 'genshin-genesis-1980', countryCode: 'US', symbol: '$', price: 29.99 },
  { id: 'genshin-genesis-3280-us', itemId: 'genshin-genesis-3280', countryCode: 'US', symbol: '$', price: 49.99 },
  { id: 'genshin-genesis-6480-us', itemId: 'genshin-genesis-6480', countryCode: 'US', symbol: '$', price: 99.99 },
  { id: 'genshin-welkin-us', itemId: 'genshin-welkin', countryCode: 'US', symbol: '$', price: 4.99 },
  { id: 'genshin-battle-pass-us', itemId: 'genshin-battle-pass', countryCode: 'US', symbol: '$', price: 9.99 },
  { id: 'genshin-battle-pass-bundle-us', itemId: 'genshin-battle-pass-bundle', countryCode: 'US', symbol: '$', price: 19.99 },
] as const;

// ============================================================================
// SEED FUNCTIONS
// ============================================================================
export async function seedGames(db: DrizzleInstance) {
  console.log('🎮 Seeding games...');

  await db.insert(schema.games).values(
    GAME_SEED_DATA.map((game) => ({
      ...game,
      createdBy: 'system',
      updatedBy: 'system',
    }))
  ).onConflictDoNothing();

  console.log(`✅ Seeded ${GAME_SEED_DATA.length} games`);
}

export async function seedItems(db: DrizzleInstance) {
  console.log('📦 Seeding items...');

  await db.insert(schema.items).values(
    ITEM_SEED_DATA.map((item) => ({
      ...item,
      isActive: true,
      createdBy: 'system',
      updatedBy: 'system',
    }))
  ).onConflictDoNothing();

  console.log(`✅ Seeded ${ITEM_SEED_DATA.length} items`);
}

export async function seedItemDetails(db: DrizzleInstance) {
  console.log('💰 Seeding item details...');

  await db.insert(schema.itemDetails).values([...ITEM_DETAIL_SEED_DATA]).onConflictDoNothing();

  console.log(`✅ Seeded ${ITEM_DETAIL_SEED_DATA.length} item details`);
}

export { GAME_SEED_DATA, ITEM_SEED_DATA, ITEM_DETAIL_SEED_DATA };
