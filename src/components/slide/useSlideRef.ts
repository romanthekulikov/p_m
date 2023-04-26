import { useRef } from "react"

function useSlideRef() {
    const ref = useRef<HTMLDivElement>(null);
    
    return ref;
}

export {
    useSlideRef,
}