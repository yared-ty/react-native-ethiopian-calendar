import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from "react-native-fcm";

var notificationListener;
var refreshTokenListener;

exports.reqPermission = () => {

  FCM.requestPermissions();
}
exports.scheduleNotification  = (notif) => {
  FCM.scheduleLocalNotification(notif);
}

exports.getInitialNotification = (cb) => {
  FCM.getInitialNotification().then(cb)
}

exports.getToken = (cb) => {
  FCM.getFCMToken().then(cb);
}

exports.listenNotification = (cb)=> {
  notificationListner = FCM.on(FCMEvent.Notification, cb);
}

exports.listenTokenChange = (cb) => {
  refreshTokenListener = FCM.on (FCMEvent.RefreshToken, cb);
}
exports.registerKilledListener = (cb) => {
 FCM.on(FCMEvent.Notification, cb) 
}
exports.removeNotification = () => {
  notificationListner.remove();
  refreshTokenListener.remove();
  FCM.removeAllDeliveredNotifications()
  FCM.cancelAllLocalNotifications()
}

