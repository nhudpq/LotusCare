import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  ChevronDown,
  ChevronRight,
  Leaf,
  Zap,
} from "lucide-react";
import { Avatar, Button, Flex, Image } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const menuGroups = [
  {
    title: "Nền Tảng",
    items: [
      {
        title: "Bảng Điều Khiển",
        icon: LayoutDashboard,
        href: "/",
      },
      {
        title: "Khu Thử Nghiệm",
        icon: Users,
        href: "#",
        subItems: [
          { title: "Lịch Sử", href: "/history" },
          { title: "Đánh Dấu", href: "/starred" },
          { title: "Cài Đặt", href: "/settings" },
        ],
      },
    ],
  },
  {
    title: "Quản Lý Phòng Khám",
    items: [
      {
        title: "Bệnh Nhân",
        icon: Users,
        href: "/patients",
      },
      {
        title: "Dịch Vụ Y Tế",
        icon: Heart,
        href: "/medical-services",
      },
      {
        title: "Hỗ Trợ Trị Liệu",
        icon: Leaf,
        href: "/herbal-formulas",
      },
      {
        title: "Huyệt (Acupoints)",
        icon: Zap,
        href: "/acupoints",
      },
      {
        title: "Lịch Hẹn",
        icon: Calendar,
        href: "/appointments",
      },
    ],
  },
];

export function AppSidebar() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Playground: false,
  });

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sidebar className='sidebar-container' style={{ background: "#FAFAFA" }}>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-1 pt-1 '>
          <Image
            src='https://media-public.canva.com/8UmAg/MAFvW68UmAg/1/tl.png'
            height={36}
          />
          <div>
            <div className='truncate font-semibold text-sm'>Acme Ince</div>
            <div className='truncate text-xs text-muted-foreground text-gray-600'>
              Doanh Nghiệp
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map(group => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel
              style={{
                color: "#656565",
              }}
              className='text-xs px-1 pt-2'>
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(item => (
                <div key={item.title}>
                  {item.subItems ? (
                    <div>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => toggleExpanded(item.title)}
                          className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <item.icon className='w-4 h-4' />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedItems[item.title] ? "rotate-180" : ""
                            }`}
                          />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {expandedItems[item.title] && (
                        <SidebarMenuSub>
                          {item.subItems.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton>
                                <Link to={subItem.href}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Link
                          to={item.href}
                          className='flex items-center gap-2'>
                          <item.icon className='w-4 h-4' />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='user-info mb-1 flex space-between '>
              <Flex className='flex-1' gap={8} justify=''>
                <div>
                  <Avatar
                    style={{ background: "#000" }}
                    shape='square'
                    size={28}>
                    K
                  </Avatar>
                </div>
                <div>
                  <div
                    style={{ fontSize: 12 }}
                    className='truncate text-xs font-semibold'>
                    Đào Vân Khánh
                  </div>
                  <div
                    style={{ fontSize: 11 }}
                    className='truncate text-xs text-muted-foreground text-gray-600'>
                    khanhvandao@gmail.com
                  </div>
                </div>
              </Flex>
              <Button type='text' icon={<ChevronRight size={16} />} />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
