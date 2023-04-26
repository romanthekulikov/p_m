import React from "react";
import type * as types from '../../../../common/types';
import styles from "./styles.module.css";
import { connect } from "react-redux";

const connector = connect(null, null);

type Props = {imageElement: types.ImageInfo};

function ImageComponent(props: Props): JSX.Element
{
    return (
        props.imageElement.type === "imageUrl" 
        ? <img className={styles["image"]} src={props.imageElement.path} alt={"картинка"}/> 
        : <img className={styles["image"]} src={props.imageElement.base64} alt={"картинка"}/>
    );
}

export default connector(ImageComponent);