document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("custom-audio");
    const playPauseButton = document.getElementById("play-pause");
    const seekBar = document.getElementById("seek-bar");
    const currentTime = document.getElementById("current-time");
    const duration = document.getElementById("duration");
    const audioFileInput = document.getElementById("audio-file-input");
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const loopButton = document.getElementById("loop");
    const audioList = document.getElementById("audio-list");
    const currentSong = document.getElementById("current-song");

    let audioSources = [];
    let currentIndex = 0;
    let isLooping = false;



    function updateLoopButton() {
        loopButton.textContent = isLooping ? "Loop (On)" : "Loop (Off)";
    }

    function updateAudioSource(index) {
        if (index >= 0 && index < audioSources.length) {
            audio.src = audioSources[index];
            audio.load();
            playAudio();
        }
    }

    function playAudio() {
        audio.play();
        playPauseButton.textContent = "Pause";
        currentSong.textContent = audioList.children[currentIndex].textContent;
    }

    playPauseButton.addEventListener("click", () => {
        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
            playPauseButton.textContent = "Play";
        }
    });

    audioFileInput.addEventListener("change", () => {
        audioSources = [];
        currentIndex = 0;
        audioList.innerHTML = "";

        const selectedFiles = audioFileInput.files;
        if (selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                if (file.type === "audio/mpeg") {
                    audioSources.push(URL.createObjectURL(file));
                    const listItem = document.createElement("li");
                    listItem.textContent = file.name;
                    listItem.addEventListener("click", () => {
                        const index = Array.from(audioList.children).indexOf(listItem);
                        currentIndex = index;
                        updateAudioSource(currentIndex);
                    });
                    audioList.appendChild(listItem);
                }
            }
        }

        if (audioSources.length > 0) {
            updateAudioSource(currentIndex);
        }
    });

    previousButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + audioSources.length) % audioSources.length;
        updateAudioSource(currentIndex);
    });

    nextButton.addEventListener("click", () => {
        if (isLooping) {
            currentIndex = (currentIndex + 1) % audioSources.length;
        } else {
            currentIndex = (currentIndex + 1) % audioSources.length;
            if (currentIndex === 0) {
                audio.pause();
                playPauseButton.textContent = "Play";
                return;
            }
        }
        updateAudioSource(currentIndex);
    });

    loopButton.addEventListener("click", () => {
        isLooping = !isLooping;
        audio.loop = isLooping;
        updateLoopButton();
    });

    // Initialize loop button text
    updateLoopButton();

    audio.addEventListener("timeupdate", () => {
        const currentTimeValue = Math.floor(audio.currentTime);
        const durationValue = Math.floor(audio.duration);

        // Update seek bar
        seekBar.value = (audio.currentTime / audio.duration) * 100;

        // Update current time
        const currentHours = Math.floor(currentTimeValue / 3600);
        const currentMinutes = Math.floor((currentTimeValue % 3600) / 60);
        const currentSeconds = currentTimeValue % 60;
        currentTime.textContent =
            (currentHours > 0 ? `${currentHours}:` : "") +
            `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

        // Update duration
        if (!isNaN(durationValue)) {
            const durationHours = Math.floor(durationValue / 3600);
            const durationMinutes = Math.floor((durationValue % 3600) / 60);
            const durationSeconds = durationValue % 60;
            duration.textContent =
                (durationHours > 0 ? `${durationHours}:` : "") +
                `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
        }
    });

    audio.addEventListener("ended", () => {
        if (currentIndex < audioSources.length - 1) {
            currentIndex++;
            updateAudioSource(currentIndex);
        } else if (isLooping) {
            // If looping is enabled, replay the first audio when the last one finishes
            currentIndex = 0;
            updateAudioSource(currentIndex);
        }
    });

    seekBar.addEventListener("input", () => {
        const seekTime = (seekBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });
});
