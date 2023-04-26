import type * as types from "./types";
import * as consts from "./consts";
import * as createElement from "./model/createElement";
import * as updateElement from "./model/updateElement";
import { getProperty } from "./utils/property";

function changeTitle(presentationMaker: types.PresentationMaker, updatedTitle: string): types.PresentationMaker {
    return {
        ...presentationMaker,
        title: updatedTitle
    }
}

function convertStateToJson(presentationMaker: types.PresentationMaker): types.PresentationMaker {
    const json: string = JSON.stringify(presentationMaker);
    const blob = new Blob([json], {type: "text/plain"});

    const title: string = presentationMaker.title;
    const fileName: string = (title !== "" ? title : "presentation_make") + ".json";

    const link = document.createElement("a");

    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", fileName);

    link.click();

    return presentationMaker;
}

function convertJsonToState(json: string): types.PresentationMaker {
    if (typeof json !== "string") {
        return json;
    }

    return JSON.parse(json);
}

function undo(presentationMaker: types.PresentationMaker): types.PresentationMaker {
    if (presentationMaker.currentPresentationElementsIndex <= 0) {
        return presentationMaker;
    }

    const newPresentationElements: number = presentationMaker.currentPresentationElementsIndex - 1;

    return {
        ...presentationMaker,
        presentationElements: {
            ...presentationMaker.localHistory[newPresentationElements]
        },
        currentPresentationElementsIndex: newPresentationElements
    };
}

function redo(presentationMaker: types.PresentationMaker): types.PresentationMaker {
    if (presentationMaker.currentPresentationElementsIndex >= presentationMaker.localHistory.length - 1) {
        return presentationMaker;
    }

    const newPresentationElements: number = presentationMaker.currentPresentationElementsIndex + 1;

    return {
        ...presentationMaker,
        presentationElements: {
            ...presentationMaker.localHistory[newPresentationElements]
        },
        currentPresentationElementsIndex: newPresentationElements
    };
}

