export const localStorageData = {
  users: [
    { username: "admin", password: "password" },
    { username: "pumin", password: "1234" },
  ],
  currentUser: "admin",

  boards: [
    {
      id: "board1",
      name: "Project Alpha",
      owner: "pumin",
      members: ["pumin"],
      columns: [
        {
          id: "col1",
          name: "Todo",
          tasks: [
            {
              id: "task1",
              title: "Design UI",
              tags: ["UI"],
              description: "Use Figma",
            },
          ],
        },
      ],
    },
  ],
};
