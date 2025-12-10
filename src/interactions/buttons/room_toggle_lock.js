import { PermissionFlagsBits } from 'discord.js';
import dataManager from '../../utils/dataManager.js';

export const customId = 'room_toggle_lock';

export async function execute(interaction) {
  const member = interaction.member;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({
      content: '❌ Bir ses kanalında değilsiniz!',
      ephemeral: true
    });
  }

  const activeRoom = dataManager.getActiveRoom(interaction.guild.id, member.id);

  if (!activeRoom || activeRoom !== voiceChannel.id) {
    return interaction.reply({
      content: '❌ Bu sadece kendi odanızda kullanabilirsiniz!',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const permissions = voiceChannel.permissionOverwrites.cache.get(interaction.guild.id);
    const isLocked = permissions && permissions.deny.has(PermissionFlagsBits.Connect);

    if (isLocked) {
      await voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
        Connect: null
      });

      await interaction.editReply({
        content: '🔓 **Odanızın kilidi açıldı!** Herkes girebilir.'
      });
    } else {
      await voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
        Connect: false
      });

      await interaction.editReply({
        content: '🔒 **Odanız kilitlendi!** Sadece izin verdiğiniz kişiler girebilir.'
      });
    }
  } catch (error) {
    console.error('Kilit toggle hatası:', error);
    await interaction.editReply({
      content: '❌ Oda kilidi değiştirilirken bir hata oluştu!'
    });
  }
}
