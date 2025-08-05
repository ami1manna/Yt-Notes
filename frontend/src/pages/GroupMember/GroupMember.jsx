import React from 'react';
import { useSelector } from 'react-redux';
import { groupDetailSelectors } from '@/store/groupDetails';
import Card from '@/components/common/Card';
import { User2, Crown, Shield, Mail, Calendar } from 'lucide-react';

const GroupMember = () => {
  const groupDetails = useSelector(groupDetailSelectors.getGroupDetails);

  if (!groupDetails) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Loading members...</p>
      </div>
    );
  }

  const { members } = groupDetails;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Group Members
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {members?.length || 0} member{members?.length !== 1 ? 's' : ''} in this group
        </p>
      </div>

      {!members || members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6">
            <User2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Members Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
            This group doesn't have any members yet. Invite people to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <Card
              key={member.userId}
              hover
              variant="elevated"
              size="default"
              className="overflow-hidden relative group/card bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card.Header className="p-0">
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {member.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role === 'admin' ? (
                        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                          <Crown className="w-3 h-3" />
                          Admin
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          Member
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Header>

              <Card.Content className="space-y-3 px-6 py-4">
                <Card.Title size="lg" className="group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
                  {member.username || 'Unknown User'}
                </Card.Title>
                <Card.Description className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">{member.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Joined {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupMember