export default {
	data: {
		name: `interactionCreate`,
		description: `When someone execute slash command`,
		once: false
	},

	async execute(client, interaction) {

		try {
			const cmd = client.commands.get(interaction.commandName);
			if(cmd) {
				if(cmd.execute) {
					await cmd.execute(client, interaction);					
				} else if(cmd.executes) {
					const subcommand = interaction.options?._subcommand;
					if(subcommand) await cmd.executes[subcommand](client, interaction);
				}
			}
		} catch (e) {
			console.error(`[!][COMMAND] - ${e}`);
		}
	}
}