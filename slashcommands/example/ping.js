module.exports = {
	data: {
		name: `ping`,
		description: `Bot latency`
	},

	async execute(client, interaction) {
		interaction.reply({content: `Latency : ${client.ws.ping}ms`, ephemeral: true})
	}
}