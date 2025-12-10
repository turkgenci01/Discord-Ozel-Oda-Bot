import dataManager from '../../utils/dataManager.js';

export const customId = 'select_unban_user';

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

    dataManager.unbanUser(interaction.guild.id, member.id, targetMember.id);

    await voiceChannel.permissionOverwrites.delete(targetMember.id);

    await interaction.update({
      content: `♻️ **${targetMember.user.username}** ban listesinden çıkarıldı!`,
      components: []
    });
  } catch (error) {
    console.error('Ban kaldırma hatası:', error);
    await interaction.update({
      content: '❌ Ban kaldırılırken bir hata oluştu!',
      components: []
    });
  }
}
