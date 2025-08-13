const { getRoadmapData } = require('../../services/roadmap/roadmapService');

// @desc    Get roadmap data for a group
// @route   GET /api/groups/:groupId/roadmap
// @access  Private
exports.getRoadmap = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and user data is in req.user

    const roadmapData = await getRoadmapData(groupId, userId);
    
    res.status(200).json({
      success: true,
      data: roadmapData
    });
  } catch (error) {
    console.error('Error in getRoadmap controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
