import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  MapPin, Compass, LogIn, LogOut, User, Menu, X, Search, Clock3,
  Wallet, Star, Route, GitBranch, BrainCircuit, MessageSquare,
  Info, LayoutDashboard, CalendarDays, ChevronRight, CheckCircle2,
  AlertCircle, Eye, EyeOff, History, Sparkles
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

const attractionData = {
  Hyderabad: [
    ["charminar","Charminar","Historical",40,1.5,92,4.7,17.3616,78.4747],
    ["golconda","Golconda Fort","Historical",25,2.5,95,4.6,17.3833,78.4011],
    ["museum","Salar Jung Museum","Museums",50,2,86,4.5,17.3713,78.4804],
    ["tankbund","Hussain Sagar","Nature",0,1.5,78,4.4,17.4239,78.4738],
    ["park","KBR National Park","Nature",30,2,74,4.3,17.4230,78.4180],
    ["ramoji","Ramoji Film City","Entertainment",1200,5,98,4.5,17.2543,78.6808],
    ["birla","Birla Mandir","Religious",0,1,80,4.7,17.4062,78.4691]
  ],
  Goa: [
    ["baga","Baga Beach","Nature",0,2,88,4.5,15.5557,73.7517],
    ["aguada","Fort Aguada","Historical",50,1.5,90,4.5,15.4920,73.7739],
    ["basilica","Basilica of Bom Jesus","Religious",0,1.5,84,4.6,15.5009,73.9119],
    ["dudhsagar","Dudhsagar Falls","Adventure",500,5,97,4.8,15.3144,74.3140],
    ["palolem","Palolem Beach","Nature",0,2.5,86,4.7,15.0100,74.0232],
    ["panjim","Fontainhas","Photography",0,1.5,75,4.5,15.4957,73.8278]
  ],
  Delhi: [
    ["redfort","Red Fort","Historical",35,2,95,4.6,28.6562,77.2410],
    ["qutub","Qutub Minar","Historical",40,2,94,4.7,28.5244,77.1855],
    ["indiagate","India Gate","Photography",0,1,82,4.6,28.6129,77.2295],
    ["lotus","Lotus Temple","Religious",0,1.5,83,4.5,28.5535,77.2588],
    ["museumdelhi","National Museum","Museums",20,2.5,87,4.5,28.6118,77.2195]
  ],
  Mumbai: [
    ["gateway","Gateway of India","Historical",0,1.5,94,4.6,18.9220,72.8347],
    ["marine","Marine Drive","Nature",0,1.5,88,4.7,18.9439,72.8238],
    ["cst","Chhatrapati Shivaji Terminus","Historical",0,1,91,4.7,18.9402,72.8356],
    ["elephanta","Elephanta Caves","Historical",40,4,93,4.4,18.9633,72.9315],
    ["museumumbai","CSMVS Museum","Museums",100,2.5,84,4.5,18.9270,72.8324]
  ],
  Bengaluru: [
    ["palace","Bangalore Palace","Historical",250,2,90,4.4,12.9988,77.5921],
    ["lalbagh","Lalbagh Botanical Garden","Nature",30,2,88,4.6,12.9507,77.5848],
    ["cubbon","Cubbon Park","Nature",0,1.5,82,4.6,12.9763,77.5929],
    ["museumblr","Visvesvaraya Museum","Museums",85,2,84,4.6,12.9757,77.5963],
    ["iskcon","ISKCON Temple","Religious",0,1.5,78,4.7,13.0098,77.5511]
  ],
  Chennai: [
    ["marina","Marina Beach","Nature",0,2,90,4.5,13.0500,80.2824],
    ["kapaleeshwarar","Kapaleeshwarar Temple","Religious",0,1.5,87,4.7,13.0335,80.2697],
    ["fortstgeorge","Fort St. George","Historical",20,2,88,4.4,13.0797,80.2870],
    ["museumchn","Government Museum","Museums",25,2.5,85,4.5,13.0694,80.2572],
    ["mahabalipuram","Mahabalipuram","Historical",40,4,96,4.7,12.6208,80.1945]
  ],
  Paris: [
    ["eiffel","Eiffel Tower","Historical",30,2.5,100,4.8,48.8584,2.2945],
    ["louvre","Louvre Museum","Museums",22,3.5,99,4.8,48.8606,2.3376],
    ["notredame","Notre-Dame","Historical",0,1.5,88,4.7,48.8530,2.3499],
    ["montmartre","Montmartre","Photography",0,2,86,4.6,48.8867,2.3431]
  ],
  London: [
    ["tower","Tower of London","Historical",35,2.5,96,4.7,51.5081,-0.0759],
    ["british","British Museum","Museums",0,3,98,4.7,51.5194,-0.1270],
    ["londoneye","London Eye","Entertainment",45,1.5,91,4.5,51.5033,-0.1196],
    ["buckingham","Buckingham Palace","Historical",30,2,92,4.6,51.5014,-0.1419]
  ],
  Dubai: [
    ["burj","Burj Khalifa","Photography",180,2,100,4.8,25.1972,55.2744],
    ["museumfuture","Museum of the Future","Museums",150,2.5,96,4.6,25.2190,55.2820],
    ["dubaimall","Dubai Mall","Shopping",0,2.5,88,4.7,25.1985,55.2796],
    ["jumeirah","Jumeirah Beach","Nature",0,2,84,4.6,25.2050,55.2430]
  ],
  Tokyo: [
    ["sensoji","Senso-ji","Religious",0,1.5,91,4.7,35.7148,139.7967],
    ["skytree","Tokyo Skytree","Photography",2100,2,96,4.6,35.7101,139.8107],
    ["ueno","Ueno Park","Nature",0,2,83,4.5,35.7148,139.7731],
    ["museumtokyo","Tokyo National Museum","Museums",1000,2.5,90,4.7,35.7188,139.7765]
  ],
  "New York": [
    ["liberty","Statue of Liberty","Historical",2500,4,99,4.7,40.6892,-74.0445],
    ["central","Central Park","Nature",0,2.5,94,4.8,40.7829,-73.9654],
    ["met","Metropolitan Museum of Art","Museums",0,3,97,4.8,40.7794,-73.9632],
    ["times","Times Square","Photography",0,1.5,90,4.6,40.7580,-73.9855]
  ]
};