function addSlide(presentationMaker: types.PresentationMaker): types.PresentationMaker {
    const newSlide: types.Slide = createElement.createSlide();

    const newSlidesGroup: types.Slide[] = [
        ...presentationMaker.presentationElements.slidesGroup,
        newSlide
    ];

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup,
        currentSlideIndex: newSlidesGroup.length - 1,
        selectedSlidesIndexes: [],
        selectedAreasIndexes: [],
        currentAreaIndex: consts.notSelectedIndex
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function deleteSlides(presentationMaker: types.PresentationMaker): types.PresentationMaker {
    const newSelectedSlidesIndexes: number[] = [...presentationMaker.presentationElements.selectedSlidesIndexes];

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.filter(
        (_, index) => !newSelectedSlidesIndexes.includes(index) && 
        index !== presentationMaker.presentationElements.currentSlideIndex
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup,
        currentSlideIndex: newSlidesGroup.length > 0 ? 0 : consts.notSelectedIndex,
        selectedSlidesIndexes: [],
        selectedAreasIndexes: [],
        currentAreaIndex: consts.notSelectedIndex
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function moveSlides(presentationMaker: types.PresentationMaker, insertPos: number): types.PresentationMaker {
    if (insertPos < 0 || insertPos >= presentationMaker.presentationElements.slidesGroup.length) {
        return presentationMaker;
    }

    const currSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    const currSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[currSlideIndex];

    const newSelectedSlidesIndexes: number[] = [...presentationMaker.presentationElements.selectedSlidesIndexes];
    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.filter((_, index) => {
        return !newSelectedSlidesIndexes.includes(index) && index !== currSlideIndex
    });

    const selectedSlides: types.Slide[] = !presentationMaker.presentationElements.selectedSlidesIndexes.length ?
    [currSlide] : presentationMaker.presentationElements.selectedSlidesIndexes.map((index) => {
        return presentationMaker.presentationElements.slidesGroup[index];
    });

    newSlidesGroup.splice(insertPos, 0, ...selectedSlides);

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup,
        currentSlideIndex: insertPos,
        selectedSlidesIndexes: newSlidesGroup.map((value, index) =>
            selectedSlides.includes(value) ? index : 
            consts.notSelectedIndex).filter(value => value !== consts.notSelectedIndex)
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function selectSlides(presentationMaker: types.PresentationMaker, selectedSlides: number[]): types.PresentationMaker {
    if (!presentationMaker.presentationElements.slidesGroup.length) {
        return presentationMaker;
    }

    const slidesIndexes: number[] = [...selectedSlides];
    if (presentationMaker.presentationElements.slidesGroup.length <= 
    slidesIndexes.sort((int1: number, int2: number) => int2 - int1)[0]
    || slidesIndexes.find((int: number) => int < 0)
    || slidesIndexes.filter((value, index) => slidesIndexes.indexOf(value) !== index).length
    || slidesIndexes.find(value => value === presentationMaker.presentationElements.currentSlideIndex)) {
        return presentationMaker;
    }

    const currSlideIndex: number[] = presentationMaker.presentationElements.currentSlideIndex !== consts.notSelectedIndex ? 
    [presentationMaker.presentationElements.currentSlideIndex] : [];

    const selectedSlidesIndexes: number[] = presentationMaker.presentationElements.selectedSlidesIndexes.length ? 
    [...presentationMaker.presentationElements.selectedSlidesIndexes.filter(value => !slidesIndexes.includes(value))]
    : currSlideIndex;

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        selectedSlidesIndexes: [...selectedSlidesIndexes, ...slidesIndexes],
        selectedAreasIndexes: [],
        currentSlideIndex: selectedSlides[selectedSlides.length - 1],
        currentAreaIndex: consts.notSelectedIndex
    }

    return {
        ...presentationMaker,
        presentationElements: newPresentationElements
    };
}

function unselectSlides(presentationMaker: types.PresentationMaker, unselectedSlides: number[]): types.PresentationMaker {
    if (!presentationMaker.presentationElements.slidesGroup.length) {
        return presentationMaker;
    }

    const slidesIndexes: number[] = [...unselectedSlides];

    if (presentationMaker.presentationElements.slidesGroup.length <= 
    unselectedSlides.sort((int1: number, int2: number) => int2 - int1)[0]
    || slidesIndexes.find((int: number) => int < 0)) {
        return presentationMaker;
    }

    const newSelectedSlidesIndexes: number[] = presentationMaker.presentationElements.selectedSlidesIndexes.filter(
        (index: number) => !slidesIndexes.includes(index)
    );

    const newCurrSlideIndex: number = newSelectedSlidesIndexes.length ? newSelectedSlidesIndexes[0] : slidesIndexes[0];

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        currentSlideIndex: newSelectedSlidesIndexes.length - 1 > 0
            ? newSelectedSlidesIndexes[newSelectedSlidesIndexes.length - 1] : newCurrSlideIndex,
        selectedSlidesIndexes: newSelectedSlidesIndexes.length > 1 ? newSelectedSlidesIndexes : []
    }

    return {
        ...presentationMaker,
        presentationElements: newPresentationElements
    };
}

function assignSlideIndex(presentationMaker: types.PresentationMaker, slideIndex: number): types.PresentationMaker {
    if (presentationMaker.presentationElements.slidesGroup.length === 0 || slideIndex < 0
    || presentationMaker.presentationElements.slidesGroup.length <= slideIndex) {
        return presentationMaker;
    }

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        currentSlideIndex: slideIndex,
        currentAreaIndex: consts.notSelectedIndex,
        selectedSlidesIndexes: [],
        selectedAreasIndexes: []
    }

    return {
        ...presentationMaker,
        presentationElements: newPresentationElements
    };
}

function updateSlideProperty(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    if (presentationMaker.presentationElements.slidesGroup.length === 0) {
        return presentationMaker;
    }

    const currentSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    const currentSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[currentSlideIndex];

    const newSlide: types.Slide = updateElement.updateSlide(currentSlide, properties);

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (slide, index) => index === currentSlideIndex ? newSlide : slide
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function addArea(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    const currentSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    if (currentSlideIndex === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const curSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[currentSlideIndex];

    const areaContent = createElement.createAreaContent(properties);
    const newArea: types.Area = createElement.createArea(areaContent, curSlide.areas.length);

    const newSlide: types.Slide = {
        ...curSlide,
        areas: [...curSlide.areas, newArea]
    };

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (slide, index) => index === currentSlideIndex ? newSlide : slide
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup,
        currentAreaIndex: newSlide.areas.length - 1,
        selectedAreasIndexes: [],
        selectedSlidesIndexes: []
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function deleteAreas(presentationMaker: types.PresentationMaker): types.PresentationMaker {
    const curSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    if (curSlideIndex === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const curAreaIndex: number = presentationMaker.presentationElements.currentAreaIndex;
    const curSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[curSlideIndex];
    const newSlide: types.Slide = {
        ...curSlide,
        areas: curSlide.areas.filter(
            (_, index) => !presentationMaker.presentationElements.selectedAreasIndexes.includes(index) 
            && index !== curAreaIndex
        )
    };

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (slide, index) => index === curSlideIndex ? newSlide : slide
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup,
        currentAreaIndex: consts.notSelectedIndex,
        selectedAreasIndexes: []
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function selectAreas(presentationMaker: types.PresentationMaker, selectedAreas: number[]): types.PresentationMaker {
    const curSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    if (curSlideIndex === consts.notSelectedIndex || !selectedAreas.length) {
        return presentationMaker;
    }

    const areasIndexes: number[] = [...selectedAreas];
    const curSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[curSlideIndex];

    if (curSlide.areas.length <= areasIndexes.sort((int1: number, int2: number) => int2 - int1)[0]
    || areasIndexes.find((int: number) => int < 0)
    || areasIndexes.filter((value, index) => areasIndexes.indexOf(value) !== index).length
    || areasIndexes.find(value => value === presentationMaker.presentationElements.currentAreaIndex)) {
        return presentationMaker;
    }

    const selectedAreasIndexes: number[] = presentationMaker.presentationElements.selectedAreasIndexes.length ?
    [...presentationMaker.presentationElements.selectedAreasIndexes] : (
        presentationMaker.presentationElements.currentAreaIndex !== -1 ? 
        [presentationMaker.presentationElements.currentAreaIndex] : []
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        selectedSlidesIndexes: [],
        selectedAreasIndexes: [...selectedAreasIndexes, ...selectedAreas],
        currentAreaIndex: consts.notSelectedIndex
    }

    return {
        ...presentationMaker,
        presentationElements: newPresentationElements
    };
}

function unselectAreas(presentationMaker: types.PresentationMaker, selectedAreas: number[]): types.PresentationMaker {
    const curSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    if (curSlideIndex === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const areasIndexes: number[] = [...selectedAreas];
    const curSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[curSlideIndex];
    if (curSlide.areas.length <= areasIndexes.sort((int1: number, int2: number) => int2 - int1)[0]
    || areasIndexes.find((int: number) => int < 0)) {
        return presentationMaker;
    }

    const newSelectedAreasIndexes: number[] = presentationMaker.presentationElements.selectedAreasIndexes.filter(
        (index: number) => !areasIndexes.includes(index)
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        currentAreaIndex: (
            newSelectedAreasIndexes.length - 1 > 0 || !newSelectedAreasIndexes[newSelectedAreasIndexes.length - 1]
        ) ? consts.notSelectedIndex : newSelectedAreasIndexes[newSelectedAreasIndexes.length - 1],
        selectedAreasIndexes: newSelectedAreasIndexes.length > 1 ? newSelectedAreasIndexes : []
    }

    return {
        ...presentationMaker,
        presentationElements: newPresentationElements
    };
}

function assignAreaIndex(presentationMaker: types.PresentationMaker, areaIndex: number): types.PresentationMaker {
    const curSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    if (!presentationMaker.presentationElements.slidesGroup.length) {
        return presentationMaker;
    }

    const curSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[curSlideIndex];
    if (areaIndex < -1 || curSlide.areas.length <= areaIndex) {
        return presentationMaker;
    }

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        currentAreaIndex: areaIndex,
        selectedSlidesIndexes: [],
        selectedAreasIndexes: []
    }

    return {
        ...presentationMaker,
        presentationElements: newPresentationElements
    };
}

function updateArea(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    const currIdSlide: number = presentationMaker.presentationElements.currentSlideIndex;
    const currIdArea: number = presentationMaker.presentationElements.currentAreaIndex;

    if (currIdArea === consts.notSelectedIndex || currIdSlide === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const currentSlide: types.Slide = { ...presentationMaker.presentationElements.slidesGroup[currIdSlide] };
    const currentArea: types.Area = { ...currentSlide.areas[currIdArea] };

    const newArea: types.Area = updateElement.updateArea(currentArea, properties);

    const newSlide: types.Slide = {
        ...currentSlide,
        areas: currentSlide.areas.map((value, index) => index === currIdArea ? newArea : value)
    };

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (value, index) => index === currIdSlide ? newSlide : value
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function updateAreas(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    const currSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;

    if (currSlideIndex === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const areasSelect: types.AreaSelect[] = getProperty(properties, "areasSelect") as types.AreaSelect[];
    const slidePosX: number = getProperty(properties, "slidePosX") as number;
    const slidePosY: number = getProperty(properties, "slidePosY") as number;

    const currentSlide: types.Slide = {...presentationMaker.presentationElements.slidesGroup[currSlideIndex]};

    const updatedAreas: (types.UpdatedArea | undefined)[] = currentSlide.areas.map((area, index) => {
        if (!areasSelect.find(value => value.index === index)) {
            return;
        }

        return {
            index: index,
            x: area.x,
            y: area.y
        }
    });

    const earlySlide: types.Slide = {
        ...currentSlide,
        areas: currentSlide.areas.map((area, index) => {
            const areaSelect: types.AreaSelect | undefined = areasSelect.find(value => value.index === index);

            if (!areaSelect) {
                return area;
            }

            return updateElement.updateArea(area, { x: areaSelect.x - slidePosX, y: areaSelect.y - slidePosY });
        })
    }

    const newSlide: types.Slide = {
        ...currentSlide,
        areas: currentSlide.areas.map((area, index) => {
            const updatedArea: types.UpdatedArea | undefined = updatedAreas.find(value => value && value.index === index);

            if (!updatedArea) {
                return area;
            }

            return updateElement.updateArea(area, { x: updatedArea.x, y: updatedArea.y });
        })
    };

    const earlyPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: presentationMaker.presentationElements.slidesGroup.map(
            (slide, index) => index === currSlideIndex ? earlySlide : slide
        )
    }

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: presentationMaker.presentationElements.slidesGroup.map(
            (slide, index) => index === currSlideIndex ? newSlide : slide
        )
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex),
            earlyPresentationElements,
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function updateInDragAreas(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    const currSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;

    if (currSlideIndex === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const areasSelect: types.AreaSelect[] = getProperty(properties, "areasSelect") as types.AreaSelect[];
    const newAreaLastX: number = getProperty(properties, "newAreaLastX") as number;
    const newAreaLastY: number = getProperty(properties, "newAreaLastY") as number;

    const currSlide: types.Slide = {...presentationMaker.presentationElements.slidesGroup[currSlideIndex]};
    const lastAreaIndex: number = areasSelect[areasSelect.length - 1].index;
    const lastArea: types.Area = {...currSlide.areas[lastAreaIndex]};

    const stepX: number = newAreaLastX - lastArea.x;
    const stepY: number = newAreaLastY - lastArea.y;

    const newAreas: types.Area[] = currSlide.areas.map((area, index) => {
        if (!areasSelect.find(value => value.index === index)) {
            return area;
        }
        else if (index === lastAreaIndex) {
            return updateElement.updateArea(area, { x: newAreaLastX, y: newAreaLastY });
        }

        return updateElement.updateArea(area, { x: area.x + stepX, y: area.y + stepY });
    });

    const newSlide: types.Slide = {
        ...currSlide,
        areas: newAreas
    }

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (slide, index) => index === currSlideIndex ? newSlide : slide
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    return {
        ...presentationMaker,
        presentationElements: newPresentationElements
    };
}

function updateText(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    const currentSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    const currentAreaIndex: number = presentationMaker.presentationElements.currentAreaIndex;

    if (currentAreaIndex === consts.notSelectedIndex || currentSlideIndex === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const currentAreaInfo: types.AreaContent | undefined =
    presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas[currentAreaIndex].contains;

    if (!currentAreaInfo || currentAreaInfo.type !== 'text') {
        return presentationMaker;
    }

    const newArea: types.Area = {
        ...presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas[currentAreaIndex],
        contains: updateElement.updateText(currentAreaInfo, properties),
    }

    const newSlide: types.Slide = {
        ...presentationMaker.presentationElements.slidesGroup[currentSlideIndex],
        areas: presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas.map(
            (value, index) => index === currentAreaIndex ? newArea : value
        )
    };

    const newSlidesGroup = presentationMaker.presentationElements.slidesGroup.map(
        (value, index) => index === currentSlideIndex ? newSlide : value
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function createText(presentationMaker: types.PresentationMaker): types.PresentationMaker {
    const currentSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    const currentAreaIndex: number = presentationMaker.presentationElements.currentAreaIndex;

    if (currentAreaIndex === consts.notSelectedIndex || currentSlideIndex === consts.notSelectedIndex
    || presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas[currentAreaIndex].contains) {
        return presentationMaker;
    }

    const newArea: types.Area = {
        ...presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas[currentAreaIndex],
        contains: { ...consts.defaultTextInfo },
    }

    const newSlide: types.Slide = {
        ...presentationMaker.presentationElements.slidesGroup[currentSlideIndex],
        areas: presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas.map(
            (value, index) => index === currentAreaIndex ? newArea : value
        )
    };

    const newSlidesGroup = presentationMaker.presentationElements.slidesGroup.map(
        (value, index) => index === currentSlideIndex ? newSlide : value);

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function createImage(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    const currentSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    const currentAreaIndex: number = presentationMaker.presentationElements.currentAreaIndex;

    if (currentAreaIndex === consts.notSelectedIndex || currentSlideIndex === consts.notSelectedIndex
    || presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas[currentAreaIndex].contains) {
        return presentationMaker;
    }

    const currentSlide: types.Slide = presentationMaker.presentationElements.slidesGroup[currentSlideIndex];
    const newAreaContent: types.AreaContent = createElement.createAreaContent(properties)
    const newArea: types.Area = createElement.createArea(newAreaContent, currentSlide.areas.length);

    const newSlide: types.Slide = {
        ...presentationMaker.presentationElements.slidesGroup[currentSlideIndex],
        areas: presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas.map(
            (value, index) => index === currentAreaIndex ? newArea : value
        )
    };

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (value, index) => index === currentSlideIndex ? newSlide : value
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function updateGraphicPrimitive(presentationMaker: types.PresentationMaker, properties: Object): types.PresentationMaker {
    const currIdSlide: number = presentationMaker.presentationElements.currentSlideIndex;
    const currIdArea: number = presentationMaker.presentationElements.currentAreaIndex;

    if (currIdArea === consts.notSelectedIndex || currIdSlide === consts.notSelectedIndex) {
        return presentationMaker;
    }

    const areaContentInfo: types.AreaContent | undefined =
    presentationMaker.presentationElements.slidesGroup[currIdSlide].areas[currIdArea].contains;

    if (!areaContentInfo || areaContentInfo.type !== 'primitive') {
        return presentationMaker;
    }

    const newGraphicPrimitiveInfo: types.GraphicPrimitiveInfo =
        updateElement.updateGraphicPrimitive(areaContentInfo, properties);

    const newArea: types.Area = {
        ...presentationMaker.presentationElements.slidesGroup[currIdSlide].areas[currIdArea],
        contains: newGraphicPrimitiveInfo
    };

    const newSlide: types.Slide = {
        ...presentationMaker.presentationElements.slidesGroup[currIdSlide],
        areas: presentationMaker.presentationElements.slidesGroup[currIdSlide].areas.map(
            (value, index) => index === currIdArea ? newArea : value
        )
    };

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (value, index) => index === currIdSlide ? newSlide : value
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

function createGraphicPrimitive(presentationMaker: types.PresentationMaker, type: types.Primitive): types.PresentationMaker {
    const currentSlideIndex: number = presentationMaker.presentationElements.currentSlideIndex;
    const currentAreaIndex: number = presentationMaker.presentationElements.currentAreaIndex;

    if (currentAreaIndex === consts.notSelectedIndex || currentSlideIndex === consts.notSelectedIndex || 
    presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas[currentAreaIndex].contains) {
        return presentationMaker;
    }

    const newGraphicPrimitiveInfo: types.GraphicPrimitiveInfo = {
        ...consts.defaultGraphicPrimitiveInfo,
        primitive: type
    };

    const newArea: types.Area = {
        ...presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas[currentAreaIndex],
        contains: newGraphicPrimitiveInfo
    };

    const newSlide: types.Slide = {
        ...presentationMaker.presentationElements.slidesGroup[currentSlideIndex],
        areas: presentationMaker.presentationElements.slidesGroup[currentSlideIndex].areas.map(
            (value, index) => index === currentAreaIndex ? newArea : value
        )
    };

    const newSlidesGroup: types.Slide[] = presentationMaker.presentationElements.slidesGroup.map(
        (value, index) => index === currentSlideIndex ? newSlide : value
    );

    const newPresentationElements: types.PresentationElements = {
        ...presentationMaker.presentationElements,
        slidesGroup: newSlidesGroup
    }

    const startSlicePos: number = 
        presentationMaker.localHistory.length <= consts.maxLocalHistoryLength ? 
        0 : presentationMaker.localHistory.length - consts.maxLocalHistoryLength;

    return {
        ...presentationMaker,
        localHistory: [
            ...presentationMaker.localHistory.slice(startSlicePos, presentationMaker.currentPresentationElementsIndex + 1),
            newPresentationElements
        ],
        presentationElements: newPresentationElements,
        currentPresentationElementsIndex: presentationMaker.currentPresentationElementsIndex + 1 - startSlicePos
    };
}

export {
    changeTitle,
    undo,
    redo,
    addSlide,
    moveSlides,
    deleteSlides,
    selectSlides,
    unselectSlides,
    assignSlideIndex,
    addArea,
    deleteAreas,
    selectAreas,
    unselectAreas,
    assignAreaIndex,
    updateSlideProperty,
    updateArea,
    updateAreas,
    updateInDragAreas,
    updateText,
    createText,
    createImage,
    createGraphicPrimitive,
    updateGraphicPrimitive,
    convertStateToJson,
    convertJsonToState,
};