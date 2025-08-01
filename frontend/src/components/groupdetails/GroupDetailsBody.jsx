// components/groupdetails/GroupDetailsBody.jsx
import React from "react";
import RecentActivity from "./RecentActivity";
import Card from "../common/Card";

const SidebarExtras = ({ group }) => (
  <Card>
    <Card.Content>
      <div className="text-sm text-gray-700 dark:text-gray-200">
        {/* Placeholder for sidebar content */}
        <div className="font-medium mb-1">Quick Links</div>
        <div className="space-y-2">
          <div className="text-xs">• View members</div>
          <div className="text-xs">• Manage playlists</div>
          <div className="text-xs">• Group settings</div>
        </div>
      </div>
    </Card.Content>
  </Card>
);

const GroupDetailsBody = ({ group, recentActivities }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="sm:col-span-2 space-y-4">
        <Card>
          <Card.Content>
            {/* Primary group content; can be expanded */}
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {/* Example: list of members, description details, etc. */}
              <p className="mb-2 font-medium">About the group</p>
              <p>{group?.longDescription || group?.description || "No description provided."}</p>
            </div>
          </Card.Content>
        </Card>
        <RecentActivity recentActivities={recentActivities} />
      </div>
      <div className="sm:col-span-1 space-y-4">
        <SidebarExtras group={group} />
      </div>
    </div>
  );
};

export default GroupDetailsBody;