const categories = ["Historical","Nature","Museums","Adventure","Religious","Shopping","Food","Family","Photography","Entertainment"];

function normalizeData(city, list) {
  return list.map(([id,name,category,entryCost,visitTime,value,rating,latitude,longitude]) => ({
    id, name, destination: city, category, entryCost, visitTime, value, rating, latitude, longitude
  }));
}

const demoAttractions = Object.fromEntries(Object.entries(attractionData).map(([k,v]) => [k, normalizeData(k,v)]));

function getAttractions(destination) {
  const exact = Object.keys(demoAttractions).find(k => k.toLowerCase() === destination.trim().toLowerCase());
  if (exact) return { city: exact, attractions: demoAttractions[exact], demo: true };
  const match = Object.keys(demoAttractions).find(k => k.toLowerCase().includes(destination.trim().toLowerCase()) || destination.trim().toLowerCase().includes(k.toLowerCase()));
  if (match) return { city: match, attractions: demoAttractions[match], demo: true };
  return { city: destination.trim(), attractions: [], demo: false };
}

function scoreAttraction(a, budget, time) {
  const costRatio = a.entryCost === 0 ? 1 : Math.max(0.1, budget / Math.max(a.entryCost, 1));
  const timeRatio = Math.max(0.1, time / Math.max(a.visitTime, 0.5));
  return a.value / (a.visitTime * 0.65 + Math.max(a.entryCost, 1) / Math.max(budget,1) * 10) * Math.min(costRatio, timeRatio, 5);
}

function greedyAlgorithm(attractions, budget, time, preferences) {
  let remainingBudget = budget, remainingTime = time, selected = [], decisions = [];
  let pool = attractions.filter(a => !preferences.length || preferences.includes(a.category));
  if (!pool.length) pool = attractions;
  const available = [...pool];
  while (available.length) {
    const feasible = available.filter(a => a.entryCost <= remainingBudget && a.visitTime <= remainingTime);
    if (!feasible.length) break;
    feasible.sort((a,b) => scoreAttraction(b,remainingBudget,remainingTime)-scoreAttraction(a,remainingBudget,remainingTime));
    const best = feasible[0];
    const score = scoreAttraction(best,remainingBudget,remainingTime);
    selected.push(best);
    remainingBudget -= best.entryCost;
    remainingTime -= best.visitTime;
    decisions.push({ attraction: best, score, selected: true, remainingBudget, remainingTime });
    const idx = available.findIndex(x => x.id === best.id);
    available.splice(idx,1);
  }
  attractions.forEach(a => {
    if (!selected.some(s => s.id === a.id)) {
      decisions.push({ attraction:a, score:scoreAttraction(a,budget,time), selected:false, remainingBudget, remainingTime });
    }
  });
  return {selected,totalCost:budget-remainingBudget,totalTime:time-remainingTime,totalValue:selected.reduce((s,a)=>s+a.value,0),remainingBudget,remainingTime,decisions};
}

