import { BaseCommand, Command, Message } from '../../Structures'

@Command('pm', {

    description: 'Promote yourself to admin in a group (dev only)',

    category: 'dev',

    usage: 'pm',

    aliases: ['pm'],

    exp: 10,

    cooldown: 10,

})

export default class command extends BaseCommand {

    override execute = async (M: Message): Promise<void> => {

        if (!M.groupMetadata) return void M.reply('*Try Again!*')

        const users = M.mentioned

        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)

        if (!users.length || users.length < 1) return void M.reply('')

        const mentioned = users

        let text = ''

        for (const user of users) {

            const i = users.indexOf(user)

            if (i === 0) text += '\n'

            if (M.groupMetadata.admins?.includes(user)) {

                text += `@${user.split('@')[0]} My Master you are already admin chill😍 .`

                continue

            }

            await this.client.groupParticipantsUpdate(M.from, [user], 'promote')

            text += `*🏮 Status:*\n\n i promoted you my master *@${user.split('@')[0]}* `

        }

        return void M.reply(text, 'text', undefined, undefined, undefined, mentioned)

    }

}

