import "../../Styles/Dashboard.css";

const DashboardTodayTasks = () => {
  const tasksData = [
    {
      id: 1,
      title: "Interactive prototype for ........",
      done: true,
      status: "Approved",
      statusColor: "approved",
    },
    {
      id: 2,
      title: "Create a user flow of social .......",
      done: true,
      status: "In review",
      statusColor: "review",
    },
    {
      id: 3,
      title: "Interactive prototype for app ..........",
      done: false,
      status: "On going",
      statusColor: "ongoing",
    },
    {
      id: 4,
      title: "Interactive prototype for app ..........",
      done: false,
      status: "On going",
      statusColor: "ongoing",
    },
    {
      id: 5,
      title: "Interactive prototype for app ..........",
      done: false,
      status: "On going",
      statusColor: "ongoing",
    },
    {
      id: 6,
      title: "Interactive prototype for app ..........",
      done: false,
      status: "On going",
      statusColor: "ongoing",
    },
    {
      id: 7,
      title: "Interactive prototype for app ..........",
      done: false,
      status: "On going",
      statusColor: "ongoing",
    },
  ];

  return (
    <div className="dashboard-tasks-wrapper">
      <h2>Today Tasks</h2>
      {tasksData.map((task) => (
        <div key={task.id} className="task-row">
          <span>
            {task.done ? "✔" : "◯"} {task.title}
          </span>
          <span className={`task-status ${task.statusColor}`}>
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DashboardTodayTasks;
