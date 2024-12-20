const { Command } = require('commander');
const program = new Command();

program
    .name('test')
    .description('Greeting using commander.js')
    .version('1.0.0');

program
    .command('greet <name>')
    .description('Greet someone by name')
    .action((name) => {
        console.log(`Hello, ${name}!`);
    });

program.parse(process.argv);