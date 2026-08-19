import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { t } from '../../lib'

interface WttrResponse {
    current_condition: [{
        temp_C: string
        temp_F: string
        weatherDesc: [{ value: string }]
        humidity: string
        windspeedKmph: string
        FeelsLikeC: string
        uvIndex: string
        visibility: string
    }]
    nearest_area: [{ areaName: [{ value: string }]; country: [{ value: string }] }]
}

@Command('weather', {
    description: 'Check live weather of any city 🌤️',
    category: 'utils',
    usage: 'weather <city name>',
    aliases: ['w', 'mausam'],
    cooldown: 10,
    exp: 15,
    dm: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const lang = await this.getLang(M)
        const prefix = this.client.config.prefix
        if (!context.trim())
            return void M.reply(t('weather_usage', lang, { p: prefix }))

        const city = context.trim()
        try {
            const data = await this.client.utils.fetch<WttrResponse>(
                `https://wttr.in/${encodeURIComponent(city)}?format=j1`
            )
            if (!data?.current_condition)
                return void M.reply(t('weather_not_found', lang, { city }))

            const cur = data.current_condition[0]
            const area = data.nearest_area[0]
            const desc = cur.weatherDesc[0].value
            const emoji = this.getEmoji(desc)

            return void M.reply(
                `${emoji} *WEATHER REPORT* ${emoji}\n` +
                `${'─'.repeat(25)}\n` +
                `📍 *Location:* ${area.areaName[0].value}, ${area.country[0].value}\n` +
                `${'─'.repeat(25)}\n\n` +
                `🌡️ *Temperature:* ${cur.temp_C}°C / ${cur.temp_F}°F\n` +
                `🤔 *Feels Like:* ${cur.FeelsLikeC}°C\n` +
                `☁️ *Condition:* ${desc}\n` +
                `💧 *Humidity:* ${cur.humidity}%\n` +
                `💨 *Wind:* ${cur.windspeedKmph} km/h\n` +
                `👁️ *Visibility:* ${cur.visibility} km\n` +
                `☀️ *UV Index:* ${cur.uvIndex}\n` +
                `${'─'.repeat(25)}\n` +
                `📢 *How to use:* \`${prefix}weather <city>\``
            )
        } catch {
            return void M.reply(t('weather_error', lang, { city }))
        }
    }

    private getEmoji = (desc: string): string => {
        const d = desc.toLowerCase()
        if (d.includes('rain')) return '🌧️'
        if (d.includes('snow')) return '❄️'
        if (d.includes('thunder')) return '⛈️'
        if (d.includes('cloud')) return '☁️'
        if (d.includes('sunny') || d.includes('clear')) return '☀️'
        if (d.includes('fog') || d.includes('mist')) return '🌫️'
        return '🌤️'
    }
}
