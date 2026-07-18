interface NotePDFProps {
  title: string;
  tags: string[];
  content: string;
}

export default function NotePDF({ title, tags, content }: NotePDFProps) {
  return (
    <div
      id="note-pdf"
      className="bg-white p-12 text-black"
      style={{
        width: "210mm",
        minHeight: "297mm",
      }}
    >
      <h1
        style={{
          fontSize: 34,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        {title}
      </h1>

      {tags.length > 0 && (
        <div
          style={{
            marginBottom: 24,
            color: "#666",
            fontSize: 14,
          }}
        >
          <strong>Tags:</strong> {tags.join(", ")}
        </div>
      )}

      <hr style={{ marginBottom: 32 }} />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </div>
  );
}
