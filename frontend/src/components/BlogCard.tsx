interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  date: string;
}

export const BlogCard = ({
  authorName,
  title,
  content,
  date,
}: BlogCardProps) => {
  const previewContent = content ? content.slice(0, 100) + "..." : "";
  const estimatedReadingTime = `${Math.ceil(content.length / 100)} minute read`;

  return (
    <div className="p-4 border rounded-md shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center text-sm text-gray-700">
        <Avatar name={authorName} />
        <span className="ml-2 font-medium">{authorName}</span>
        <span className="ml-auto text-gray-400">{date}</span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      {/* Content Preview */}
      <p className="text-sm text-gray-700">{previewContent}</p>

      {/* Reading Time */}
      <div className="text-xs text-gray-500">{estimatedReadingTime}</div>

      {/* Divider */}
      <div className="bg-slate-200 h-[1px] w-full" />
    </div>
  );
};

function Avatar({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center w-6 h-6 bg-black text-white rounded-full text-xs font-semibold"
      title={name}
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

export default BlogCard;
