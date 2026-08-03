import "./ProviderDashboard.css";
import Sidebar from "../../components/Provider/Sidebar";

export default function ProviderDashboard() {

    return (

       <div className="dashboard-content">

    <div className="welcome-card">

        <h2>Welcome, Provider 👋</h2>

        <p>
            Manage your profile, services and bookings from one place.
        </p>

    </div>

    <div className="stats-grid">

        <div className="stat-card">
            <h3>Total Services</h3>
            <span>5</span>
        </div>

        <div className="stat-card">
            <h3>Rating</h3>
            <span>4.8 ⭐</span>
        </div>

        <div className="stat-card">
            <h3>Availability</h3>
            <span>Available</span>
        </div>

        <div className="stat-card">
            <h3>Verified</h3>
            <span>Yes</span>
        </div>

    </div>

    <div className="quick-actions">

        <h2>Quick Actions</h2>

        <div className="action-grid">

            <button>Edit Profile</button>

            <button>Manage Services</button>

            <button>Bookings</button>

        </div>

    </div>

    <div className="recent-card">

        <h2>Recent Activity</h2>

        <p>No recent activity available.</p>

    </div>

</div>

    );
}