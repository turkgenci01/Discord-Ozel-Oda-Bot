import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../../data/guilds.json');

class DataManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (!fs.existsSync(DATA_PATH)) {
        const initialData = { guilds: {} };
        fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
        return initialData;
      }
      const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      return { guilds: {} };
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DATA_PATH, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Veri kaydetme hatası:', error);
    }
  }

  getGuildData(guildId) {
    if (!this.data.guilds[guildId]) {
      this.data.guilds[guildId] = {
        panelChannelId: null,
        panelMessageId: null,
        mainVoiceChannelId: null,
        userRoomNames: {},
        userBans: {},
        activeRooms: {},
        roomLimits: {}
      };
      this.saveData();
    }
    return this.data.guilds[guildId];
  }

  setGuildConfig(guildId, config) {
    const guildData = this.getGuildData(guildId);
    Object.assign(guildData, config);
    this.saveData();
  }

  setUserRoomName(guildId, userId, roomName) {
    const guildData = this.getGuildData(guildId);
    guildData.userRoomNames[userId] = roomName;
    this.saveData();
  }

  getUserRoomName(guildId, userId) {
    const guildData = this.getGuildData(guildId);
    return guildData.userRoomNames[userId] || null;
  }

  setActiveRoom(guildId, userId, channelId) {
    const guildData = this.getGuildData(guildId);
    guildData.activeRooms[userId] = channelId;
    this.saveData();
  }

  getActiveRoom(guildId, userId) {
    const guildData = this.getGuildData(guildId);
    return guildData.activeRooms[userId] || null;
  }

  removeActiveRoom(guildId, userId) {
    const guildData = this.getGuildData(guildId);
    delete guildData.activeRooms[userId];
    this.saveData();
  }

  banUser(guildId, ownerId, userId) {
    const guildData = this.getGuildData(guildId);
    if (!guildData.userBans[ownerId]) {
      guildData.userBans[ownerId] = [];
    }
    if (!guildData.userBans[ownerId].includes(userId)) {
      guildData.userBans[ownerId].push(userId);
      this.saveData();
    }
  }

  unbanUser(guildId, ownerId, userId) {
    const guildData = this.getGuildData(guildId);
    if (guildData.userBans[ownerId]) {
      guildData.userBans[ownerId] = guildData.userBans[ownerId].filter(id => id !== userId);
      this.saveData();
    }
  }

  getBannedUsers(guildId, ownerId) {
    const guildData = this.getGuildData(guildId);
    return guildData.userBans[ownerId] || [];
  }

  isUserBanned(guildId, ownerId, userId) {
    const bannedUsers = this.getBannedUsers(guildId, ownerId);
    return bannedUsers.includes(userId);
  }

  setRoomLimit(guildId, channelId, limit) {
    const guildData = this.getGuildData(guildId);
    guildData.roomLimits[channelId] = limit;
    this.saveData();
  }

  getRoomLimit(guildId, channelId) {
    const guildData = this.getGuildData(guildId);
    return guildData.roomLimits[channelId] || 0;
  }

  removeRoomLimit(guildId, channelId) {
    const guildData = this.getGuildData(guildId);
    delete guildData.roomLimits[channelId];
    this.saveData();
  }
}

export default new DataManager();
