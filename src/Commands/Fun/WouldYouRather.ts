import { Command, BaseCommand, Message } from '../../Structures'

const questions: [string, string][] = [
    ['Forever lose your phone', 'Forever lose your wallet'],
    ['Be super rich but always bored', 'Be poor but always happy'],
    ['Be able to fly', 'Be able to become invisible'],
    ['Know when you will die', 'Know how you will die'],
    ['Live without music', 'Live without social media'],
    ['Never use WhatsApp again', 'Never use Instagram again'],
    ['Be the funniest person in the room', 'Be the smartest person in the room'],
    ['Eat your favorite food every single day', 'Never eat your favorite food again'],
    ['Travel back in time', 'Travel to the future'],
    ['Have 10 good friends', 'Have 1 perfect best friend'],
    ['Win ₹1 crore but never travel', 'Travel the whole world but stay broke'],
    ['Be famous but hated', 'Be unknown but loved'],
    ['Sleep 16 hours a day', 'Only need 2 hours of sleep'],
    ['Know every language', 'Know how to play every instrument'],
    ['Never feel cold again', 'Never feel hot again'],
    ['Have photographic memory', 'Be able to forget anything you want'],
    ['Speak to animals', 'Speak to the dead'],
    ['Be 10 years older', 'Be 10 years younger'],
    ['Live in the mountains', 'Live by the beach'],
    ['Always be overdressed', 'Always be underdressed']
]

@Command('wouldyourather', {
    description: 'Would you rather? — fun group question 🤔',
    category: 'fun',
    usage: 'wouldyourather',
    aliases: ['wyr', 'would'],
    cooldown: 8,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const q = questions[Math.floor(Math.random() * questions.length)]
        return void M.reply(
            `🤔 *WOULD YOU RATHER?* 🤔\n` +
            `${'─'.repeat(25)}\n\n` +
            `🅰️ *${q[0]}*\n\n` +
            `        ─── OR ───\n\n` +
            `🅱️ *${q[1]}*\n\n` +
            `${'─'.repeat(25)}\n` +
            `A ya B? Reply karo! 👇\n` +
            `📢 *How to use:* \`${prefix}wyr\``
        )
    }
}
