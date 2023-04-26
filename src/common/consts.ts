import type * as types from './types';

const notSelectedIndex = -1;

const maxLocalHistoryLength = 40;

const defaultTextInfo: types.TextInfo = {
    type: 'text',
    color: 'black',
    strokeColor: 'black',
    strokeWidth: 0,
    fontSize: 30,
    font: 'Arial',
    italic: false,
    bold: false,
    underlined: false,
    text: '',
};

const defaultGraphicPrimitiveInfo: types.GraphicPrimitiveInfo = {
    type: 'primitive',
    color: 'black',
    strokeColor: 'black',
    strokeWidth: 0,
    primitive: 'rectangle',
};

export {
    notSelectedIndex,
    maxLocalHistoryLength,
    defaultTextInfo,
    defaultGraphicPrimitiveInfo,
};