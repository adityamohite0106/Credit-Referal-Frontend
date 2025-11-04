import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { dashboard, fetchDashboard, makePurchase, logout } = useStore();
const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const copyLink = () => {
    navigator.clipboard.writeText(dashboard.referralLink);
    alert("Link copied to clipboard!");
  };

  if (!dashboard) {
    return (
      <div className="loading-container">
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-10"
    >
      <div className="container">
        {/* Header */}
        <motion.div 
          className="dashboard-header flex justify-between items-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1>Referral Dashboard</h1>
          <button onClick={() => {
              logout();          
              navigate('/login');
          }}>
            Logout
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="card stat-card text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Referred Users</h3>
            <p className="stat-blue">{dashboard.referredUsers}</p>
          </motion.div>
          <motion.div 
            className="card stat-card text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Converted</h3>
            <p className="stat-green">{dashboard.convertedUsers}</p>
          </motion.div>
          <motion.div 
            className="card stat-card text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Total Credits</h3>
            <p className="stat-purple">{dashboard.totalCredits}</p>
          </motion.div>
        </motion.div>

        {/* Referral Link Card */}
        <motion.div 
          className="card mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Your Referral Link</h3>
          <p className="text-sm text-gray-600 mt-2">
            Share this link with friends to earn credits when they make their first purchase
          </p>
          <div className="referral-link">
            <input
              type="text"
              value={dashboard.referralLink}
              readOnly
              className="input"
            />
            <button onClick={copyLink} className="btn btn-primary">
              Copy Link
            </button>
          </div>
        </motion.div>

        {/* Purchase Simulation Card */}
        <motion.div 
          className="card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Simulate First Purchase</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Click to buy a product. You can only do this <strong>once</strong>.
            {dashboard.totalCredits >= 2 && " You've already earned referral credits!"}
          </p>
          <button
            onClick={async () => {
              if (window.confirm("Confirm purchase? This can only be done once.")) {
                try {
                  await makePurchase();
                  alert("Purchase successful! +2 credits");
                } catch (err) {
                  alert(err.message || "Purchase failed");
                }
              }
            }}
            disabled={dashboard?.hasPurchased}
            className={`btn ${dashboard?.hasPurchased ? 'btn-outline' : 'btn-primary'}`}
          >
            {dashboard?.hasPurchased ? "✓ Already Purchased" : "Buy Product (+2 Credits)"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}