// store/group/index.js
import reducer from "./groupSlice";
import * as groupsThunks from "./groupThunks";
import * as groupsSelectors from "./groupSelector";

export { groupsThunks , groupsSelectors };
export default reducer;
