const currentLocation = location.href;
const links = document.querySelectorAll("a");
const linksLength = links.length;

console.log(linksLength);
for (let i = 0; i < linksLength; i++) {
  console.log(links);
  if (links[i].href === currentLocation) {
    links[i].className = "active";
    console.log(links[i]);
  }
}
