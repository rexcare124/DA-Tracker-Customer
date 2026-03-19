import { LucideIcon } from "lucide-react";
import { MotionProps as OriginalMotionProps } from "framer-motion";


declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {
  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }

  interface HeaderProps {
    title: string;
    subtitle: string;
  }

  interface NavbarProps {
    isDashboard: boolean;
  }

  interface AppSidebarProps {
    userType: "manager" | "local";
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: "manager" | "local";
  }

  interface UserInfo {
    id: string | number;
    email: string | null | undefined;
    name: string | null | undefined;
  }

  interface AppUser {
    userInfo: UserInfo;
    userRole: string;
  }
}

export { AppUser, UserInfo };

export {};
