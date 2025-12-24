// import { Button } from "@heroui/button";
// import { Input, Image } from "@heroui/react";
import {
  IoSearchOutline,
  IoNotifications,
  IoLogoWhatsapp,
  IoRocketSharp,
} from "react-icons/io5";
import {
  FaTelegram,
  FaUsers,
  FaCloudArrowDown,
  FaChevronRight,
  FaChevronDown,
  FaWindowMaximize,
  FaDatabase,
} from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import {
  BiSolidDashboard,
  BiSolidMessageSquareEdit,
  BiSolidPhotoAlbum,
  BiSolidWidget,
} from "react-icons/bi";
import { MdWork, MdEmail } from "react-icons/md";
import { PiCurrencyRubFill } from "react-icons/pi";
import { SiCodeblocks, SiGoogleanalytics } from "react-icons/si";
import { IoSettingsSharp } from "react-icons/io5";
import { HiMiniServerStack } from "react-icons/hi2";
// import { usePathname, useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState, useMemo, useLayoutEffect } from "react";
// import { Badge, useDisclosure } from "@heroui/react";
import { RiPagesFill } from "react-icons/ri";
import { TbSectionFilled } from "react-icons/tb";
import { SiCashapp } from "react-icons/si";
import { ThemeSwitch } from "@/components/theme-switch";
// import { Button } from "@heroui/react";

