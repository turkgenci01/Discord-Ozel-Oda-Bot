import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { loadCommands } from './src/handlers/commandHandler.js';
import { loadEvents } from './src/handlers/eventHandler.js';
import { loadInteractions } from './src/handlers/interactionHandler.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

async function registerCommands() {
  try {
    console.log('🔄 Slash komutları kaydediliyor...');

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    await loadCommands(client);

    const commands = [];
    for (const command of client.commands.values()) {
      commands.push(command.data.toJSON());
    }

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Slash komutları başarıyla kaydedildi!');
  } catch (error) {
    console.error('❌ Komut kaydetme hatası:', error);
  }
}

async function startBot() {
  try {
    if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
      throw new Error('DISCORD_TOKEN ve CLIENT_ID environment variables gerekli! .env dosyasını kontrol edin.');
    }

    await registerCommands();
    await loadEvents(client);
    await loadInteractions(client);

    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('❌ Bot başlatma hatası:', error);
    process.exit(1);
  }
}

startBot();
