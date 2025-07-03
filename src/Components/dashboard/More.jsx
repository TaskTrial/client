import "../Styles/More.css";
import { FaUniversity } from "react-icons/fa";
import { FaSitemap } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function More() {
  const navigate = useNavigate();
  const handleOrganization = () => {
    navigate("/Home/Organization");
  };
  const handleDepartments = () => {
    navigate("/Home/Departments");
  };
  const handleTeams = () => {
    navigate("/Home/Teams");
  };
  return (
    <>
      <div className="More">
        <div className="More-fields">
          <div className="More-field" onClick={handleOrganization}>
            <button className="More-button">
              <FaUniversity size={18} />
              My Organization
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
          <div className="More-field" onClick={handleDepartments}>
            <button className="More-button">
              <FaSitemap size={18} />
              My Departments
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
          <div className="More-field" onClick={handleTeams}>
            <button className="More-button">
              <FaSitemap size={18} />
              My Teams
            </button>
            <FaArrowRight className="profile-back-icon" />
          </div>
        </div>
      </div>
    </>
  );
}

export default More;
