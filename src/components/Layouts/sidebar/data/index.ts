import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
      
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },

      {
        title: "ChatLogs",
        url: "/chatlogs",
        icon: Icons.LogsIcon,
        items: [],
      },

      
      
      {
        title: "Settings",
        url: "/settings", // ✅ add this
        icon: Icons.SettingsIcon,
        items: [], // ✅ remove submenu
      },
    ],
  },
  
];