function multiConstraintKnapsack(attractions, budget, time, preferences) {
  let pool = attractions.filter(a => !preferences.length || preferences.includes(a.category));
  if (!pool.length) pool = attractions;
  const n = pool.length;
  const B = Math.max(0, Math.floor(budget));
  const T = Math.max(0, Math.floor(time * 2));
  const dp = Array.from({length:n+1},()=>Array.from({length:B+1},()=>Array(T+1).fill(0)));
  for (let i=1;i<=n;i++) {
    const a=pool[i-1], c=Math.floor(a.entryCost), t=Math.floor(a.visitTime*2);
    for (let b=0;b<=B;b++) for (let tt=0;tt<=T;tt++) {
      dp[i][b][tt]=dp[i-1][b][tt];
      if(c<=b && t<=tt) dp[i][b][tt]=Math.max(dp[i][b][tt],dp[i-1][b-c][tt-t]+a.value);
    }
  }
  let b=B, t=T, selected=[];
  for(let i=n;i>=1;i--){
    if(dp[i][b][t]!==dp[i-1][b][t]){
      const a=pool[i-1]; selected.push(a); b-=Math.floor(a.entryCost); t-=Math.floor(a.visitTime*2);
    }
  }
  selected.reverse();
  const totalCost=selected.reduce((s,a)=>s+a.entryCost,0), totalTime=selected.reduce((s,a)=>s+a.visitTime,0);
  return {selected,totalCost,totalTime,totalValue:selected.reduce((s,a)=>s+a.value,0),remainingBudget:budget-totalCost,remainingTime:time-totalTime};
}

function buildGraph(attractions) {
  const edges = {};
  attractions.forEach((a,i)=>{
    edges[a.id]=[];
    if(i>0) edges[a.id].push(attractions[i-1].id);
    if(i<attractions.length-1) edges[a.id].push(attractions[i+1].id);
    if(i+2<attractions.length) edges[a.id].push(attractions[i+2].id);
  });
  return edges;
}

function bfsGraph(attractions) {
  if(!attractions.length) return [];
  const graph=buildGraph(attractions), queue=[attractions[0].id], seen=new Set(queue), order=[];
  while(queue.length){
    const id=queue.shift(); order.push(id);
    (graph[id]||[]).forEach(next=>{if(!seen.has(next)){seen.add(next);queue.push(next);}});
  }
  return order.map(id=>attractions.find(a=>a.id===id)).filter(Boolean);
}

function authGet(){try{return JSON.parse(localStorage.getItem("tap_user"))||null}catch{return null}}
function historyGet(){try{return JSON.parse(localStorage.getItem("tap_history"))||[]}catch{return []}}

function MapAutoFit({points}) {
  const map=useMap();
  useEffect(()=>{
    if(points.length) map.fitBounds(points.map(p=>[p.latitude,p.longitude]),{padding:[30,30]});
  },[points,map]);
  return null;
}

function Login({onLogin,onGoSignup}) {
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[show,setShow]=useState(false),[remember,setRemember]=useState(false),[error,setError]=useState("");
  const submit=e=>{
    e.preventDefault(); setError("");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    if(password.length<6) return setError("Password must contain at least 6 characters.");
    const users=JSON.parse(localStorage.getItem("tap_users")||"[]");
    const user=users.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password);
    if(!user) return setError("Invalid email or password. Please sign up first.");
    localStorage.setItem("tap_user",JSON.stringify({name:user.name,email:user.email}));
    if(remember)localStorage.setItem("tap_remember","1"); else localStorage.removeItem("tap_remember");
    onLogin(user);
  };
  return <AuthShell title="Welcome Back" subtitle="Sign in to continue planning your journey.">
    <form onSubmit={submit} className="form">
      <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com"/>
      <div><label>Password</label><div className="password-wrap"><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></div>
      <div className="row between small"><label className="check"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Remember Me</label><button type="button" className="link" onClick={()=>alert("Demo: password reset would be handled by a backend.")}>Forgot Password?</button></div>
      {error&&<ErrorBox text={error}/>}
      <button className="primary full">Login <ChevronRight size={18}/></button>
      <p className="center muted">Don't have an account? <button type="button" className="link" onClick={onGoSignup}>Sign Up</button></p>
    </form>
  </AuthShell>
}

function Signup({onSignup,onGoLogin}) {
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[error,setError]=useState("");
  const submit=e=>{
    e.preventDefault(); setError("");
    if(!name.trim()||!email||!password||!confirm) return setError("All fields are required.");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email.");
    if(password.length<6) return setError("Password must contain at least 6 characters.");
    if(password!==confirm) return setError("Password and Confirm Password must match.");
    const users=JSON.parse(localStorage.getItem("tap_users")||"[]");
    if(users.some(u=>u.email.toLowerCase()===email.toLowerCase())) return setError("An account with this email already exists.");
    const user={name:name.trim(),email,password}; users.push(user); localStorage.setItem("tap_users",JSON.stringify(users));
    localStorage.setItem("tap_user",JSON.stringify({name:user.name,email:user.email})); onSignup(user);
  };
  return <AuthShell title="Create Your Account" subtitle="Start building smarter trips with DAA algorithms.">
    <form onSubmit={submit} className="form">
      <Field label="Full Name" value={name} onChange={setName} placeholder="Your name"/>
      <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com"/>
      <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="Minimum 6 characters"/>
      <Field label="Confirm Password" value={confirm} onChange={setConfirm} type="password" placeholder="Repeat password"/>
      {error&&<ErrorBox text={error}/>}
      <button className="primary full">Create Account <ChevronRight size={18}/></button>
      <p className="center muted">Already have an account? <button type="button" className="link" onClick={onGoLogin}>Login</button></p>
    </form>
  </AuthShell>
}

