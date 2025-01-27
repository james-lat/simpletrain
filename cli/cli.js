import { Command } from 'commander';
import readline from 'readline';
import chalk from 'chalk';
import axios from 'axios';
import https from 'https';

const program = new Command();

program
  .name('my-cli')
  .description('A CLI that prompts for username and password')
  .version('1.0.0');

program
  .command('login')
  .description('Login with username and password')
  .action(async() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    axios.get('https://127.0.0.1:8000/api/auth_link/', {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false  // Disable certificate validation
      })
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });

    rl.question('You need to authenticate here: ', (username) => {

      rl.stdoutMuted = true;
      // rl.question('Enter your password: ', (password) => {
      //   rl.close();
          
      //   console.log(`\nUsername: ${username}`);
      //   console.log('Password: [hidden]');
      // });

      rl._writeToOutput = (string) => {
        if (rl.stdoutMuted) {
          rl.output.write('*');
        } else {
          rl.output.write(string);
        }
      };
    });
  });

// run this locally using " npx json-server --watch dummy_data.json --port 3000"
//   make sure json-server is installed using npm install -g json-server  
program
  .command('getTemplate <name/id>')
  .description('get dummy template data using name or ID')
  .action(async (nameOrId) => {
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
        console.log("template found")
        // send template to dockerAPI to turn into image
        try {
          console.log("trying create container")
          const response = await axios.post('http://localhost:3001/create-container', template);
          console.log("repsonse from post request: \n")
          console.log(response.data.message)
        }
        catch (error){
          console.log('Error: 1')
          console.log(error.response?.data || error.message)
        }
      }
    }
    catch (error){
      console.log('Error: 2')
      console.log(error)
    }
  })

program.parse(process.argv);