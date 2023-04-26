import * as types from "./../types";

const resizeDivider: number = 1.778;
const distanceFromEdgeOfWorkboardToSlide: number = 150;
const areaBorderWidth: number = 10;
const resizeRightIndent: number = 25;
const resizeTopIndent: number = 11;
const resizeLeftIndent: number = 11;
const resizeBottomIndent: number = 25;

function createAreasInfo(e,
    slidesGroup: types.Slide[],
    currSlideIndex: number,
    currAreaIndex: number,
    selectedAreasIndexes: number[]
): types.AreaSelect[] {
    let areasInfo: Array<types.AreaSelect> = [];

    slidesGroup[currSlideIndex].areas.map((area, index) => {
        const areaWorkboard = document.querySelectorAll("#" + area.id)[0];
        const areaPosition = areaWorkboard.getBoundingClientRect();

        if (index === currAreaIndex || selectedAreasIndexes.includes(index)) 
        {
            const areaInfo: types.AreaSelect = {
                index: index,
                x: areaPosition.x,
                y: areaPosition.y,
                stepX: e.pageX - areaPosition.x,
                stepY: e.pageY - areaPosition.y,
            }

            areasInfo = (index === currAreaIndex) ? [areaInfo] :
            [...areasInfo.filter(value => value.index !== index), areaInfo];
        }
    });

    return areasInfo;
}

function updateAreasSelect(
    slidesGroup: types.Slide[],
    currSlideIndex: number,
    currAreaIndex: number,
    selectedAreasIndexes: number[],
    style: string
) {
    if (!slidesGroup[currSlideIndex] || !slidesGroup[currSlideIndex].areas) return;

    slidesGroup[currSlideIndex].areas.map((area, index) => {
        const areaElements = document.querySelectorAll("#" + area.id);
        const areaWorkboard = areaElements[0];
        const areaSlidesGroup = areaElements[1];

        if (index === currAreaIndex || selectedAreasIndexes.includes(index)) 
        {
            areaWorkboard.classList.add(style);
            areaSlidesGroup.classList.add(style);
        }
        else 
        {
            areaWorkboard.classList.remove(style);
            areaSlidesGroup.classList.remove(style);
        }
    });
}

function updateWorkboardSize() {
    const workboard = document.querySelectorAll("#workboard")[0];
    const workboardSlide: Element = document.querySelectorAll("#workboard-slide")[0];

    const workboardSlideStyles = (workboardSlide as HTMLElement).style;

    if (workboardSlide.clientWidth / resizeDivider < workboard.clientHeight - distanceFromEdgeOfWorkboardToSlide)
    {
        workboardSlideStyles.width = "100%";
        workboardSlideStyles.height = (workboardSlide.clientWidth / resizeDivider).toString() + "px";
    }
    else
    {
        workboardSlideStyles.height = "100%";
        workboardSlideStyles.width = (workboardSlide.clientHeight * resizeDivider).toString() + "px";
    }
}

function getNewDragCoordX(e, workboardSlideX: number, areasSelect: types.AreaSelect[]) {
    return e.pageX - workboardSlideX - areasSelect[areasSelect.length - 1].stepX;
}

function getNewDragCoordY(e, workboardSlideY: number, areasSelect: types.AreaSelect[]) {
    return e.pageY - workboardSlideY - areasSelect[areasSelect.length - 1].stepY;
}

function getCursorInAreaCheck(e, area: types.Area) {
    const areaWorkboard = document.querySelectorAll("#" + area.id)[0];
    const areaPosition = areaWorkboard.getBoundingClientRect();

    return e.pageX >= areaPosition.x && e.pageY >= areaPosition.y &&
    e.pageX <= areaPosition.x + area.width + areaBorderWidth * 2 && 
    e.pageY <= areaPosition.y + area.height + areaBorderWidth * 2;
}

function getCursorInResizeCheck(e, areaId: string) {
    const areaWorkboard = document.querySelectorAll("#" + areaId)[0];
    const areaPosition = areaWorkboard.getBoundingClientRect();

    return e.pageX >= areaPosition.x + areaPosition.width - resizeRightIndent && 
    e.pageY >= areaPosition.y + areaPosition.height - resizeBottomIndent &&
    e.pageX <= areaPosition.x + areaPosition.width - resizeLeftIndent && 
    e.pageY <= areaPosition.y + areaPosition.height - resizeTopIndent;
}

export default {
    createAreasInfo,
    updateAreasSelect,
    updateWorkboardSize,
    getNewDragCoordX,
    getNewDragCoordY,
    getCursorInAreaCheck,
    getCursorInResizeCheck
}