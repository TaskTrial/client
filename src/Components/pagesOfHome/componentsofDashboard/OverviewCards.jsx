import { FaChartLine, FaTasks } from "react-icons/fa";
import { MdAccessTime, MdWork } from "react-icons/md";

const cardsData = [
  {
    id: 1,
    title: "Total revenue",
    value: "$53,00989",
    icon: <FaChartLine color="#b388f0" size={24} />,
    status: "12% increase from last month",
    statusColor: "green",
  },
  {
    id: 2,
    title: "Projects",
    value: "95 /100",
    icon: <MdWork color="#f7a07a" size={24} />,
    status: "10% decrease from last month",
    statusColor: "red",
  },
  {
    id: 3,
    title: "Time spent",
    value: "1022 /1300 Hrs",
    icon: <MdAccessTime color="#89bdfb" size={24} />,
    status: "8% increase from last month",
    statusColor: "green",
  },
  {
    id: 4,
    title: "Tasks",
    value: "12 /300",
    icon: <FaTasks color="#a88fed" size={24} />,
    status: "8% increase from last month",
    statusColor: "green",
  },
];

const OverviewCards = () => {
  return (
    <div className="dashboard-overview-wrapper">
      {cardsData.map((card) => (
        <div key={card.id} className="dashboard-card">
          <div className="dashboard-icon">{card.icon}</div>
          <h3 className="dashboard-title">{card.title}</h3>
          <p className="dashboard-value">{card.value}</p>
          <p
            className={`dashboard-status ${
              card.statusColor === "green"
                ? "dashboard-status-up"
                : "dashboard-status-down"
            }`}
          >
            {card.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
