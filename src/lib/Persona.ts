import { Rias } from './Rias'
import { Alya } from './Alya'
import { Akino } from './Akino'
import { Hinata } from './Hinata'
import { ZeroTwo } from './ZeroTwo'
import { Miku } from './Miku'

export type TPersona = 'rias' | 'alya' | 'akino' | 'hinata' | 'zerotwo' | 'miku'

/** Dialogue set for the currently active bot persona */
export const getPersona = (persona: TPersona): typeof Rias => {
    switch (persona) {
        case 'alya':    return Alya
        case 'akino':   return Akino
        case 'hinata':  return Hinata
        case 'zerotwo': return ZeroTwo
        case 'miku':    return Miku
        default:        return Rias
    }
}

/** Display name for the currently active bot persona */
export const getPersonaName = (persona: TPersona): string => {
    switch (persona) {
        case 'alya':    return 'Alya Kujou'
        case 'akino':   return 'Akino Himejima'
        case 'hinata':  return 'Hinata Hyuga'
        case 'zerotwo': return 'Zero Two'
        case 'miku':    return 'Hatsune Miku'
        default:        return 'Rias Gremory'
    }
}
