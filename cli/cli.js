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

program.parse(process.argv);