type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

export default function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span
          className={`text-indigo-600 text-xl transition-transform duration-300 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-600 text-sm">{answer}</p>
      </div>
    </div>
  );
}