function AuthShell({title,subtitle,children}) {
  return <div className="auth-page"><div className="auth-card"><div className="brand large"><span className="brand-icon"><Compass/></span><span>Tourist Attraction Planner</span></div><h1>{title}</h1><p className="muted">{subtitle}</p>{children}</div></div>
}
function Field({label,value,onChange,type="text",placeholder=""}){return <div><label>{label}</label><input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder}/></div>}
function ErrorBox({text}){return <div className="error"><AlertCircle size={17}/>{text}</div>}

function Navbar({user,page,setPage,onLogout}) {
  const [open,setOpen]=useState(false);
  const links=[["home","Home"],["planner","Plan Trip"],["destinations","Destinations"],["algorithms","Algorithms"],["about","About"],["feedback","Feedback"]];
  return <nav className="navbar"><div className="nav-inner"><button className="brand" onClick={()=>setPage("home")}><span className="brand-icon"><Compass size={21}/></span>Tourist Planner</button><div className={"nav-links "+(open?"open":"")}>{links.map(([id,label])=><button key={id} className={page===id?"active":""} onClick={()=>{setPage(id);setOpen(false)}}>{label}</button>)}</div><div className="nav-user">{user?<><button className="profile-btn" onClick={()=>setPage("dashboard")}><User size={17}/>{user.name}</button><button className="logout" onClick={onLogout}><LogOut size={16}/></button></>:<button className="login-nav" onClick={()=>setPage("login")}><LogIn size={17}/> Login</button>}</div><button className="mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></nav>
}

function Home({setPage,user}) {
  return <main><section className="hero"><div className="hero-content"><div className="eyebrow"><Sparkles size={16}/> DAA-powered travel planning</div><h1>Plan smarter.<br/><span>Travel better.</span></h1><p>Build a personalized tourist itinerary using Greedy, Knapsack and Graph Traversal algorithms — within your time and budget.</p><div className="hero-actions"><button className="primary" onClick={()=>setPage(user?"planner":"login")}>Start Planning <ChevronRight/></button><button className="secondary" onClick={()=>setPage("algorithms")}>Explore Algorithms</button></div><div className="hero-stats"><div><b>3</b><span>Core Algorithms</span></div><div><b>10+</b><span>Demo Destinations</span></div><div><b>∞</b><span>Searchable Places</span></div></div></div><div className="hero-art"><div className="orb"></div><div className="route-card"><div className="route-head"><span><MapPin size={17}/> Trip Preview</span><span className="pill">DAA</span></div><div className="mini-route"><span className="dot"></span><div><b>Destination</b><small>Any city in the world</small></div></div><div className="mini-line"></div><div className="mini-route"><span className="dot second"></span><div><b>Optimized itinerary</b><small>Budget + Time aware</small></div></div></div></div></section><section className="section"><div className="section-title"><div><span className="eyebrow">How it works</span><h2>From input to itinerary</h2></div><p>Your constraints become algorithmic decisions you can inspect.</p></div><div className="feature-grid">{[["Greedy","Select good feasible options step by step.",BrainCircuit],["Knapsack","Find a valuable combination under resource constraints.",Wallet],["Graph Traversal","Explore connected attractions and support a visit sequence.",GitBranch]].map(([t,d,I])=><div className="feature-card" key={t}><div className="icon-box"><I/></div><h3>{t}</h3><p>{d}</p><button className="text-btn" onClick={()=>setPage("algorithms")}>Learn more <ChevronRight size={15}/></button></div>)}</div></section></main>
}

