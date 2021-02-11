export default class Overlay implements OverlayInterface {
  x: number[] = [];
  y: number[] = [];
  visible = true;
  scaling = 1;
  offset = 0;
  name = '';
  color = '#FF9664';
}

export interface OverlayInterface {
  x: number[];
  y: number[];
  visible: boolean;
  scaling: number;
  offset: number;
  name: string;
  color: string;
}
