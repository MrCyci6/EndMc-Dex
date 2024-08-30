export default {
    data: {
        type: 1,
        name: 'pokemon',
        description: 'See informations about specific pokémon',
        options: [
            {
                type: 3,
                name: "pokemon",
                description: "About what pokemon you want informations ?",
                required: true
            }
        ]
    },

    async execute(client, interaction) {

        const pokemon = interaction.options.getString("pokemon");
        
        const nothing = new client.requires.Discord.EmbedBuilder()
            .setTitle(`${pokemon}`)
            .setColor("#ff0000")
            .setDescription(`This pokemon is not in our pokedex.`)

        const generalData = await client.functions.get(`${client.config.api.pokeapi.url}/pokemon/${pokemon}`);
        if(!generalData) return interaction.reply({embeds: [nothing]});

        const speciesData = await client.functions.get(generalData.species.url);
        if(!speciesData) return interaction.reply({embeds: [nothing]});

        const formData = await client.functions.get(generalData?.forms[0]?.url);

        const abilities = generalData.abilities ? generalData.abilities.map(ability => ability.ability.name) : ["None"];
        const color = speciesData.color ? speciesData.name : "Invisible";
        const captureRate = speciesData.capture_rate ? speciesData.capture_rate : "0"; 
        const habitat = speciesData.habitat ? speciesData.habitat.name : "The earth.";
        const types = generalData.types ? generalData.types.map(type => type.type.name) : ["None"];
        const eggGroups = speciesData.egg_groups ? speciesData.egg_groups.map(group => group.name) : ["None"];
        const id = generalData.id ? generalData.id : (formData ? formData.id : "0");
        const title = `${generalData.name} | #${String(id).padStart(3, "0")}`;

        let embedHome = new client.requires.Discord.EmbedBuilder()
            .setTitle(`${title}`)
            .setColor("#ff0000")
            .setFields(
                {
                    name: `\`📰\` About`,
                    value: `**Abilities** ${abilities.join(", ")}
**Color** ${color}
**Capture Rate** ${captureRate}
**Habitat** ${habitat}
**Types** ${types.join(", ")}`,
                    inline: false
                },
                {
                    name: `\`🐣\` Breeding`,
                    value: `**Egg Groups** ${eggGroups}`,
                    inline: false
                }
            )
            .setFooter({text: `HOME -> ${title}`})
        if(formData?.sprites?.front_default) embedHome.setThumbnail(formData.sprites.front_default)

        const statsInfos = generalData.stats.map(stat => `**${stat.stat.name.toUpperCase()}** (${stat.base_stat})\n${client.functions.getBar(stat.base_stat)}`);
        let embedStats = new client.requires.Discord.EmbedBuilder()
            .setTitle(`${title}`)
            .setColor("#ff0000")
            .setFooter({text: `STATS -> ${title}`})
            .setDescription(`\`❤️\` Base stats

${statsInfos.join("\n\n")}`)
        if(formData?.sprites?.front_default) embedStats.setThumbnail(formData.sprites.front_default)

        const _id = client.functions.randomString();
        const stats = new client.requires.Discord.ActionRowBuilder()
            .addComponents(
                new client.requires.Discord.ButtonBuilder()
                    .setCustomId(`stats-${_id}`)
                    .setLabel("BASE STATS")
                    .setStyle("Primary")
                    .setDisabled(false),
                )        
        const home = new client.requires.Discord.ActionRowBuilder()
            .addComponents(
                new client.requires.Discord.ButtonBuilder()
                    .setCustomId(`home-${_id}`)
                    .setLabel("HOME")
                    .setStyle("Primary")
                    .setDisabled(false),
                )

        await interaction.reply({embeds: [embedHome], components: [stats]});
    
        client.on('interactionCreate', async interaction2 => {
            if(interaction2.isButton()) {
                if(interaction2.user.id == interaction.user.id) {
                    if(interaction2.customId == `stats-${_id}`) {
                        await interaction2.update({embeds: [embedStats], components: [home]});
                    } else if(interaction2.customId == `home-${_id}`) {
                        await interaction2.update({embeds: [embedHome], components: [stats]});
                    }
                }
            }
        });
    }
};