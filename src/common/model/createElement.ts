import * as types from "../types";
import { generateId } from "../utils/generateId";
import { areaContentTypeNames } from "./typeNames";
import { getProperty } from "../utils/property";
import * as consts from "../consts";

function createSlide(): types.Slide
{
    return {
        id: generateId(),
        areas: [],
        backgroundColor: "white",
        backgroundImage: {type: "imageUrl", path: ""},
    }
}

function createArea(contains: types.AreaContent, zIndex: number): types.Area
{
    return {
        id: generateId(),
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        zIndex: zIndex,
        contains: contains,
    }
}

function createAreaContent(properties: Object): types.AreaContent
{
    const areaType = getProperty(properties, "areaType") as string;

    if (areaType === areaContentTypeNames.text)
    {
        return {...consts.defaultTextInfo}
    }

    if (areaType === areaContentTypeNames.primitive)
    {
        const primitive = getProperty(properties, "primitiveType") as types.Primitive;
        return {
            ...consts.defaultGraphicPrimitiveInfo,
            primitive,
        }
    }

    const path = getProperty(properties, "path") as string;

    if (areaType === areaContentTypeNames.imageBase64)
    {
        return {
            base64: path,
            type: "imageBase64",
        }
    }

    return {
        path: path,
        type: "imageUrl",
    }
}

export 
{
    createSlide,
    createArea,
    createAreaContent,
};