import { CommandInteraction } from 'discord.js'
import Price from './price'

export const commands = [Price]

export const handleSlashCommand = async (
    interaction: CommandInteraction,
): Promise<void> => {
    const slashCommand = commands.find(
        (command) => command.name === interaction.commandName,
    )

    try {
        if (!slashCommand) {
            await interaction.followUp({
                content:
                    'This command is currently unavailable. Please contact support for assistance.',
            })
        } else {
            await interaction.deferReply()

            await slashCommand.execute(interaction)
        }
    } catch (error) {
        console.error('Error executing command:', error)
        await interaction.followUp({
            content: 'An error has occurred while executing the command.',
        })
    }
}
