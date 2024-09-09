import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Generates a PDF with the note's title, tags, and content
 * @param title - The title of the note
 * @param tags - The tags associated with the note
 * @param content - The content (description) of the note
 */
export const generatePDF = (
  title: string,
  tags: string[],
  content: string,
): void => {
  const docDefinition = {
    content: [
      { text: title, style: "header" },
      { text: `Tags: ${tags.join(", ")}`, style: "content", margin: [0, 10] },
      { text: "Description:", style: "subheader", margin: [0, 20, 0, 10] },
      { text: content, margin: [0, 0, 0, 10] },
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
