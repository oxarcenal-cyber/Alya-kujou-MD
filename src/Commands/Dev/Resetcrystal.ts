import { BaseCommand, Command, Message } from '../../Structures'

@Command('rc', {
    category: 'dev',
    description: 'reset the gold of the @tagged user',
    usage: 'resetcystal',
    exp: 25,
    cooldown: 0
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M?.sender?.isMod) {
            if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
            if (!users.length || users.length < 0) return void M.reply('Tag or quote a user to give')
            // if (users[0] === M.sender.jid) return void M.reply('tag someone')
            if (M.numbers.length < 1) return void M.reply(`amount?`)
            const user = users[0]
            const { wallet } = await this.client.DB.getUser(M.sender.jid)
            const amount = M.numbers[0]
            // if ((wallet - amount) < 0) return void M.reply(`Check ur wallet`)
            // await this.client.DB.setCrystal(M.sender.jid, -amount)
            await this.client.DB.setCrystal(user, amount)
            return void M.reply(`gold has been set to *💎${amount}*  of @${user.split('@')[0]}`, 'text', undefined, undefined, undefined, [
                M.sender.jid,
                user
            ])
        }
    }
}
