
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import * as L from 'leaflet';
declare module 'leaflet' {

  import {LatLngExpression, PolylineOptions} from 'leaflet';

  function curve(path, options?: {}): Curve;

  interface Curve {
    addTo(map: L.Map): any;
  }

  namespace Polyline {
    function Arc(from, to, option?);
  }

  function polygon(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PathTransformPolylineOptions): Polygon;

  interface PathTransformPolylineOptions extends PolylineOptions {
    transform?: boolean;
    draggable?: boolean;
  }

  interface PathTransformOptions {
    handlerOptions?: L.PathOptions;
    boundsOptions?: L.PolylineOptions;
    rotateHandleOptions?: L.PolylineOptions;
    handleLength?: number;
    rotation?: boolean;
    scaling?: boolean;
    uniformScaling?: boolean;
  }

  interface Polygon {
    transform: PathTransform;
    dragging: PathDrag;
  }

  interface PathDrag {
    enable();
    disable();
  }

  interface PathTransform {
    enable(options?: PathTransformOptions);
    setOptions(options: PathTransformOptions)
  }
}
