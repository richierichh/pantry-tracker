import React from "react";
const columns = [
  {name: "ITEM", uid: "item", sortable: true},
  {name: "QUANTITY", uid: "quantity", sortable: true},
  {name: "ADDED ON", uid: "added on", sortable: true},
  {name: "EXPIRES ON", uid: "expires on", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];


const users = [
  {
    id: 1,
    item: "Tony Reichert",
    role: "CEO",
    team: "Manquantityment",
    quantity: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: 2,
    item: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    quantity: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 3,
    item: "Jane Fisher",
    role: "Sr. Dev",
    team: "Development",
    quantity: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    id: 4,
    item: "William Howard",
    role: "C.M.",
    team: "Marketing",
    quantity: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
  {
    id: 5,
    item: "Kristen Copper",
    role: "S. Manquantityr",
    team: "Sales",
    quantity: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
  },
  {
    id: 6,
    item: "Brian Kim",
    role: "P. Manquantityr",
    team: "Manquantityment",
    quantity: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 7,
    item: "Michael Hunt",
    role: "Designer",
    team: "Design",
    quantity: "27",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
  },
  {
    id: 8,
    item: "Samantha Brooks",
    role: "HR Manquantityr",
    team: "HR",
    quantity: "31",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d"
  },
  {
    id: 9,
    item: "Frank Harrison",
    role: "F. Manquantityr",
    team: "Finance",
    quantity: "33",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: 10,
    item: "Emma Adams",
    role: "Ops Manquantityr",
    team: "Operations",
    quantity: "35",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 11,
    item: "Brandon Stevens",
    role: "Jr. Dev",
    team: "Development",
    quantity: "22",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: 12,
    item: "Megan Richards",
    role: "P. Manquantityr",
    team: "Product",
    quantity: "28",
    avatar: "https://i.pravatar.cc/150?img=10"
  },
  {
    id: 13,
    item: "Oliver Scott",
    role: "S. Manquantityr",
    team: "Security",
    quantity: "37",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 14,
    item: "Grace Allen",
    role: "M. Specialist",
    team: "Marketing",
    quantity: "30",
    avatar: "https://i.pravatar.cc/150?img=16"
  }
];

export {columns, users};
