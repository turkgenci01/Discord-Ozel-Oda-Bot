import dataManager from '../../utils/dataManager.js';

export const customId = 'room_delete';

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
    dataManager.removeActiveRoom(interaction.guild.id, member.id);
    dataManager.removeRoomLimit(interaction.guild.id, voiceChannel.id);

    await voiceChannel.delete();

    await interaction.editReply({
      content: '🗑️ **Odanız başarıyla silindi!**'
    });
  } catch (error) {
    console.error('Oda silme hatası:', error);
    await interaction.editReply({
      content: '❌ Oda silinirken bir hata oluştu!'
    });
  }
}
