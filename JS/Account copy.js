// disintegrate.init();

const cardCopy = document.querySelector(".card-container").cloneNode(true);

// Because html2canvas doesn't support CSS filters yet, manually calculate a hue-rotate for newly created cards
const origColor1 = "#ff6767",
    origColor2 = "#ff4545";

const addCardContainer = document.querySelector(".container");
const addCard = addCardContainer.querySelector(".add-new");

const margin = parseFloat(window.getComputedStyle(addCardContainer).marginTop);
const offset = document.body.children[1].offsetTop - margin;

addCard.onclick = (e) => {
    // alert("alert")
    if (moveAnim && moveAnim.isActive()) return;

    const newCard = cardCopy.cloneNode(true),
        rotationDegree = Math.random() * 360;

    const newColor1 = changeHue(origColor1, rotationDegree),
        newColor2 = changeHue(origColor2, rotationDegree);

    newCard.querySelector(
        ".strip-bottom"
    ).style.backgroundImage = `linear-gradient(to bottom, ${newColor1}, ${newColor2})`;
    newCard.querySelector(
        ".strip-top"
    ).style.backgroundImage = `linear-gradient(to bottom, ${newColor1}, ${newColor2})`;

    document.body.insertBefore(newCard, addCardContainer);

    gsap.from(newCard, { opacity: 0 });
    gsap.from(addCard, { y: -offset });

    disintegrate.init();
};

let moveAnim;
document.onclick = (e) => {
    if (moveAnim && moveAnim.isActive()) return;

    if (e.srcElement.className === "delete") {
        const parent = e.srcElement.parentNode,
            card = parent.querySelector(".card"),
            disObj = disintegrate.getDisObj(card);

        let targets = gsap.utils.toArray(".card-container, .container");
        let isAfterCard = false;

        targets = targets.filter((el) => {
            if (el === parent) {
                isAfterCard = true;
                return false;
            }

            return isAfterCard;
        });

        moveAnim = gsap.to(targets, {
            y: -offset,
            onComplete: () => {
                gsap.set(targets, { y: 0 });
                disObj.kill();
                parent.parentNode.removeChild(parent);
            }
        });

        // Create our particles
        disintegrate.createSimultaneousParticles(disObj);

        // Hide the original card
        parent.style.visibility = "hidden";

        // Remove the whole thing after the animation completes
        disObj.elem.addEventListener("disComplete", (e) => {
            disObj.kill();
            parent.parentNode.removeChild(parent);
        });
    }
};

// From https://stackoverflow.com/a/17433060/2065702
function changeHue(rgb, degree) {
    var hsl = rgbToHSL(rgb);
    hsl.h += degree;
    if (hsl.h > 360) {
        hsl.h -= 360;
    } else if (hsl.h < 0) {
        hsl.h += 360;
    }
    return hslToRGB(hsl);
}

// exepcts a string and returns an object
function rgbToHSL(rgb) {
    // strip the leading # if it's there
    rgb = rgb.replace(/^\s*#|\s*$/g, "");

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (rgb.length == 3) {
        rgb = rgb.replace(/(.)/g, "$1$1");
    }

    var r = parseInt(rgb.substr(0, 2), 16) / 255,
        g = parseInt(rgb.substr(2, 2), 16) / 255,
        b = parseInt(rgb.substr(4, 2), 16) / 255,
        cMax = Math.max(r, g, b),
        cMin = Math.min(r, g, b),
        delta = cMax - cMin,
        l = (cMax + cMin) / 2,
        h = 0,
        s = 0;

    if (delta == 0) {
        h = 0;
    } else if (cMax == r) {
        h = 60 * (((g - b) / delta) % 6);
    } else if (cMax == g) {
        h = 60 * ((b - r) / delta + 2);
    } else {
        h = 60 * ((r - g) / delta + 4);
    }

    if (delta == 0) {
        s = 0;
    } else {
        s = delta / (1 - Math.abs(2 * l - 1));
    }

    return {
        h: h,
        s: s,
        l: l
    };
}

// expects an object and returns a string
function hslToRGB(hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r,
        g,
        b;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = normalize_rgb_value(r, m);
    g = normalize_rgb_value(g, m);
    b = normalize_rgb_value(b, m);

    return rgbToHex(r, g, b);
}

function normalize_rgb_value(color, m) {
    color = Math.floor((color + m) * 255);
    if (color < 0) {
        color = 0;
    }
    return color;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
