const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error("Geolocation error:", error);
    }, {
        timeout: 5000,
        maximumAge: 0, // No caching, always get fresh data
        enableHighAccuracy: true // Try to use GPS for accuracy
    });
}

// Initialize the map centered at [0, 0] with zoom level 10
const map = L.map("map").setView([0, 0], 100);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "FoodForward"
}).addTo(map);


const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 20);
    if (markers[id]) {
        markers[id].setLatLang([latitude, longitude])
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});