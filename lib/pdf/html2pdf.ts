export async function getHtml2Pdf() {
  return (await import("html2pdf.js")).default;
}
