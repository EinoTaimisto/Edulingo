document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".project-container");

    // Ensure all boxes start from a higher position
    containers.forEach((container, index) => {
        container.style.opacity = "0";
        container.style.transform = "translateY(-80px) scale(0.9)";
    });

    // Animate the boxes dropping down in sequence (top to bottom)
    containers.forEach((container, index) => {
        setTimeout(() => {
            container.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
            container.style.opacity = "1";
            container.style.transform = "translateY(0) scale(1)";
        }, index * 200); // Staggered effect from first to last
    });
});
