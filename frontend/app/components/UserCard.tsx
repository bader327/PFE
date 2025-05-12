import Image from "next/image";

const UserCard = ({ type, alert }: { type: string; alert?: boolean }) => {
  return (
    <div
      className={`rounded-2xl odd:bg-purple-200 even:bg-yellow-200 p-4 flex-1 min-w-[130px] ${
        alert ? "border-red-200 border-4 animate-pulse" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">0.9</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
