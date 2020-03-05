import {getMebacha, getChristianTsom,getOtherBeal,getChristianBeal,getSpecificDate} from './bahirehasab'
import { getIslamBeal} from './hijra'
import {getDays} from '../utils/global';
import _ from 'lodash'

exports.getDayByName = (y, m, d) => {
  let index = getSpecificDate(y, m, d);
  let days = getDays();

  index = (index < 2)? index + 5: index - 2;
  return days[index];
}
exports.getAllBeal = (y) => {
  let tsom = getChristianTsom(y);
  let fixed = getOtherBeal(y);  //Fixed date holydays
  let christian = getChristianBeal(y);
  let islam = getIslamBeal(y);

  let total = fixed.concat(tsom);
  total = total.concat(christian);
  total = total.concat(islam);

  total = _.orderBy(total, ['month'], ['asce']);
  return total;
}
const getBealByName = (y)=> {
  let store = [];

  let fixed = getOtherBeal(y);
  let christian = getChristianBeal(y);
  let islam = getIslamBeal(y);

  let total = fixed.concat(christian);
  total = total.concat(islam);


  for(let i=0; i<total.length; i++){
    store[total[i].month +':'+ total[i].days] = total[i].name;
  }

  return store;
}
const getTotalDays = (year, month)=> {
  let total;
  if(month === 13 && year%4 === 3)
    total = 6;
  else if(month === 13)
    total = 5;
  else
    total = 30;
  return total;
}
/* getTotalWeeks:
 * calculates total weeks in a month; could be 1,2,4,5
 */
const getTotalWeeks = (start_date, total_days) => {
   let x = start_date;
   //let weeks = 1;

   if(total_days == 30){
     if(start_date <= 5)
      return 5
    return 6
   }
   else if(total_days == 5){
     if(start_date <= 2)
      return 1
    return 2;
   }
   else{
     if(start_date <= 1)
      return 1;
    return 2;
  }/*
   for(let i = 1; i  <total_days; i++){
     x++;
     if(x%7 === 0){
       weeks++;x=0;
     }
  }
  return weeks;*/
}

/* getMonthlyDates: returns array of day object in the following format
 * weeks[
 *  { id,
 *    days[
 *    {
 *      day:
 *      ...
 *    }]
 *  }
 *   ...
 * ]
 */
exports.getMonthlyDates = (year, month) => {
  let beal = getBealByName(year);

  let start = getMebacha(year, month);
  let total_days =  getTotalDays(year, month);
  let prev_days = (month - 1 ===0)? getTotalDays(year -1, 13): getTotalDays(year, month - 1);
  let next_days = (month ===13)? getTotalDays(year + 1, 1): getTotalDays(year, month + 1);
  let total_weeks = getTotalWeeks(start, total_days);
  let day_count = 1;

  let weeks = [];

  for(let i = 0; i < total_weeks; i++){
    let days = [];
    //insert previous month dates, if any
    if(start > 0 && i === 0){
      for(let j = 0; j < start; j++) {
        days.push({
          day: prev_days - start + j + 1,
          month: (month - 1 ===0)?13 :month-1,
          year: (month - 1 ===0)?year -1: year,
        });
      }
    }
    //insert current month dates
    let j = start;
    for(; j < 7 && day_count <= total_days; j++){
      let tmp = day_count++;
      days.push({
        day: tmp,
        this_month: true,
        month: month,
        year: year,
        holyDay: beal[month+':'+tmp]  //for fast indexing
      });
    }
    //insert next month dates, if any
    if(i === total_weeks -1 && j < 7){
      let nxt = 1;
      for(let k = j; k < 7 && nxt <=next_days; k++) {
        days.push({
          day: nxt++,
          month: (month ===13)?1 :month+1,
          year: (month ===13)?year + 1: year,
        });
      }
    }

    start= 0;
    weeks.push({
      id: i,
      days: days
    })
  }
  let m = {};
  m.month = month;
  m.year = year;
  m.weeks = weeks;
  return m
}
