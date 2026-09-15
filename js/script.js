/* =====================================================
   CINEMATIC INTRO
===================================================== */

const introScreen =
    document.querySelector(".intro-screen");

const introLetters =
    document.querySelectorAll(".intro-letter");


document.body.classList.add(
    "intro-active"
);


let letterIndex = 0;


function revealNextLetter() {

    if (
        letterIndex >=
        introLetters.length
    ) {

        introScreen.classList.add(
            "ready"
        );


        setTimeout(() => {

            introScreen.classList.add(
                "exit"
            );


            setTimeout(() => {

                document.body.classList.remove(
                    "intro-active"
                );

            }, 1250);

        }, 900);


        return;
    }


    introLetters[
        letterIndex
    ].classList.add(
        "show"
    );


    letterIndex++;


    setTimeout(
        revealNextLetter,
        170
    );
}


setTimeout(
    revealNextLetter,
    500
);



/* =====================================================
   HERO REVEAL
===================================================== */

const hero =
    document.querySelector(".hero");

const hiddenLayer =
    document.querySelector(".hero-hidden");

const superheroLayer =
    document.querySelector(".superhero-layer");


let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

let hovering = false;


hero.addEventListener(
    "mousemove",
    (event) => {

        const rect =
            hero.getBoundingClientRect();


        targetX =
            event.clientX -
            rect.left;


        targetY =
            event.clientY -
            rect.top;


        hovering = true;

    }
);



function animate() {

    mouseX +=
        (targetX - mouseX) * 0.15;


    mouseY +=
        (targetY - mouseY) * 0.15;


    if (hovering) {

        const circle = `
            circle(
                170px at
                ${mouseX}px
                ${mouseY}px
            )
        `;


        hiddenLayer.style.clipPath =
            circle;


        superheroLayer.style.clipPath =
            circle;

    }


    requestAnimationFrame(
        animate
    );
}


animate();



hero.addEventListener(
    "mouseleave",
    () => {

        hovering = false;


        hiddenLayer.style.clipPath =
            "circle(0px at 50% 50%)";


        superheroLayer.style.clipPath =
            "circle(0px at 50% 50%)";

    }
);



/* =====================================================
   PROJECT IMAGE REVEAL
===================================================== */

const projectFrames =
    document.querySelectorAll(
        ".project-image-wrap"
    );


const projectObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


projectFrames.forEach(
    (frame) => {

        projectObserver.observe(
            frame
        );

    }
);
/* =========================================================
   WORK HEADER REVEAL
========================================================= */

const workHeader =
    document.querySelector(".work-header");

if (workHeader) {

    const workHeaderObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        workHeaderObserver.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

    workHeaderObserver.observe(workHeader);
}
const projectContents =
    document.querySelectorAll(".project-content");

const projectContentObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    projectContentObserver.unobserve(
                        entry.target
                    );
                }
            });
        },
        {
            threshold: 0.15
        }
    );

projectContents.forEach((content) => {
    projectContentObserver.observe(content);
});
/* =====================================================
   ABOUT REVEAL
===================================================== */

/* =====================================================
   ABOUT REVEAL
===================================================== */

const aboutSection =
    document.querySelector(".about-section");

if (aboutSection) {

    const aboutObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        aboutSection.classList.add(
                            "visible"
                        );

                        aboutObserver.unobserve(
                            aboutSection
                        );

                    }

                });

            },
            {
                threshold: 0.4
            }
        );

    aboutObserver.observe(aboutSection);
}
/* =====================================================
   CONTACT REVEAL
===================================================== */

const contactSection =
    document.querySelector(".contact-section");

if (contactSection) {

    const contactObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        contactSection.classList.add(
                            "visible"
                        );

                        contactObserver.unobserve(
                            contactSection
                        );

                    }

                });

            },
            {
                threshold: 0.35
            }
        );

    contactObserver.observe(contactSection);
}
