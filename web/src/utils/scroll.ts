export function scrollToNounExplorer() {
  const element = document.getElementById("explore-section");
  const destinationScrollY = element?.offsetTop;
  const currentScrollY = document.documentElement.scrollTop || document.body.scrollTop;

  console.log("scrollToNounExplorer", { destinationScrollY, currentScrollY });

  // Slight delay to prevent scroll glitches as the page is resizing
  setTimeout(() => {
    window.scrollTo({
      top: destinationScrollY,
      behavior: destinationScrollY && destinationScrollY > currentScrollY ? "smooth" : "instant",
    });
  }, 1);
}
