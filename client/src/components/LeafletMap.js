import { MapContainer, TileLayer, Polygon, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { LABELS } from '../constants';

function SetViewOnChange ({data}) {
  // Zoom the map to fit all the polygons on mount and prop change
  const map = useMap();
  if (data.length > 0) {
    const bounds = L.latLngBounds((data).map((polygon) => JSON.parse(polygon['coordinates']).map(poly => poly)));
    map.fitBounds(bounds, {maxZoom:12})
  }
  return null;
}

const LeafletMap = ({ data, variables }) => {
  return (
    <MapContainer className="map" center={[39.951951, -75.193752]} zoom={10}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors" />
      { data.map((polygon, i) => (
        <Polygon key={i} positions={JSON.parse(polygon['coordinates'])}>
          <Tooltip sticky>
              Tract: <strong>{polygon['tract']}</strong>
              {variables.length > 0 && 
                variables.map((variable) => (
                  <p key={variable}>{variable}: {polygon[LABELS[variable]['label']]}</p>
                ))
              }
          </Tooltip>
        </Polygon>
      ))}
      <SetViewOnChange data={data}/>
    </MapContainer>
  );
};

export default LeafletMap;


