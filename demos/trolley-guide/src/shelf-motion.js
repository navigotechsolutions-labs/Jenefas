// Illustrative shelf positioning, expressed only in scene units.
export function shelfMotion(time) {
 const smooth = (x) => { const p=Math.max(0,Math.min(1,x)); return p*p*(3-2*p); };
 const t=time-24;
 return { visible:t>=0, supportOffset:1.15*(1-smooth(t/2)), plateVisible:t>=2.5, plateHeight:.85*(1-smooth((t-2.5)/2)) };
}
