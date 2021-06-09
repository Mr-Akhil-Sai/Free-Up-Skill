const currentLocation = location.href;
const links = document.querySelectorAll("a");
const linksLength = links.length;

for (let i = 0; i < linksLength; i++) {
  if (links[i].href === currentLocation) {
    links[i].className = "active";
  }
}
