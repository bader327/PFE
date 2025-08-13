"use client";

import Image from "next/image";
import { ChangeEvent } from "react";

interface Props {
  onSearch?: (term: string) => void;
  placeholder?: string;
}

const TableSearch = ({ onSearch, placeholder = "Search..." }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
