
export const getAngle = (x1, y1, x2, y2) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    const angleInDegrees = (angleInRadians * (180 / Math.PI) + 360) % 360;
    return 360 - angleInDegrees;
}
