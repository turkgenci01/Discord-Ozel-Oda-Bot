import dataManager from '../../utils/dataManager.js';

export const customId = 'modal_set_room_name';

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

  const newName = interaction.fields.getTextInputValue('room_name_input');

  if (!newName || newName.trim().length === 0) {
    return interaction.reply({
      content: '❌ Geçerli bir oda adı girin!',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    await voiceChannel.setName(newName.trim());
    dataManager.setUserRoomName(interaction.guild.id, member.id, newName.trim());

    await interaction.editReply({
      content: `📝 **Oda adınız başarıyla değiştirildi!**\nYeni ad: **${newName.trim()}**\n\n*Bu isim bir sonraki odanızda da kullanılacak.*`
    });
  } catch (error) {
    console.error('Oda adı değiştirme hatası:', error);
    await interaction.editReply({
      content: '❌ Oda adı değiştirilirken bir hata oluştu!'
    });
  }
}
