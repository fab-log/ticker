const bar = document.querySelector(".bar");
const pixels = document.querySelectorAll(".pixel");

const startLoader = () => {
    bar.style.display = "block";
    for (let i = 0; i < pixels.length; i++) {
        pixels[i].classList.remove("loader");
        setTimeout(() => {
            pixels[i].classList.add("loader");
        }, i * 120);
    }
}

const stopLoader = () => {
    bar.style.display = "none";
    /* for (let i = 0; i < pixels.length; i++) {
        pixels[i].classList.remove("loader");
    } */
}