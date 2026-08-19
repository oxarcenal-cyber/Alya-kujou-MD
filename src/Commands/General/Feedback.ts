import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('suggest', {
    description: 'Send your suggestion or idea to the bot owner',
    aliases: ['feedback', 'idea'],
    cooldown: 30,
    exp: 5,
    usage: 'suggest <your idea here>',
    category: 'general',
    dm: true
})
export default class SuggestCommand extends BaseCommand {
    public override execute = async (M: Message, args: IArgs): Promise<void> => {
        const text = args.context.trim()
        if (!text)
            return void await M.reply(
                `💡 *How to submit a suggestion?*\n\n` +
                `\`${this.client.config.prefix}suggest <your idea>\`\n\n` +
                `*Example:*\n` +
                `\`${this.client.config.prefix}suggest Add a trivia game command!\`\n\n` +
                `📝 _All suggestions are forwarded to the owner!_`
            )

        await this.client.DB.saveFeedback(M.sender.jid, M.sender.username, 'suggestion', text)
        await M.reply(
            `✅ *Suggestion Submitted!* 🎉\n\n` +
            `📝 *Your idea:*\n_"${text}"_\n\n` +
            `🙏 Thank you! We will review it carefully.\n` +
            `💫 _The owner team will check it soon!_`
        )
    }
}

@Command('bugreport', {
    description: 'Report a bug or error you encountered',
    aliases: ['reportbug', 'bug'],
    cooldown: 30,
    exp: 5,
    usage: 'bugreport <describe the error>',
    category: 'general',
    dm: true
})
export class BugReportCommand extends BaseCommand {
    public override execute = async (M: Message, args: IArgs): Promise<void> => {
        const text = args.context.trim()
        if (!text)
            return void await M.reply(
                `🐛 *How to report a bug?*\n\n` +
                `\`${this.client.config.prefix}bugreport <what went wrong>\`\n\n` +
                `*Example:*\n` +
                `\`${this.client.config.prefix}bugreport !daily command is not working\`\n\n` +
                `📝 _A detailed description helps us fix it faster!_`
            )

        await this.client.DB.saveFeedback(M.sender.jid, M.sender.username, 'bugreport', text)
        await M.reply(
            `🐛 *Bug Report Submitted!* 🔧\n\n` +
            `📝 *Problem:*\n_"${text}"_\n\n` +
            `🙏 Thank you for reporting this!\n` +
            `⚡ _The owner will fix it as soon as possible!_`
        )
    }
}

@Command('request', {
    description: 'Request a new command or feature',
    aliases: ['cmdrequest', 'featurereq'],
    cooldown: 30,
    exp: 5,
    usage: 'request <what you want>',
    category: 'general',
    dm: true
})
export class RequestCommand extends BaseCommand {
    public override execute = async (M: Message, args: IArgs): Promise<void> => {
        const text = args.context.trim()
        if (!text)
            return void await M.reply(
                `📬 *How to request a command?*\n\n` +
                `\`${this.client.config.prefix}request <what command you want>\`\n\n` +
                `*Example:*\n` +
                `\`${this.client.config.prefix}request Add a meme generator command\`\n\n` +
                `📝 _Most popular requests get added first!_`
            )

        await this.client.DB.saveFeedback(M.sender.jid, M.sender.username, 'request', text)
        await M.reply(
            `📬 *Feature Request Submitted!* ⭐\n\n` +
            `📝 *Request:*\n_"${text}"_\n\n` +
            `🙏 Thank you! We'll check if it can be added.\n` +
            `💪 _Popular requests get implemented first!_`
        )
    }
}
