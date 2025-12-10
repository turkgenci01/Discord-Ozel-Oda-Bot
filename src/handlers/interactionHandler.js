import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Collection } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadInteractions(client) {
  client.buttons = new Collection();
  client.modals = new Collection();
  client.selectMenus = new Collection();

  const buttonsPath = path.join(__dirname, '../interactions/buttons');
  const modalsPath = path.join(__dirname, '../interactions/modals');
  const selectMenusPath = path.join(__dirname, '../interactions/selectmenus');

  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = await import(`file://${filePath}`);

    if ('customId' in button && 'execute' in button) {
      client.buttons.set(button.customId, button);
      console.log(`✅ Button yüklendi: ${button.customId}`);
    }
  }

  const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));
  for (const file of modalFiles) {
    const filePath = path.join(modalsPath, file);
    const modal = await import(`file://${filePath}`);

    if ('customId' in modal && 'execute' in modal) {
      client.modals.set(modal.customId, modal);
      console.log(`✅ Modal yüklendi: ${modal.customId}`);
    }
  }

  const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));
  for (const file of selectMenuFiles) {
    const filePath = path.join(selectMenusPath, file);
    const selectMenu = await import(`file://${filePath}`);

    if ('customId' in selectMenu && 'execute' in selectMenu) {
      client.selectMenus.set(selectMenu.customId, selectMenu);
      console.log(`✅ Select Menu yüklendi: ${selectMenu.customId}`);
    }
  }

  console.log(`📦 Toplam ${client.buttons.size} button, ${client.modals.size} modal, ${client.selectMenus.size} select menu yüklendi`);
}
