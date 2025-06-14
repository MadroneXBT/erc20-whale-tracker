import { CommandInteraction, ChatInputApplicationCommandData } from 'discord.js'

export interface Command extends ChatInputApplicationCommandData {
    execute: (interaction: CommandInteraction) => Promise<void>
}
