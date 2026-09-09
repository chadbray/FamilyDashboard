const PEOPLE={penelope:{name:'Penelope',color:'#846BB8'},timothy:{name:'Timothy',color:'#4F88BD'},josie:{name:'Josie',color:'#F28C28'},chad:{name:'Chad',color:'#4F9478'},family:{name:'Family',color:'#6786A8'},alemannia:{name:'Alemannia',color:'#F4D03F'}};
const ONCE=[
 {date:'2026-09-05',title:'Quentin’s birthday party',person:'timothy',start:'12:00'},
 {date:'2026-09-08',title:'Ballet',person:'penelope',start:'15:45',end:'16:30',note:'Take ballet things to school · Change into ballet clothes at OGS'},
 {date:'2026-09-09',title:'Gogo leaves',person:'family',timeLabel:'Morning · Time TBC',responsible:'Chad',linkedTitle:'Gogo · Airport'},
 {date:'2026-09-12',title:'Alemannia vs Jahn Regensburg',person:'alemannia',start:'16:30',homeGame:true},
 {date:'2026-09-15',title:'Parents’ evening',person:'josie',start:'19:30'},
 {date:'2026-09-17',title:'Head Acoustics birthday party',person:'josie',timeLabel:'Until late'},
 {date:'2026-09-19',title:'Kindergarten grill',person:'family',start:'14:00'},
 {date:'2026-09-19',title:'Braai at the Mertens',person:'family',timeLabel:'Afternoon · Time TBC'},
 {date:'2026-09-19',title:'Alemannia vs Fortuna Düsseldorf',person:'alemannia',start:'14:00',homeGame:true},
 {date:'2026-09-21',title:'Keyboard',person:'josie',start:'19:00',location:'Summerlong'},
];
const BIRTHDAYS=[{md:'09-09',title:'Dale’s birthday'},{md:'09-10',title:'Grumps’s birthday'},{md:'09-10',title:'Diane’s birthday'},{md:'09-14',title:'Bradford’s birthday'}];
const REPEATS=[
 {from:'2026-09-14',to:'2026-12-31',weekday:1,title:'Pick up Penelope for swimming',person:'chad',start:'15:30',end:'16:15'},
 {from:'2026-09-08',to:'2026-12-31',weekday:2,title:'Pick up Timothy',person:'chad',start:'15:10',end:'15:30'},
 {from:'2026-09-08',to:'2026-12-31',weekday:2,title:'Pick up Penelope for ballet',person:'chad',start:'15:30',end:'15:45'},
 {from:'2026-09-15',to:'2026-12-31',weekday:2,title:'Ballet',person:'penelope',start:'15:45',end:'16:30',note:'Take ballet things to school · Change into ballet clothes at OGS'},
 {from:'2026-09-14',to:'2026-12-31',weekday:1,title:'Swimming lesson',person:'penelope',start:'16:15',end:'17:00'},
 {from:'2026-09-21',to:'2026-12-31',weekday:1,title:'Football',person:'timothy',start:'17:30',end:'18:30',responsible:'Chad',linkedTitle:'Timothy · Football'},
 {from:'2026-09-18',to:'2026-12-31',weekday:5,title:'Football',person:'timothy',start:'16:30',end:'17:30',responsible:'Chad',linkedTitle:'Timothy · Football'},
];
function itemsFor(date){let key=iso(date),items=ONCE.filter(x=>x.date===key).map(x=>({...x}));for(const b of BIRTHDAYS)if(key.slice(5)===b.md)items.push({date:key,title:b.title,person:'family',birthday:true});for(const r of REPEATS)if(date.getDay()===r.weekday&&date>=parse(r.from)&&date<=parse(r.to))items.push({...r,date:key});if(key==='2026-09-18'){const football=items.find(e=>e.title==='Football'&&e.start==='16:30');if(football){football.responsible='Chad';football.linkedTitle='Timothy · Football'}}return items.sort((a,b)=>(a.start||'').localeCompare(b.start||''));}
function weatherIcon(code){if(code===0)return'☀️';if(code<=2)return'🌤️';if(code===3)return'☁️';if(code===45||code===48)return'🌫️';if(code>=51&&code<=67)return'🌧️';if(code>=71&&code<=77)return'🌨️';if(code>=80&&code<=82)return'🌦️';if(code>=85&&code<=86)return'🌨️';if(code>=95)return'⛈️';return'🌡️'}
async function getWeather(){const url='https://api.open-meteo.com/v1/forecast?latitude=50.7753&longitude=6.0839&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=16';const data=await fetch(url).then(r=>{if(!r.ok)throw new Error('weather');return r.json()});const weather={};data.daily.time.forEach((date,i)=>weather[date]={icon:weatherIcon(data.daily.weather_code[i]),high:Math.round(data.daily.temperature_2m_max[i]),low:Math.round(data.daily.temperature_2m_min[i])});return weather}
function scheduleDashboardRefresh(){const now=new Date(),next=new Date(now);next.setSeconds(0,0);next.setMinutes(0);next.setHours(now.getHours()+1);if(next.getHours()>22){next.setDate(next.getDate()+1);next.setHours(7,0,0,0)}else if(next.getHours()<7){next.setHours(7,0,0,0)}setTimeout(()=>location.reload(),Math.max(1000,next-now))}
function refreshWhenVisible(){let wasHidden=false;document.addEventListener('visibilitychange',()=>{if(document.hidden){wasHidden=true}else if(wasHidden){location.reload()}});window.addEventListener('pageshow',event=>{if(event.persisted)location.reload()})}
