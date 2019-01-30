import {
    nodeWidth, nodeHeight, nodeBorderRadius, branchBorderRadius, nodeHalfWidth, nodeHalfHeight, jointRadius,
    useClearStyle,
    useTextStyle,
    useNodeStyle, useJointStyle, jointPadding, jointIconRadius, useWireStyle, wireMarginTop, wireMarginBottom,
    useBranchStyle, useLinkStyle, useInversedTextStyle, useDisabledTextStyle,
} from './styles';


// 类似OpenGL形式的绘图状态机

const debug = false;
const log = (...params) => {
    if (debug) {
        // console.log(...params);
    }
};

export let context = null;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let width = 800;
let height = 600;
let imagePatterns = null;
let boundingBox = { left: 0, right: 0, top: 0, bottom: 0 };

export function initialize(inContext, settings, inImagePatterns) {
    context = inContext;
    offsetX = settings.offsetX;
    offsetY = settings.offsetY;
    scale = settings.scale;
    width = settings.width;
    height = settings.height;
    imagePatterns = inImagePatterns;

    const x = -offsetX / scale;
    const y = -offsetY / scale;
    boundingBox = {
        left: x,
        right: x + width / scale,
        top: y,
        bottom: y + height / scale,
    };

    context.setTransform(1, 0, 0, 1, 0, 0);
    clear();
    context.setTransform(scale, 0, 0, scale, offsetX, offsetY);
}

function isInBoundingBox(left, right, top, bottom) {
    return !(right < boundingBox.left || left > boundingBox.right || top > boundingBox.bottom || bottom < boundingBox.top);
}

export function clear() {
    context.save();
    useClearStyle();
    context.fillRect(0, 0, width, height);
    context.restore();
}

