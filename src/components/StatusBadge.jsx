const styles = {
  'Pending':     'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'Resolved':    'bg-green-100 text-green-800 border-green-200',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
      }`}
    >
      {status}
    </span>
  );
}