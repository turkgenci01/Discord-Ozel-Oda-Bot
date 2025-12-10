import dataManager from '../../utils/dataManager.js';

export const customId = 'modal_set_room_limit';

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

  const limitInput = interaction.fields.getTextInputValue('room_limit_input');
  const limit = parseInt(limitInput);

  if (isNaN(limit) || limit < 0 || limit > 99) {
    return interaction.reply({
      content: '❌ Lütfen 0-99 arasında bir sayı girin! (0 = limitsiz)',
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    await voiceChannel.setUserLimit(limit);
    dataManager.setRoomLimit(interaction.guild.id, voiceChannel.id, limit);

    if (limit === 0) {
      await interaction.editReply({
        content: '🔢 **Kullanıcı limiti kaldırıldı!** Odanız artık limitsiz.'
      });
    } else {
      await interaction.editReply({
        content: `🔢 **Kullanıcı limiti ayarlandı!** Maksimum **${limit}** kişi girebilir.`
      });
    }
  } catch (error) {
    console.error('Limit ayarlama hatası:', error);
    await interaction.editReply({
      content: '❌ Kullanıcı limiti ayarlanırken bir hata oluştu!'
    });
  }
}
