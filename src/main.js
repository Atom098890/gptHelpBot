import {Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import dotenv from 'dotenv';
import { ogg } from './ogg.js';
import { openai } from './opanai.js';
import { code } from 'telegraf/format';
dotenv.config();

const bot = new Telegraf(process.env.TOKEN_BOT);

bot.command('start', async (ctx)=> {
    const users = process.env.USERS.split(',');
    
    users.forEach((u) => {
        if (!ctx.message.from.id.toString().includes(u)) {
            bot.stop();
        } else {
            bot.on(message('voice'), async (ctx) => {
                try {
                    await ctx.reply(code('wait...'));
                    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
                    const userId = String(ctx.message.from.id);
                    const oggPath = await ogg.create(link.href, userId);
                    const mp3Path = await ogg.toMp3(oggPath, userId);
                    
                    const text = await openai.transcription(mp3Path);
            
                    const messages = [{role: 'user', content: text}];
                    const response = await openai.chat(messages);
            
                    await ctx.reply(response);
                } catch(e) {
                    throw new Error(`Error voice message ${e.message}`);
                }
            });
        }
    });
    
    // await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));