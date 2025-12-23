import { Button } from "@heroui/button";
import {
  IoSearchOutline,
  IoLogoWhatsapp,
} from "react-icons/io5";
import {
  FaTelegram,
  FaWindowMaximize,
} from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import {
  BiSolidDashboard,
  BiSolidMessageSquareEdit,
  BiSolidWidget,
} from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { SiCodeblocks } from "react-icons/si";
import { RiPagesFill } from "react-icons/ri";
import { TbSectionFilled } from "react-icons/tb";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "./components/Logo";
import { Search } from "./components/Search";
import { UsersSearchClient } from "./components/ApiTest";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    {
      label: "Дашборд",
      icon: <BiSolidDashboard className="text-[24px]" />,
      route: '/',
    },
    {
      label: "Админка CMS",
      icon: <BiSolidMessageSquareEdit className="text-[24px]" />,
      route: '/',
      isOpen: false,
      submenu: [
        {
          label: "Страницы",
          icon: <RiPagesFill className="text-[24px]" />,
          route: '/',
        },
        {
          label: "Секции",
          icon: <TbSectionFilled className="text-[24px]" />,
          route: '/',
        },
        {
          label: "Виджеты",
          icon: <BiSolidWidget className="text-[24px]" />,
          route: '/',
        },
        {
          label: "Модальные окна",
          icon: <FaWindowMaximize className="text-[20px] mx-[2px]" />,
          route: '/',
        },
      ],
    },
    {
      label: "Модули",
      icon: <SiCodeblocks className="text-[20px] mx-[2px]" />,
      route: '/',
      isOpen: false,
      submenu: [
        {
          label: "Отправка Email",
          icon: <MdEmail className="text-[24px]" />,
          route: '/',
        },
        // {
        // 	label: "Интеграции",
        // 	icon: <MdIntegrationInstructions className="text-[24px]" />,
        // 	route: ROUTES.MODULES_INTEGRATIONS,
        // },
      ],
    }
  ]

  return (
    <div className="w-screen h-screen px-9">
      {/* Шапка */}
      <div className="grid grid-cols-5 py-8">
        <div className="col-span-1 flex items-center">
          <Logo />
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-6">
          {/* <Search
            api="users"
            debounceMs={500}
            minLength={2}
          /> */}
          <UsersSearchClient />
          <div className="col-span-1 flex items-center justify-end gap-6">
            <ThemeSwitch className="" />
            <button
              className="flex items-center"
            //   onClick={() => router.push(ROUTES.MESSENGER)}
            >
              {/* <Badge
                className="mr-2 mt-px cursor-pointer"
                color="danger"
                content={4}
                isInvisible={false}
                shape="circle"
              >
                <IoNotifications className="text-[22px] text-foreground-500 mr-2 mt-px cursor-pointer" />
              </Badge> */}
            </button>
            <TbLogout2
              className="text-danger text-[24px] cursor-pointer ml-[3px]"
            //   onClick={logout}
            />
          </div>
        </div>
      </div>

      {/* Основная часть */}
      <div className="grid grid-cols-5 min-h-[calc(100vh-120px)]">
        {/* Боковое меню */}
        <div className="col-span-1 flex flex-col justify-between pr-9 pb-9 gap-6 transition-all duration-1000 animate-appearance-in">
          <div className="flex flex-col w-full gap-6">
            {/* {project ? (
                <>
                  <Button
                    className="w-full justify-between shadow-custom" // <-- Разводим контент по краям
                    color="secondary"
                    endContent={
                      projectsMenuOpen ? (
                        <FaChevronDown className="text-[10px]" />
                      ) : (
                        <FaChevronRight className="text-[10px]" />
                      )
                    }
                    radius="full"
                    size="lg"
                    startContent={
                      <div className="relative w-[24px] h-[24px] rounded-full overflow-hidden">
                        <Image
                          alt={project?.name || "Лого"}
                          className="object-cover w-[24px] h-[24px]"
                          radius="none"
                          src={
                            project?.logo
                              ? getMedia(project?.logo)
                              : "/core/nophoto.png"
                          }
                        />
                      </div>
                    }
                    variant="solid"
                    onPress={() => setProjectsMenuOpen(!projectsMenuOpen)}
                  >
                    <span className="flex-1 text-left">{project?.name}</span>
                  </Button>

                  {projectsMenuOpen && filteredProjects ? (
                    <>
                      <Button
                        className={`w-full justify-start pl-[60px]`}
                        color={"primary"}
                        radius="full"
                        size="lg"
                        startContent={
                          <IoRocketSharp className="text-[20px] mx-[2px]" />
                        }
                        variant={"light"}
                        onPress={() => isSuperAdmin && onEdit()}
                      >
                        Новый проект
                      </Button>

                      {filteredProjects.map((item: any) => (
                        <Button
                          key={item._id}
                          className={`w-full justify-start pl-[60px]`}
                          color={"default"}
                          radius="full"
                          size="lg"
                          startContent={
                            <div className="relative w-[24px] h-[24px] aspect-[100/100] rounded-full overflow-hidden">
                              <Image
                                alt={item?.name || "Лого"}
                                className="object-cover w-[24px] h-[24px]"
                                radius="none"
                                src={
                                  item?.logo
                                    ? getMedia(item?.logo)
                                    : "/core/nophoto.png"
                                }
                              />
                            </div>
                          }
                          variant={"light"}
                          onPress={() => {
                            setProjectId(item._id);
                            setProjectsMenuOpen(false);
                          }}
                        >
                          {item?.name}
                        </Button>
                      ))}
                    </>
                  ) : null}
                </>
              ) : (
                <Button
                  className={`w-full justify-start ${
                    isActive(ROUTES.STARTUP) ? "shadow-custom" : ""
                  }`}
                  color={"primary"}
                  radius="full"
                  size="lg"
                  startContent={
                    <IoRocketSharp className="text-[20px] mx-[2px]" />
                  }
                  variant={isActive(ROUTES.STARTUP) ? "solid" : "light"}
                  onPress={() => null}
                >
                  Начать проект
                </Button>
              )} */}

            {/* {getMenuItems()?.map((item: any) => (
                <div key={item.route}>
                  <Button
                    className={`w-full justify-between ${item.extraClass || ""} ${
                      isActive(item.route) ? "shadow-custom" : ""
                    }`}
                    color={isActive(item.route) ? "primary" : "default"}
                    endContent={
                      item?.submenu?.length ? (
                        item?.isOpen ? (
                          <FaChevronDown className="text-[10px]" />
                        ) : (
                          <FaChevronRight className="text-[10px]" />
                        )
                      ) : null
                    }
                    radius="full"
                    size="lg"
                    startContent={item.icon}
                    variant={isActive(item.route) ? "solid" : "light"}
                    onPress={() => {
                      router.push(item.route);
                      setMenuItems((prev: any) =>
                        prev.map((menuItem: any) =>
                          menuItem.route === item.route
                            ? { ...menuItem, isOpen: !item?.isOpen }
                            : { ...menuItem, isOpen: false },
                        ),
                      );
                    }}
                  >
                    <span className="flex-1 text-left">{item?.label}</span>
                  </Button>

                  {item?.isOpen && item?.submenu?.length ? (
                    <div className="flex flex-col mt-6 gap-6">
                      {item?.submenu?.map((i: any) => (
                        <Button
                          key={i.route}
                          className={`w-full justify-start pl-[60px] ${i.extraClass || ""} `}
                          color={isActive(i.route) ? "primary" : "default"}
                          radius="full"
                          size="lg"
                          startContent={i.icon}
                          variant={"light"}
                          onPress={() => {
                            router.push(i.route);
                          }}
                        >
                          {i.label}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))} */}
          </div>

          {/* Поддержка */}
          <div className="flex flex-col gap-4">
            <p className="">Служба поддержки</p>
            <div className="flex items-center gap-4 -ml-1.5">
              <Button
                isIconOnly
                className="group bg-transparent"
                radius="full"
                variant="flat"
              >
                <FaTelegram className="text-[32px] group-hover:text-primary" />
              </Button>
              <Button
                isIconOnly
                className="group bg-transparent"
                radius="full"
                variant="flat"
              >
                <IoLogoWhatsapp className="text-[34px] group-hover:text-primary" />
              </Button>
              <Button
                isIconOnly
                className="group bg-transparent"
                radius="full"
                variant="flat"
              >
                <MdEmail className="text-[36px] group-hover:text-primary" />
              </Button>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="col-span-4 bg-foreground-100 mb-9 rounded-4xl p-9">
          {children}
        </div>
      </div>

      {/* <ProjectModal isOpen={isEdit} onClose={closeEdit} /> */}
    </div>
  );
}
