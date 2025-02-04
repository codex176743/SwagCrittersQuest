import Link from "next/link";

const cards = [
  {
    title: "Now Selling",
    description: "February Swag Drop",
    path: "/buy",
    children: "Buy Now",
  },
  {
    title: "Reveal Swag",
    description: "January Reveal Now Available",
    path: "/reveal",
    children: "Reveal Now",
  },
  {
    title: "Redeem",
    description: "Ready to Ship and Burn?",
    path: "/redeem",
    children: "Order Now",
  },
];

const HomePage = () => {
  return (
    <div className="container mx-auto grid lg:grid-cols-3 md:grid-cols-1 justify-items-center gap-10 px-10">
      {cards.map(({ title, description, path, children }) => (
        <Card key={title} title={title} description={description} path={path}>
          {children}
        </Card>
      ))}
    </div>
  );
};

const Card = ({
  children,
  title,
  description,
  path,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  path: string;
}) => {
  return (
    <div className="flex flex-col w-[300px] border-4 border-black p-5 space-y-10 text-center">
      <p className="font-bold text-[30px]">{title}</p>
      <p className="font-semibold text-[24px]">{description}</p>
      <Link
        className="border-4 border-black bg-yellow-500 p-2 text-gray-500 font-semibold text-[24px]"
        href={path}
      >
        {children}
      </Link>
    </div>
  );
};

export default HomePage;
