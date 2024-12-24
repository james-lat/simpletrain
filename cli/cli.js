import { Command } from 'commander';
import readline from 'readline';
import chalk from 'chalk';
import axios from 'axios';
const program = new Command();

program
  .name('my-cli')
  .description('A CLI that prompts for username and password')
  .version('1.0.0');

program
  .command('login')
  .description('Login with username and password')
  .action(() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter your username: ', (username) => {
      rl.stdoutMuted = true;
      rl.question('Enter your password: ', (password) => {
        rl.close();
          
        console.log(`\nUsername: ${username}`);
        console.log('Password: [hidden]');
      });

      rl._writeToOutput = (string) => {
        if (rl.stdoutMuted) {
          rl.output.write('*');
        } else {
          rl.output.write(string);
        }
      };
    });
  });

// run this locally using "json-server --watch dummy_data.json --port 3000"
//   make sure json-server is installed using npm install -g json-server  
program
  .command('getTemplate <name/id>')
  .description('get dummy template data using name or ID')
  .action(async (nameOrID) => {
    try {
      const response = await axios.get('http://localhost:3000/templates');
      const templates = response.data;
      const template = templates.find(
        (t) => t.name === nameOrId || t.id.toString() === nameOrId
      );

      if(!template){
        console.log("Template not found")
      }
      else{
        // send template to dockerAPI to turn into image
      }


    }
  })

program.parse(process.argv);