import { Client, Collection } from 'discord.js';
import discord from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

class MrBot extends Client {
    constructor(config = { 
        intents: [
            3276799
        ]
    }) {
        super(config);
        
        this.author = `@mrcyci6`;
        this.commands = new Collection();
        this.command = [];
        
        this.requires = {
            Discord: discord,
            fs: fs,
            path: path
        }

        this.init();
    }

    async init() {
        this.config = JSON.parse(await fs.readFile("./storage/config.json", "utf-8"));
        this.functions = (await import(`./functions/utils.js`)).default(this);
        dotenv.config({ path: `./storage/.env` });

        await this.loadSlashCommands();
        await this.loadEvents();

        this.login(process.env.TOKEN)
    }

    async loadSlashCommands() {
        (await fs.readdir(`./slashcommands`)).forEach(async dir => {
            const commands = (await fs.readdir(`./slashcommands/${dir}`)).filter(files => files.endsWith(".js"));
      
            for (let file of commands) {
                let command = (await import(`../slashcommands/${dir}/${file}`)).default;

                if(!command.execute) {
                    const subcommands = (await fs.readdir(`./slashcommands/${dir}/subcommands`)).filter(files => files.endsWith(".js"));
                    command.data.options = [];
                    command.executes = {};
                    for(const sub of subcommands) {
                        let subcommand = (await import(`../slashcommands/${dir}/subcommands/${sub}`)).default;
                        command.data.options.push(subcommand.data)
                        command.executes[subcommand.data.name] = subcommand.execute;
                    }
                }


                this.commands.set(command.data.name, command);
                this.command.push(command.data);

                console.log(`[+] command : ${file.replace('.js', "")} ${command.data.name} [${dir}]`);
            }
        });
    }

    async loadEvents() {
        (await fs.readdir(`./events`)).forEach(async dir => {
            const events = (await fs.readdir(`./events/${dir}`)).filter(files => files.endsWith(".js"));
          
            for (const file of events) {
                let event = (await import(`../events/${dir}/${file}`)).default;
                
                if(event.data.once) {
                    this.once(event.data.name, (...args) => event.execute(this, ...args));
                } else {
                    this.on(event.data.name, (...args) => event.execute(this, ...args));
                }

                console.log(`[+] event : ${file.replace('.js', "")} (${event.data.name}) [${dir}]`);
            }
        })
    }

}

export { MrBot };