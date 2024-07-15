require([
    "esri/Map",
    "esri/views/MapView",
    "esri/WebMap"
], function (Map, MapView, WebMap) {
    // Crea un nuevo mapa web a partir del ID del mapa
    var webmap = new WebMap({
        portalItem: {
            id: "f9a8549c32e74ff8b104366bfb1434af"  // Reemplaza con el ID de tu mapa de ArcGIS Online
        }
    });

    // Crea una vista del mapa
    var view = new MapView({
        container: "viewDiv", // Referencia el contenedor del mapa
        map: webmap
    });
});
