const groundSort = (a, b) => {
  return a.start - b.start
}

export const groundCoordinates = [
  {
    type: 'land',
    start: 20,
    end: 740,
    h: 110
  },
  {
    type: 'land',
    start: 150,
    end: 256,
    h: 145
  },
  {
    type: 'land',
    start: 245,
    end: 288,
    h: 176
  },
  {
    type: 'land',
    start: 280,
    end: 350,
    h: 205
  },
  {
    type: 'land',
    start: 340,
    end: 387,
    h: 176
  },
  {
    type: 'land',
    start: 406,
    end: 481,
    h: 145
  },
  {
    type: 'land',
    start: 570,
    end: 641,
    h: 205
  },
  {
    type: 'land',
    start: 600,
    end: 707,
    h: 160
  },
  {
    type: 'land',
    start: 856,
    end: 1026,
    h: 110
  },
  {
    type: 'land',
    start: 1142,
    end: 1410,
    h: 110
  },
  {
    type: 'land',
    start: 1335,
    end: 1858,
    h: 80
  },
  {
    type: 'land',
    start: 1370,
    end: 1475,
    h: 210
  },
  {
    type: 'land',
    start: 1463,
    end: 1538,
    h: 160
  },
  {
    type: 'land',
    start: 1560,
    end: 1795,
    h: 144
  },
  {
    type: 'land',
    start: 1688,
    end: 1891,
    h: 210
  },
  {
    type: 'land',
    start: 1815,
    end: 2051,
    h: 110
  },
  {
    type: 'land',
    start: 1880,
    end: 1954,
    h: 175
  },
  {
    type: 'land',
    start: 1975,
    end: 2051,
    h: 175
  },
  {
    type: 'land',
    start: 2010,
    end: 2178,
    h: 80
  },
  {
    type: 'land',
    start: 2073,
    end: 2113,
    h: 160
  },
  {
    type: 'land',
    start: 2135,
    end: 2241,
    h: 145
  },
  {
    type: 'land',
    start: 2210,
    end: 2274,
    h: 115
  },
  {
    type: 'land',
    start: 2295,
    end: 2370,
    h: 145
  },
  {
    type: 'land',
    start: 2295,
    end: 2337,
    h: 210
  },
  {
    type: 'land',
    start: 2325,
    end: 2433,
    h: 180
  },
  {
    type: 'land',
    start: 2422,
    end: 2500,
    h: 115
  },
  {
    type: 'land',
    start: 2455,
    end: 2530,
    h: 80
  },
  {
    type: 'land',
    start: 2455,
    end: 2500,
    h: 210
  },
  {
    type: 'land',
    start: 2490,
    end: 2530,
    h: 160
  },
  {
    type: 'land',
    start: 2550,
    end: 2625,
    h: 110
  },
  {
    type: 'land',
    start: 2580,
    end: 2752,
    h: 140
  },
  {
    type: 'land',
    start: 2680,
    end: 2785,
    h: 208
  },
  {
    type: 'land',
    start: 2808,
    end: 2880,
    h: 176
  },
  {
    type: 'land',
    start: 2900,
    end: 2980,
    h: 145
  },
  {
    type: 'land',
    start: 2966,
    end: 3135,
    h: 115
  },
  {
    type: 'land',
    start: 2966,
    end: 3246,
    h: 210
  },
  {
    type: 'land',
    start: 3000,
    end: 3135,
    h: 160
  },
  {
    type: 'land',
    start: 3125,
    end: 3167,
    h: 145
  },
  {
    type: 'land',
    start: 3157,
    end: 3200,
    h: 178
  },
  {
    type: 'water',
    start: 0,
    end: 1743,
    h: 221,
    fallDisabled: true
    // h: data.winHeight - 10
  },
].sort(groundSort);


export const enemiesPos = [
  {
    type: 'birdman',
    x: 1000,
    y: 10
  },
  {
    type: 'birdman',
    x: 2000,
    y: 10
  },
  {
    type: 'cannon',
    x: 500,
    y: 110
  },
  {
    type: 'cannon',
    x: 550,
    y: 110
  },
  {
    type: 'cannon',
    x: 600,
    y: 110
  },
  {
    type: 'runningman',
    x: 450,
    y: 110
  },
  {
    type: 'runningman',
    x: 500,
    y: 110
  },
  {
    type: 'runningman',
    x: 550,
    y: 110
  },
  {
    type: 'runningman',
    x: 1300,
    y: 110
  },
  {
    type: 'runningman',
    x: 1350,
    y: 110
  },
  {
    type: 'runningman',
    x: 1400,
    y: 110
  },
  {
    type: 'runningman',
    x: 1700,
    y: 144
  },
  {
    type: 'runningman',
    x: 1400,
    y: 80
  },
  {
    type: 'runningman',
    x: 1450,
    y: 80
  },
  {
    type: 'runningman',
    x: 1500,
    y: 80
  },
  {
    type: 'runningman',
    x: 1550,
    y: 80
  },
  {
    type: 'runningman',
    x: 1600,
    y: 80
  },
  {
    type: 'runningman',
    x: 1650,
    y: 80
  },
  {
    type: 'runningman',
    x: 1700,
    y: 80
  },
  {
    type: 'runningman',
    x: 1750,
    y: 80
  },
  {
    type: 'runningman',
    x: 1800,
    y: 80
  },
  {
    type: 'runningman',
    x: 950,
    y: 110
  },
  {
    type: 'gunner',
    x: 320,
    y: 205
  },
  {
    type: 'gunner',
    x: 610,
    y: 205
  },
  {
    type: 'gunner',
    x: 1000,
    y: 110
  },
  {
    type: 'gunner',
    x: 1330,
    y: 110
  },
  {
    type: 'gunner',
    x: 1460,
    y: 210
  },
  {
    type: 'gunner',
    x: 1800,
    y: 210
  },
  {
    type: 'gunner',
    x: 2100,
    y: 160
  },
  {
    type: 'gunner',
    x: 2320,
    y: 210
  },
  {
    type: 'gunner',
    x: 2490,
    y: 210
  },
  {
    type: 'gunner',
    x: 2750,
    y: 210
  },
  {
    type: 'gunner',
    x: 2790,
    y: 210
  },
  {
    type: 'eagle',
    x: 100,
    bulletType: 2,
  },
  {
    type: 'eagle',
    x: 500,
    bulletType: 2,
  },
  {
    type: 'eagle',
    x: 1000,
    bulletType: 2
  },
  {
    type: 'eagle',
    x: 1500,
    bulletType: 2,
  },
  {
    type: 'eagle',
    x: 2000,
    bulletType: 2,
  },
  {
    type: 'eagle',
    x: 2500,
    bulletType: 2,
  },
  {
    type: 'eagle',
    x: 3000,
    bulletType: 2,
  },
  {
    type: 'kun',
    x: 3000,
    // x: 300,
    y: 100
  }
].sort((a, b) => {
  return a.x - b.x
});
