import GroupDetailsHeader from '@/components/groupdetails/GroupDetailsHeader';
import GroupDetailsBody from '../../components/groupdetails/GroupDetailsBody';

const GroupDetails = () => {
  return (
    <div className='flex flex-col w-full p-4 gap-4'>
    <GroupDetailsHeader/>
    <GroupDetailsBody/>
    </div>
  )

}

export default GroupDetails
