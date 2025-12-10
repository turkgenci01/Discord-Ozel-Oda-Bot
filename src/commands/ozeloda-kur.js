import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} from 'discord.js';
import dataManager from '../utils/dataManager.js';
import { createManagementPanel } from '../utils/panelManager.js';

export const data = new SlashCommandBuilder()
  .setName('özeloda-kur')
  .setDescription('Özel oda sistemini kurar')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption(option =>
    option
      .setName('panel-kanal')
      .setDescription('Yönetim panelinin gönderileceği metin kanalı')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  )
  .addChannelOption(option =>
    option
      .setName('ana-kanal')
      .setDescription('Ana özel oda ses kanalı')
      .addChannelTypes(ChannelType.GuildVoice)
      .setRequired(true)
  );

export async function execute(interaction) {
  const panelChannel = interaction.options.getChannel('panel-kanal');
  const mainVoiceChannel = interaction.options.getChannel('ana-kanal');

  if (!panelChannel || !mainVoiceChannel) {
    return interaction.reply({
      content: '❌ Lütfen geçerli kanallar seçin!',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    dataManager.setGuildConfig(interaction.guild.id, {
      panelChannelId: panelChannel.id,
      mainVoiceChannelId: mainVoiceChannel.id
    });

    await createManagementPanel(panelChannel);

    await interaction.editReply({
      content:
        `✅ **Özel oda sistemi başarıyla kuruldu!**\n\n` +
        `📋 **Panel Kanalı:** ${panelChannel}\n` +
        `🎧 **Ana Ses Kanalı:** ${mainVoiceChannel}\n\n` +
        `Kullanıcılar ${mainVoiceChannel} kanalına girdiğinde otomatik olarak özel odaları oluşturulacak.`
    });
  } catch (error) {
    console.error('Kurulum hatası:', error);
    await interaction.editReply({
      content: '❌ Sistem kurulurken bir hata oluştu. Lütfen botun gerekli izinlere sahip olduğundan emin olun.'
    });
  }
}
