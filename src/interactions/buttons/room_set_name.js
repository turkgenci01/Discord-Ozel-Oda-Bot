import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import dataManager from '../../utils/dataManager.js';

export const customId = 'room_set_name';

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
    .setCustomId('modal_set_room_name')
    .setTitle('Oda Adı Belirle');

  const nameInput = new TextInputBuilder()
    .setCustomId('room_name_input')
    .setLabel('Yeni oda adını girin')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Örnek: Ahmet - Odası')
    .setMinLength(1)
    .setMaxLength(50)
    .setRequired(true);

  const actionRow = new ActionRowBuilder().addComponents(nameInput);
  modal.addComponents(actionRow);

  await interaction.showModal(modal);
}
