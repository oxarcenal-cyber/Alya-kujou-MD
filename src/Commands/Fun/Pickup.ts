import { Command, BaseCommand, Message } from '../../Structures'

const pickupLines = [
    'Are you a magician? Because whenever I look at you, everyone else disappears.',
    "Do you have a map? I keep getting lost in your eyes.",
    "Are you a parking ticket? Because you've got 'fine' written all over you.",
    'Is your name Google? Because you have everything I have been searching for.',
    'Are you a bank loan? Because you have my interest.',
    'Do you believe in love at first sight, or should I walk by again?',
    'Are you made of copper and tellurium? Because you are CuTe.',
    'Are you a time traveler? Because I see you in my future.',
    'I must be a snowflake, because I have fallen for you.',
    'Are you a star? Because your beauty lights up the universe.',
    'If you were a vegetable, you would be a cute-cumber.',
    'Are you Australian? Because you meet all of my koala-fications.',
    'Do you have a Band-Aid? Because I just scraped my knee falling for you.',
    'I was wondering if you had an extra heart… because mine was just stolen.',
    'My doctor told me I am lacking Vitamin U.',
    'Are you a keyboard? Because you are just my type.',
    'Are you a camera? Because every time I look at you, I smile.',
    'If beauty were time, you would be an eternity.',
    'Are you a library? Because I am checking you out.',
    'Do you have a pencil? Because I want to erase your past and write our future.'
]

@Command('pickup', {
    description: 'Get a random pickup line 😏',
    category: 'fun',
    usage: 'pickup',
    aliases: ['pickupline', 'flirt'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const prefix = this.client.config.prefix
        const line = pickupLines[Math.floor(Math.random() * pickupLines.length)]
        return void M.reply(
            `😏 *PICKUP LINE* 😏\n` +
            `${'─'.repeat(25)}\n\n` +
            `💘 ${line}\n\n` +
            `${'─'.repeat(25)}\n` +
            `📢 *How to use:* \`${prefix}pickup\``
        )
    }
}
