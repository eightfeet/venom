import eot from './fonts/dice.eot';
import svg from './fonts/dice.svg';
import ttf from './fonts/dice.ttf';
import woff from './fonts/dice.woff';

const fontface = `@font-face {
    font-family: 'dice';
    src:  url('${eot}?7oj4ak');
    src:  url('${eot}?7oj4ak#iefix') format('embedded-opentype'),
      url('${ttf}?7oj4ak') format('truetype'),
      url('${woff}?7oj4ak') format('woff'),
      url('${svg}?7oj4ak#dice') format('svg');
    font-weight: normal;
    font-style: normal;
}`;

const styleDom = document.createElement('style');
styleDom.setAttribute('type', 'text/css');
styleDom.innerHTML = fontface;

document.getElementsByTagName('head')[0].appendChild(styleDom);
  