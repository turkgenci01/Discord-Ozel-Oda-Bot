import { checkAndRecreatePanel } from '../utils/panelManager.js';
import dataManager from '../utils/dataManager.js';

export const name = 'ready';
export const once = true;

export async function execute(client) {
  console.log(`✅ Bot başarıyla giriş yaptı: ${client.user.tag}`);
  console.log(`📊 Toplam sunucu sayısı: ${client.guilds.cache.size}`);

  const guildIds = Object.keys(dataManager.data.guilds);
  for (const guildId of guildIds) {
    await checkAndRecreatePanel(client, guildId);
  }

  console.log('✅ Tüm yönetim panelleri kontrol edildi');
}
