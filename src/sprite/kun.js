import kunUrl from '@/assets/kun/kun_sprite.png';
export const kunSprite = {
    url: kunUrl,
    frames: {
        'run-1': [130, 2, 30, 40],
        'run-2': [169, 2, 27, 40],
        'jump-1': [87, 2, 30, 39],
        'jump-2': [52, 0, 28, 42],
        'basketball': [0, 6, 33, 32],
    },
    animations: {
        run: [
            'run-1',
            'run-2',
        ],
        leftRun: '-run',
        jump1: ['jump-1'],
        jump2: ['jump-2'],
        basketball: ['basketball'],
    },
    tiles: []
}

