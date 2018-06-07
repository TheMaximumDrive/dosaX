
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import * as L from 'leaflet';
declare module 'leaflet' {

  function curve(path, options?: {}): Curve;

  interface Curve {
    addTo(map: L.Map): any;
  }

  namespace Polyline {
    function Arc(from, to, option?);
  }
}