function Planner({user,onNeedLogin,onTripSaved}) {
  const [destination,setDestination]=useState(""),[budget,setBudget]=useState(""),[time,setTime]=useState(""),[start,setStart]=useState(""),[preferences,setPreferences]=useState([]),[result,setResult]=useState(null),[error,setError]=useState("");
  const [algorithm,setAlgorithm]=useState("greedy");
  const lookup=useMemo(()=>destination?getAttractions(destination):null,[destination]);
  const togglePref=p=>setPreferences(x=>x.includes(p)?x.filter(a=>a!==p):[...x,p]);
  const generate=()=>{
    setError(""); setResult(null);
    if(!destination.trim()) return setError("Please enter a destination.");
    const b=Number(budget),t=Number(time);
    if(!Number.isFinite(b)||b<0) return setError("Please enter a valid budget.");
    if(!Number.isFinite(t)||t<=0) return setError("Please enter available travel time.");
    if(!lookup.attractions.length) return setError("No demo attractions are available for this destination yet. Add API/database data using the same attraction structure to support it.");
    const g=greedyAlgorithm(lookup.attractions,b,t,preferences), k=multiConstraintKnapsack(lookup.attractions,b,t,preferences);
    if(!g.selected.length && !k.selected.length) return setError("No suitable attractions found for your current time and budget. Try increasing your available time or budget.");
    const selected=algorithm==="greedy"?g.selected:k.selected;
    const traversal=bfsGraph(selected.length?selected:lookup.attractions);
    const finalOrder=traversal.filter(a=>selected.some(s=>s.id===a.id));
    const out={destination:lookup.city,attractions:lookup.attractions,greedy:g,knapsack:k,selected,order:finalOrder.length?finalOrder:selected,algorithm,startingLocation:start};
    setResult(out);
    const history=historyGet(); history.unshift({destination:lookup.city,date:new Date().toLocaleDateString(),count:selected.length,cost:selected.reduce((s,a)=>s+a.entryCost,0)}); localStorage.setItem("tap_history",JSON.stringify(history.slice(0,10))); onTripSaved?.();
  };
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">Trip planner</span><h1>Build your itinerary</h1><p>Choose a destination, set constraints and let the algorithms do the selection.</p></div></div><div className="planner-layout"><section className="panel"><div className="panel-title"><div className="icon-box small"><Compass/></div><div><h2>Trip inputs</h2><p>All resources are hard constraints.</p></div></div><div className="form-grid"><div className="full-col"><label>Where do you want to travel?</label><div className="search-input"><Search/><input value={destination} onChange={e=>{setDestination(e.target.value);setResult(null)}} placeholder="Hyderabad, Paris, Tokyo, Goa..."/>{lookup?.attractions.length>0&&<span className="match">Demo data</span>}</div>{destination&&lookup&&!lookup.attractions.length&&<small className="hint">No local demo data for this place. The architecture is ready for API data.</small>}</div><div><label>Available Budget</label><div className="input-icon"><Wallet/><input type="number" min="0" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="5000"/></div></div><div><label>Available Time (hours)</label><div className="input-icon"><Clock3/><input type="number" min="0.5" step="0.5" value={time} onChange={e=>setTime(e.target.value)} placeholder="8"/></div></div><div className="full-col"><label>Starting Location <span className="muted">(optional)</span></label><input value={start} onChange={e=>setStart(e.target.value)} placeholder="Hotel, station, airport, etc."/></div><div className="full-col"><label>Travel Preferences</label><div className="chips">{categories.map(c=><button type="button" key={c} className={preferences.includes(c)?"chip selected":"chip"} onClick={()=>togglePref(c)}>{c}</button>)}</div></div><div className="full-col"><label>Selection Algorithm</label><div className="algorithm-toggle"><button className={algorithm==="greedy"?"selected":""} onClick={()=>setAlgorithm("greedy")}>Greedy</button><button className={algorithm==="knapsack"?"selected":""} onClick={()=>setAlgorithm("knapsack")}>Knapsack</button></div></div></div>{error&&<ErrorBox text={error}/>}<button className="primary full generate" onClick={generate}>Generate My Itinerary <Sparkles size={18}/></button></section><section className="panel destination-preview"><div className="panel-title"><div className="icon-box small"><MapPin/></div><div><h2>{lookup?.city||"Destination"}</h2><p>{lookup?.attractions.length||0} demo attractions available</p></div></div>{lookup?.attractions.length?<div className="attraction-list">{lookup.attractions.map(a=><div className="attraction-row" key={a.id}><div className="a-avatar">{a.name.charAt(0)}</div><div className="a-info"><b>{a.name}</b><span>{a.category} · {a.visitTime}h · ₹{a.entryCost}</span></div><span className="rating"><Star size={14} fill="currentColor"/> {a.rating}</span></div>)}</div>:<div className="empty-preview"><MapPin size={38}/><p>Search a demo destination to preview attractions.</p><small>Hyderabad · Goa · Delhi · Mumbai · Bengaluru · Chennai · Paris · London · Dubai · Tokyo · New York</small></div>}</section></div>{result&&<PlannerResult result={result}/>}</main>
}

