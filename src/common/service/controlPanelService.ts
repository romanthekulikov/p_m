import { gapi } from 'gapi-script';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const apiKey = "AIzaSyDBGK9XKGSKosooSCc6AYt0utHt1XN3-vc";
const clientID = "1030468714467-op9s4o29m260crer5tu3n97kngv1co6i.apps.googleusercontent.com";
const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const scopes = "https://www.googleapis.com/auth/drive";

const maxFileSizeBytes = 94371840;

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        clientId: clientID,
        discoveryDocs: discoveryDocs,
        scope: scopes
    }).catch((error) => {
        console.log(error);
    });
}

function changeTextAreasToDivs(clonedDoc: Document) {
    const textAreas = clonedDoc.getElementsByTagName("textarea");

    let isTextAreaExist = false;
    for (let i = 0; i < textAreas.length; i++) {
        isTextAreaExist = true;

        const textArea = textAreas[i];

        const div = document.createElement("div");

        div.setAttribute("class", textArea.getAttribute("class") as string);
        div.setAttribute("style", textArea.getAttribute("style") as string);

        div.style.whiteSpace = "pre";

        div.innerHTML = textArea.innerHTML;

        textArea.replaceWith(div);
    }

    if (isTextAreaExist) {
        changeTextAreasToDivs(clonedDoc);
    }
}

async function savePdf(slidesContent: string[], prev: string, name: string) {
    const workboardSlide = document.getElementById("workboard-slide");

    if (!workboardSlide) return;

    let slidesContentArr = [...slidesContent.slice(1), prev];

    await html2canvas(workboardSlide, {
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
            changeTextAreasToDivs(clonedDoc);
        }
    }).then(canvas => {
        if (slidesContentArr.length <= 1 && !slidesContent.length) return;

        const contentDataURL = canvas.toDataURL("image/jpeg");

        slidesContentArr = [...slidesContentArr, contentDataURL];
    });

    const pdf = new jsPDF("l", "px", "a4");
    const title: string = name !== "" ? name : "presentation_maker";

    const imgProps = pdf.getImageProperties(slidesContentArr[0]);
    const width: number = pdf.internal.pageSize.getWidth();
    const height: number = (imgProps.height * width) / imgProps.width;

    const positionY: number = (pdf.internal.pageSize.getHeight() - height) / 2;

    slidesContentArr.map((slideContent, index) => {
        pdf.addImage(slideContent, "JPEG", 0, positionY, width, height);

        index === slidesContentArr.length - 1 ? pdf.save(title) : pdf.addPage();
    });
}

export default {
    apiKey,
    clientID,
    discoveryDocs,
    scopes,
    maxFileSizeBytes,

    handleClientLoad,
    changeTextAreasToDivs,
    savePdf,
}