// Scene units express visual proportions only. They are NOT measurements.
// Only four broad visible structures are represented; connections stay schematic.
export const product28 = {
  code: '28',
  reference: './assets/page_7.png',
  parts: [
    { id: 'base', shape: 'box', size: [3.6, .12, 1.9], assembled: [0, .08, 0], exploded: [-.45, .08, .7], interval: [0, .25] },
    { id: 'post', shape: 'cylinder', radius: .12, height: 3.3, assembled: [0, 1.79, 0], exploded: [0, 2.8, -.5], interval: [.25, .5] },
    { id: 'lowerRail', shape: 'box', size: [3.3, .17, .09], assembled: [0, 2.05, .16], exploded: [1.1, 2.3, 1.4], interval: [.5, .75] },
    { id: 'upperRail', shape: 'box', size: [3.3, .17, .09], assembled: [0, 3.05, .16], exploded: [-.9, 4.25, 1.4], interval: [.75, 1] },
  ],
};
