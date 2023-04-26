import * as types from "./../types";

const slideDistance: number = 20;
const slideWidth: number = 219;
const slideHeight: number = 125;

function updateSlidesSelect(
    slidesGroup: types.Slide[],
    currSlideIndex: number,
    selectedSlidesIndexes: number[],
    style: string
) {
    if (!slidesGroup[currSlideIndex] || !slidesGroup[currSlideIndex].areas) return;

    slidesGroup.map((slide, index) => {
        const slideElement = document.querySelectorAll("#" + slide.id)[0];

        if (index === currSlideIndex || selectedSlidesIndexes.includes(index)) 
        {
            slideElement.classList.add(style);
        }
        else 
        {
            slideElement.classList.remove(style);
        }
    });
}

function getInsertPositionToMove(e, slidesGroup: types.Slide[]): number {
    let insertPos: number = -1;

    slidesGroup.map((slide, index) => {
        const slideElement = document.querySelectorAll("#" + slide.id)[0];
        const slidePosition = slideElement.getBoundingClientRect();

        const cursorPosDownY: number = e.pageY - slidePosition.y - slidePosition.height;

        const cursorPosDown: boolean = cursorPosDownY > 0 &&
            (cursorPosDownY <= slideDistance || index === slidesGroup.length - 1);
        const cursorPosUp: boolean = slidePosition.y - e.pageY <= slideDistance;

        if (cursorPosDown)
        {
            insertPos = index + 1;
        }
        else if (cursorPosUp)
        {
            insertPos = index;
        }
    });

    return insertPos;
}

function getIsSelectSlidesCheck(e, 
    slidesGroup: types.Slide[], 
    currSlideIndex: number, 
    selectedSlidesIndexes: number[]
): boolean {
    let isSelect: boolean = false;

    slidesGroup.map((slide, index) => {
        const slideElement = document.querySelectorAll("#" + slide.id)[0];
        const slidePosition = slideElement.getBoundingClientRect();

        const cursorInSlide: boolean = e.pageX >= slidePosition.x && e.pageY >= slidePosition.y &&
            e.pageX <= slidePosition.x + slideWidth && e.pageY <= slidePosition.y + slideHeight;

        if (cursorInSlide && (index === currSlideIndex || selectedSlidesIndexes.includes(index)))
        {
            isSelect = true;
        }
    });

    return isSelect;
}

export default {
    slideWidth,
    slideHeight,
    
    updateSlidesSelect,
    getInsertPositionToMove,
    getIsSelectSlidesCheck,
}