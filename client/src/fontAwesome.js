import { library } from "@fortawesome/fontawesome-svg-core";
import {fab, faTwitterSquare, faFacebook, faLinkedin, faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";

function initFontAwesome() {
    library.add(fab, faTwitterSquare, faFacebook, faLinkedin, faGithub, faGoogle);
}
export default initFontAwesome;