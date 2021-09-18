
 import I18n from 'react-native-i18n';
 import en from '../locale/en';
 import am from '../locale/am';
 import or from '../locale/or';
 import ti from '../locale/ti';
 import { lang_init, lang_read, lang_write } from '../db/lang'

 I18n.fallbacks = true;
 I18n.missingBehaviour = 'guess';
 I18n.defaultLocale = 'or';
 I18n.locale = 'am';

 I18n.translations = {
   am,
   or,
   ti,
   en
 };
 export const setLocale = (locale) => {
   I18n.locale = locale;
 };
 export const initLanguage = async () => {
  await lang_init();

   let l = lang_read()
   if(!l.length){
     let p =[];
     p.push({
       id: '_' + Math.random().toString(36).substr(2, 9),
       locale: 'am'
     })
     await lang_write(p)
     I18n.defaultLocale = p[0].locale
     I18n.locale =p[0].locale;
   }
   else {
     I18n.defaultLocale = l[0].llocale
     I18n.locale =l[0].locale;
   }
 }
 export const getCurrentLocale = () => I18n.locale;

 export default I18n.translate.bind(I18n);
