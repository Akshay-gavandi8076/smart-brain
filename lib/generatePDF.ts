// lib/generatePDF.ts

import { getHtml2Pdf } from "./pdf/html2pdf";

export const generatePDF = async (
  title: string,
  tags: string[],
  content: string,
) => {
  const html2pdf = await getHtml2Pdf();

  const element = document.createElement("div");

  element.style.background = "white";
  element.style.color = "black";
  element.style.padding = "48px";
  element.style.width = "210mm";
  element.style.minHeight = "297mm";
  element.style.fontFamily = "Inter, Arial, Helvetica, sans-serif";

  element.innerHTML = `
    <style>

      body{
        font-family:Inter,Arial,sans-serif;
      }

      h1{
        font-size:34px;
        margin-bottom:18px;
      }

      h2{
        font-size:28px;
        margin-top:28px;
        margin-bottom:12px;
      }

      h3{
        font-size:22px;
        margin-top:24px;
        margin-bottom:10px;
      }

      p{
        line-height:1.8;
        margin:12px 0;
      }

      ul{
        margin-left:28px;
      }

      ol{
        margin-left:28px;
      }

      li{
        margin:8px 0;
      }

      table{
        width:100%;
        border-collapse:collapse;
        margin:20px 0;
      }

      td,th{
        border:1px solid #ccc;
        padding:8px;
      }

      blockquote{
        border-left:4px solid #888;
        padding-left:16px;
        color:#666;
        margin:18px 0;
      }

      code{
        background:#f4f4f4;
        padding:2px 6px;
        border-radius:4px;
      }

      pre{
        background:#f4f4f4;
        padding:16px;
        overflow:hidden;
        border-radius:8px;
      }

      img{
        max-width:100%;
      }

      hr{
        margin:24px 0;
      }

    </style>

    <h1>${title}</h1>

    ${
      tags.length ? `<p><strong>Tags:</strong> ${tags.join(", ")}</p><hr/>` : ""
    }

    ${content}
  `;

  document.body.appendChild(element);

  const options = {
    margin: 10,

    filename: `${title}.pdf`,

    image: {
      type: "jpeg" as const,
      quality: 1,
    },

    html2canvas: {
      scale: 2,
      useCORS: true,
    },

    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },

    pagebreak: {
      mode: ["css", "legacy"] as const,
    },
  };

  await html2pdf().set(options).from(element).save();

  document.body.removeChild(element);
};
