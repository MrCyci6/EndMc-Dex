const { Client, Collection } = require('discord.js');

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
            Discord: require('discord.js'),
            fs: require('fs'),
            path: require('path')
        }

        this.config = require(this.requires.path.join(__dirname, "..", "storage", "config.json"));
        require('dotenv').config({ path: this.requires.path.join(__dirname, "..", "storage", ".env") });

        this.loadSlashCommands();
        this.loadEvents();

        this.login(process.env.TOKEN)
    }

    loadSlashCommands() {
        let i = 0;
        this.requires.fs.readdirSync(`${this.requires.path.join(__dirname, "..", "slashcommands")}`).forEach(dir => {
            let commands = this.requires.fs.readdirSync(`${this.requires.path.join(__dirname, "..", "slashcommands", dir)}`).filter(files => files.endsWith(".js"));
      
            for (let file of commands) {
                let command = require(`${this.requires.path.join(__dirname, "..", "slashcommands", dir, file)}`);
                
                if(!command.execute) {
                    let subcommands = this.requires.fs.readdirSync(this.requires.path.join(__dirname, "..", "slashcommands", dir, "subcommands")).filter(files => files.endsWith(".js"));
                    command.data.options = [];
                    command.executes = {};
                    for(let sub of subcommands) {
                        let subcommand = require(this.requires.path.join(__dirname, "..", "slashcommands", dir, "subcommands", sub));
                        command.data.options.push(subcommand.data)
                        command.executes[subcommand.data.name] = subcommand.execute;
                    }
                }


                this.commands.set(command.data.name, command);
                this.command.push(command.data);

                console.log(`[+] command : ${file.replace('.js', "")} ${command.data.name} [${dir}]`); i++;
            }
        });
        console.log(`[*] ${i} commands loaded\n`);
    }

    loadEvents() {
        let i = 0;
        this.requires.fs.readdirSync(`${this.requires.path.join(__dirname, "..", "events")}`).forEach(dir => {
            let events = this.requires.fs.readdirSync(`${this.requires.path.join(__dirname, "..", "events", dir)}`).filter(files => files.endsWith(".js"));
          
            for (let file of events) {
                let event = require(`${this.requires.path.join(__dirname, "..", "events", dir, file)}`);
                
                if(event.data.once) {
                    this.once(event.data.name, (...args) => event.execute(this, ...args));
                } else {
                    this.on(event.data.name, (...args) => event.execute(this, ...args));
                }

                console.log(`[+] event : ${file.replace('.js', "")} (${event.data.name}) [${dir}]`); i++;
            }
        })
        console.log(`[*] ${i} events loaded\n`);
    }

}

exports.MrBot = MrBot;