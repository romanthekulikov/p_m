import * as types from "../types";
import { getProperty } from "../utils/property";

function updateSlide(currentSlide: types.Slide, properties: Object): types.Slide
{
    return {
        ...currentSlide,
        backgroundColor: ("backgroundColor" in properties 
            ? getProperty(properties, "backgroundColor") as string 
            : null) ?? currentSlide.backgroundColor,
        backgroundImage: ("backgroundImage" in properties 
            ? getProperty(properties, "backgroundImage") as types.ImageInfo 
            : null) ?? currentSlide.backgroundImage,
    }
}

function updateArea(currentArea: types.Area, properties: Object): types.Area
{
    return {
        ...currentArea,
        x: ("x" in properties 
            ? getProperty(properties, "x") as number 
            : null) ?? currentArea.x,
        y: ("y" in properties 
            ? getProperty(properties, "y") as number 
            : null) ?? currentArea.y,
        width: ("width" in properties 
            ? getProperty(properties, "width") as number 
            : null) ?? currentArea.width,
        height: ("height" in properties 
            ? getProperty(properties, "height") as number 
            : null) ?? currentArea.height,
        zIndex: ("zIndex" in properties 
            ? getProperty(properties, "zIndex") as number 
            : null) ?? currentArea.zIndex,
    };
}

function updateGraphicPrimitive(currentGraphicPrimitive: types.GraphicPrimitiveInfo, properties: Object): types.GraphicPrimitiveInfo
{
    return {
        ...currentGraphicPrimitive,
        color: ("color" in properties 
            ? getProperty(properties, "color") as string 
            : null) ?? currentGraphicPrimitive.color,
        strokeColor: ("strokeColor" in properties 
            ? getProperty(properties, "strokeColor") as string 
            : null) ?? currentGraphicPrimitive.strokeColor,
        strokeWidth: ("strokeWidth" in properties 
            ? getProperty(properties, "strokeWidth") as number 
            : null) ?? currentGraphicPrimitive.strokeWidth,
        primitive: ("primitive" in properties 
            ? getProperty(properties, "primitive") as types.Primitive 
            : null) ?? currentGraphicPrimitive.primitive,
    };
}

function updateText(text: types.TextInfo, properties: Object): types.TextInfo
{
    return {
        ...text,
        color: ("color" in properties 
            ? getProperty(properties, "color") as string 
            : null) ?? text.color,
        strokeColor: ("strokeColor" in properties 
            ? getProperty(properties, "strokeColor") as string 
            : null) ?? text.strokeColor,
        strokeWidth: ("strokeWidth" in properties 
            ? getProperty(properties, "strokeWidth") as number 
            : null) ?? text.strokeWidth,
        fontSize: ("fontSize" in properties 
            ? getProperty(properties, "fontSize") as number 
            : null) ?? text.fontSize,
        font: ("font" in properties 
            ? getProperty(properties, "font") as string 
            : null) ?? text.font,
        italic: ("italic" in properties 
            ? getProperty(properties, "italic") as boolean
            : null) ?? text.italic,
        bold: ("bold" in properties 
            ? getProperty(properties, "bold") as boolean
            : null) ?? text.bold,
        underlined: ("underlined" in properties 
            ? getProperty(properties, "underlined") as boolean
            : null) ?? text.underlined,
        text: ("text" in properties 
            ? getProperty(properties, "text") as string 
            : null) ?? text.text,
    };
}

export 
{
    updateSlide,
    updateArea,
    updateText,
    updateGraphicPrimitive,
};