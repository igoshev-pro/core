'use client'

import { Button } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, memo } from 'react'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa6';
import { IoRocketSharp } from 'react-icons/io5';
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

const SideMenuMainLayout = memo(() => {
  const pathname = usePathname();
  const router = useRouter();

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
  const [menuItems, setMenuItems] = useState<any[]>(() => {
    // Пытаемся найти меню в глобальном кэше
    const entries = Array.from(globalMenuCache.entries());
    for (const [projectId, cached] of entries) {
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        // Открываем меню по текущему URL
        return openMenuByPathname(cached.menu, pathname);
      }
    }
    return [];
  });
  
  const [loading, setLoading] = useState(false);
  const menuLoadedRef = useRef(false);
  const currentProjectIdRef = useRef<string | null>(null);
  const initRef = useRef(false);

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

  const isActive = (route: string) => pathname.startsWith(route);


  const onEdit = () => {
    router.push('/admin/core/projects/create')
  }

  if (loading) {
    return (
      <div className="flex flex-col w-full gap-6">
        <div className="text-sm text-foreground-500">Загрузка меню...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6">
      <Button
        className={`w-full justify-start`}
        color={"primary"}
        radius="full"
        size="lg"
        startContent={<IoRocketSharp className="text-[20px] mx-[2px]" />}
        variant={"light"}
        onPress={() => onEdit()}
      >
        Новый проект
      </Button>

      {menuItems.length === 0 ? (
        <div className="text-sm text-foreground-500">Меню не настроено</div>
      ) : (
        menuItems?.map((item: any) => {
        const hasSubmenu = !!item?.submenu?.length;
          // Родитель активен если:
          // - Меню открыто (всегда активен когда открыт), ИЛИ
          // - URL соответствует его route или подпункту
          const hasActiveSubmenu = hasSubmenu && item.submenu.some((s: any) => isActive(s.route));
          const parentActive = item.isOpen || isActive(item.route) || hasActiveSubmenu;

        return (
            <div key={item._id || item.route}>
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
              variant={parentActive ? "solid" : "light"}
              onPress={() => {
                if (hasSubmenu) {
                  const newIsOpen = !item.isOpen;
                  
                  // При клике на родителя: переключаем открыто/закрыто
                  setMenuItems((prev: any) => {
                    return prev.map((m: any) => {
                      if (m._id === item._id || m.route === item.route) {
                        return { ...m, isOpen: newIsOpen };
                      }
                      // Закрываем другие открытые меню
                      if (m.isOpen) {
                        return { ...m, isOpen: false };
                      }
                      return m;
                    });
                  });
                  
                  // Если открываем меню и есть подпункты, переходим на первый подпункт
                  if (newIsOpen && item.submenu && item.submenu.length > 0) {
                    const firstSubmenu = item.submenu[0];
                    if (firstSubmenu.route) {
                      router.push(firstSubmenu.route);
                    }
                  }
                  
                  return;
                }

                // обычные пункты без подменю
                // НЕ закрываем меню - пользователь может вернуться к подпунктам
                router.push(item.route);
              }}
            >
              <span className="flex-1 text-left">{item?.label}</span>
            </Button>

            {item?.isOpen && hasSubmenu ? (
              <div className="flex flex-col mt-6 gap-6">
                {item.submenu.map((i: any) => (
                  <Button
                      key={i._id || i.route}
                      className={`w-full justify-start pl-[60px] ${i.extraClass || ""} ${isActive(i.route) ? 'text-primary' : ''}`}
                    color={isActive(i.route) ? "primary" : "default"}
                    radius="full"
                    size="lg"
                      startContent={i.icon || null}
                      variant="light"
                    onPress={() => {
                      // При переходе к подпункту НЕ закрываем родительское меню
                      router.push(i.route);
                    }}
                  >
                    {i.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        );
        })
      )}
    </div>
  )
});

SideMenuMainLayout.displayName = 'SideMenuMainLayout';

export default SideMenuMainLayout
