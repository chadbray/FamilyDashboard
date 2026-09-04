const PEOPLE={penelope:{name:'Penelope',color:'#8B5CF6'},timothy:{name:'Timothy',color:'#3987F5'},josie:{name:'Josie',color:'#F06D6D'},chad:{name:'Chad',color:'#2DA77A'},family:{name:'Family',color:'#D68A13'},alemannia:{name:'Alemannia',color:'#F3C500'}};
const ONCE=[
 {date:'2026-09-05',title:'Quentin’s birthday party',person:'timothy'},
 {date:'2026-09-08',title:'Ballet',person:'penelope',start:'15:45',end:'16:30'},
 {date:'2026-09-09',title:'Gogo leaves',person:'family',timeLabel:'Morning · Time TBC',responsible:'Chad',linkedTitle:'Gogo · Airport'},
 {date:'2026-09-12',title:'Alemannia vs Jahn Regensburg',person:'alemannia',start:'16:30',homeGame:true},
 {date:'2026-09-15',title:'Football',person:'timothy'},
 {date:'2026-09-15',title:'Parents’ evening',person:'josie',start:'19:30'},
 {date:'2026-09-17',title:'Head Acoustics birthday party',person:'josie'},
 {date:'2026-09-19',title:'Kindergarten grill',person:'family',start:'14:00'},
 {date:'2026-09-19',title:'Alemannia vs Fortuna Düsseldorf',person:'alemannia',start:'14:00',homeGame:true},
];
const BIRTHDAYS=[{md:'09-09',title:'Dale’s birthday'},{md:'09-10',title:'Grumps’s birthday'},{md:'09-10',title:'Diane’s birthday'},{md:'09-14',title:'Bradford’s birthday'}];
const REPEATS=[
 {from:'2026-09-15',to:'2026-12-31',weekday:2,title:'Ballet',person:'penelope',start:'15:45',end:'16:30'},
 {from:'2026-09-14',to:'2026-12-31',weekday:1,title:'Swimming lesson',person:'penelope',start:'16:15',end:'17:00'},
 {from:'2026-09-18',to:'2026-12-31',weekday:5,title:'Football',person:'timothy',start:'16:30',end:'17:30'},
 {from:'2026-09-21',to:'2026-12-31',weekday:1,title:'Football',person:'timothy',start:'17:30',end:'18:30'},
];
const pad=n=>String(n).padStart(2,'0'),iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,parse=s=>new Date(`${s}T12:00:00`),monday=d=>{d=new Date(d);d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d},mins=s=>{let[h,m]=s.split(':').map(Number);return h*60+m},dur=(a,b)=>{if(!a||!b)return'';let n=mins(b)-mins(a);return n>=60?`${Math.floor(n/60)}h${n%60?' '+n%60+'m':''}`:`${n}m`};
function easter(year){let a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=(h+l-7*m+114)%31+1;return new Date(year,month-1,day,12)}
function holidayFor(date){let y=date.getFullYear(),map={};const add=(d,name)=>map[iso(d)]=name,fixed=(m,d,name)=>add(new Date(y,m-1,d,12),name),move=(days,name)=>{let d=easter(y);d.setDate(d.getDate()+days);add(d,name)};fixed(1,1,'Neujahr');move(-2,'Karfreitag');move(1,'Ostermontag');fixed(5,1,'Tag der Arbeit');move(39,'Christi Himmelfahrt');move(50,'Pfingstmontag');move(60,'Fronleichnam');fixed(10,3,'Tag der Deutschen Einheit');fixed(11,1,'Allerheiligen');fixed(12,25,'1. Weihnachtstag');fixed(12,26,'2. Weihnachtstag');return map[iso(date)]||''}
function itemsFor(date){let key=iso(date),items=ONCE.filter(x=>x.date===key).map(x=>({...x}));for(const b of BIRTHDAYS)if(key.slice(5)===b.md)items.push({date:key,title:b.title,person:'family',birthday:true});for(const r of REPEATS)if(date.getDay()===r.weekday&&date>=parse(r.from)&&date<=parse(r.to))items.push({...r,date:key});if(key==='2026-09-18'){const football=items.find(e=>e.title==='Football'&&e.start==='16:30');if(football){football.responsible='Chad';football.linkedTitle='Timothy · Football'}}return items.sort((a,b)=>(a.start||'').localeCompare(b.start||''));}
function weatherIcon(code){if(code===0)return'☀️';if(code<=2)return'🌤️';if(code===3)return'☁️';if(code===45||code===48)return'🌫️';if(code>=51&&code<=67)return'🌧️';if(code>=71&&code<=77)return'🌨️';if(code>=80&&code<=82)return'🌦️';if(code>=85&&code<=86)return'🌨️';if(code>=95)return'⛈️';return'🌡️'}
async function getWeather(){const url='https://api.open-meteo.com/v1/forecast?latitude=50.7753&longitude=6.0839&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=16';const data=await fetch(url).then(r=>{if(!r.ok)throw new Error('weather');return r.json()});const weather={};data.daily.time.forEach((date,i)=>weather[date]={icon:weatherIcon(data.daily.weather_code[i]),high:Math.round(data.daily.temperature_2m_max[i]),low:Math.round(data.daily.temperature_2m_min[i])});return weather}
function scheduleDashboardRefresh(){const now=new Date(),next=new Date(now);next.setSeconds(0,0);next.setMinutes(0);next.setHours(now.getHours()+1);if(next.getHours()>22){next.setDate(next.getDate()+1);next.setHours(7,0,0,0)}else if(next.getHours()<7){next.setHours(7,0,0,0)}setTimeout(()=>location.reload(),Math.max(1000,next-now))}
function refreshWhenVisible(){let wasHidden=false;document.addEventListener('visibilitychange',()=>{if(document.hidden){wasHidden=true}else if(wasHidden){location.reload()}});window.addEventListener('pageshow',event=>{if(event.persisted)location.reload()})}
