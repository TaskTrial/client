import "../../Styles/Dashboard.css";

const DashboardTotalProjects = () => {
  const projectsData = [
    {
      id: 1,
      name: "Nelsa web developement",
      status: "Completed",
      statusColor: "completed", // للـ CSS class
      progress: 100,
      progressColor: "green", // border color
    },
    {
      id: 2,
      name: "Datascale AI app",
      status: "Delayed",
      statusColor: "delayed",
      progress: 35,
      progressColor: "yellow",
    },
    {
      id: 3,
      name: "Media channel branding",
      status: "At risk",
      statusColor: "at-risk",
      progress: 68,
      progressColor: "red",
    },
    {
      id: 4,
      name: "Media channel branding",
      status: "At risk",
      statusColor: "at-risk",
      progress: 68,
      progressColor: "red",
    },
    {
      id: 5,
      name: "Media channel branding",
      status: "At risk",
      statusColor: "at-risk",
      progress: 68,
      progressColor: "red",
    },
    {
      id: 6,
      name: "Media channel branding",
      status: "At risk",
      statusColor: "at-risk",
      progress: 68,
      progressColor: "red",
    },
    {
      id: 7,
      name: "Media channel branding",
      status: "At risk",
      statusColor: "at-risk",
      progress: 68,
      progressColor: "red",
    },
    {
      id: 8,
      name: "Media channel branding",
      status: "At risk",
      statusColor: "at-risk",
      progress: 68,
      progressColor: "red",
    },
  ];

  return (
    <div className="dashboard-projects-wrapper">
      <h2>Project Summary</h2>
      {projectsData.map((project) => (
        <div key={project.id} className="project-row">
          <span>{project.name}</span>
          <span className={`status ${project.statusColor}`}>
            {project.status}
          </span>
          <span className={`progress-circle ${project.progressColor}`}>
            {project.progress}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default DashboardTotalProjects;
