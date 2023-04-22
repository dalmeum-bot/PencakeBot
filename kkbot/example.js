const allowedUserIdList = 95;
const allowedPackageNameList = "com.kakao.talk";
const replyActionTitleList = ["reply", "답장"];
const bot = BotManager.getCurrentBot();

bot.on("notificationPosted", (sbn, sm) => {
    if (!(allowedUserIdList == sbn.userId && allowedPackageNameList == sbn.getPackageName())) return;

    const actions = sbn.getNotification().actions;
    if (actions === null) return;

    actions.forEach((action) => {
        if (replyActionTitleList.includes(String(action.title).toLowerCase())) {
            const data = sbn.getNotification().extras;

            const sender = data.getString("android.title");
            const room = data.getString("android.subText") || sender;

            const msg = data.getString("android.text");
            // const isGroupChat = data.getBoolean("android.isGroupConversation");
            // const packageName = noti.getPackageName();
        
            // const replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, scriptName);
            // const icon = data.getParcelable("android.messagingUser").getIcon().getBitmap();
            // const imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, icon);
        
            // com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
            // onMsg.call(this, room, msg, sender, isGroupChat, replier, imageDB, packageName);
        }
    });    
});

const onMsg = (room, msg, sender, isGroupChat, replier, imageDB, packageName) => {
    Log.d(msg);
};