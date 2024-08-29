module.exports = {
    data: {
        type: 1,
        name: 'pokemon',
        description: 'See informations about specific pokémon'
    },

    async execute(client, interaction) {

        await interaction.reply('Masterclass');
    
    }
};