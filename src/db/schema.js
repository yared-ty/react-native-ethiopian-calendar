import Realm from 'realm';

export const etDate = {
  name: 'etDate',
  properties: {
    day: 'int?',
    month: 'int?',
    year: 'int?',
  }
}
export const tasks = {
  name: 'tasks',
  properties: {
    id: 'string?',
    title: 'string',
    desc: 'string',
    createdAt: 'date',
    dueDate: 'etDate',
    dueTime: 'date',
    notifyMe: 'bool',
  }
}
export const lang = {
  name: 'lang',
  properties: {
    id: 'string?',
    locale: "string?"
  }
}
const SCHEMA = [
  tasks,
  etDate,
  lang,
];
export default new Realm({schema: SCHEMA});
