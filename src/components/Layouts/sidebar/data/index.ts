import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
          },
        ],
      },
      
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },

      {
        title: "Logs",
        url: "/logs",
        icon: Icons.LogsIcon,
        items: [],
      },
      
     
      {
        title: "Pages",
        icon: Icons.SettingsIcon,
        items: [
          {
            title: "Agent Settings",
            url: "/agent-settings", 
           
          },
          {
            title: "Client Settings",
            url: "/client-settings", 
            
          },
        ],
      },
    ],
  },
  
];