function PlannerResult({result}) {
  const [tab,setTab]=useState("itinerary");
  const selected=result.selected, g=result.greedy,k=result.knapsack;
  const graph=buildGraph(result.attractions), traversal=bfsGraph(result.attractions);
  const points=selected;
  return <section className="results"><div className="results-header"><div><span className="eyebrow">Generated result</span><h2>{result.destination} itinerary</h2><p>{selected.length} attractions selected using {result.algorithm==="greedy"?"Greedy":"Knapsack"} + BFS traversal.</p></div><div className="result-pill"><CheckCircle2 size={18}/> Constraints respected</div></div><div className="metric-grid"><Metric label="Attractions" value={selected.length}/><Metric label="Total Cost" value={"₹"+selected.reduce((s,a)=>s+a.entryCost,0)}/><Metric label="Time Used" value={selected.reduce((s,a)=>s+a.visitTime,0).toFixed(1)+"h"}/><Metric label="Total Value" value={selected.reduce((s,a)=>s+a.value,0)}/></div><div className="tabs"><button className={tab==="itinerary"?"active":""} onClick={()=>setTab("itinerary")}><CalendarDays/> Itinerary</button><button className={tab==="comparison"?"active":""} onClick={()=>setTab("comparison")}><BrainCircuit/> Algorithm Comparison</button><button className={tab==="graph"?"active":""} onClick={()=>setTab("graph")}><GitBranch/> Graph Traversal</button><button className={tab==="map"?"active":""} onClick={()=>setTab("map")}><MapPin/> Map</button></div>{tab==="itinerary"&&<div className="result-columns"><div className="itinerary-card">{result.order.map((a,i)=><div className="timeline-item" key={a.id}><div className="timeline-time">{String(9+Math.floor(result.order.slice(0,i).reduce((s,x)=>s+x.visitTime,0))).padStart(2,"0")}:00</div><div className="timeline-dot"></div><div className="timeline-content"><b>{a.name}</b><span>{a.category} · {a.visitTime}h · ₹{a.entryCost}</span></div></div>)}{!result.order.length&&<p>No attractions selected.</p>}</div><div className="side-summary"><Summary title="Resource usage" rows={[["Budget used","₹"+selected.reduce((s,a)=>s+a.entryCost,0)],["Budget remaining","₹"+Math.max(0,(g.remainingBudget??0)).toFixed(0)],["Time used",selected.reduce((s,a)=>s+a.visitTime,0).toFixed(1)+"h"],["Time remaining",Math.max(0,(g.remainingTime??0)).toFixed(1)+"h"]]}/><div className="info-note"><Info size={17}/><span>Visit order uses graph traversal for connected attractions. BFS is not a weighted shortest-path algorithm.</span></div></div></div>}{tab==="comparison"&&<Comparison g={g} k={k}/>} {tab==="graph"&&<GraphView attractions={result.attractions} traversal={traversal} graph={graph}/>} {tab==="map"&&<TripMap points={points} all={result.attractions}/>}</section>
}
function Metric({label,value}){return <div className="metric"><span>{label}</span><b>{value}</b></div>}
function Summary({title,rows}){return <div className="summary"><h3>{title}</h3>{rows.map(([a,b])=><div key={a}><span>{a}</span><b>{b}</b></div>)}</div>}
function Comparison({g,k}){return <div className="comparison"><div className="compare-card"><div className="compare-title"><BrainCircuit/><h3>Greedy Result</h3></div><p>Selects a high-scoring feasible attraction at each step.</p><Metric label="Attractions" value={g.selected.length}/><Metric label="Total cost" value={"₹"+g.totalCost}/><Metric label="Total time" value={g.totalTime.toFixed(1)+"h"}/><Metric label="Total value" value={g.totalValue}/><details><summary>View decisions</summary><div className="decision-list">{g.decisions.map((d,i)=><div key={i}><span>{d.attraction.name}</span><span className={d.selected?"yes":"no"}>{d.selected?"Selected":"Not selected"}</span></div>)}</div></details></div><div className="compare-card"><div className="compare-title"><Wallet/><h3>Knapsack Result</h3></div><p>Uses a two-resource dynamic-programming formulation for time and budget.</p><Metric label="Attractions" value={k.selected.length}/><Metric label="Total cost" value={"₹"+k.totalCost}/><Metric label="Total time" value={k.totalTime.toFixed(1)+"h"}/><Metric label="Total value" value={k.totalValue}/><details><summary>Selected items</summary><div className="decision-list">{k.selected.map(a=><div key={a.id}><span>{a.name}</span><span className="yes">Selected</span></div>)}</div></details></div></div>}
function GraphView({attractions,traversal,graph}){return <div className="graph-layout"><div className="graph-visual">{attractions.map((a,i)=>{const x=12+(i%4)*25,y=25+Math.floor(i/4)*28;return <React.Fragment key={a.id}><div className="graph-node" style={{left:`${x}%`,top:`${y}%`}}><span>{i+1}</span><small>{a.name}</small></div>{i<attractions.length-1&&<div className="graph-edge" style={{left:`${x+4}%`,top:`${y+3}%`,width:"21%"}}/>}</React.Fragment>})}</div><div className="traversal-panel"><h3>BFS Traversal Order</h3><p className="muted">The graph connects nearby/demo-sequence attractions. BFS explores connected nodes level by level.</p><div className="traversal-list">{traversal.map((a,i)=><div key={a.id}><b>{i+1}</b><span>{a.name}</span></div>)}</div></div></div>}
function TripMap({points,all}){const center=points.length?[points[0].latitude,points[0].longitude]:all.length?[all[0].latitude,all[0].longitude]:[20,0];return <div className="map-wrap"><MapContainer center={center} zoom={12} scrollWheelZoom style={{height:"520px",width:"100%"}}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><MapAutoFit points={points.length?points:all}/>{all.map(a=><Marker key={a.id} position={[a.latitude,a.longitude]} icon={new L.Icon.Default()}><Popup><b>{a.name}</b><br/>{a.category}<br/>₹{a.entryCost} · {a.visitTime}h</Popup></Marker>)}{points.length>1&&<Polyline positions={points.map(a=>[a.latitude,a.longitude])}/>}</MapContainer></div>}

