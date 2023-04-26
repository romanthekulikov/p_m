import React, {useEffect, useState} from "react";
import { connect, ConnectedProps } from "react-redux";
import type { RootState } from "../../store";
import Slide from "../slide/Slide";
import fullscreenStyles from "./fullscreen.module.css";

const mapState = (state: RootState) => ({
    slidesGroup: state.presentationElements.slidesGroup,
});

const connector = connect(mapState, null);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function Fullscreen(props: Props): JSX.Element
{
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentShownSlideIndex, setCurrentShownSlideIndex] = useState(0);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(!isFullscreen);
            setCurrentShownSlideIndex(0);
        };

        document.addEventListener("fullscreenchange", onFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", onFullscreenChange);
        };
    }, [isFullscreen, currentShownSlideIndex]);

    const slides = props.slidesGroup.map((slideElement, index) => {
        return <Slide isControl={false} isCurrent={true} slideElement={slideElement} index={index} isFullscreenMode={true} />;
    });

    const onMouseClick = e => {
        const newCurrentShownSlideIndex = e.clientX > window.screen.width / 2 ? currentShownSlideIndex + 1 : currentShownSlideIndex -1;
        
        if (newCurrentShownSlideIndex >= 0 && newCurrentShownSlideIndex < slides.length)
        {
            setCurrentShownSlideIndex(newCurrentShownSlideIndex);
        } 
    };

    return (
        <div onClick={onMouseClick} className={fullscreenStyles[isFullscreen ? "fullscreen-mode-on" : "fullscreen-mode-off"]}>
            {slides.length > 0 &&
                slides[currentShownSlideIndex]
            }
        </div>
    );
}

export default connector(Fullscreen);