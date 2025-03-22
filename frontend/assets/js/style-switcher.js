
/*=========================== toggle style switcher ===========================*/
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
styleSwitcherToggle.addEventListener("click", () => {
document.querySelector(".style-switcher").classList.toggle("open");
})
// hide style switcher on scroll
window.addEventListener( "scroll", () => {
if(document.querySelector(".style-switcher").classList.contains("open"))
{
    document.querySelector(".style-switcher").classList.remove("open");
}
})
/*=========================== theme light and dark mode ===========================*/
const dayNightToggle = document.querySelector(".day-night");
const icon = dayNightToggle.querySelector("i");

// Function to apply the theme
function applyTheme(theme) {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
    
    // Update the icon
    if (theme === "dark") {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}
// Check localStorage for theme on page load
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

// Toggle theme on button click
dayNightToggle.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    
    // Update charts to match current theme
    updateChartsTheme();
});
