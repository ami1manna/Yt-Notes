// components/groupdetails/RecentActivity.jsx
import React from "react";
import Card from "../common/Card";

const RecentActivity = ({ recentActivities = [] }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-semibold">Recent Activity</h2>
      </div>
      <Card.Content>
        <div className="space-y-3 sm:space-y-4">
          {recentActivities.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-6">
              No recent activity.
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg hover:bg-bg-light dark:hover:bg-card-dark transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs sm:text-sm">
                    {activity.type === "playlist"
                      ? "📺"
                      : activity.type === "note"
                      ? "📝"
                      : activity.type === "member"
                      ? "👥"
                      : "💬"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-text-dark dark:text-text-light">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}
                    {activity.item && (
                      <span className="font-medium"> "{activity.item}"</span>
                    )}
                  </p>
                  <p className="text-xs text-text-muted">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default RecentActivity;
    