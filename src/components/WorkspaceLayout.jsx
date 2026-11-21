import Sidebar from "./Sidebar";
import WorkspaceTopbar from "./WorkspaceTopbar";
import "../styles/Home.css";

function WorkspaceLayout({ children }) {
  return (
    <div className="home-dashboard">
      <Sidebar />
      <div className="home-main workspace-main">
        <WorkspaceTopbar />
        {children}
      </div>
    </div>
  );
}

export default WorkspaceLayout;
