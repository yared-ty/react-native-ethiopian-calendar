import _ from 'lodash'
import {scheduleNotification} from './api.js'

export const notif = {
  id: new Date().valueOf().toString(),
  fire_date: '',
  title: "",
  body: "",
  sub_text: "",
  priority: "high",
  large_icon: "",
  big_text: "",
  vibrate: 300,
  wake_screen: true,
  show_in_foreground: true,
};

export const notify = (msg) => {

   let __notif = _.clone(notif);
   __notif.title = msg.title
   __notif.body = msg.desc
   __notif.fire_date = msg.dueTime.getTime(),
   scheduleNotification(__notif);
}
