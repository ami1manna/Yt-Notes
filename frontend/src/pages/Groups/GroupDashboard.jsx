import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { groupsThunks } from "@/store/group";
import GroupStats from "@/components/group/GRoupStats";
import GroupList from "@/components/group/GroupList";

const GroupDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(groupsThunks.fetchGroups());
  }, [dispatch]);

  return (
    <div className="w-full px-4 h-full">
      <GroupStats />
      <GroupList />
    </div>
  );
};

export default GroupDashboard;
