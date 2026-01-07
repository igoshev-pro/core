"use client"

import { Button } from "@heroui/react"
import React, { useEffect, useState, useRef, memo } from "react"
import { CgClose, CgMenuRight } from "react-icons/cg"
import { FaChevronDown, FaChevronRight } from "react-icons/fa6"
import { IoRocketSharp } from "react-icons/io5"
import { TbLogout2 } from "react-icons/tb"
import { usePathname, useRouter } from "next/navigation"
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher"
import { logoutAction } from "@/app/api/actions/logout"
import { ThemeSwitch } from "@/components/theme-switch"
import * as FaIcons from 'react-icons/fa6';
import * as Io5Icons from 'react-icons/io5';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as BiIcons from 'react-icons/bi';
import * as TbIcons from 'react-icons/tb';
import * as GiIcons from 'react-icons/gi';
import { getSiteSchema, type SiteMenuItem } from '@/api/core/projectsApi';

// Маппинг префиксов иконок на библиотеки
const iconLibraries: Record<string, any> = {
  'fa': FaIcons,
  'fa6': FaIcons,
  'io': IoIcons,
  'io5': Io5Icons,
  'md': MdIcons,
  'ri': RiIcons,
  'si': SiIcons,
  'bi': BiIcons,
  'tb': TbIcons,
  'gi': GiIcons,
};

// Функция для преобразования строки иконки в компонент
function getIconComponent(iconName?: string, iconSize?: string): React.ReactNode | null {
  if (!iconName) return null;

  // Преобразуем "tb-world-www" -> "TbWorldWww"
  const parts = iconName.split('-');
  const prefix = parts[0]; // "tb"
  const rest = parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(''); // "WorldWww"
  const componentName = prefix.charAt(0).toUpperCase() + prefix.slice(1) + rest; // "TbWorldWww"

  // Пробуем разные варианты библиотек
  let library = iconLibraries[prefix];
  
  // Если не нашли, пробуем варианты
  if (!library) {
    if (prefix === 'io') {
      // Пробуем сначала io5, потом io
      library = Io5Icons;
      const IconComponent = library[componentName];
      if (!IconComponent) {
        library = IoIcons;
      }
    }
  }

  if (!library) return null;

  const IconComponent = library[componentName];
  if (!IconComponent) {
    // Пробуем без первой буквы префикса (например, "Io5" -> "Io")
    const altComponentName = componentName.replace(/^Io5/, 'Io').replace(/^Fa6/, 'Fa');
    const AltIconComponent = library[altComponentName];
    if (AltIconComponent) {
      const iconStyle: React.CSSProperties = {
        fontSize: iconSize || '24px',
        width: '24px',
        height: '24px',
      };
      return <AltIconComponent style={iconStyle} />;
    }
    return null;
  }

  // Применяем размер через style
  const iconStyle: React.CSSProperties = {
    fontSize: iconSize || '24px',
    width: '24px',
    height: '24px',
  };

  return <IconComponent style={iconStyle} />;
}

// Функция для получения текста из i18n объекта
function getLabelText(label: Record<string, string> | undefined, locale: string = 'ru'): string {
  if (!label) return '';
  return label[locale] || label['ru'] || label['en'] || Object.values(label)[0] || '';
}

// Функция для построения иерархии меню из данных (без иконок - они создаются при рендере)
function buildMenuHierarchyFromData(items: SiteMenuItem[]): any[] {
  // Сортируем по order
  const sorted = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Создаем мапу для быстрого доступа
  const itemMap = new Map<string, any>();
  const rootItems: any[] = [];

  // Сначала создаем все элементы (без иконок - они будут созданы при рендере)
  sorted.forEach(item => {
    const menuItem: any = {
      _id: item._id,
      label: getLabelText(item.label),
      iconName: item.icon, // Сохраняем имя иконки
      iconSize: item.iconSize, // Сохраняем размер иконки
      route: item.linkType === 'internal' 
        ? (item.pagePath || '#') 
        : (item.externalUrl || '#'),
      parentId: item.parentId,
      submenu: [],
      isOpen: false,
    };
    itemMap.set(item._id, menuItem);
  });

  // Строим иерархию
  sorted.forEach(item => {
    const menuItem = itemMap.get(item._id)!;
    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.submenu.push(menuItem);
      } else {
        // Если родитель не найден, добавляем в корень
        rootItems.push(menuItem);
      }
    } else {
      rootItems.push(menuItem);
    }
  });

  return rootItems;
}

