import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import dataManager from './dataManager.js';

export async function createManagementPanel(channel) {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🎧 Özel Oda Yönetim Paneli')
    .setDescription(
      '**Kendi özel odanızı yönetmek için aşağıdaki butonları kullanın.**\n\n' +
      '📝 **Oda Adı Belirle** - Odanıza özel bir isim verin\n' +
      '🔒 **Kilitle/Kilidi Aç** - Odanızı kilitleyip açın\n' +
      '🔢 **Kullanıcı Limiti** - Oda limitini ayarlayın (1-99)\n' +
      '➕ **Üye Ekle** - Odanıza birini ekleyin\n' +
      '➖ **Üye Çıkar** - Odanızdan birini çıkarın\n' +
      '🚫 **Üyeyi Banla** - Birini odanızdan kalıcı olarak yasaklayın\n' +
      '♻️ **Banı Kaldır** - Ban listesinden birini çıkarın\n' +
      '🗑️ **Odayı Sil** - Özel odanızı silin'
    )
    .setFooter({ text: 'Bu butonları sadece oda sahibi kullanabilir' })
    .setTimestamp();

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('room_set_name')
      .setLabel('Oda Adı Belirle')
      .setEmoji('📝')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('room_toggle_lock')
      .setLabel('Kilitle')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('room_set_limit')
      .setLabel('Kullanıcı Limiti')
      .setEmoji('🔢')
      .setStyle(ButtonStyle.Primary)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('room_add_user')
      .setLabel('Üye Ekle')
      .setEmoji('➕')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('room_remove_user')
      .setLabel('Üye Çıkar')
      .setEmoji('➖')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('room_ban_user')
      .setLabel('Üyeyi Banla')
      .setEmoji('🚫')
      .setStyle(ButtonStyle.Secondary)
  );

  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('room_unban_user')
      .setLabel('Banı Kaldır')
      .setEmoji('♻️')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('room_delete')
      .setLabel('Odayı Sil')
      .setEmoji('🗑️')
      .setStyle(ButtonStyle.Danger)
  );

  try {
    const message = await channel.send({
      embeds: [embed],
      components: [row1, row2, row3]
    });

    dataManager.setGuildConfig(channel.guild.id, {
      panelChannelId: channel.id,
      panelMessageId: message.id
    });

    return message;
  } catch (error) {
    console.error('Panel oluşturma hatası:', error);
    return null;
  }
}

export async function checkAndRecreatePanel(client, guildId) {
  const guildData = dataManager.getGuildData(guildId);

  if (!guildData.panelChannelId || !guildData.panelMessageId) {
    return;
  }

  try {
    const channel = await client.channels.fetch(guildData.panelChannelId);
    if (!channel) return;

    try {
      await channel.messages.fetch(guildData.panelMessageId);
    } catch (error) {
      console.log(`Panel mesajı bulunamadı, yeniden oluşturuluyor... (Guild: ${guildId})`);
      await createManagementPanel(channel);
    }
  } catch (error) {
    console.error('Panel kontrolü hatası:', error);
  }
}
