import { PermissionFlagsBits } from 'discord.js';
import dataManager from '../../utils/dataManager.js';

export const customId = 'select_add_user';

export async function execute(interaction) {
  const member = interaction.member;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    return interaction.update({
      content: '❌ Bir ses kanalında değilsiniz!',
      components: []
    });
  }

  const activeRoom = dataManager.getActiveRoom(interaction.guild.id, member.id);

  if (!activeRoom || activeRoom !== voiceChannel.id) {
    return interaction.update({
      content: '❌ Bu sadece kendi odanızda kullanabilirsiniz!',
      components: []
    });
  }

  const selectedUserId = interaction.values[0];

  try {
    const targetMember = await interaction.guild.members.fetch(selectedUserId);

    await voiceChannel.permissionOverwrites.edit(targetMember.id, {
      ViewChannel: true,
      Connect: true
    });

    await interaction.update({
      content: `➕ **${targetMember.user.username}** odanıza eklendi!`,
      components: []
    });
  } catch (error) {
    console.error('Üye ekleme hatası:', error);
    await interaction.update({
      content: '❌ Üye eklenirken bir hata oluştu!',
      components: []
    });
  }
}
