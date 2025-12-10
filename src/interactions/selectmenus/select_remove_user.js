import dataManager from '../../utils/dataManager.js';

export const customId = 'select_remove_user';

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

    if (targetMember.voice.channel && targetMember.voice.channel.id === voiceChannel.id) {
      await targetMember.voice.disconnect();
    }

    await interaction.update({
      content: `➖ **${targetMember.user.username}** odanızdan çıkarıldı!`,
      components: []
    });
  } catch (error) {
    console.error('Üye çıkarma hatası:', error);
    await interaction.update({
      content: '❌ Üye çıkarılırken bir hata oluştu!',
      components: []
    });
  }
}
