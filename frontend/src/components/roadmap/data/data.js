export const flowData = {
    "nodes": [
      {
        "id": "root_node",
        "data": { "label": "All Learning Paths", "type": "root" },
        "position": { "x": 425, "y": 25 },
        "type": "rootNode"
      },
      {
        "id": "pl_1",
        "position": { "x": 100, "y": 150 },
        "data": { 
          "label": "React JS Roadmap", 
          "duration": 72446,
          "type": "playlist",
          "difficulty": "Intermediate",
          "progress": 65,
          "children": [
            {
              "id": "sec_1_1",
              "name": "React Fundamentals",
              "type": "section",
              "progress": 80,
              "children": [
                { "id": "vz1RlUyrc3w", "title": "React JS roadmap", "duration": 1818, "type": "video", "completed": true },
                { "id": "k3KqQvywToE", "title": "Create react projects", "duration": 2116, "type": "video", "completed": true }
              ]
            },
            {
              "id": "sec_1_2",
              "name": "State Management",
              "type": "section",
              "progress": 50,
              "children": [
                { "id": "lI7IIOWM0Mo", "title": "Why you need hooks", "duration": 1698, "type": "video", "completed": true },
                { "id": "MPCVGFvgVEQ", "title": "Virtual DOM & Fibre", "duration": 1281, "type": "video", "completed": false }
              ]
            }
          ]
        },
        "type": "playlistNode"
      },
      {
        "id": "pl_2",
        "position": { "x": 400, "y": 150 },
        "data": { 
          "label": "Advanced React Patterns", 
          "duration": 55000, 
          "type": "playlist",
          "difficulty": "Advanced",
          "progress": 25
        },
        "type": "playlistNode"
      },
      {
        "id": "pl_3",
        "position": { "x": 700, "y": 150 },
        "data": { 
          "label": "Node.js for Beginners", 
          "duration": 68000, 
          "type": "playlist",
          "difficulty": "Beginner",
          "progress": 90
        },
        "type": "playlistNode"
      }
    ],
    "edges": [
      { "id": "eroot-1", "source": "root_node", "target": "pl_1", "type": "smoothstep" },
      { "id": "eroot-2", "source": "root_node", "target": "pl_2", "type": "smoothstep" },
      { "id": "eroot-3", "source": "root_node", "target": "pl_3", "type": "smoothstep" }
    ]
  };
