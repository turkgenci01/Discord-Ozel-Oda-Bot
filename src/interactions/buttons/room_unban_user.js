import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import dataManager from '../../utils/dataManager.js';

export const customId = 'room_unban_user';

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

  const bannedUserIds = dataManager.getBannedUsers(interaction.guild.id, member.id);

  if (bannedUserIds.length === 0) {
    return interaction.reply({
      content: '❌ Ban listeniz boş!',
      ephemeral: true
    });
  }

  const bannedMembers = [];
  for (const userId of bannedUserIds.slice(0, 25)) {
    try {
      const bannedMember = await interaction.guild.members.fetch(userId);
      bannedMembers.push(bannedMember);
    } catch (error) {
      console.error(`Banlı kullanıcı bulunamadı: ${userId}`);
    }
  }

  if (bannedMembers.length === 0) {
    return interaction.reply({
      content: '❌ Ban listenizdeki kullanıcılar sunucuda bulunamadı!',
      ephemeral: true
    });
  }

  const options = bannedMembers.map(m => ({
    label: m.user.username,
    description: m.user.tag,
    value: m.id
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_unban_user')
    .setPlaceholder('Banını kaldırmak istediğiniz üyeyi seçin')
    .addOptions(options)
    .setMinValues(1)
    .setMaxValues(1);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.reply({
    content: '♻️ **Banını kaldırmak istediğiniz üyeyi seçin:**',
    components: [row],
    ephemeral: true
  });
}