// import { useLogout } from "@/hooks/useLogout";
// import { ROUTES } from "@/app/routes";
// import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
// import { RootState } from "@/api/store";
// import { clearSearchValue, setSearchValue } from "@/api/slices/searchSlice";
// import { useDebounce } from "@/hooks/useDebounce";
// import { formatBalance } from "@/helper/formatedRubleWithThousands";
// import { DashboardLogo } from "@/components/ui/DashboardLogo";
// import { ProjectModal } from "@/components/modals/ProjectModal";
// import { useMeQuery } from "@/api/services/authApi";
// import { getMedia } from "@/helper/getMedia";
// import { UserRole } from "@/types/user";
// import {
//   useGetProjectQuery,
//   useGetProjectsQuery,
// } from "@/api/services/projectApi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const logout = useLogout();
  // const pathname = usePathname();
  // const router = useRouter();

  // const dispatch = useDispatch();
  // const globalSearchValue = useSelector(
  //   (state: RootState) => state.search.value,
  // );

  // Локальное значение для инпута
  // const [localValue, setLocalValue] = useState(globalSearchValue);

  // const debouncedValue = useDebounce(localValue, 500);

  // useEffect(() => {
  //   dispatch(setSearchValue(debouncedValue));
  // }, [debouncedValue, dispatch]);

  // const [projectId, setProjectId] = useState();
  // const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
  // const [loading, setLoading] = useState(true);

  // const { data: me } = useMeQuery(null);
  // const { data: projects } = useGetProjectsQuery(null, { skip: !me?._id });
  // const { data: project, isLoading } = useGetProjectQuery(projectId, {
  //   skip: !projectId,
  // });

  // useEffect(() => {
  //   if (!isLoading) {
  //     const timeout = setTimeout(() => {
  //       setLoading(false);
  //       clearTimeout(timeout);
  //     }, 300);
  //   }
  // }, [isLoading]);

  // useEffect(() => {
  //   if (
  //     !localStorage ||
  //     !projectId ||
  //     localStorage?.getItem("igoshev-project-id") === projectId
  //   )
  //     return;

  //   localStorage.setItem("igoshev-project-id", projectId);
  // }, [projectId]);

  // useLayoutEffect(() => {
  //   if (!localStorage) return;

  //   setProjectId(
  //     localStorage?.getItem("igoshev-project-id") || projects?.[0]?._id || "",
  //   );
  // }, [projects]);

  // const isSuperAdmin = useMemo(
  //   () => me?.role === UserRole.SuperAdmin,
  //   [me?.role],
  // );

  // const isActive = (route: string) => pathname.startsWith(route);

  // const filteredProjects = useMemo(
  //   () => projects?.filter((i: any) => i._id !== projectId) ?? [],
  //   [projects, projectId],
  // );

  // const [menuItems, setMenuItems] = useState([
  //   {
  //     label: "Дашборд",
  //     icon: <BiSolidDashboard className="text-[24px]" />,
  //     route: ROUTES.DASHBOARD,
  //   },
  //   {
  //     label: "Админка CMS",
  //     icon: <BiSolidMessageSquareEdit className="text-[24px]" />,
  //     route: ROUTES.CMS,
  //     isOpen: false,
  //     submenu: [
  //       {
  //         label: "Страницы",
  //         icon: <RiPagesFill className="text-[24px]" />,
  //         route: ROUTES.CMS_PAGES,
  //       },
  //       {
  //         label: "Секции",
  //         icon: <TbSectionFilled className="text-[24px]" />,
  //         route: ROUTES.CMS_SECTIONS,
  //       },
  //       {
  //         label: "Виджеты",
  //         icon: <BiSolidWidget className="text-[24px]" />,
  //         route: ROUTES.CMS_WIDGETS,
  //       },
  //       {
  //         label: "Модальные окна",
  //         icon: <FaWindowMaximize className="text-[20px] mx-[2px]" />,
  //         route: ROUTES.CMS_MODALS,
  //       },
  //     ],
  //   },
  //   {
  //     label: "Модули",
  //     icon: <SiCodeblocks className="text-[20px] mx-[2px]" />,
  //     route: ROUTES.MODULES,
  //     isOpen: false,
  //     submenu: [
  //       {
  //         label: "Отправка Email",
  //         icon: <MdEmail className="text-[24px]" />,
  //         route: ROUTES.MODULES_EMAILS,
  //       },
  //       // {
  //       // 	label: "Интеграции",
  //       // 	icon: <MdIntegrationInstructions className="text-[24px]" />,
  //       // 	route: ROUTES.MODULES_INTEGRATIONS,
  //       // },
  //     ],
  //   },
  //   {
  //     label: "Сущности БД",
  //     icon: <FaDatabase className="text-[20px] mx-[1px]" />,
  //     route: ROUTES.ENTITIES,
  //     submenu: [
  //       {
  //         label: "Проекты",
  //         icon: <MdWork className="text-[24px]" />,
  //         route: ROUTES.ENTITY_PROJECTS,
  //       },
  //       {
  //         label: "Пользователи",
  //         icon: <FaUsers className="text-[24px]" />,
  //         route: ROUTES.ENTITY_USERS,
  //       },
  //       {
  //         label: "Услуги",
  //         icon: <SiCashapp className="text-[20px] mx-[2px]" />,
  //         route: ROUTES.ENTITY_SERVICES,
  //       },
  //       {
  //         label: "Работы",
  //         icon: <BiSolidPhotoAlbum className="text-[24px]" />,
  //         route: ROUTES.ENTITY_WORKS,
  //       },
  //     ],
  //   },
  //   {
  //     label: "Заявки CRM Lite",
  //     icon: <PiCurrencyRubFill className="text-[26px] -mx-px" />,
  //     route: ROUTES.CRM,
  //   },
  //   {
  //     label: "Аналитика",
  //     icon: <SiGoogleanalytics className="text-[20px] mx-[2px]" />,
  //     route: ROUTES.ANALYTICS,
  //   },
  //   {
  //     label: "Настройки",
  //     icon: <IoSettingsSharp className="text-[24px]" />,
  //     route: ROUTES.SETTINGS,
  //   },
  //   {
  //     label: "Cloud",
  //     icon: <FaCloudArrowDown className="text-[24px]" />,
  //     route: ROUTES.CLOUD,
  //     extraClass: `${project ? "mt-12" : ""}`,
  //   },
  //   {
  //     label: "Хостинг",
  //     icon: <HiMiniServerStack className="text-[24px]" />,
  //     route: ROUTES.HOSTING,
  //   },
  // ]);

  // const getMenuItems = () => {
  //   if (isSuperAdmin) {
  //     return menuItems;
  //   } else if (project) {
  //     // return menuItems.filter((item) => item.label !== "Проекты");
  //     return menuItems;
  //   } else {
  //     return [menuItems[menuItems.length - 1], menuItems[menuItems.length - 2]];
  //   }
  // };

  // const {
  //   isOpen: isEdit,
  //   onOpen: onEdit,
  //   onClose: closeEdit,
  // } = useDisclosure();

  return (
    <div className="w-screen h-screen px-9">
      {/* Шапка */}
      <div className="grid grid-cols-5 py-8">
        <div className="col-span-1 flex items-center">
          {/* <DashboardLogo /> */}LOGO
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-6">
          <div>Поиск</div>
          {/* <Input
            isClearable
            className="rounded-full col-span-1 my-1"
            placeholder="Найти..."
            radius="full"
            size="lg"
            startContent={<IoSearchOutline className="text-[20px]" />}
            type="text"
            // value={localValue}
            // onClear={() => {
            //   setLocalValue(""); // сброс локального значения (очистка поля)
            //   dispatch(clearSearchValue()); // очистка в Redux
            // }}
            // onValueChange={(value: string) => setLocalValue(value)}
          /> */}
          <div className="col-span-1 flex items-center justify-end gap-6">
            <ThemeSwitch className="" />
            <button
              className="flex items-center"
            // onClick={() => router.push(ROUTES.MESSENGER)}
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
            {/* {me ? (
              <button
                className="mt-[5px] cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://buy.stripe.com/9B6dR92Tz6ZsfbI6e6co000",
                    "_blanc",
                  )
                }
              >
                <p className="text-xs">
                  Ваш баланс{" "}
                  <span className="text-primary text-base ml-[3px]">
                    {formatBalance(me?.balance, me?.currentCurrency)}
                  </span>
                </p>
              </button>
            ) : null} */}

            <TbLogout2
              className="text-danger text-[24px] cursor-pointer ml-[3px]"
            // onClick={logout}
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
                className={`w-full justify-start ${isActive(ROUTES.STARTUP) ? "shadow-custom" : ""
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
                  className={`w-full justify-between ${item.extraClass || ""} ${isActive(item.route) ? "shadow-custom" : ""
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
              {/* <Button
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
              </Button> */}
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
