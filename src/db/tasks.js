import _ from 'lodash';
import realm from './schema'

var store = {
  tasks: []
}
exports.task_init = async() => {
  try{
    realm.write(()=>{
      store.tasks = realm.objects('tasks');
    });
  }
  catch(e){
  }
}

exports.task_write = async(tasks) => {
  try {
    realm.write(()=> {
      for(let i =0; i<tasks.length; ++i){
        realm.create('tasks', tasks[i]);
      }
    });
  }
  catch(e){
  }
}

exports.task_read = (f) => {
  if(!f){
    let t = Array.from(store.tasks);
    t = _.orderBy(t, ['createdAt'], ['desc']);
    return t;
  }
  if(f.id){
    let s = store.tasks.filtered('id == $0', f.id);
    return s[0];
  }
  if(f.dueDate){
    let t = Array.from(store.tasks);
    t = _.filter(t, (i)=> i.dueDate.day === f.dueDate.day && i.dueDate.month === f.dueDate.month && i.dueDate.year === f.dueDate.year)
    return t;
  }
}
exports.task_delete = async (f) => {
  let s;
  try {
    realm.write(() => {
      if(f.id){
        s = store.tasks.filtered('id == $0', f.id);
        realm.delete(s);
      }
    });
  }
  catch(e){
  }
}
exports.task_update = async(d, f) => {
  let s;
  try {
    realm.write(() => {
      s = store.tasks.filtered('id == $0', f.id);
      if(s[0]){
        s[0].title = d[0].title;
        s[0].desc = d[0].desc;
        s[0].createdAt = d[0].createdAt;
        s[0].dueDate = d[0].dueDate;
        s[0].dueTime = d[0].dueTime;
        s[0].notifyMe = d[0].notifyMe;
      }
    });
  }
  catch(e){
  }
}
