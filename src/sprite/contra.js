import contraUrl from '@/assets/images/contra.png';
import bulletsUrl from '@/assets/images/bullets.png';
export const contraSprite = {
    url: contraUrl,
    frames: {
        'run-1': [0, 42, 17, 36],
        'run-2': [17, 42, 20, 36],
        'run-3': [17, 42, 20, 36],
        'run-4': [58, 43, 17, 35],
        'run-5': [75, 43, 19, 35],
        'run-6': [94, 46, 21, 32],
        'jump-1': [116, 51, 17, 21],
        'jump-2': [134, 53, 21, 17],
        'jump-3': [156, 51, 17, 21],
        'jump-4': [174, 53, 21, 17],
        // 平射
        'shot-1':  [0, 7, 24, 35],
        'shot-2': [24, 8, 24, 34],
        // 向上射击
        'shot-3': [48, 0, 15, 43],
        'shot-4': [63, 0, 15, 42],
        // 趴下射击
        'shot-5': [78, 24, 33, 17],
        'shot-6':  [111, 25, 33, 17],
        'run-shot-1': [0, 78, 24, 35],
        'run-shot-2': [24, 78, 26, 35],
        'run-shot-3': [50, 80, 26, 33],
        'die-1': [77, 93, 24, 16],
        'die-2': [103, 89, 16, 24],
        'die-3': [121, 93, 24, 16],
        'die-4': [147, 89, 16, 24],
        'die-5': [167, 102, 33, 11],
        'top-right-1':  [0, 148, 17, 36],
        'top-right-2':  [17, 148, 20, 36],
        'top-right-3':  [37, 150, 21, 34],
        'bottom-right-1': [0, 220, 21, 36],
        'bottom-right-2': [21, 220, 22, 36],
        'bottom-right-3': [43, 222, 22, 34],
        'gunM':  [96, 8, 7, 7],
        'life': [192, 0, 9, 16],
    },
    animations: {
        bottomRight: [
            'bottom-right-1',
            'bottom-right-2',
            'bottom-right-3',
        ],
        bottomLeft: '-bottomRight',
        topRight: [
            'top-right-1',
            'top-right-2',
            'top-right-3',
        ],
        topLeft: '-topRight',
        die: [
            'die-1',
            'die-2',
            'die-3',
            'die-4',
            'die-5',
        ],
        runShot: [
            'run-shot-1',
            'run-shot-2',
            'run-shot-3',
        ],
        forward: ['shot-1'],
        backward: '-forward',
        forwardShot: [
            'shot-1',
            'shot-2',
        ],
        top: ['shot-3'],
        leftTop: '-top',
        topShot: [
            'shot-3',
            'shot-4',
        ],
        bottom: ['shot-5'],
        leftBottom: '-bottom',
        downShot: [
            'shot-5',
            'shot-6',
        ],
        right: [
            'run-1',
            'run-2',
            'run-3',
            'run-4',
            'run-5',
            'run-6',
        ],
        left: '-right',
        jumpping: [
            'jump-1',
            'jump-2',
            'jump-3',
            'jump-4',
        ],
        life: ['life'],
    },
    tiles: {
        gunM: [96, 8, 7, 7],
        gunN: [81, 9, 4, 4],
    }
}

export const eagleSprite = {
    url: bulletsUrl,
    frames: [],
    animations: [],
    tiles: {
        origin: [99, 17, 25, 15],
        eagleM: [0, 0, 24, 15],
        eagleS: [49, 0, 25, 15],
        eagleR: [74, 0, 25, 15],
    }
}
