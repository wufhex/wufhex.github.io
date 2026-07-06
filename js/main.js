import * as fluid    from "/js/fluidbg/render.js";
import * as tw       from "/js/ui/typewriter.js";
import * as gtcard   from "/js/ui/cards.js";
import * as links    from "/js/ui/links.js"
import * as glitch   from "/js/ui/glitch.js";
import * as carousel from "/js/ui/carousel.js"

const GITHUB_USERNAME = "wufhex";

fluid.init();
tw.init();
gtcard.load(GITHUB_USERNAME);
links.load();
glitch.run();
carousel.init();
