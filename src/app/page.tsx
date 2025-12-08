import prisma from "@/lib/prisma";

const Page = async () => {
  const users = await prisma.user.findMany();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {JSON.stringify(users)}
    </div>
  );
};

export default Page;
