import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import dataManager from '../../utils/dataManager.js';

export const customId = 'room_set_limit';

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

  const modal = new ModalBuilder()
    .setCustomId('modal_set_room_limit')
    .setTitle('Kullanıcı Limiti Ayarla');

  const limitInput = new TextInputBuilder()
    .setCustomId('room_limit_input')
    .setLabel('Kullanıcı limiti (1-99, 0 = limitsiz)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Örnek: 5')
    .setMinLength(1)
    .setMaxLength(2)
    .setRequired(true);

  const actionRow = new ActionRowBuilder().addComponents(limitInput);
  modal.addComponents(actionRow);

  await interaction.showModal(modal);
}
