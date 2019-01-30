import { context } from './draw';

export const elementMaxHeight = 40;
export const nodeWidth = 150;
export const nodeHeight = elementMaxHeight;
export const nodeBorderRadius = 6;
export const branchBorderRadius = elementMaxHeight / 2;
export const endBorderRadius = nodeWidth / 2;
export const nodeHalfWidth = nodeWidth / 2;
export const nodeHalfHeight = nodeHeight / 2;
export const elementHorizontalInterval = 30;
export const elementVerticalInterval = 32;
export const elementHorizontalStep = nodeWidth + elementHorizontalInterval;
export const elementVerticalStep = nodeHeight + elementVerticalInterval;
export const elementHalfHorizontalStep = elementHorizontalStep / 2;
export const elementHalfVerticalStep = elementVerticalStep / 2;
export const jointRadius = 8;
export const jointPadding = 2;
export const jointIconRadius = jointRadius - jointPadding;
export const wireMarginTop = elementMaxHeight / 2 + 8;
export const wireMarginBottom = elementMaxHeight / 2 + 4;

export function useClearStyle() {
    context.fillStyle = '#fefbf9';
}

export function useTextStyle() {
    context.font = '12px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
}

export function useInversedTextStyle() {
    context.font = '12px Arial';
    context.fillStyle = '#333333';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
}

export function useDisabledTextStyle() {
    context.font = '12px Arial';
    context.fillStyle = '#888';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
}

export function useNodeStyle(style) {
    const { selected, highlighted, disabled } = style;

    if (disabled) {
        context.fillStyle = '#ccc';
        if (selected) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 2;
            context.shadowBlur = 10;
            context.shadowColor = 'rgba(0, 0, 0, 0.1)';
            context.strokeStyle = '#6f6dd8';
            context.lineWidth = 4;
        }
    }
    else if (selected) {
        context.fillStyle = '#fff';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 4;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#6f6dd8';
        context.lineWidth = 4;
    }
    else if (highlighted) {
        context.fillStyle = '#fff';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(0, 0, 0, 0.3)';
        context.strokeStyle = '#fff';
        context.lineWidth = 0;
    }
    else {
        context.fillStyle = '#fff';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#fff';
        context.lineWidth = 0;
    }
}

export function useBranchStyle(style) {
    const { selected, highlighted, disabled } = style;

    if (disabled) {
        context.fillStyle = '#ccc';
        if (selected) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 2;
            context.shadowBlur = 10;
            context.shadowColor = 'rgba(0, 0, 0, 0.1)';
            context.strokeStyle = '#6f6dd8';
            context.lineWidth = 2;
        }
    }
    else if (selected) {
        context.fillStyle = '#84d476';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#6f6dd8';
        context.lineWidth = 4;
    }
    else if (highlighted) {
        context.fillStyle = '#84d476';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(0, 0, 0, 0.3)';
        context.strokeStyle = '#fff';
        context.lineWidth = 0;
    }
    else {
        context.fillStyle = '#84d476';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 10;
        context.shadowColor = 'rgba(0, 0, 0, 0.1)';
        context.strokeStyle = '#fff';
        context.lineWidth = 0;
    }
}

export function useJointStyle(highlighted) {
    if (highlighted) {
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#6495ed';
        context.lineWidth = 1;
        context.lineCap = 'round';
    }
    else {
        context.fillStyle = '#ffffff';
        context.strokeStyle = 'LightGrey';
        context.lineWidth = 1;
        context.lineCap = 'round';
    }
}

export function useLinkStyle(style) {
    const { selected, highlighted, disabled } = style;

    if (disabled) {
        context.fillStyle = '#f1f1f1';
        context.lineWidth = 4;
        context.setLineDash([4, 4]);
        if (selected) {
            context.strokeStyle = '#6f6dd8';
        }
        else {
            context.strokeStyle = '#ccc';
        }
    }
    else if (selected) {
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#6f6dd8';
        context.lineWidth = 4;
        context.setLineDash([4, 4]);
    }
    else if (highlighted) {
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#6f6dd8';
        context.lineWidth = 4;
        context.setLineDash([4, 4]);
    }
    else {
        context.fillStyle = '#ffffff';
        context.strokeStyle = 'LightGrey';
        context.lineWidth = 4;
        context.setLineDash([4, 4]);
    }
}

export function useWireStyle() {
    context.lineWidth = 2;
    context.strokeStyle = '#ccc';
    context.lineCap = 'round';
    context.lineJoin = 'round';
}



// WEBPACK FOOTER //
// ./src/Author/components/extra/styles.js