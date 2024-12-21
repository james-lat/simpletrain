const { Command } = require('commander');
const inquirer = require('@inquirer/inquirer');
const program = new Command();

program
    .command('greet <name>')
    .description('Greet someone by name')
    .action((name) => {
        console.log(`Hello, ${name}!`);
    });

program
    .command('login')
    .description('Login with your username and password')
    .action(async () => {
        try {
        const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Enter your username:',
        },
        {
          type: 'password',
          name: 'password',
          message: 'Enter your password:',
        }
      ]);
  
      console.log(`Username: ${answers.username}`);
      console.log('Password has been securely entered.');
        } catch (error) {
            console.error('Error during prompt:', error);
        }
    });
  

program.parse(process.argv);