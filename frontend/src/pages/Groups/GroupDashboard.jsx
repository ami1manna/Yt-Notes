import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGroups } from "@/store/slices/groupSlice";
import GroupStats from "../../components/group/GRoupStats";
import GroupList from "../../components/group/GroupList";

const GroupDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <div className="w-full px-4 h-full">
      <GroupStats />
      <GroupList />
    </div>
  );
};

export default GroupDashboard;
