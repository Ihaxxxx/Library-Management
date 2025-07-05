import { User, LayoutGrid, Book } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Sidebar {
  books: any;
  setCurrentState: any;
  setCategoryChangeValue : any;
  categories: string[];
}
type NavItem = {
  id: string;
  label: string;
  icon: JSX.Element;
  categories?: string[];
};

export default function Sidebar({
  books,
  setCurrentState,
  setCategoryChangeValue,
  categories,
}: Sidebar) {
  const [active, setActive] = useState<string>("book");
  const [categoryActive, setCategoryActive] = useState<string>('');
  const [openSubMenu, setOpenSubMenu] = useState<Boolean>(false);
  const [categorySubMenu, setCategorySubMenu] = useState<JSX.Element[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([
    {
      id: "books",
      label: "Books",
      icon: <Book size={20} />,
    },
    {
      id: "categories",
      label: "Categories",
      icon: <LayoutGrid size={20} />,
      categories: [],
    },
  ]);

  useEffect(() => {
    setNavItems((prevItems) =>
      prevItems.map((item) =>
        item.id === "categories" ? { ...item, categories } : item
      )
    );

    const categorySubMenu = categories.map(
      (category: string, index: number) => (
        <div key={category}>
          <button
            onClick={() => {
              setActive(category);
              setCurrentState(category);
              setOpenSubMenu(true);
            }}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium w-full
        ${
          active === category
            ? "bg-blue-100 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
          >
            <div className="flex items-center space-x-3">
              <LayoutGrid size={20} />
              <span>{category}</span>
            </div>

            <ChevronUp
              className={`transition-transform duration-300 ${
                active === category ? "rotate-180" : ""
              }`}
              size={16}
            />
          </button>
        </div>
      )
    );
    setCategorySubMenu(categorySubMenu);
  }, [books]);

  return (
    <div className="w-full md:w-100 h-full bg-white border-r shadow-sm p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Library Panel</h2>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <div key={item.id}>
            {item.id !== "books" ? (
              <>
                <button
                  onClick={() => {
                    setActive(item.id);
                    setOpenSubMenu(true);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium w-full
                  ${
                    active === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronUp
                    className={`transition-transform duration-300 ${
                      active === item.id ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>

                {/* Render submenu if Categories is active */}
                {item.id === "categories" && active === "categories" && (
                  <div className="ml-6 mt-2 flex flex-col space-y-1">
                    {categories.map((category: string) => (
                      <button
                        key={category}
                        onClick={() => {
                          setCategoryActive(category);
                          setCategoryChangeValue(category);
                        }}
                        className={`text-left text-sm rounded px-2 py-1 w-full
                        ${
                          categoryActive === category
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setActive(item.id);
                  setCurrentState(item.id);
                  setOpenSubMenu(false);
                  setCategoryActive('')
                  setCategoryChangeValue('')
                }}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium w-full
                ${
                  active === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