export function drawNode(element, style) {
    const { hasError, hasWarning, hasComment, disabled } = style;
    let { x, y, title, image } = element;
    const pattern = imagePatterns[image];
    const erroricon = imagePatterns['erroricon'];
    const warningicon = imagePatterns['warningicon'];
    const left = x - nodeHalfWidth;
    const right = x + nodeHalfWidth;
    const top = y - nodeHalfHeight;
    const bottom = y + nodeHalfHeight;

    if (isInBoundingBox(left, right, top, bottom)) {
        log(`'Draw node (${x}, ${y})`);

        context.save();
        useNodeStyle(style);
        context.beginPath();
        context.moveTo(left + nodeBorderRadius, top);
        context.arcTo(right, top, right, bottom, nodeBorderRadius);
        context.arcTo(right, bottom, left, bottom, nodeBorderRadius);
        context.arcTo(left, bottom, left, top, nodeBorderRadius);
        context.arcTo(left, top, right, top, nodeBorderRadius);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();

        //绘制错误图标
        if (hasError && erroricon && erroricon.image) {
            context.save();
            context.beginPath();
            context.arc(x - 87, y - 8, 8, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(erroricon.image, x - 95, y - 16, 16, 16);
            context.restore();
        }

        //绘制警告图标
        if (hasWarning && warningicon && warningicon.image) {
            context.save();
            context.beginPath();
            context.arc(x - 87, y + 8, 8, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(warningicon.image, x - 95, y, 16, 16);
            context.restore();
        }

        //绘制批注图标
        if (hasComment) {
            context.save();
            context.fillStyle = '#fff';
            context.beginPath();
            context.arc(x + 73, y - 18, 8, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            context.restore();
            context.save();
            context.fillStyle = '#f76b6b';
            context.beginPath();
            context.arc(x + 73, y - 18, 5, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            context.restore();
        }

        // 绘制头像
        if (pattern && pattern.image) {
            context.save();
            context.beginPath();
            context.arc(x - 52, y, 16, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(pattern.image, x - 68, y - 16, 32, 32);
            context.restore();
        }
        else {
            context.save();
            context.fillStyle = '#eeeeee';
            context.beginPath();
            context.arc(x - 52, y, 16, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            context.restore();
        }

        // 绘制标题
        context.save();
        if (disabled) {
            useDisabledTextStyle();
        } else {
            useInversedTextStyle();
        }
        context.fillText(title.length > 6 ? (title.substring(0, 6) + '...') : title, x + 18, y);
        context.restore();
    }

    return {
        type: 'Rect',
        left: left,
        right: right,
        top: top,
        bottom: bottom,
    };
}

export function drawBranch(element, style) {
    const { x, y, title, index } = element;
    const { hasComment, hasError, hasWarning, disabled } = style;
    const erroricon = imagePatterns['erroricon'];
    const warningicon = imagePatterns['warningicon'];
    const left = x - nodeHalfWidth;
    const right = x + nodeHalfWidth
    const top = y - nodeHalfHeight;
    const bottom = y + nodeHalfHeight;

    if (isInBoundingBox(left, right, top, bottom)) {
        log(`'Draw branch (${left}, ${top})`);

        context.save();
        useBranchStyle(style);
        context.beginPath();
        context.moveTo(left + branchBorderRadius, top);
        context.arcTo(left + nodeWidth, top, left + nodeWidth, top + nodeHeight, branchBorderRadius);
        context.arcTo(left + nodeWidth, top + nodeHeight, left, top + nodeHeight, branchBorderRadius);
        context.arcTo(left, top + nodeHeight, left, top, branchBorderRadius);
        context.arcTo(left, top, left + nodeWidth, top, branchBorderRadius);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();

        context.save();
        if (disabled) {
            useDisabledTextStyle();
        } else {
            useTextStyle();
        }
        context.fillText(title.length > 8 ? (title.substring(0, 8) + '...') : title, x + 10, y);
        context.restore();

        //绘制分支序号
        context.save();
        if (disabled) {
            context.fillStyle = '#ccc';
        } else {
            context.fillStyle = '#fff';
        }
        context.beginPath();
        context.arc(x - 55, y, 9, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.restore();
        context.save();
        if (disabled) {
            useDisabledTextStyle();
        } else {
            context.font = '12px Arial';
            context.fillStyle = '#84d476';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
        }
        context.fillText(index + 1, x - 55, y);
        context.restore();

        //绘制错误图标
        if (hasError && erroricon && erroricon.image) {
            context.save();
            context.beginPath();
            context.arc(x - 87, y - 8, 8, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(erroricon.image, x - 95, y - 16, 16, 16);
            context.restore();
        }

        //绘制警告图标
        if (hasWarning && warningicon && warningicon.image) {
            context.save();
            context.beginPath();
            context.arc(x - 87, y + 8, 8, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(warningicon.image, x - 95, y, 16, 16);
            context.restore();
        }

        //绘制批注图标
        if (hasComment) {
            context.save();
            context.fillStyle = '#fff';
            context.beginPath();
            context.arc(x + 73, y - 18, 8, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            context.restore();
            context.save();
            context.fillStyle = '#f76b6b';
            context.beginPath();
            context.arc(x + 73, y - 18, 5, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            context.restore();
        }
    }

    return {
        type: 'Rect',
        left: left,
        right: left + nodeWidth,
        top: top,
        bottom: top + nodeHeight,
    };
}

export function drawJoint(element, style) {
    const { x, y, expanded } = element;
    const { highlighted } = style;

    if (isInBoundingBox(x - jointIconRadius, x + jointIconRadius, y - jointIconRadius, y + jointIconRadius)) {
        log(`'Draw joint (${x}, ${y})`);

        context.save();
        useJointStyle(highlighted);
        context.beginPath();
        context.arc(x, y, jointRadius, 0, 360, false);
        context.closePath();
        context.fill();
        context.stroke();

        if (expanded) {
            context.beginPath();
            context.moveTo(x - jointIconRadius, y);
            context.lineTo(x + jointIconRadius, y);
            context.closePath();
            context.stroke();
        }
        else {
            context.beginPath();
            context.moveTo(x - jointRadius + jointPadding, y);
            context.lineTo(x + jointRadius - jointPadding, y);
            context.moveTo(x, y + jointRadius - jointPadding);
            context.lineTo(x, y - jointRadius + jointPadding);
            context.closePath();
            context.stroke();
        }

        context.restore();
    }

    return {
        type: 'Circle',
        x: x,
        y: y,
        radius: jointRadius,
    };
}

export function drawLink(element, style) {
    const { disabled } = style;
    let { x, y, title } = element;
    const left = x - nodeHalfWidth;
    const right = x + nodeHalfWidth;
    const top = y - nodeHalfHeight;
    const bottom = y + nodeHalfHeight;

    if (isInBoundingBox(left, right, top, bottom)) {
        log(`'Draw link (${x}, ${y})`);

        context.save();
        useLinkStyle(style);
        context.beginPath();
        context.moveTo(left + nodeBorderRadius, top);
        context.arcTo(right, top, right, bottom, nodeBorderRadius);
        context.arcTo(right, bottom, left, bottom, nodeBorderRadius);
        context.arcTo(left, bottom, left, top, nodeBorderRadius);
        context.arcTo(left, top, right, top, nodeBorderRadius);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();

        context.save();
        if (disabled) {
            useDisabledTextStyle();
        } else {
            useInversedTextStyle();
        }
        const lines = title.split('\n');
        if (lines.length === 2) {
            context.fillText(lines[0].substring(0, 8), x, y - 7.5);
            context.fillText(lines[1].substring(0, 8), x, y + 7.5);
        }
        else if (lines.length > 2) {
            context.fillText(lines[0].substring(0, 8), x, y - 10);
            context.fillText(lines[1].substring(0, 8), x, y + 2.5);
            context.fillText('...', x, y + 10);
        }
        else {
            context.fillText(title.substring(0, 8), x, y);
        }
        context.restore();

    }

    return {
        type: 'Rect',
        left: left,
        right: right,
        top: top,
        bottom: bottom,
    };
}

export function drawWire(element, style) {
    const { a, b } = element;
    const { x: x1, y: y1 } = a;
    const { x: x2, y: y2 } = b;
    const y = (y1 + y2) / 2;

    if (isInBoundingBox(Math.min(x1, x2), Math.max(x1, x2), Math.min(y1, y2), Math.max(y1, y2))) {
        context.save();
        useWireStyle();
        context.beginPath();
        context.moveTo(x1, y1 + wireMarginTop);
        context.lineTo(x1, y);
        context.lineTo(x2, y);
        context.lineTo(x2, y2 - wireMarginBottom);
        context.stroke();
        context.closePath();
        context.restore();
    }
}


// WEBPACK FOOTER //
// ./src/Author/components/extra/draw.js