function Dashboard({user,setPage}) {
  const history=historyGet();
  return <main className="page"><div className="dashboard-hero"><div><span className="eyebrow">Your dashboard</span><h1>Welcome, {user.name}!</h1><p>Your travel planning workspace.</p></div><button className="primary" onClick={()=>setPage("planner")}>Plan a Trip <ChevronRight/></button></div><div className="quick-grid">{[["Plan a Trip","Build an optimized itinerary","planner",Compass],["View Destinations","Explore demo destinations","destinations",MapPin],["View Algorithms","Understand the DAA logic","algorithms",BrainCircuit],["Give Feedback","Help improve the planner","feedback",MessageSquare]].map(([t,d,p,I])=><button className="quick-card" key={p} onClick={()=>setPage(p)}><I/><b>{t}</b><span>{d}</span><ChevronRight/></button>)}</div><section className="panel history-panel"><div className="panel-title"><div className="icon-box small"><History/></div><div><h2>Recent Trips</h2><p>Your latest generated itineraries.</p></div></div>{history.length?<div className="history-list">{history.map((h,i)=><div className="history-row" key={i}><div><b>{h.destination}</b><span>{h.date}</span></div><span>{h.count} attractions</span><span>₹{h.cost}</span></div>)}</div>:<div className="empty-preview">No trips planned yet.</div>}</section></main>
}

function Destinations({setPage}){const cities=Object.keys(demoAttractions);return <main className="page"><div className="page-heading"><div><span className="eyebrow">Explore</span><h1>Destinations</h1><p>Demo attraction datasets are reusable and ready to be replaced or extended with an API.</p></div></div><div className="destination-grid">{cities.map(c=><button className="destination-card" key={c} onClick={()=>{setPage("planner");}}><div className="dest-icon"><MapPin/></div><div><h3>{c}</h3><p>{demoAttractions[c].length} attractions · {new Set(demoAttractions[c].map(a=>a.category)).size} categories</p></div><ChevronRight/></button>)}</div><div className="info-note wide"><Info size={18}/><span>Any destination can be typed in the planner. These cities have built-in demo data; unknown destinations return an empty dataset ready for future API/database integration.</span></div></main>}

function Algorithms(){return <main className="page"><div className="page-heading"><div><span className="eyebrow">DAA laboratory</span><h1>How Our Algorithms Work</h1><p>INPUT → ALGORITHM → DECISION → OUTPUT</p></div></div><div className="algo-grid"><Algo icon={BrainCircuit} title="Greedy" color="orange">Ranks currently feasible attractions using value and resource usage, then selects a high-scoring option and updates the remaining budget and time. It is fast and understandable, but it does not guarantee a globally optimal solution.</Algo><Algo icon={Wallet} title="Knapsack" color="blue">Uses dynamic programming with two resource dimensions: budget and time. Each attraction is a 0/1 item, meaning it is selected or not selected, and the objective is to maximize total attraction value.</Algo><Algo icon={GitBranch} title="Graph Traversal" color="green">Represents attractions as graph nodes and connections as edges. BFS explores the connected graph level-by-level to produce a feasible exploration order. BFS/DFS alone does not solve weighted shortest paths.</Algo></div><div className="pipeline"><div>INPUT<span>Destination + Budget + Time + Preferences</span></div><ChevronRight/><div>ALGORITHM<span>Greedy / Knapsack / BFS</span></div><ChevronRight/><div>DECISION<span>Select + order attractions</span></div><ChevronRight/><div>OUTPUT<span>Itinerary + Map + Metrics</span></div></div></main>}
function Algo({icon:Icon,title,children,color}){return <div className={"algo-card "+color}><div className="algo-icon"><Icon/></div><h2>{title}</h2><p>{children}</p><div className="algo-tag">DAA Concept</div></div>}

