import translate from '../utils/language'
import _ from 'lodash'

let abiy_tsome_t = 14;
let debrezeit_t = 41;
let hosaina_t = 62;
let siklet_t = 67;
let tinsae_t = 69;
let rikbe_kahinat_t = 93;
let irget_t = 108;
let peraklitos_t = 118;
let tsome_hawariat_t = 119;
let tsome_dihnet_t = 121;

let bhr =  {
  ameteKunene: 5500,
  tinteMetke: 19,
  tinteAbekte: 11,
};

export const getMebacha = (year, month)=> {
  let ameteAlem = year + bhr.ameteKunene;
  let meteneRabiet = ameteAlem/4;

  let meskeremOne=(ameteAlem + meteneRabiet)%7;
  let mebacha=parseInt((meskeremOne+2*(month-1))%7);

  return mebacha;
}
const getWengelawi = (year) => {
  let ameteAlem = year + bhr.ameteKunene;
  let w = ameteAlem%4;

  switch(w){
    case 1:
      return 'Mathewos'
    case 2:
      return 'Markos';
    case 3:
      return 'Lukas';
    case 0:
      return 'Yohannes';
  }
}
const getTinteOn = (year) => {
  let ameteAlem = year + bhr.ameteKunene;
  let meteneRabiet = parseInt(ameteAlem/4);//truncate

  let tinteOn = (ameteAlem + meteneRabiet)%7;

  tinteOn =tinteOn -1
  return tinteOn;
  //wendesday 1, ...teusday: 7
}
const getWenbere  = (year) => {
  let wenber = (year + bhr.ameteKunene)%19;
  wenber = wenber-1;
  return wenber;
}
const getMetke = (year) => {

  let wbr = getWenbere(year);
  let metke=(bhr.tinteMetke*wbr)%30;
  let abk = getAbekte(wbr);

  if(abk === 0)
    return 30;
  return metke;
}
const getAbekte =(wenbere) => {
  let abekte=(bhr.tinteAbekte*wenbere)%30;
  return abekte;

}
const getNenewe = (year) => {
  let mtk = getMetke(year);
  let nenewe_month = 5;
  let nenewe_day = getMebachaHamer(year);

  if(mtk < 14)
    nenewe_month  = 6;
  else {
    let twsk = getTewsake(year, 1, mtk);

    if((twsk + mtk) > 30){
      nenewe_month  = 6;
      nenewe_day = (twsk + mtk)%30;
    }
  }
  return {
    month: nenewe_month,
    days: nenewe_day
  }
}
const getMebachaHamer = (year) => {
  let mtk = getMetke(year);
  let month = 1;

  if(mtk < 14)
    month  = 2;

  let twsk = getTewsake(year, month, mtk);
  let mebachaHamer = (mtk + twsk)%30;

  if(mebachaHamer === 0)
    return 30;

  return mebachaHamer;
}
export const getSpecificDate = (y, m, d) => {
  let t = getTinteOn(y);
  let date = (t + 2*(m - 1) + d + 2)%7;

  return date;
}

const   getTewsake = (year, month, day) => {
  let tewsak=0;
  let date = getSpecificDate(year, month, day);
  switch (date){
      case 2: tewsak = 6;
      break;
      case 3: tewsak = 5;
      break;
      case 4: tewsak = 4;
      break;
      case 5: tewsak = 3;
      break;
      case 6: tewsak = 2;
      break;
      case 0: tewsak = 8;
      break;
      case 1: tewsak = 7;
      break;
  }
  return tewsak;
}
export const getChristianBeal = (year) => {
  let beal = [];
  let nenewe = getNenewe(year);

  let totalDays = (30*nenewe.month) + nenewe.days + siklet_t;

  beal.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('HOLYDAY_siklet')
  });
  totalDays = (30*nenewe.month) + nenewe.days + tinsae_t;
  beal.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('HOLYDAY_tinsae')
  });
  return beal;
}
export const getChristianTsom = (year) => {
  let tsom = [];
  let nenewe = getNenewe(year);

  let totalDays = (30*nenewe.month) + nenewe.days;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('TSOM_nenewe')
  });
  totalDays = (30*nenewe.month) + nenewe.days + abiy_tsome_t;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('TSOM_abiy')
  });
  totalDays = (30*nenewe.month) + nenewe.days + hosaina_t;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('HOLYDAY_hosaina')
  });

  totalDays = (30*nenewe.month) + nenewe.days + rikbe_kahinat_t;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('HOLYDAY_kahinat')
  });
  totalDays = (30*nenewe.month) + nenewe.days + irget_t;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('HOLYDAY_irget')
  });
  totalDays = (30*nenewe.month) + nenewe.days + peraklitos_t;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('HOLYDAY_peraklitos')
  });
  totalDays = (30*nenewe.month) + nenewe.days + tsome_hawariat_t;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('TSOM_hawariat')
  });
  totalDays = (30*nenewe.month) + nenewe.days + tsome_dihnet_t;
  tsom.push({
    year: year,
    month: parseInt(totalDays/30),
    days: (totalDays%30)? totalDays%30: 30,
    name: translate('TSOM_dihnet')
  });
  return tsom;
}
//Fixed date holydays
export const getOtherBeal = (year) => {
  let beal = []
  beal.push({
    year: year,
    month: 1,
    days: 1,
    name: translate('HOLYDAY_newyear')
  });
  beal.push({
    year: year,
    month: 1,
    days: 17,
    name: translate('HOLYDAY_meskel')
  });
  beal.push({
    year: year,
    month: 4,
    days: (year%4)?29:28,
    name: translate('HOLYDAY_gena')
  });
  beal.push({
    year: year,
    month: 5,
    days: 11,
    name: translate('HOLYDAY_timket')
  });
  beal.push({
    year: year,
    month: 6,
    days: 23,
    name: translate('HOLYDAY_adwa')
  });
  beal.push({
    year: year,
    month: 8,
    days: 23,
    name: translate('HOLYDAY_labaderoch')
  });
  beal.push({
    year: year,
    month: 8,
    days: 27,
    name: translate('HOLYDAY_arbegnoch')
  });

  return beal;
}
