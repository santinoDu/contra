import enemyUrl from '@/assets/images/enemySprite.png';
export const enemySprite = {
    url: enemyUrl,
    frames: {
        'run-1': [45, 41, 19, 31],
        'run-2': [65, 42, 17, 31],
        'run-3': [84, 43, 18, 31],
        'run-4': [103, 41, 19, 31],
        'run-5': [123, 42, 18, 31],
        'bird-man': [15, 184, 26, 47],
        'shot-1': [90, 74, 25, 31],
        'shot-2': [70, 9, 24, 31],
        'cannon': [76, 262, 32, 31],
    },
    animations: {
        runningman: [
            'run-1',
            'run-2',
            'run-3',
            'run-4',
            'run-5',
        ],
        birdman: ['bird-man'],
        shot1: ['shot-1'],
        shot2: ['shot-2'],
        shotRight: '-shot2',
        cannon: ['cannon'],
    },
    tiles: []
}

