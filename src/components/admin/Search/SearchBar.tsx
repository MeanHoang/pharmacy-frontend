import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "w-70",
}) => {
  return (
    <div className="relative flex items-center bg-white shadow-md rounded-lg p-2 w-70">
      <Search className="text-gray-500 w-5 h-5 " />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-gray-700 ml-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
