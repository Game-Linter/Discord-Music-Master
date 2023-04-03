import { REST, Routes } from 'discord.js';
import { Command } from '../commands/command.abstract';

export const hydrateCommands = (commands: Command[]) => {
    const rest = new REST({ version: '10' }).setToken(process.env.token!);

    const commandArr = commands.map((command) => command.data.toJSON());

    // and deploy your commands!
    (async () => {
        try {
            console.log(
                `Started refreshing ${commands.length} application (/) commands.`,
            );

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = (await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!) as any,
                { body: commandArr },
            )) as any;

            console.log(
                `Successfully reloaded ${data.length} application (/) commands.`,
            );
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
};
