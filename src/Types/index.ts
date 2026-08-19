import Baileys, { GroupMetadata, ParticipantAction } from '@adiwajshing/baileys'

export * from './Config'
export * from './Command'
export * from './Message'
export * from './Pokemon'

export interface IContact {
    jid: string
    username: string
    isMod: boolean
}

export interface ISender extends IContact {
    isAdmin: boolean
}

export interface ICall {
    content: {
        attrs: {
            'call-creator': string
        }
        tag: string
    }[]
}

export interface IEvent {
    jid: string
    participants: string[]
    action: ParticipantAction
    author?: string
}

export interface YT_Search {
    type: string
    videoId: string
    url: string
    title: string
    description: string
    image: string
    thumbnail: string
    seconds: number
    timestamp: string
    duration: {
        seconds: number
        timestamp: string
    }
    ago: string
    views: number
    author: {
        name: string
        url: string
    }
}

export enum GroupFeatures {
    'events' = 'By enabling this feature, the bot reacts when a member is promoted or demoted',
    'welcome' = 'By enabling this feature, the bot sends a welcome message when someone joins and a farewell when someone leaves',
    'wild' = 'By enabling this feature, it will send wild pokemon',
    'chara' = 'By enabling this feature, it will send collectible cards in the group',
    'mods' = "By enabling this feature, it enables the bot to remove the member (except for admins) which sent an invite link of other groups. This will work if and only if the bot's an admin",
    'nsfw' = 'By enabling this feature, it enables the bot to send *NSFW* contents',
    'casino' = 'By enabling this feature, casino game commands (coinflip, dice, roulette, slot etc.) will be usable in this group',
    'birthday' = 'By enabling this feature, the bot announces birthdays of group members in the group'
}

export interface IGroup extends GroupMetadata {
    admins?: string[]
}

export type client = ReturnType<typeof Baileys>
