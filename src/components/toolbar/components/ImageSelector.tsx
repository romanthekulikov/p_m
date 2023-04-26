import React, { useState } from "react";
import * as types from "../../../common/types";
import styles from "./styles/styles.module.css";
import * as areaActions from "../../../actions/areas/areasActions";
import * as slideActions from "../../../actions/slides/slidesActions";
import { connect, ConnectedProps } from "react-redux";
import imageCompression from 'browser-image-compression';
import WaitingPopUp from "../../waitingPopUp/WaitingPopUp";

const mapDispatch = {
    addArea: areaActions.addArea,
    updateSlideProperty: slideActions.updateSlideProperty,
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    isBackgroundImageSelector: boolean
};

function ImageSelector(props: Props): JSX.Element {
    const [isError, setIsError] = useState(false);
    const [isPopUp, setIsPopUp] = useState(false);
    const [popUpName, setPopUpName] = useState("");

    const checkIfImageExists = (url: string, callback: Function) => {
        const img = new Image();
        img.src = url;

        if (img.complete)
        {
            callback(true);
        }
        else 
        {
            img.onload = () => {
                callback(true);
            };

            img.onerror = () => {
                callback(false);
            };
        }
    }

    const addImageBaseHandler = e => {
        const fileReader = new FileReader();

        fileReader.onload = () => {
            const backgroundImage: types.ImageInfo = {
                type: "imageBase64",
                base64: fileReader.result as string
            };

            props.isBackgroundImageSelector 
                ? props.updateSlideProperty({backgroundImage: backgroundImage, backgroundColor: ""})
                : props.addArea({areaType: "imageBase64", path: fileReader.result});
            
            setIsError(false);
        }

        setPopUpName("Загрузка изображения...");
        setIsPopUp(true);

        imageCompression(e.target.files[0], {
            maxSizeMB: 1, useWebWorker: true
        })
        .then(compressedFile => {
            setIsPopUp(false);
            e.target.value = null;

            fileReader.readAsDataURL(compressedFile);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const addImageUrlHandler = () => {
        const url: string = document.getElementById("selector")?.getElementsByTagName("input")[1].value as string;

        const backgroundImage: types.ImageInfo = {
            type: "imageUrl",
            path: url
        };

        checkIfImageExists(url, (exists: boolean) => {
            if (!exists)
            {
                setIsError(true);
                return;
            }
            
            setIsError(false);
            props.isBackgroundImageSelector ? props.updateSlideProperty({backgroundImage: backgroundImage})
                : props.addArea({areaType: "imageUrl", path: url});
        });
    }

    const closeImageSelectorHandler = () => {
        const selector = document.getElementById("image-selector");
        selector?.classList.remove(selector?.classList[1]);
    }

    return (
        <div id="image-selector" className={styles["image-selector"]}>
            <div id="selector" className={styles["image-selector__content"]} onClick={e => e.stopPropagation()}>
                <label className={styles["image-base"]}>
                    <div className={styles["image-base__text"]}>Загрузить с компьютера</div>
                    <input className={styles["input"]} type="file" accept=".jpg, .jpeg, .png" onChange={addImageBaseHandler} />
                </label>
                <input id="image-url" 
                    className={styles["image-url"]} 
                    placeholder="Добавьте URL изображения" 
                    type="url" 
                    autoComplete="off"
                />
                <button className={styles["button-image-add"]} type="submit" onClick={addImageUrlHandler}>Добавить</button>
                <a id="error-message" className={isError ? styles["error-message-active"] : styles["error-message-inactive"]}>
                    Недействительный URL
                </a>
                <button className={styles["button-ready"]} onClick={closeImageSelectorHandler}>Готово</button>
            </div>
            <WaitingPopUp isPopUp={isPopUp} name={popUpName} />
        </div>
    );
}

export default connector(ImageSelector);