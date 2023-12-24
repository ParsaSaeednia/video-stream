<template>
    <div>
        <h1>Upload your video</h1>
        <input type="file" @change="handleVideoUpload" accept="video/*" />

        <video ref="videoPlayer" v-if="videoUrl" controls autoplay @timeupdate="savePlaybackTime">
            <source :src="videoUrl" type="video/mp4">
            Your browser does not support the video tag.
        </video>

        <!-- Button to clear the video -->
        <button v-if="videoUrl" @click="clearVideo">Clear Video</button>
    </div>
</template>
  
<script>
import localForage from 'localforage';

export default {
    data() {
        return {
            videoUrl: null,
        };
    },
    async created() {
        // Load the video when the component is created
        const videoBlob = await localForage.getItem('uploadedVideo');
        if (videoBlob) {
            this.videoUrl = URL.createObjectURL(videoBlob);
            this.$nextTick(() => {
                if (this.$refs.videoPlayer) {
                    // Set the currentTime of the video player to the last saved time
                    const lastTime = parseFloat(localStorage.getItem('playbackTime'));
                    this.$refs.videoPlayer.currentTime = isNaN(lastTime) ? 0 : lastTime;
                }
            });
        }
    },
    methods: {
        async handleVideoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                await this.storeVideo(file);
            }
        },
        async storeVideo(file) {
            const videoBlob = new Blob([file], { type: 'video/mp4' });
            await localForage.setItem('uploadedVideo', videoBlob);
            this.videoUrl = URL.createObjectURL(file);
        },
        savePlaybackTime() {
            // Store the current playback time in localStorage
            const currentTime = this.$refs.videoPlayer.currentTime;
            localStorage.setItem('playbackTime', currentTime.toString());
        },
        async clearVideo() {
            this.videoUrl = null;
            await localForage.removeItem('uploadedVideo');
            localStorage.removeItem('playbackTime');
            this.$forceUpdate();
        }
    },
    beforeUnmount() {
        // Save the playback time before unmounting
        if (this.$refs.videoPlayer) {
            this.savePlaybackTime();
        }

        if (this.videoUrl) {
            URL.revokeObjectURL(this.videoUrl);
        }
    }
};
</script>
  