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
        title: "Logs",
        url: "/",
        icon: Icons.LogsIcon,
        items: [],
      },
      
     
     {
  title: "Settings",
  icon: Icons.SettingsIcon,
  items: [
    {
      title: "Agent Settings",
      url: "/agent-settings",
      icon: Icons.AgentIcon, 
    },
    {
      title: "Client Settings",
      url: "/client-settings",
      icon: Icons.ClientIcon, 
    },
  ],
}
    ],
  },
  
];
