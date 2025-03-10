import { Command } from 'commander';
import readline from 'readline';
import chalk from 'chalk';
import axios from 'axios';
import https from 'https';
import WebSocket from 'ws';

const program = new Command();

// Function to fetch the authentication link and cookies
async function getAuthLink() {
  try {
    const response = await axios.get('https://127.0.0.1:8443/api/auth_link/', {
      withCredentials: true,  // Include cookies in request/response
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disable cert validation
    });
    return {
      auth_url: response.data.auth_url,
      ws_auth_url: response.data.ws_auth_url,
      cookies: response.headers['set-cookie'] || [] // Ensure cookies is an array
    };
  } catch (error) {
    console.error('Error fetching auth_link:', error.message);
    return null;
  }
}

// Function to check authentication status (optional, kept for reference)
// async function checkAuthStatus() {
//   try {
//     const response = await axios.get('https://127.0.0.1:8443/api/auth_status/', {
//       withCredentials: true,
//       httpsAgent: new https.Agent({ rejectUnauthorized: false })
//     });
//     return response.data.authenticated;
//   } catch (error) {
//     console.error('Error checking authentication status:', error.message);
//     return false;
//   }
// }

program
  .command('login')
  .description('Login with username and password')
  .action(async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("Fetching authentication link...");
    const authData = await getAuthLink();

    if (!authData || !authData.ws_auth_url) {
      console.log("Failed to fetch authentication link.");
      rl.close();
      return;
    }

    //Remember websocket check only launches in home.html
    console.log(`You need to authenticate here: ${authData.auth_url}`);
    console.log(`WebSocket: ${authData.ws_auth_url}`);

    // Create WebSocket with session cookies
    const socket = new WebSocket(authData.ws_auth_url, {
      headers: { Cookie: authData.cookies.join('; ') }, // Pass sessionid cookie
      rejectUnauthorized: false // Ignore SSL certificate verification
    });

    socket.on('open', () => {
      console.log("Waiting for authentication confirmation...");
    });

    socket.on('message', async (data) => {
      const message = JSON.parse(data);
      console.log(message);

      if (message.status === "authenticated") {
        console.log(chalk.green("Login confirmed! Authentication successful!"));
        socket.close();
        process.stdin.setRawMode(false);
        process.stdin.pause();
        rl.close();
      } else if (message.status === "pending") {
        console.log("Authentication still pending...");
      }
    });

    socket.on('close', () => {
      console.log("WebSocket connection closed.");
    });

    socket.on('error', (err) => {
      console.error("WebSocket error:", err);
    });
  });

program.parse(process.argv);