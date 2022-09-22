/* eslint-disable max-len */
import { FC } from "react";

import close from "./close.svg";
import cart from "./cart.svg";
import closeLarge from "./clear.svg";
import share from "./share.svg";
import camera from "./camera.svg";
import expand from "./expand.svg";
import timer from "./timer.svg";
import info from "./info.svg";
import backArrow from "./backArrow.svg";

const icons: any = {
    cart: cart,
    close: close,
    backArrow: backArrow,
    info: info,
    timer: timer,
    expand: expand,
    camera: camera,
    share: share,
    closeLarge: closeLarge,
};

type Props = {
    icon: any;
    alt?: string;
    color?: string;
    width?: number;
    height?: number;
    style?: any;
    background?: string;
    shape?: string; //circle or square
};
const getIcon = (icon: any) => icons[icon];

const SvgIcon: FC<Props> = ({ icon, color = 'inherit', width = 24, height = 24, shape = "", background = "unset", style }: Props) => {
    const CurrentIcon = getIcon(icon);

    const shapeCss = shape ? {
        background: '#dee1ec',
        borderRadius: shape == 'circle' ? '50%' : '6px',
        padding: '4px'
    } : {};

    return (
        <span className="svg-icon-wrap d-f-c" style={
            {
                'color': color,
                'width': `${width}px`,
                'height': `${height}px`,
                'background': background,
                ...shapeCss,
                ...style
            }}>
            <CurrentIcon />
        </span>
    );
}

export default SvgIcon;
