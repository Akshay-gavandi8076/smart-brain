interface NotePdfTemplateProps {
  title: string;
  tags: string[];
  html: string;
}

export default function NotePdfTemplate({
  title,
  tags,
  html,
}: NotePdfTemplateProps) {
  return (
    <div
      id="note-pdf-template"
      className="prose prose-lg dark:prose-invert max-w-none bg-white px-16 py-14 text-black"
      style={{
        width: "210mm",
        minHeight: "297mm",
      }}
    >
      <h1>{title}</h1>

      {tags.length > 0 && (
        <div className="mb-8 text-gray-600">
          <strong>Tags:</strong> {tags.join(", ")}
        </div>
      )}

      <hr className="mb-10" />

      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
}
