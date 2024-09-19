import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = (
  title: string,
  tags: string[],
  content: string,
): void => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: title, style: "header" } as Content,
      {
        text: `Tags: ${tags.join(", ")}`,
        style: "content",
        margin: [0, 10],
      } as Content,
      {
        text: "Description:",
        style: "subheader",
        margin: [0, 20, 0, 10],
      } as Content,
      { text: content, margin: [0, 0, 0, 10] } as Content,
    ],
    styles: {
      header: {
        fontSize: 30,
        bold: true,
      },
      subheader: {
        fontSize: 16,
        bold: true,
      },
      content: {
        fontSize: 12,
      },
    },
  };

  pdfMake.createPdf(docDefinition).download(`${title}.pdf`);
};