// Функция для добавления иконок к элементам меню
function addIconsToMenuItems(items: any[]): any[] {
  return items.map(item => {
    const icon = item.iconName ? getIconComponent(item.iconName, item.iconSize) : null;
    const submenu = item.submenu?.length > 0 ? addIconsToMenuItems(item.submenu) : [];
    return {
      ...item,
      icon,
      submenu,
    };
  });
}

// Глобальный кэш меню на уровне модуля (не сбрасывается при ре-рендерах)
const globalMenuCache = new Map<string, {
  menu: any[];
  timestamp: number;
  projectId: string;
}>();

// Глобальный флаг загрузки
const loadingPromises = new Map<string, Promise<any[]>>();

// Функция для очистки кэша меню (можно вызвать извне)
export const clearMenuCache = (projectId?: string) => {
  if (projectId) {
    // Очищаем кэш для конкретного проекта
    globalMenuCache.delete(projectId);
    loadingPromises.delete(projectId);
    try {
      localStorage.removeItem(`adminMenuData_${projectId}`);
    } catch {
      // Игнорируем ошибки localStorage
    }
  } else {
    // Очищаем весь кэш
    globalMenuCache.clear();
    loadingPromises.clear();
    try {
      // Очищаем все ключи меню из localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('adminMenuData_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Игнорируем ошибки localStorage
    }
  }
};

type SubItem = {
    _id?: string
    label: string
    icon: React.ReactNode
    route: string
    extraClass?: string
}

type MenuItem = {
    _id?: string
    label: string
    icon: React.ReactNode
    route: string
    isOpen?: boolean
    extraClass?: string
    submenu?: SubItem[]
}

const parentKey = (route: string) => `parent:${route}`

