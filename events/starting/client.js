export default {
	data: {
		name: `ready`,
		description: `Bot starting`,
		once: false
	},

	async execute(client) {
		
		client.guilds.cache.forEach(guild => {
			guild.commands.set(client.command);
		})

		console.log(`\n- Connecté ${client.user.username} : ${client.guilds.cache.size} serveurs`);
		console.log(`- Invitation : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`);
		console.log(`- Made by ${client.author} with <3`);
	}
}