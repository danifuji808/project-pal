export const STATUS = ["Queued", "WIP", "Completed"];
export const CRAFT = ["Knit", "Crochet", "Tunisian Crochet"];
export const TYPES = ["Blanket","Scarf","Shawl/Cowl","Beanie/Hat","Mittens/Gloves","Socks","Sweater/Cardigan","Top/Tee","Bag/Tote","Toy/Amigurumi","Dishcloth","Other"];
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAYLABELS = ["S","M","T","W","T","F","S"];

export const SS = {
  Queued:   { bg:"bg-blue-100 dark:bg-blue-900",   text:"text-blue-800 dark:text-blue-200",   border:"border-blue-400 dark:border-blue-500",   sel:"bg-blue-200 dark:bg-blue-800" },
  WIP:      { bg:"bg-amber-100 dark:bg-amber-900",  text:"text-amber-800 dark:text-amber-200",  border:"border-amber-400 dark:border-amber-500",  sel:"bg-amber-200 dark:bg-amber-800" },
  Completed:{ bg:"bg-green-100 dark:bg-green-900",  text:"text-green-800 dark:text-green-200",  border:"border-green-400 dark:border-green-500",  sel:"bg-green-200 dark:bg-green-800" },
};

export const CI = { Knit:"K", Crochet:"C", "Tunisian Crochet":"T" };

export const THEMES = {
  toffee:    { label:"Toffee",          free:true,  emoji:"🤎" },
  midnight:  { label:"Midnight",        free:true,  emoji:"🖤" },
  cream:     { label:"Cream",           free:true,  emoji:"🤍" },
  glacier:   { label:"Glacier",         free:false, emoji:"🩵" },
  lavender:  { label:"Lavender Fields", free:false, emoji:"💜" },
  sage:      { label:"Sage",            free:false, emoji:"🌿" },
  blush:     { label:"Blush",           free:false, emoji:"🩷" },
  terracotta:{ label:"Terracotta",      free:false, emoji:"🧡" },
};

export const DEFAULT_SETTINGS = {
  theme:"toffee", iconSet:"default", cardLayout:"default",
  defaultCraft:"Knit", defaultStatus:"Queued", autoWip:true,
  rowCounterVisibility:"visible", breakReminders:false, breakInterval:50,
  celebrationEnabled:true, isDonor:false, onboardingDone:false, defaultUnit:"yards"
};

export const SAMPLE_PROJECT = {
  id:"sample-project-guest", name:"Sample Project", pattern:"Creative Pattern Name",
  patternUrl:"https://www.ravelry.com", size:"M", craft:"Knit", type:"Beanie/Hat",
  status:"WIP", recipient:"", needleSizes:["6mm"],
  yarns:[{ id:"sy1", brand:"Generic", name:"Squishy", colorway:"Rainbows", dyeLot:"12345", amountPerSkein:"220", unit:"yards", numSkeins:"1" }],
  notes:[
    { id:"sn1", text:"Started the brim today! Cast on went smoothly.", ts:new Date(Date.now()-7*86400000).toISOString() },
    { id:"sn2", text:"Had to frog back 3 rows — miscounted the rib pattern. Back on track!", ts:new Date(Date.now()-5*86400000).toISOString() },
    { id:"sn3", text:"The colorway is even prettier in person. Really happy with this yarn.", ts:new Date(Date.now()-2*86400000).toISOString() },
  ],
  todos:[
    { id:"st1", text:"Cast on 96 stitches", done:true },
    { id:"st2", text:"Work 2x2 rib for 2 inches", done:true },
    { id:"st3", text:"Switch to stockinette for body", done:false },
    { id:"st4", text:"Work decreases for crown", done:false },
    { id:"st5", text:"Kitchener stitch or 3-needle bind off", done:false },
  ],
  sessions:[
    { id:"ss1", start:new Date(Date.now()-7*86400000).toISOString(), end:new Date(Date.now()-7*86400000+45*60000).toISOString(), duration:45*60000 },
    { id:"ss2", start:new Date(Date.now()-5*86400000).toISOString(), end:new Date(Date.now()-5*86400000+30*60000).toISOString(), duration:30*60000 },
    { id:"ss3", start:new Date(Date.now()-2*86400000).toISOString(), end:new Date(Date.now()-2*86400000+60*60000).toISOString(), duration:60*60000 },
  ],
  activeSession:null,
  rowCounter:{ current:6, start:1 },
  repeatCounter:{ enabled:true, from:6, to:8, total:3, current:1 },
  priorHours:"", priorMins:"", _nameEdited:true,
};
