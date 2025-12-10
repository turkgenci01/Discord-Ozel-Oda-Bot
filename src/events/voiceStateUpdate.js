import { ChannelType, PermissionFlagsBits } from 'discord.js';
import dataManager from '../utils/dataManager.js';

export const name = 'voiceStateUpdate';

export async function execute(oldState, newState) {
  const guildId = newState.guild.id;
  const guildData = dataManager.getGuildData(guildId);

  if (!guildData.mainVoiceChannelId) return;

  if (newState.channelId === guildData.mainVoiceChannelId) {
    await handleUserJoinMainChannel(newState, guildData);
  }

  if (oldState.channel && oldState.channel.members.size === 0) {
    await handleEmptyRoom(oldState, guildData);
  }
}

async function handleUserJoinMainChannel(state, guildData) {
  const member = state.member;
  const guild = state.guild;

  const existingRoom = dataManager.getActiveRoom(guild.id, member.id);
  if (existingRoom) {
    try {
      const existingChannel = await guild.channels.fetch(existingRoom);
      if (existingChannel) {
        return;
      }
    } catch (error) {
      dataManager.removeActiveRoom(guild.id, member.id);
    }
  }

  const customName = dataManager.getUserRoomName(guild.id, member.id);
  const channelName = customName || `${member.user.username} – Odası`;

  try {
    const privateChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice,
      parent: state.channel.parent,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
        },
        {
          id: member.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.MoveMembers,
            PermissionFlagsBits.MuteMembers,
            PermissionFlagsBits.DeafenMembers
          ]
        }
      ]
    });

    dataManager.setActiveRoom(guild.id, member.id, privateChannel.id);

    await member.voice.setChannel(privateChannel);

    console.log(`✅ Özel oda oluşturuldu: ${channelName} (${privateChannel.id}) - Sunucu: ${guild.name}`);
  } catch (error) {
    console.error('Özel oda oluşturma hatası:', error);
  }
}

async function handleEmptyRoom(state, guildData) {
  const channel = state.channel;
  const guild = state.guild;

  const ownerIds = Object.keys(guildData.activeRooms);
  for (const ownerId of ownerIds) {
    if (guildData.activeRooms[ownerId] === channel.id) {
      try {
        await channel.delete();
        dataManager.removeActiveRoom(guild.id, ownerId);
        dataManager.removeRoomLimit(guild.id, channel.id);
        console.log(`🗑️ Boş özel oda silindi: ${channel.name} (${channel.id}) - Sunucu: ${guild.name}`);
      } catch (error) {
        console.error('Oda silme hatası:', error);
      }
      break;
    }
  }
}
