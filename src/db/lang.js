import _ from 'lodash';
import realm from './schema'

var store = {
  lang: []
}

exports.lang_init = async() => {
  try{
    realm.write(()=>{
      store.lang = realm.objects('lang');
    });
  }
  catch(e){
  }
}

exports.lang_write = async(lang) => {
  try {
    realm.write(()=> {
      for(let i =0; i<lang.length; ++i){
        realm.create('lang', lang[i]);
      }
    });
  }
  catch(e){
  }
}

exports.lang_read = (f) => {
  if(!f){
    let t = Array.from(store.lang);
    return t;
  }
}
exports.lang_update = async(d, f) => {
  let s;
  try {
    realm.write(() => {
      s = store.lang.filtered('id == $0', f.id);
      if(s[0]){
        s[0].locale = d[0].locale;
      }
    });
  }
  catch(e){
  }
}
