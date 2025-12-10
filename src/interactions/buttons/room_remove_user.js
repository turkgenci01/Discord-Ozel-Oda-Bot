import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import dataManager from '../../utils/dataManager.js';

export const customId = 'room_remove_user';

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

  const membersInChannel = Array.from(voiceChannel.members.values())
    .filter(m => m.id !== member.id);

  if (membersInChannel.length === 0) {
    return interaction.reply({
      content: '❌ Odanızda başka kimse yok!',
      ephemeral: true
    });
  }

  const options = membersInChannel.slice(0, 25).map(m => ({
    label: m.user.username,
    description: m.user.tag,
    value: m.id
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_remove_user')
    .setPlaceholder('Çıkarmak istediğiniz üyeyi seçin')
    .addOptions(options)
    .setMinValues(1)
    .setMaxValues(1);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.reply({
    content: '➖ **Odanızdan çıkarmak istediğiniz üyeyi seçin:**',
    components: [row],
    ephemeral: true
  });
}