function Feedback({user}){const [name,setName]=useState(user?.name||""),[email,setEmail]=useState(user?.email||""),[rating,setRating]=useState(0),[like,setLike]=useState(""),[improve,setImprove]=useState(""),[suggest,setSuggest]=useState(""),[done,setDone]=useState(false),[error,setError]=useState("");
 const submit=e=>{e.preventDefault();if(!name||!email||!rating)return setError("Please provide your name, valid email and a star rating.");const list=JSON.parse(localStorage.getItem("tap_feedback")||"[]");list.push({name,email,rating,like,improve,suggest,date:new Date().toISOString()});localStorage.setItem("tap_feedback",JSON.stringify(list));setDone(true);setLike("");setImprove("");setSuggest("");setRating(0);setError("")};
 return <main className="page narrow"><div className="page-heading"><div><span className="eyebrow">Feedback</span><h1>Help us improve</h1><p>Your feedback helps us make the DAA demonstration clearer and more useful.</p></div></div><section className="panel feedback-card">{done&&<div className="success"><CheckCircle2/> Thank you for your feedback!</div>}<form onSubmit={submit} className="form-grid"><Field label="Name" value={name} onChange={setName} placeholder="Your name"/><Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com"/><div className="full-col"><label>Rating</label><div className="stars">{[1,2,3,4,5].map(n=><button type="button" key={n} className={n<=rating?"on":""} onClick={()=>setRating(n)}><Star fill="currentColor"/></button>)}</div></div><div className="full-col"><label>What did you like?</label><textarea value={like} onChange={e=>setLike(e.target.value)} placeholder="Tell us what worked well..."/></div><div className="full-col"><label>What can we improve?</label><textarea value={improve} onChange={e=>setImprove(e.target.value)} placeholder="Tell us what could be better..."/></div><div className="full-col"><label>Additional suggestions</label><textarea value={suggest} onChange={e=>setSuggest(e.target.value)} placeholder="Any ideas for future versions?"/></div>{error&&<ErrorBox text={error}/>}<div className="full-col"><button className="primary">Submit Feedback <MessageSquare size={18}/></button></div></form></section></main>}

function About(){return <main className="page narrow"><div className="about-hero"><div className="icon-box large"><Compass/></div><span className="eyebrow">About the project</span><h1>Tourist Attraction Planner</h1><p>A practical DAA project that turns a real travel-planning problem into an interactive algorithm demonstration.</p></div><div className="about-grid"><div className="panel"><h2>Problem</h2><p>Tourists often have limited time and budget but want to visit valuable attractions. The planner models attraction selection as a constrained optimization problem.</p></div><div className="panel"><h2>Goal</h2><p>Demonstrate how Greedy, multi-constraint Knapsack and Graph Traversal can be applied to a practical tourism planning workflow.</p></div></div></main>}

function Profile({user,onLogout}){return <main className="page narrow"><section className="profile-card"><div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div><span className="eyebrow">Profile</span><h1>{user.name}</h1><p>{user.email}</p><button className="secondary" onClick={onLogout}><LogOut size={17}/> Logout</button></section></main>}

function App(){
 const [user,setUser]=useState(authGet()),[page,setPage]=useState(authGet()?"dashboard":"home");
 useEffect(()=>{const remembered=authGet();if(remembered)setUser(remembered)},[]);
 const logout=()=>{localStorage.removeItem("tap_user");setUser(null);setPage("home")};
 const protectedPage=p=>{if(!user){setPage("login");return}setPage(p)};
 let content;
 if(page==="login") content=<Login onLogin={u=>{setUser({name:u.name,email:u.email});setPage("dashboard")}} onGoSignup={()=>setPage("signup")}/>;
 else if(page==="signup") content=<Signup onSignup={u=>{setUser({name:u.name,email:u.email});setPage("dashboard")}} onGoLogin={()=>setPage("login")}/>;
 else {content=page==="home"?<Home setPage={protectedPage} user={user}/>:
 page==="planner"?<Planner user={user} onNeedLogin={()=>setPage("login")}/>:page==="dashboard"?<Dashboard user={user} setPage={setPage}/>:
 page==="destinations"?<Destinations setPage={setPage}/>:page==="algorithms"?<Algorithms/>:page==="feedback"?<Feedback user={user}/>:page==="about"?<About/>:page==="profile"?<Profile user={user} onLogout={logout}/>:<Home setPage={protectedPage} user={user}/>}
 return <><Navbar user={user} page={page} setPage={setPage} onLogout={logout}/>{content}<footer><div className="brand"><span className="brand-icon"><Compass size={18}/></span>Tourist Planner</div><span>DAA Problem 76 · Greedy · Knapsack · Graph Traversal</span></footer></>;
}
createRoot(document.getElementById("root")).render(<App/>);