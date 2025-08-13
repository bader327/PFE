"use client";

import { getUserRoleFromUser } from "@/lib/roleUtils";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import FormModal from "../../../components/FormModal";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableSearch from "../../../components/TableSearch";
import { teachersData } from "../../../lib/data";

type Teacher = {
  id: number;
  userId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  posts: string[];
  address: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "User ID", accessor: "userId", className: "hidden md:table-cell" },
  { header: "Posts", accessor: "posts", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const TeacherListPage = () => {
  const { user } = useUser();
  const role = getUserRoleFromUser(user);
  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-gray-100 transition-all"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
          alt="Profile"
          width={40}
          height={40}
          className="hidden md:block w-10 h-10 rounded-full object-cover shadow"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-700">{item.userId}</td>
      <td className="hidden md:table-cell text-gray-700">
        {item.posts.join(", ")}
      </td>
      <td className="hidden lg:table-cell text-gray-700">{item.phone}</td>
      <td className="hidden lg:table-cell text-gray-700">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition text-white"
              title="View"
            >
              <Image src="/view.png" alt="view" width={16} height={16} />
            </button>
          </Link>
          {role === "SUPERADMIN" && (
            <FormModal table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md m-4 mt-0 space-y-6">
      {/* TOP */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Teachers Directory</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition">
              <Image src="/sort.png" alt="sort" width={14} height={14} />
            </button>
            {role === "SUPERADMIN" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table columns={columns} renderRow={renderRow} data={teachersData} />
      </div>

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;
