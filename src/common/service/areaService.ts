import * as types from "./../types";
import SlidesGroupService from "./slidesGroupService";

const areaBorderWidth: number = 10;
const standartDivider: number = 9;

function getWidth(width: number, isFullscreenMode: boolean, widthScalingFactorFullscreen: number): number {
    return (width + areaBorderWidth * 2) * (isFullscreenMode ? widthScalingFactorFullscreen : 1);
}

function getHeight(height: number, isFullscreenMode: boolean, heightScalingFactorFullscreen: number): number {
    return (height + areaBorderWidth * 2) * (isFullscreenMode ? heightScalingFactorFullscreen : 1);
}

function getMarginLeft(
    isFullscreenMode: boolean, 
    areaElement: types.Area, 
    widthScalingFactorFullscreen: number,
    isCurrentSlide: boolean,
    workboardSlide: Element, 
    slideRef: HTMLDivElement|null
): number {
    const xDivider: number = workboardSlide && slideRef ? 
        workboardSlide.clientWidth / slideRef.offsetWidth : standartDivider;
    
    return isFullscreenMode ? (areaElement.x * widthScalingFactorFullscreen * 1.4) : 
        (isCurrentSlide ? areaElement.x : areaElement.x / xDivider);
}

function getMarginTop(
    isFullscreenMode: boolean, 
    areaElement: types.Area, 
    heightScalingFactorFullscreen: number,
    isCurrentSlide: boolean,
    workboardSlide: Element, 
    slideRef: HTMLDivElement|null
): number {
    const yDivider: number = workboardSlide && slideRef ? 
        workboardSlide.clientHeight / slideRef.offsetHeight : standartDivider;

    return isFullscreenMode ? (areaElement.y * heightScalingFactorFullscreen * 1.4) :
        (isCurrentSlide ? areaElement.y : areaElement.y / yDivider);
}

function getTransform(isCurrentSlide: boolean, workboardSlide: Element) {
    const widthScalingFactor = SlidesGroupService.slideWidth / workboardSlide.clientWidth;
    const heightScalingFactor = SlidesGroupService.slideHeight / workboardSlide.clientHeight;

    return isCurrentSlide ? "" : ("scale(" + widthScalingFactor + "," + heightScalingFactor + ")");
}

function getWidthScalingFactorFullscreen(workboardSlideWidth: number): number {
    return window.screen.width / workboardSlideWidth;
}

function getHeightScalingFactorFullscreen(workboardSlideHeight: number): number {
    return window.screen.height / workboardSlideHeight;
}

function getFontSize(
    isFullscreenMode: boolean, 
    textElement: types.TextInfo, 
    scalingFactorFullscreen: number
): number {
    return isFullscreenMode ? textElement.fontSize * scalingFactorFullscreen : textElement.fontSize;
}

export default {
    getWidth,
    getHeight,
    getMarginLeft,
    getMarginTop,
    getTransform,
    getWidthScalingFactorFullscreen,
    getHeightScalingFactorFullscreen,
    getFontSize,
}