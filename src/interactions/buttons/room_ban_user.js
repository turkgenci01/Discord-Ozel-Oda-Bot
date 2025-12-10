import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import dataManager from '../../utils/dataManager.js';

export const customId = 'room_ban_user';

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

  const members = interaction.guild.members.cache
    .filter(m => !m.user.bot && m.id !== member.id)
    .first(25);

  if (members.length === 0) {
    return interaction.reply({
      content: '❌ Banlanacak üye bulunamadı!',
      ephemeral: true
    });
  }

  const options = members.map(m => ({
    label: m.user.username,
    description: m.user.tag,
    value: m.id
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_ban_user')
    .setPlaceholder('Banlamak istediğiniz üyeyi seçin')
    .addOptions(options)
    .setMinValues(1)
    .setMaxValues(1);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.reply({
    content: '🚫 **Odanızdan banlamak istediğiniz üyeyi seçin:**',
    components: [row],
    ephemeral: true
  });
}
