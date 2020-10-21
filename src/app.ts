import Engine from './engine'

var engine: Engine;


// The main entry point of app
window.onload = function () {
    engine = new Engine();
    engine.loop();
}


window.onresize = function () {
    engine.resize();
};