    import { createSlice } from '@reduxjs/toolkit';
import { fetchGroupPlaylistDetails } from './groupPlaylistThunks';
     
    const initialState = {
    groupPlaylistDetails: null,
    status: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
    };

    const groupPlaylistDetailsSlice = createSlice({
    name: 'groupPlaylistDetails',
    initialState,
    reducers: {
        clearGroupPlaylistDetails: (state) => {
        state.groupPlaylistDetails = null;
        state.status = 'idle';
        state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

        // FETCH GROUP
        .addCase(fetchGroupPlaylistDetails.pending, (state) => {
            state.status = 'pending';
            state.error = null;
        })
        .addCase(fetchGroupPlaylistDetails.fulfilled, (state, { payload }) => {
            state.groupPlaylistDetails = payload;
            state.status = 'succeeded';
        })
        .addCase(fetchGroupPlaylistDetails.rejected, (state, { error, payload }) => {
            state.status = 'failed';
            state.error = payload || error?.message || 'Failed to fetch group details';
        })

        
    },
    });

    export const { clearGroupPlaylistDetails } = groupPlaylistDetailsSlice.actions;
    export default groupPlaylistDetailsSlice.reducer;
