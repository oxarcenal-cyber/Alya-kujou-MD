import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { Document } from 'mongoose'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GroupSchema {
    @prop({ type: String, required: true, default: 'all' })
    public bot!: string 

    @prop({ type: String, unique: true, required: true })
    public jid!: string

    @prop({ type: Boolean, required: true, default: false })
    public events!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public mods!: boolean

   @prop({ type: Boolean, required: true, default: false })
    public chara!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public nsfw!: boolean
  
    @prop({ type: Boolean, required: true, default: false })
    public wild!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public welcome!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public casino!: boolean

    @prop({ type: String, default: '' })
    public rules!: string

    @prop({ type: Boolean, required: true, default: false })
    public groupChatbot!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public dxdChat!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public dxdGreetings!: boolean

    @prop({ type: String, required: true, default: 'en' })
    public language!: string

    @prop({ type: Boolean, required: true, default: false })
    public autoReact!: boolean

    @prop({ type: String, required: true, default: 'all' })
    public autoReactMode!: string

    @prop({ type: Boolean, required: true, default: false })
    public smashboom!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public autoCute!: boolean

    @prop({ type: () => [Object], required: true, default: [] })
    public gymHistory!: { winner: string; pokemon: string; type: string; reward: string; date: number }[]

    @prop({ type: Boolean, required: true, default: false })
    public badWords!: boolean

    @prop({ type: () => [String], required: true, default: [] })
    public badWordsList!: string[]

    @prop({ type: Boolean, required: true, default: false })
    public beastChat!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public newsEnabled!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public birthday!: boolean

    @prop({ type: Boolean, required: true, default: false })
    public studyAi!: boolean

    @prop({ type: String, required: true, default: 'all' })
    public studyAiMode!: string

    @prop({ type: Number, required: true, default: 0 })
    public totalMessages!: number

    @prop({ type: () => [Object], required: true, default: [] })
    public memberMsgCount!: { jid: string; count: number }[]
}

export type TGroupModel = GroupSchema & Document

export const groupSchema = getModelForClass(GroupSchema)
