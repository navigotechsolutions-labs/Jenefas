// Catalogue page 7, lower-right Product 29. Visual proportions only.
// V arms are grouped as one base; factory construction and joints are unknown.
export const product29 = {
 code: '29', reference: '../product-28/assets/page_7.png',
 parts: [
  {id:'base', shape:'vBase', assembled:[0,.08,0], exploded:[-.45,.08,.7], interval:[0,.25]},
  {id:'post', shape:'cylinder', radius:.12,height:3.3,assembled:[0,1.79,0],exploded:[0,2.8,-.5],interval:[.25,.5]},
  {id:'lowerRail',shape:'box',size:[3.3,.17,.09],assembled:[0,2.05,.16],exploded:[1.1,2.3,1.4],interval:[.5,.75]},
  {id:'upperRail',shape:'box',size:[3.3,.17,.09],assembled:[0,3.05,.16],exploded:[-.9,4.25,1.4],interval:[.75,1]},
 ],
};
