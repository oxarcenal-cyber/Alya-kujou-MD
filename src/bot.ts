import chalk from 'chalk'
import { Client } from './Structures'
import { MessageHandler, AssetHandler, CallHandler, EventHandler, NewsHandler } from './Handlers'

const _origInfo = console.info.bind(console)
console.info = (...args: unknown[]): void => {
    const msg = typeof args[0] === 'string' ? args[0] : ''
    if (msg.startsWith('Closing session') || msg.startsWith('Removing old closed') || msg.startsWith('Closing open session')) return
    _origInfo(...args)
}

// Last-resort telemetry for rejections that escape their local try/catch
// (e.g. WhatsApp rate-overlimit during an internal groupMetadata fetch).
// This does not replace per-call error handling — it just stops a single
// stray rejection from taking down the whole bot.
process.on('unhandledRejection', (reason) => {
    console.error('[RIAS GREMORY] Unhandled rejection:', reason)
})

// An uncaughtException means Node's internal invariants may already be
// broken (partial socket/DB state, etc.), so we do not keep running on the
// same process. Log with context, then exit non-zero so the workflow's
// process manager restarts us cleanly instead of limping along corrupted.
process.on('uncaughtException', (error) => {
    console.error('[RIAS GREMORY] Uncaught exception, restarting:', error)
    process.exit(1)
})

;(async (): Promise<void> => {
    const client = new Client()

    // Prepare every local handler before opening the WhatsApp socket. On a fast
    // reconnect, WhatsApp can deliver the first messages immediately after the
    // socket opens; registering these listeners after `start()` creates a small
    // but real window where those messages are dropped.
    new AssetHandler(client).loadAssets()

    const messageHandler = new MessageHandler(client)

    const { handleEvents, sendMessageOnJoiningGroup } = new EventHandler(client)

    const { handleCall } = new CallHandler(client)

    // Command modules are relatively expensive to require. Do not make
    // WhatsApp wait for all of them before the socket can start. Messages that
    // arrive during this short window are replayed once the command registry is
    // ready.
    let handlersReady = false
    const pendingMessages: import('./Structures').Message[] = []

    client.on('new_message', async (M) => {
        if (!handlersReady) {
            pendingMessages.push(M)
            return
        }
        try { await messageHandler.handleMessage(M) }
        catch (err) { console.error('[ALYA MD] handleMessage error:', err) }
    })

    client.on('participants_update', async (event) => {
        try { await handleEvents(event) }
        catch (err) { console.error('[ALYA MD] handleEvents error:', err) }
    })

    client.on('new_group_joined', async (group) => {
        try {
            messageHandler.groups.push(group.jid)
            await sendMessageOnJoiningGroup(group)
        } catch (err) { console.error('[ALYA MD] new_group_joined error:', err) }
    })

    client.on('new_call', async (call) => {
        try { await handleCall(call) }
        catch (err) { console.error('[ALYA MD] handleCall error:', err) }
    })

    client.once('open', () => {
        // Group discovery, feature caches, and news warm-up are maintenance
        // work. Defer them so the first command after a reconnect is not
        // competing with a large group metadata request on the same socket.
        setTimeout(() => {
            void (async () => {
                messageHandler.groups = await client.getAllGroups()
                await Promise.all([
                    messageHandler.loadWildEnabledGroups(),
                    messageHandler.loadCharaEnabledGroups(),
                    messageHandler.loadSmashBoomGroups()
                ])

                // ─── Group Health Report ───────────────────────────────────────
                const totalGroups = messageHandler.groups.length
                const wildCount   = messageHandler.wild.length
                const charaCount  = messageHandler.chara.length
                const smashCount  = messageHandler.smashboom.length

                const status =
                    totalGroups === 0 ? chalk.gray('No groups yet') :
                    totalGroups <= 5  ? chalk.greenBright('Healthy') :
                    totalGroups <= 15 ? chalk.yellowBright('Moderate load') :
                                        chalk.redBright('High load — monitor DB')

                client.log(
                    `─── Group Health Report ───────────────────────────────────────\n` +
                    `  Total Groups  : ${chalk.cyanBright(totalGroups)}\n` +
                    `  Wild Spawn    : ${chalk.blueBright(wildCount)} group${wildCount !== 1 ? 's' : ''} enabled\n` +
                    `  Card Spawn    : ${chalk.blueBright(charaCount)} group${charaCount !== 1 ? 's' : ''} enabled\n` +
                    `  Smash Boom    : ${chalk.blueBright(smashCount)} group${smashCount !== 1 ? 's' : ''} enabled\n` +
                    `  Load Status   : ${status}\n` +
                    (totalGroups > 5
                        ? `  ${chalk.yellowBright('⚠')}  Tip: DB queries are bulk-optimized — no extra load per group\n`
                        : '') +
                    (totalGroups > 15
                        ? `  ${chalk.redBright('!')}  High group count detected — consider enabling MongoDB Atlas indexes\n`
                        : '') +
                    `───────────────────────────────────────────────────────────────`
                )

                messageHandler.spawnDxDGreetings()
                messageHandler.startLoanEmiCron()
                messageHandler.startBirthdayCron()
                messageHandler.startAnalyticsFlush()
                messageHandler.startRocketRaids()
                new NewsHandler(client).start()
            })().catch((err) => {
                console.error('[ALYA MD] Post-connect initialization error:', err)
            })
        }, 1000)
    })

    // Start the socket only after the message, event, and call listeners are
    // already installed. Reconnects reuse the same listeners above.
    await client.start()

    // Loading commands after socket creation removes the avoidable startup
    // dead-time. The queue above protects messages if WhatsApp opens first.
    await messageHandler.loadCommands()
    handlersReady = true
    const queued = pendingMessages.splice(0)
    await Promise.allSettled(queued.map(async (M) => {
        try { await messageHandler.handleMessage(M) }
        catch (err) { console.error('[ALYA MD] queued handleMessage error:', err) }
    }))
})()
