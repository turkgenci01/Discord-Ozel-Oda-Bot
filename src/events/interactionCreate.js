export const name = 'interactionCreate';

export async function execute(interaction) {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Komut bulunamadı: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('Komut çalıştırma hatası:', error);
      const errorMessage = {
        content: '❌ Bu komutu çalıştırırken bir hata oluştu!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  } else if (interaction.isButton()) {
    const button = interaction.client.buttons.get(interaction.customId);

    if (!button) {
      return interaction.reply({
        content: '❌ Bu buton artık desteklenmiyor.',
        ephemeral: true
      });
    }

    try {
      await button.execute(interaction);
    } catch (error) {
      console.error('Buton hatası:', error);
      const errorMessage = {
        content: '❌ Bu işlem gerçekleştirilirken bir hata oluştu!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  } else if (interaction.isModalSubmit()) {
    const modal = interaction.client.modals.get(interaction.customId);

    if (!modal) {
      return interaction.reply({
        content: '❌ Bu modal artık desteklenmiyor.',
        ephemeral: true
      });
    }

    try {
      await modal.execute(interaction);
    } catch (error) {
      console.error('Modal hatası:', error);
      const errorMessage = {
        content: '❌ Bu işlem gerçekleştirilirken bir hata oluştu!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  } else if (interaction.isStringSelectMenu()) {
    const selectMenu = interaction.client.selectMenus.get(interaction.customId);

    if (!selectMenu) {
      return interaction.reply({
        content: '❌ Bu menü artık desteklenmiyor.',
        ephemeral: true
      });
    }

    try {
      await selectMenu.execute(interaction);
    } catch (error) {
      console.error('Select menu hatası:', error);
      const errorMessage = {
        content: '❌ Bu işlem gerçekleştirilirken bir hata oluştu!',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }
}
