const { Command } = require('commander');
const inquirer = require('@inquirer/prompts');
const program = new Command();

program
    .command('greet <name>')
    .description('Greet someone by name')
    .action((name) => {
        console.log(`Hello, ${name}!`);
    });

async function handleLogin() {
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
          },
        ]);
    
        console.log(`\nLogin Successful!`);
        console.log(`Username: ${answers.username}`);
        console.log('Password: [hidden for security]');
      } catch (error) {
        console.error('Error during login:', error.message);
      }
    }
    
    program
      .command('login')
      .description('Login with your username and password')
      .action(() => {
        handleLogin();
      });
  

program.parse(process.argv);