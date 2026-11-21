import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import "../styles/Notifications.css";

function Notifications() {
  const navigate = useNavigate();

  return (
    <main className="notifications-page">
      <section className="notifications-content">
        <div className="notifications-heading">
          <span>YOUR ACTIVITY</span>
          <h2>Notifications</h2>
          <p>Updates and reminders about your AutomataVerse learning.</p>
        </div>

        <div className="notifications-empty">
          <span className="notifications-empty-icon">
            <Icon name="bell" size={24} />
          </span>
          <h3>You’re all caught up</h3>
          <p>
            There are no notifications yet. Your learning progress is saved
            automatically, and reminder delivery will appear here when it is
            available.
          </p>
          <button
            type="button"
            className="notifications-settings-button"
            onClick={() => navigate("/settings")}
          >
            Notification preferences
          </button>
        </div>
      </section>
    </main>
  );
}

export default Notifications;
