"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const Structures_1 = require("./Structures");
const Handlers_1 = require("./Handlers");
const _origInfo = console.info.bind(console);
console.info = (...args) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.startsWith('Closing session') || msg.startsWith('Removing old closed') || msg.startsWith('Closing open session'))
        return;
    _origInfo(...args);
};
// Last-resort telemetry for rejections that escape their local try/catch
// (e.g. WhatsApp rate-overlimit during an internal groupMetadata fetch).
// This does not replace per-call error handling — it just stops a single
// stray rejection from taking down the whole bot.
process.on('unhandledRejection', (reason) => {
    console.error('[RIAS GREMORY] Unhandled rejection:', reason);
});
// An uncaughtException means Node's internal invariants may already be
// broken (partial socket/DB state, etc.), so we do not keep running on the
// same process. Log with context, then exit non-zero so the workflow's
// process manager restarts us cleanly instead of limping along corrupted.
process.on('uncaughtException', (error) => {
    console.error('[RIAS GREMORY] Uncaught exception, restarting:', error);
    process.exit(1);
});
(async () => {
    const client = new Structures_1.Client();
    // Prepare every local handler before opening the WhatsApp socket. On a fast
    // reconnect, WhatsApp can deliver the first messages immediately after the
    // socket opens; registering these listeners after `start()` creates a small
    // but real window where those messages are dropped.
    new Handlers_1.AssetHandler(client).loadAssets();
    const messageHandler = new Handlers_1.MessageHandler(client);
    const { handleEvents, sendMessageOnJoiningGroup } = new Handlers_1.EventHandler(client);
    const { handleCall } = new Handlers_1.CallHandler(client);
    // Command modules are relatively expensive to require. Do not make
    // WhatsApp wait for all of them before the socket can start. Messages that
    // arrive during this short window are replayed once the command registry is
    // ready.
    let handlersReady = false;
    const pendingMessages = [];
    client.on('new_message', async (M) => {
        if (!handlersReady) {
            pendingMessages.push(M);
            return;
        }
        try {
            await messageHandler.handleMessage(M);
        }
        catch (err) {
            console.error('[ALYA MD] handleMessage error:', err);
        }
    });
    client.on('participants_update', async (event) => {
        try {
            await handleEvents(event);
        }
        catch (err) {
            console.error('[ALYA MD] handleEvents error:', err);
        }
    });
    client.on('new_group_joined', async (group) => {
        try {
            messageHandler.groups.push(group.jid);
            await sendMessageOnJoiningGroup(group);
        }
        catch (err) {
            console.error('[ALYA MD] new_group_joined error:', err);
        }
    });
    client.on('new_call', async (call) => {
        try {
            await handleCall(call);
        }
        catch (err) {
            console.error('[ALYA MD] handleCall error:', err);
        }
    });
    client.once('open', () => {
        // Group discovery, feature caches, and news warm-up are maintenance
        // work. Defer them so the first command after a reconnect is not
        // competing with a large group metadata request on the same socket.
        setTimeout(() => {
            void (async () => {
                messageHandler.groups = await client.getAllGroups();
                await Promise.all([
                    messageHandler.loadWildEnabledGroups(),
                    messageHandler.loadCharaEnabledGroups(),
                    messageHandler.loadSmashBoomGroups()
                ]);
                // ─── Group Health Report ───────────────────────────────────────
                const totalGroups = messageHandler.groups.length;
                const wildCount = messageHandler.wild.length;
                const charaCount = messageHandler.chara.length;
                const smashCount = messageHandler.smashboom.length;
                const status = totalGroups === 0 ? chalk_1.default.gray('No groups yet') :
                    totalGroups <= 5 ? chalk_1.default.greenBright('Healthy') :
                        totalGroups <= 15 ? chalk_1.default.yellowBright('Moderate load') :
                            chalk_1.default.redBright('High load — monitor DB');
                client.log(`─── Group Health Report ───────────────────────────────────────\n` +
                    `  Total Groups  : ${chalk_1.default.cyanBright(totalGroups)}\n` +
                    `  Wild Spawn    : ${chalk_1.default.blueBright(wildCount)} group${wildCount !== 1 ? 's' : ''} enabled\n` +
                    `  Card Spawn    : ${chalk_1.default.blueBright(charaCount)} group${charaCount !== 1 ? 's' : ''} enabled\n` +
                    `  Smash Boom    : ${chalk_1.default.blueBright(smashCount)} group${smashCount !== 1 ? 's' : ''} enabled\n` +
                    `  Load Status   : ${status}\n` +
                    (totalGroups > 5
                        ? `  ${chalk_1.default.yellowBright('⚠')}  Tip: DB queries are bulk-optimized — no extra load per group\n`
                        : '') +
                    (totalGroups > 15
                        ? `  ${chalk_1.default.redBright('!')}  High group count detected — consider enabling MongoDB Atlas indexes\n`
                        : '') +
                    `───────────────────────────────────────────────────────────────`);
                messageHandler.spawnDxDGreetings();
                messageHandler.startLoanEmiCron();
                messageHandler.startBirthdayCron();
                messageHandler.startAnalyticsFlush();
                messageHandler.startRocketRaids();
                new Handlers_1.NewsHandler(client).start();
            })().catch((err) => {
                console.error('[ALYA MD] Post-connect initialization error:', err);
            });
        }, 1000);
    });
    // Start the socket only after the message, event, and call listeners are
    // already installed. Reconnects reuse the same listeners above.
    await client.start();
    // Loading commands after socket creation removes the avoidable startup
    // dead-time. The queue above protects messages if WhatsApp opens first.
    await messageHandler.loadCommands();
    handlersReady = true;
    const queued = pendingMessages.splice(0);
    await Promise.allSettled(queued.map(async (M) => {
        try {
            await messageHandler.handleMessage(M);
        }
        catch (err) {
            console.error('[ALYA MD] queued handleMessage error:', err);
        }
    }));
})();
