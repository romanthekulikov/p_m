const ellipseAverage: number = 50;
const rectangleAverage: number = 100;
const triangleMax: number = 100;

function getEllipseValueX(strokeWidth: number, width: number): number {
    const valueX: number = (ellipseAverage - strokeWidth * ellipseAverage / width) > 0 ? 
        ellipseAverage - strokeWidth * ellipseAverage / width : 1;

    return valueX;
}

function getEllipseValueY(strokeWidth: number, height: number): number {
    const valueX: number = (ellipseAverage - strokeWidth * ellipseAverage / height) > 0 ? 
        ellipseAverage - strokeWidth * ellipseAverage / height : 1;

    return valueX;
}

function getRectangleWidth(strokeWidth: number, width: number): number {
    const newWidth: number = 
        (rectangleAverage - strokeWidth * rectangleAverage / width) > 0 ? 
        rectangleAverage - strokeWidth * rectangleAverage / width : 1;

    return newWidth;
}

function getRectangleHeight(strokeWidth: number, height: number): number {
    const newHeight: number = 
        (rectangleAverage - strokeWidth * rectangleAverage / height) > 0 ?
        rectangleAverage - strokeWidth * rectangleAverage / height : 1;

    return newHeight;
}

function getTriangleBottomPoint(strokeWidth: number): number {
    return triangleMax - strokeWidth / 2;
}

function getTriangleTopPoint(strokeWidth: number): number {
    return strokeWidth * 1.2;
}

function getTriangleBottomLeftPoint(strokeWidth: number): number {
    return strokeWidth * 0.83;
}

function getTriangleBottomRightPoint(strokeWidth: number): number {
    return triangleMax - strokeWidth * 0.83;
}   

export default {
    triangleMax,
    
    getEllipseValueX,
    getEllipseValueY,
    getRectangleWidth,
    getRectangleHeight,
    getTriangleBottomPoint,
    getTriangleTopPoint,
    getTriangleBottomLeftPoint,
    getTriangleBottomRightPoint
}