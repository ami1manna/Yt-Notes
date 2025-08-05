import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { groupsThunks } from "@/store/group";
import GroupStats from "@/components/group/GroupStats";
import GroupList from "@/components/group/GroupList";
import { clearGroupList } from "../../store/group/groupSlice";

const GroupDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(groupsThunks.fetchGroups());
    console.log("Group DashBoard remove");
    return () => {
      dispatch(clearGroupList());
      console.log("Group DashBoard remove");
    };
  }, [dispatch]);

  return (
    <div className="w-full px-4 h-full">
      <GroupStats />
      <GroupList />
    </div>
  );
};

export default GroupDashboard;
