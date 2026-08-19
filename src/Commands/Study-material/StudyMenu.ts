import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

const DIVIDER = '━'.repeat(28)

const COMMANDS = [
    { cmd: 'ask',        args: '<question>',         emoji: '🤖', desc: 'Ask any academic question — AI answers it'       },
    { cmd: 'solve',      args: '<problem>',           emoji: '🔢', desc: 'Solve math/science problems step-by-step'         },
    { cmd: 'explain',    args: '<topic>',             emoji: '💡', desc: 'Get a simple explanation of any topic'             },
    { cmd: 'summarize',  args: '<text or reply>',     emoji: '📝', desc: 'Summarize a long paragraph into key points'       },
    { cmd: 'formula',    args: '<topic>',             emoji: '📐', desc: 'Get formulas for Physics / Math / Chemistry'       },
    { cmd: 'essay',      args: '<topic>',             emoji: '✍️',  desc: 'Generate a structured essay on any topic'         },
    { cmd: 'grammar',    args: '<text or reply>',     emoji: '✅', desc: 'Check & correct grammar mistakes in your text'    },
    { cmd: 'paraphrase', args: '<text or reply>',     emoji: '🔄', desc: 'Rewrite text in fresh words, same meaning'        },
    { cmd: 'mcq',        args: '<topic> [count]',     emoji: '📋', desc: 'Generate multiple-choice practice questions'      },
    { cmd: 'flashcard',  args: 'add/list/del/clear',  emoji: '🃏', desc: 'Create & manage your personal flashcard deck'     },
    { cmd: 'studytodo',  args: 'add/done/list/clear', emoji: '📌', desc: 'Track your study tasks & homework to-do list'     },
]

@Command('study', {
    description: 'Open the Study Material menu — all study & homework commands in one place 📚',
    category: 'study',
    usage: 'study',
    aliases: ['studymenu', 'sm'],
    cooldown: 5,
    exp: 10,
    dm: true
})
export default class StudyMenuCommand extends BaseCommand {
    override execute = async (M: Message, _args: IArgs): Promise<void> => {
        const p = this.client.config.prefix

        const text =
            `╔${DIVIDER}╗\n` +
            `║   📚  *STUDY MATERIAL — COMMAND MENU*  📚   ║\n` +
            `╚${DIVIDER}╝\n\n` +
            `🎓 _Your personal AI-powered study assistant is ready!_\n` +
            `_Tap a button below or type a command with prefix_ *${p}*\n\n` +
            `${DIVIDER}\n\n` +
            `🤖 *ask* — Academic Q&A\n` +
            `🔢 *solve* — Math/Science solver\n` +
            `💡 *explain* — Topic explanation\n` +
            `📝 *summarize* — Paragraph summarizer\n` +
            `📐 *formula* — Formulas & equations\n` +
            `✍️ *essay* — Essay generator\n` +
            `✅ *grammar* — Grammar checker\n` +
            `🔄 *paraphrase* — Text rewriter\n` +
            `📋 *mcq* — MCQ practice questions\n` +
            `🃏 *flashcard* — Flashcard deck\n` +
            `📌 *studytodo* — Study task tracker\n\n` +
            `${DIVIDER}\n` +
            `⚡ _Powered by RedzeoX × OpenAI_`

        // Build list rows grouped by category
        const aiRows = [
            { title: '🤖 Ask',       description: 'Ask any academic question',          id: `${p}ask ` },
            { title: '🔢 Solve',     description: 'Solve math/science step-by-step',    id: `${p}solve ` },
            { title: '💡 Explain',   description: 'Simple explanation of any topic',    id: `${p}explain ` },
            { title: '📝 Summarize', description: 'Summarize a long paragraph',         id: `${p}summarize ` },
            { title: '📐 Formula',   description: 'Formulas for Physics/Math/Chem',     id: `${p}formula ` },
            { title: '✍️ Essay',     description: 'Generate a structured essay',         id: `${p}essay ` },
            { title: '✅ Grammar',   description: 'Check & correct grammar',             id: `${p}grammar ` },
            { title: '🔄 Paraphrase',description: 'Rewrite text in fresh words',        id: `${p}paraphrase ` },
            { title: '📋 MCQ',       description: 'Multiple-choice practice questions', id: `${p}mcq ` },
        ]
        const toolRows = [
            { title: '🃏 Flashcard', description: 'Manage your flashcard deck',         id: `${p}flashcard` },
            { title: '📌 Study Todo',description: 'Track study tasks & homework',       id: `${p}studytodo` },
            { title: '🌟 Roxy AI',   description: 'Personal AI study assistant',        id: `${p}roxy ` },
        ]

        return void await this.client.sendMessage(M.from, {
            text,
            footer: '⚡ RedzeoX × OpenAI',
            buttons: [{
                text: '📚 Browse Commands',
                sections: [
                    { title: '🤖 AI Study Tools', rows: aiRows },
                    { title: '🛠️ Study Utilities', rows: toolRows }
                ]
            }]
        } as any, { quoted: M.message as any })
    }
}
