const { Octokit } = require('@octokit/rest');
const config = require('./config.json');
const cron = require('node-cron');

//set values for commit
const commitOwner = config.owner;
const commitRepo = config.repo;
const commitMessage = config.commit_message;
const commitContent = config.file_content;

function randomletters(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const task = async () => {
    const octokit = new Octokit({
        auth: config.personal_token
    });

    // Generate a random number between 20 and 50
    const loopCount = Math.floor(Math.random() * (50 - 20 + 1)) + 20;

    for(let i = 0; i < loopCount; i++) {
        await new Promise(resolve => {
            setTimeout(async () => {
                await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: commitOwner,
                    repo: commitRepo,
                    path: `${randomletters(10)}.txt`,
                    message: commitMessage,
                    content: Buffer.from(commitContent).toString('base64')
                }).then(res => {
                    console.log(res.data.commit.url);
                }).catch(err => console.log(err));
                resolve();
            }, config.interval);
        });
    }
};

// Schedule the task to run every day at 10:00
cron.schedule('0 10 * * *', task);