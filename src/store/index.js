import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
	state() {
		return {
			// Your state properties here
		};
	},
	mutations: {
		// Your mutations here
		UPLOAD_VIDEO(state, video) {
			state.uploadedVideo = video;
		},
	},
	actions: {
		// Your actions here
	},
	getters: {
		// Your getters here
	},
});

export default store;