const BurgerMenu = memo(() => {
    const pathname = usePathname()
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)

    // Функция для открытия меню по текущему URL
    const openMenuByPathname = (menu: any[], currentPathname: string): any[] => {
        return menu.map((item: any) => {
            const hasSubmenu = !!item?.submenu?.length;
            if (!hasSubmenu) return item;

            const shouldBeOpen =
                currentPathname.startsWith(item.route) ||
                item.submenu.some((s: any) => currentPathname.startsWith(s.route));

            if (shouldBeOpen) {
                return { ...item, isOpen: true };
            }
            return item;
        });
    };

    // Инициализируем состояние из глобального кэша, если он есть
    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        // Пытаемся найти меню в глобальном кэше
        const entries = Array.from(globalMenuCache.entries());
        for (const [projectId, cached] of entries) {
            if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
                // Открываем меню по текущему URL
                return openMenuByPathname(cached.menu, pathname);
            }
        }
        return [];
    })
    
    const [loading, setLoading] = useState(false)
    const menuLoadedRef = useRef(false)
    const currentProjectIdRef = useRef<string | null>(null)
    const initRef = useRef(false)

    // ✅ единый источник "активности"
    // - route для обычных пунктов
    // - parent:<route> для родителя с submenu (чтобы не подсвечивался первый подпункт)
    const [activeKey, setActiveKey] = useState<string>(pathname)

    // Получаем projectId и загружаем меню из схемы (только один раз или при смене проекта)
    useEffect(() => {
        // Предотвращаем повторную инициализацию
        if (initRef.current) return;
        initRef.current = true;

        const loadMenu = async () => {
            try {
                // Получаем projectId из API
                const response = await fetch('/api/core/projects/current', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                }).catch(() => null);

                let projectId: string | null = null;
                
                if (response?.ok) {
                    try {
                        const data = await response.json();
                        projectId = data.projectId;
                    } catch {
                        // Если ответ не JSON, пробуем другой способ
                    }
                }

                // Если не получилось, пробуем получить из URL (если есть в пути)
                // Используем window.location.pathname вместо pathname из хука, чтобы не было зависимости
                if (!projectId) {
                    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
                    const urlMatch = currentPath.match(/\/admin\/core\/projects\/([^\/]+)/);
                    if (urlMatch) {
                        projectId = urlMatch[1];
                    }
                }

                // Если все еще нет, пробуем из localStorage
                if (!projectId) {
                    projectId = localStorage.getItem('currentProjectId');
                }

                if (!projectId) {
                    console.warn('ProjectId not found, menu will be empty');
                    setMenuItems([]);
                    setLoading(false);
                    menuLoadedRef.current = true;
                    return;
                }

                // Проверяем глобальный кэш ПЕРВЫМ делом (в памяти)
                const cached = globalMenuCache.get(projectId);
                if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
                    // Используем меню из глобального кэша и открываем по текущему URL
                    const menuWithAutoOpen = openMenuByPathname(cached.menu, pathname);
                    if (JSON.stringify(menuItems) !== JSON.stringify(menuWithAutoOpen)) {
                        setMenuItems(menuWithAutoOpen);
                    }
                    menuLoadedRef.current = true;
                    currentProjectIdRef.current = projectId;
                    setLoading(false);
                    return;
                }

                // Если projectId не изменился и меню уже загружено в этом компоненте, не загружаем снова
                if (menuLoadedRef.current && currentProjectIdRef.current === projectId) {
                    return;
                }

                // Проверяем, не загружается ли уже меню для этого проекта
                const existingPromise = loadingPromises.get(projectId);
                if (existingPromise) {
                    // Ждем завершения существующей загрузки
                    try {
                        const menu = await existingPromise;
                        setMenuItems(menu);
                        menuLoadedRef.current = true;
                        currentProjectIdRef.current = projectId;
                        setLoading(false);
                        return;
                    } catch {
                        // Если ошибка, продолжаем загрузку
                    }
                }

                // Начинаем загрузку
                setLoading(true);
                
                const loadPromise = (async () => {
                    // Проверяем localStorage кэш
                    const cacheKey = `adminMenuData_${projectId}`;
                    let menuDataFromCache: SiteMenuItem[] | null = null;
                    
                    try {
                        const cached = localStorage.getItem(cacheKey);
                        if (cached) {
                            const parsed = JSON.parse(cached);
                            // Проверяем, не устарел ли кэш (старше 5 минут)
                            if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
                                menuDataFromCache = parsed.menuData || null;
                            }
                        }
                    } catch {
                        // Игнорируем ошибки парсинга
                    }

                    let menuItemsFromSchema: SiteMenuItem[] = [];
                    
                    if (menuDataFromCache) {
                        // Используем данные из кэша
                        menuItemsFromSchema = menuDataFromCache;
                    } else {
                        // Загружаем схему для режима admin
                        const schema = await getSiteSchema(projectId);
                        const adminSection = schema.admin;
                        menuItemsFromSchema = adminSection?.menu || [];
                        
                        // Кэшируем только данные (без иконок)
                        try {
                            localStorage.setItem(cacheKey, JSON.stringify({
                                menuData: menuItemsFromSchema,
                                timestamp: Date.now(),
                            }));
                        } catch {
                            // Игнорируем ошибки localStorage
                        }
                    }

                    // Строим иерархию и добавляем иконки
                    let hierarchicalMenu: any[] = [];
                    if (menuItemsFromSchema.length > 0) {
                        const hierarchicalMenuData = buildMenuHierarchyFromData(menuItemsFromSchema);
                        hierarchicalMenu = addIconsToMenuItems(hierarchicalMenuData);
                    }

                    // Сохраняем в глобальный кэш
                    globalMenuCache.set(projectId, {
                        menu: hierarchicalMenu,
                        timestamp: Date.now(),
                        projectId,
                    });

                    // Удаляем промис из мапы
                    loadingPromises.delete(projectId);

                    return hierarchicalMenu;
                })();

                // Сохраняем промис в мапу
                loadingPromises.set(projectId, loadPromise);

                // Ждем загрузки
                const hierarchicalMenu = await loadPromise;
                
                // Авто-раскрываем меню по текущему URL только при первой загрузке
                const menuWithAutoOpen = openMenuByPathname(hierarchicalMenu, pathname);
                
                setMenuItems(menuWithAutoOpen);
                menuLoadedRef.current = true;
                currentProjectIdRef.current = projectId;
            } catch (error) {
                console.error('Failed to load menu:', error);
                setMenuItems([]);
                menuLoadedRef.current = true;
                // Удаляем промис при ошибке
                if (currentProjectIdRef.current) {
                    loadingPromises.delete(currentProjectIdRef.current);
                }
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Загружаем только один раз при монтировании

    // если activeKey = parent:..., то никакие route/подпункты не считаем активными по startsWith
    const matchPath = activeKey.startsWith("parent:") ? "" : activeKey
    const isActiveByPath = (route: string) => matchPath.startsWith(route)

    // при реальной навигации синкаем activeKey с url
    useEffect(() => {
        setActiveKey(pathname)
    }, [pathname])


    // Предотвращаем скролл body на iPhone когда меню открыто
    useEffect(() => {
        if (isOpen) {
            // Сохраняем текущую позицию скролла
            const scrollY = window.scrollY;
            
            // Блокируем скролл body
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            
            return () => {
                // Восстанавливаем скролл
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
                
                // Восстанавливаем позицию скролла
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    const onEdit = () => {
        setActiveKey("/admin/core/projects/create")
        router.push("/admin/core/projects/create")
        setIsOpen(false)
    }

    const toggleParentOpen = (parentRoute: string, item: MenuItem) => {
        const newIsOpen = !item.isOpen;
        
        // При клике на родителя: переключаем открыто/закрыто
        setMenuItems((prev) => {
            return prev.map((m) => {
                if (m.route !== parentRoute) {
                    // Закрываем другие открытые меню
                    if (m.isOpen) {
                        return { ...m, isOpen: false };
                    }
                    return m;
                }
                // Переключаем состояние выбранного меню
                return { ...m, isOpen: newIsOpen };
            });
        });
        
        // Если открываем меню и есть подпункты, переходим на первый подпункт
        if (newIsOpen && item.submenu && item.submenu.length > 0) {
            const firstSubmenu = item.submenu[0];
            if (firstSubmenu.route) {
                handleSubItemClick(firstSubmenu.route);
            }
        }
    }

    const handleItemClick = (route: string) => {
        setActiveKey(route)
        router.push(route)
        setIsOpen(false)
    }

    const handleSubItemClick = (route: string) => {
        setActiveKey(route)
        router.push(route)
        setIsOpen(false)
    }

    return (
        <>
            <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
                <CgMenuRight className="text-4xl hover:text-primary" />
            </button>

            {isOpen ? (
                <div 
                    className="fixed inset-0 bg-background z-50 flex flex-col"
                    style={{
                        // Предотвращаем скролл на iPhone
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {/* Заголовок - фиксированный */}
                    <div className="flex justify-between items-center gap-6 px-4 py-4 min-h-[52px] border-b border-foreground-200 flex-shrink-0">
                        <p className="text-3xl font-semibold ml-1">Меню</p>
                        <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
                            <CgClose className="text-4xl hover:text-primary -mr-1" />
                        </button>
                    </div>

                    {/* Контент меню - с скроллом */}
                    <div 
                        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
                        style={{
                            // Предотвращаем скролл body на iPhone
                            overscrollBehavior: 'contain',
                            WebkitOverflowScrolling: 'touch',
                            // Фиксируем высоту для правильного скролла
                            maxHeight: 'calc(100vh - 52px)',
                        }}
                    >
                        <div className="flex flex-col gap-3">
                    <Button
                        className="w-full justify-start"
                        color="primary"
                        radius="full"
                        size="lg"
                        startContent={<IoRocketSharp className="text-[20px] mx-[2px]" />}
                        variant="light"
                        onPress={onEdit}
                    >
                        Новый проект
                    </Button>

                            {loading ? (
                                <div className="text-sm text-foreground-500 py-4">Загрузка меню...</div>
                            ) : menuItems.length === 0 ? (
                                <div className="text-sm text-foreground-500 py-4">Меню не настроено</div>
                            ) : (
                                menuItems.map((item) => {
                        const hasSubmenu = !!item?.submenu?.length

                                    // ✅ родитель активен если:
                                    // - Меню открыто (всегда активен когда открыт), ИЛИ
                                    // - URL соответствует его route или подпункту
                                    const hasActiveSubmenu = hasSubmenu && item.submenu!.some((s) => isActiveByPath(s.route));
                                    const parentActive = hasSubmenu
                                        ? item.isOpen || isActiveByPath(item.route) || hasActiveSubmenu
                                        : isActiveByPath(item.route)

                        return (
                                        <div key={item.route || item._id}>
                                <Button
                                    className={`w-full justify-between ${item.extraClass || ""} ${parentActive ? "shadow-custom" : ""}`}
                                    color={parentActive ? "primary" : "default"}
                                    endContent={
                                        hasSubmenu ? (
                                            item.isOpen ? <FaChevronDown className="text-[10px]" /> : <FaChevronRight className="text-[10px]" />
                                        ) : null
                                    }
                                    radius="full"
                                    size="lg"
                                                startContent={item.icon || null}
                                    variant={parentActive ? ("solid" as any) : ("light" as any)}
                                    onPress={() => {
                                        if (hasSubmenu) {
                                            toggleParentOpen(item.route, item)
                                            // ✅ делаем активным именно родителя, НЕ подпункт
                                            setActiveKey(parentKey(item.route))
                                            // НЕ переходим на страницу - только открываем/закрываем подменю
                                            return
                                        }

                                        setMenuItems((prev) => prev.map((m) => ({ ...m, isOpen: false })))
                                        handleItemClick(item.route)
                                    }}
                                >
                                    <span className="flex-1 text-left">{item.label}</span>
                                </Button>

                                {item.isOpen && hasSubmenu ? (
                                    <div className="flex flex-col mt-6 gap-6">
                                        {item.submenu!.map((i) => (
                                            <Button
                                                            key={i.route || i._id}
                                                className={`w-full justify-start pl-[60px] ${i.extraClass || ""}`}
                                                color={isActiveByPath(i.route) ? "primary" : "default"}
                                                radius="full"
                                                size="lg"
                                                            startContent={i.icon || null}
                                                variant="light"
                                                onPress={() => {
                                                                handleSubItemClick(i.route)
                                                }}
                                            >
                                                {i.label}
                                            </Button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        )
                                })
                            )}

                    <div className="flex items-center justify-between gap-6 px-6 mt-10">
                        <p>Выбор темы</p>
                        <ThemeSwitch className="" />
                    </div>

                    <div className="flex items-center justify-between gap-6 px-6 mt-3 mb-9">
                        <p>Выбор языка</p>
                        <LanguageSwitcher />
                    </div>

                    <Button
                        className="justify-start"
                        variant="light"
                        size="lg"
                        color="danger"
                        radius="full"
                        startContent={<TbLogout2 className="text-2xl" />}
                        onPress={() => logoutAction()}
                    >
                        Выйти
                    </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
});

BurgerMenu.displayName = 'BurgerMenu';

export default BurgerMenu
